---
publishedOn: 2026-02-15T00:00:00.000Z
title: Rate Limiting AI APIs Across Cloudflare Workers
subTitle: A singleton pattern for coordinating rate limits across distributed Workers
featured: false
heroImg: /img/content/posts/cf-omni-limiter.png
slug: global-rate-limiter-durable-objects
tags:
  - cloudflare
  - typescript
  - rate-limiting
author: shivekkhurana
---

Cloudflare Workers run across the globe, with hundreds of data centers, each spinning up instances on demand. This is great for scale, but creates a coordination problem for AI workloads.

AI APIs have strict rate limits. OpenAI, Anthropic, and AWS Bedrock all throttle requests per minute or per second. When your Workers are scattered across the world, how do you ensure they collectively stay under the limit? KV won't work here—it's eventually consistent, so concurrent requests can't reliably coordinate.

[Durable Objects](https://developers.cloudflare.com/durable-objects/) solve this. A DO is a stateful singleton that lives in one location. All requests route to that single instance, enabling consistent coordination. I built a global rate limiter called `OmniLimiter` using this pattern. Here's how it works.

## The Architecture

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 500,
  "height": 280,
  "layer": [
    {
      "data": {
        "values": [
          {"x": 80, "y": 60, "x2": 250, "y2": 200},
          {"x": 180, "y": 60, "x2": 250, "y2": 200},
          {"x": 320, "y": 60, "x2": 250, "y2": 200},
          {"x": 420, "y": 60, "x2": 250, "y2": 200}
        ]
      },
      "mark": {"type": "rule", "color": "#6b7280", "strokeWidth": 2},
      "encoding": {
        "x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 500]}, "axis": null},
        "y": {"field": "y", "type": "quantitative", "scale": {"domain": [0, 280]}, "axis": null},
        "x2": {"field": "x2"},
        "y2": {"field": "y2"}
      }
    },
    {
      "data": {
        "values": [
          {"x": 80, "y": 60, "label": "Worker 1", "type": "worker"},
          {"x": 180, "y": 60, "label": "Worker 2", "type": "worker"},
          {"x": 320, "y": 60, "label": "Worker 3", "type": "worker"},
          {"x": 420, "y": 60, "label": "Worker N", "type": "worker"},
          {"x": 250, "y": 200, "label": "OmniLimiterDO", "type": "do"}
        ]
      },
      "encoding": {
        "x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 500]}, "axis": null},
        "y": {"field": "y", "type": "quantitative", "scale": {"domain": [0, 280]}, "axis": null}
      },
      "layer": [
        {
          "mark": {"type": "circle", "size": 1800, "opacity": 1},
          "encoding": {
            "color": {
              "field": "type",
              "type": "nominal",
              "scale": {"domain": ["worker", "do"], "range": ["#3b82f6", "#f97316"]},
              "legend": null
            }
          }
        },
        {
          "mark": {"type": "text", "fontSize": 11, "fontWeight": "bold", "color": "#1f2937"},
          "encoding": {
            "text": {"field": "label", "type": "nominal"}
          }
        }
      ]
    },
    {
      "data": {"values": [{"x": 250, "y": 240, "label": "Singleton Instance (HTTP API)"}]},
      "mark": {"type": "text", "fontSize": 10, "color": "#1f2937", "fontStyle": "italic"},
      "encoding": {
        "x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 500]}, "axis": null},
        "y": {"field": "y", "type": "quantitative", "scale": {"domain": [0, 280]}, "axis": null},
        "text": {"field": "label", "type": "nominal"}
      }
    },
    {
      "data": {"values": [{"x": 250, "y": 15, "label": "Cloudflare Edge"}]},
      "mark": {"type": "text", "fontSize": 13, "fontWeight": "bold", "color": "#1f2937"},
      "encoding": {
        "x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 500]}, "axis": null},
        "y": {"field": "y", "type": "quantitative", "scale": {"domain": [0, 280]}, "axis": null},
        "text": {"field": "label", "type": "nominal"}
      }
    }
  ],
  "config": {"view": {"stroke": null}}
}
```

All Workers communicate with a single `OmniLimiterDO` instance via HTTP. The DO maintains token buckets for different limiters (Postgres writes, Google Drive reads, LLM API calls) and grants or denies access.

## The Durable Object

The DO implements a sliding window rate limiter. For each limiter key, it stores an array of timestamps representing recent requests.

### The interface

Workers communicate with the DO via HTTP. They POST to `/acquire` with a key, limit, and window size. The DO responds with whether the request is allowed, and if not, how long to wait.

```typescript
// src/domain/omniLimiter.dObj.ts
import { DurableObject } from 'cloudflare:workers';

interface AcquireRequest {
  key: string;
  limit: number;
  windowInSeconds: number;
}

interface AcquireResponse {
  allowed: boolean;
  retryAfterMs?: number;
}
```

### Class setup and HTTP handler

The DO maintains an in-memory `Map` of buckets. Each bucket is an array of timestamps for a specific limiter key.

```typescript
export class OmniLimiterDO implements DurableObject {
  private buckets: Map<string, number[]>;

  constructor(
    private state: DurableObjectState,
    private env: any
  ) {
    this.buckets = new Map();
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/acquire" && req.method === "POST") {
      const body: AcquireRequest = await req.json();
      const result = await this.acquire(body);
      return Response.json(result);
    }

    return new Response("Not found", { status: 404 });
  }
```

### The sliding window algorithm

A sliding window rate limiter tracks the exact timestamp of each request rather than counting requests in fixed buckets. This avoids the boundary problem where a burst at the edge of two fixed windows could allow 2x the limit.

Here's how it works:

1. Load all recorded timestamps for this limiter key
2. Filter out timestamps older than the window (e.g., older than 10 seconds)
3. If fewer than `limit` timestamps remain, allow the request and record the current time
4. If at the limit, calculate when the oldest timestamp will expire and tell the caller to wait

```typescript
  private async acquire(req: AcquireRequest): Promise<AcquireResponse> {
    const { key, limit, windowInSeconds } = req;
    const now = Date.now();
    const windowMs = windowInSeconds * 1000;

    // Load all timestamps for this key (e.g., "claude35Sonnet")
    const timestamps = await this.load(key);

    // Keep only timestamps within the sliding window
    // If window is 10s and now is 1000, keep timestamps > 990
    const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);

    if (validTimestamps.length < limit) {
      // Under limit: record this request and allow it
      validTimestamps.push(now);
      await this.save(key, validTimestamps);
      return { allowed: true };
    }

    // At limit: calculate when the oldest request expires
    // Example: oldest=950, window=100, now=1000 → retry after 50ms
    const oldestInWindow = validTimestamps[0];
    const retryAfterMs = oldestInWindow + windowMs - now;

    return { allowed: false, retryAfterMs };
  }
```

> The sliding window naturally cleans itself. Old timestamps get filtered out on every `acquire` call, so there's no separate cleanup job needed.

### Two-tier persistence

The `load` and `save` methods implement a two-tier cache. The in-memory Map avoids repeated storage reads within a single DO instance lifetime. The DO's durable storage persists timestamps across restarts and evictions.

```typescript
  private async load(key: string): Promise<number[]> {
    if (this.buckets.has(key)) {
      return this.buckets.get(key)!;
    }

    const stored = await this.state.storage.get<number[]>(key);
    const arr = stored ?? [];
    this.buckets.set(key, arr);
    return arr;
  }

  private async save(key: string, timestamps: number[]): Promise<void> {
    this.buckets.set(key, timestamps);
    await this.state.storage.put(key, timestamps);
  }
}
```

> Without the in-memory cache, every `acquire` call would hit durable storage. With it, repeated calls within the same DO instance are fast.

## The Wrapper Class

Workers don't call the DO directly. Instead, they use an `OmniLimiter` wrapper that handles HTTP communication and retry logic.

### Getting the singleton stub

The constructor uses `idFromName("singleton")` to get a reference to the DO. This is the key to global coordination. Every Worker, regardless of location, gets the same DO instance.

```typescript
// src/domain/omniLimiter.ts
import type { Bindings } from "./hono.types";

interface LimiterOpts {
  limit: number;
  windowInSeconds: number;
}

export class OmniLimiter {
  private stub: DurableObjectStub;

  constructor(env: Bindings) {
    const id = env.OMNI_LIMITER.idFromName("singleton");
    this.stub = env.OMNI_LIMITER.get(id);
  }
```

### Creating a named limiter

The `limiter` method returns an object with a `schedule` function. This API is inspired by [Bottleneck](https://github.com/SGrondin/bottleneck), a popular Node.js rate limiter. You wrap your function in `schedule()`, and it handles the waiting for you.

```typescript
  limiter(key: string, opts: LimiterOpts) {
    return {
      schedule: async <T>(fn: () => Promise<T> | T): Promise<T> => {
        await this.acquireWithRetry(key, opts);
        return await Promise.resolve(fn());
      },
    };
  }
```

### Blocking retry loop

The `acquireWithRetry` method loops until the DO grants permission. If denied, it waits for the suggested retry time plus a small random jitter. The jitter prevents thundering herd. Without it, all waiting requests would retry at exactly the same moment.

```typescript
  private async acquireWithRetry(key: string, opts: LimiterOpts): Promise<void> {
    while (true) {
      const response = await this.stub.fetch("http://do/acquire", {
        method: "POST",
        body: JSON.stringify({
          key,
          limit: opts.limit,
          windowInSeconds: opts.windowInSeconds,
        }),
      });

      const result: { allowed: boolean; retryAfterMs?: number } =
        await response.json();

      if (result.allowed) {
        return;
      }

      const delay = (result.retryAfterMs ?? 1000) + Math.random() * 50;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
```

## Named Limiters

Different APIs have different rate limits. Define them as factory functions:

```typescript
// src/domain/omniLimiter.dObj.types.ts
import { OmniLimiter } from './omniLimiter';
import type { Bindings } from './hono.types';

export function claudeSonnetLimiterFactory(env: Bindings) {
  return new OmniLimiter(env).limiter('claude35Sonnet', {
    limit: 1,
    windowInSeconds: 10,
  });
}

export function postgresWriteLimiterFactory(env: Bindings) {
  return new OmniLimiter(env).limiter('postgresWrite', {
    limit: 5,
    windowInSeconds: 1,
  });
}
```

The string key (`"claude35Sonnet"`) identifies the bucket in the DO. All Workers using the same key share the same rate limit.

## Usage in Application Code

Without rate limiting, you call the API directly and hope for the best:

```typescript
// Before: no coordination across Workers
app.post('/chat', async (c) => {
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    messages: [{ role: 'user', content: c.req.body.message }],
  });
  return c.json(response);
});
```

This works until traffic spikes. Then you get 429s, failed requests, and angry users.

With OmniLimiter, wrap the call in `schedule()`:

```typescript
// After: globally coordinated rate limiting
import { claudeSonnetLimiterFactory } from '../domain/omniLimiter.dObj.types';

app.post('/chat', async (c) => {
  const limiter = claudeSonnetLimiterFactory(c.env);

  const response = await limiter.schedule(async () => {
    return await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [{ role: 'user', content: c.req.body.message }],
    });
  });

  return c.json(response);
});
```

## Wrangler Configuration

Register the DO in your `wrangler.toml`:

```toml
[[env.dev.durable_objects.bindings]]
name = "OMNI_LIMITER"
class_name = "OmniLimiterDO"

[[env.dev.migrations]]
tag = "v1"
new_classes = ["OmniLimiterDO"]

[[env.prd.durable_objects.bindings]]
name = "OMNI_LIMITER"
class_name = "OmniLimiterDO"

[[env.prd.migrations]]
tag = "v1"
new_classes = ["OmniLimiterDO"]
```

And export the class from your entry point:

```typescript
// src/index.ts
export { OmniLimiterDO } from './domain/omniLimiter.dObj';
```

## Using OmniLimiter in Cloudflare Workflows

[Cloudflare Workflows](https://developers.cloudflare.com/workflows/) are long-running, durable orchestrations that can run for hours and automatically retry failures. OmniLimiter integrates naturally with workflows to rate-limit external API calls.

The problem: workflows can spawn many concurrent instances. If you trigger 50 workflows simultaneously, they might all try to call Claude at once. Without rate limiting, you get 429 errors, retries, and retry storms.

```typescript
// src/workflows/summarizeWorkflow.ts
import { WorkflowEntrypoint, type WorkflowStep } from 'cloudflare:workers';
import { claudeSonnetLimiterFactory } from '../domain/omniLimiter.dObj.types';

interface WorkflowParams {
  documentId: string;
  content: string;
}

export class SummarizeWorkflow extends WorkflowEntrypoint<
  Bindings,
  WorkflowParams
> {
  async run(event: WorkflowEvent<WorkflowParams>, step: WorkflowStep) {
    const { documentId, content } = event.payload;

    // Rate-limited LLM call
    const summary = await step.do('summarize', async () => {
      const limiter = claudeSonnetLimiterFactory(this.env);

      return await limiter.schedule(async () => {
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          messages: [{ role: 'user', content: `Summarize: ${content}` }],
        });
        return response.content[0].text;
      });
    });

    // Save result
    await step.do('save', async () => {
      await db
        .update(documents)
        .set({ summary })
        .where(eq(documents.id, documentId));
    });
  }
}
```

The `claudeSonnetLimiterFactory` ensures that across all workflow instances, only 1 request per 10 seconds hits the Claude API. Other instances wait their turn.

## Why This Works

1. **Single source of truth**: The singleton DO maintains authoritative counts
2. **Blocking semantics**: `schedule()` doesn't proceed until allowed
3. **Automatic retries**: Built-in backoff with jitter
4. **Named limiters**: Different limits for different resources
5. **Workflow integration**: Rate limiting persists across workflow step retries

The pattern scales to any external API with rate limits. Define a factory, call `schedule()`, and the limiter handles coordination.

## Trade-offs

- **Latency**: Every rate-limited call round-trips to the DO
- **Single point**: The singleton DO is in one region; distant Workers have higher latency
- **Complexity**: More moving parts than a simple counter
- **Workflow API limits**: Cloudflare Workflows have a hard cap of 1000 subrequest calls per instance. Each `limiter.schedule()` call makes at least one DO fetch—more if it needs to retry. A workflow that rate-limits 100 operations could easily consume 200-500 subrequests just for coordination, leaving little headroom for actual work

For most applications, the latency is acceptable. If you need regional rate limiting (separate limits per region), you'd use `idFromName(region)` instead of a global singleton.

For workflows with many rate-limited operations, consider batching work or moving the rate limiting to queue consumers instead of workflow steps.
