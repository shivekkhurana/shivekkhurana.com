---
publishedOn: 2025-12-30T00:00:00.000Z
title: Sophisticated Simplicity of Modern SQLite
subTitle: A benchmark-driven guide to tuning SQLite for production workloads
heroImg: /img/content/posts/sqlite-benchmarks.png
featured: false
slug: sqlite-in-production
tags: []
author: shivekkhurana
---

A [recent post](https://andersmurphy.com/2025/12/02/100000-tps-over-a-billion-rows-the-unreasonable-effectiveness-of-sqlite.html) claiming SQLite reaches 100k TPS using batched `BEGIN IMMEDIATE` transactions sparked a question: Can I build everything with SQLite?

Despite my experience since 2014 suggesting it lacks concurrent writer support, I [wasn't](https://www.reddit.com/r/Database/comments/1cqx84l/who_has_sqlite_in_production/) [alone](https://www.reddit.com/r/django/comments/17vn181/is_it_okay_to_use_sqlite_in_production/) [in](https://www.reddit.com/r/programming/comments/1djkt2y/why_does_sqlite_in_production_have_such_a_bad_rep/) [this](https://www.reddit.com/r/dotnet/comments/1bulzdi/sqlite_in_production/) [curiosity](https://www.reddit.com/r/rails/comments/k4vlqo/is_anyone_using_sqlite_on_production_either_side/). A [2024 Rails talk](https://www.youtube.com/watch?v=wFUy120Fts8) by [@fractalmind](https://fractaledmind.com/2024/10/16/sqlite-supercharges-rails/) clarified matters, debunking concurrency myths and explaining that SQLite simply needs tuning for modern hardware:

> SQLite was built in 2004 and is the most backward compatible software ever. A new database is configured for 2004 hardware by default. But in the last 21 years, computers have evolved—SSDs are omnipresent. To run SQLite in production, you simply need to tune it to 2025 standards.

> -- Stephen Margheim aka Fractal Mind (paraphrased)

## This is not SQLite vs Postgres

This isn't an argument for SQLite over Postgres, but an exploration of vertical scaling for medium-sized apps. Inspired by the Rails' "one-person framework" philosophy, I want to test the limits of a single machine running an embedded database.

While a single instance introduces geographic latency, eliminating network DB latency offers a compelling trade-off. Most of my projects don't hit millions of users, so I'm prioritizing velocity over theoretical scale. If I ever need to migrate to Postgres, I'll count that as a success.

## Why SQLite?

The client-server model of databases like Postgres requires extra infrastructure provisioning and upkeep. Because queries are passed to a network before processing, there is network latency. You can reduce the latency by running the database inside the same server as the app, but that reduces network latency rather than eliminating it. It also passes the burden of DB ops to you. This includes running the server, configuring Postgres, backups, and restore.

SQLite, on the other hand, is embedded inside your app. You can create as many SQLite databases as you want because it's just a file.
The burden of DB ops like setting up the database and backups is still on you. But that's where this article comes in. I'll set up the database and explain how to do backup ops with Litestream. Everything else will just work.

Benefits:

- The app is self-contained. Anyone can work on the app locally, just pull and `npm install`. No infra.
- Simplified deployment: the app can be compiled as an executable.
- Easier testing: creating databases is as cheap as creating a variable.
- New databases are easy to spin up: have a DB for app data, for queues, for analytics, etc. (DuckDB!).
- Reads are faster than network DBs.
- Writes are faster in low concurrency.

## About the benchmarking methodology

Benchmarks often optimize for peak numbers rather than real-world scenarios. Real applications involve connected data, joins, and concurrent writes. To simulate this, I used a blog model (Users, Posts, Tags) with realistic relationships (User has-many Posts, Post has-many Tags) and indices.

The benchmark mimics a multi-process web server with realistic queries:

- Users by time range
- Paginated posts and tags (100/read)
- Posts with joined users and tags

All code (co-authored by Composer 1, Opus 4.5, and Gemini 1.5 Pro) is [available on GitHub](https://github.com/shivekkhurana/sqlite-test).

## Runtime

Benchmarks run on a 2.4GHz 8-core Intel i9 MacBook (32GB RAM). Node.js and [Piscina](https://github.com/piscinajs/piscina) simulate a concurrent web server (like pm2/gunicorn running with n workers).

I assumed a 16-thread limit matching the logical cores, but testing exceeded this to observe saturation.

Like a real app, all workers can read and write.

# Write Phase

SQLite is a single-writer, multi-reader database. I began by tuning for write throughput, then introduced a mixed workload of 80% reads and 20% writes.

If your workload involves fewer than 20% writes, expect better performance than this benchmark. Higher write ratios will likely degrade performance.

In this phase, we start with a vanilla SQLite database and tune it for writes.

### Vanilla SQLite: Concurrency vs Error Counts

Out of the box, SQLite starts failing as soon as write concurrency exceeds one. The chart below shows the error count for approximately 100k writes across increasing worker concurrency.

_Note: When the error count is high, the latency metric is inaccurate because it only measures the latency of successful writes._

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Vanilla Write Performance - Latency and Errors vs Concurrency",
  "data": {
    "values": [
      {"concurrency": 1, "latency": 1.6874580000003334, "errorCount": 0},
      {"concurrency": 2, "latency": 1.426779000001261, "errorCount": 49998},
      {"concurrency": 4, "latency": 1.3930560000007972, "errorCount": 75031},
      {"concurrency": 8, "latency": 1.7651130000012927, "errorCount": 89232},
      {"concurrency": 16, "latency": 2.6641339999914635, "errorCount": 98326},
      {"concurrency": 32, "latency": 2.7063560000096913, "errorCount": 97988},
      {"concurrency": 64, "latency": 83.71229200001108, "errorCount": 98839},
      {"concurrency": 128, "latency": 470.4476790000044, "errorCount": 99069}
    ]
  },
  "width": 800,
  "height": 400,
  "encoding": {
    "x": {
      "field": "concurrency",
      "type": "ordinal",
      "title": "Number of Workers (Concurrency)"
    }
  },
  "layer": [
    {
      "encoding": {
        "y": {
          "field": "errorCount",
          "type": "quantitative",
          "title": "Error Counts",
          "scale": {"type": "symlog", "constant": 1, "domainMin": 0},
          "axis": null
        }
      },
      "layer": [
        {
          "mark": {
            "type": "bar",
            "color": "#e74c3c",
            "opacity": 0.5,
            "tooltip": true
          },
          "encoding": {
            "tooltip": [
              {"field": "concurrency", "title": "Workers"},
              {"field": "errorCount", "title": "Errors"}
            ]
          }
        },
        {
          "mark": {
            "type": "text",
            "align": "center",
            "baseline": "bottom",
            "dy": -5,
            "fontSize": 11,
            "font": "sans-serif"
          },
          "encoding": {
            "text": {"field": "errorCount", "type": "quantitative"},
            "color": {"value": "#e74c3c"}
          },
          "transform": [{"filter": "datum.errorCount > 0"}]
        }
      ]
    },
    {
      "encoding": {
        "y": {
          "field": "latency",
          "type": "quantitative",
          "title": "P99 Latency (ms)",
          "scale": {"type": "log", "domainMin": 1},
          "axis": {"titleColor": "#2980b9", "grid": true, "orient": "left"}
        }
      },
      "layer": [
        {
          "mark": {
            "type": "line",
            "point": true,
            "color": "#2980b9",
            "tooltip": true
          },
          "encoding": {
            "tooltip": [
              {"field": "concurrency", "title": "Workers"},
              {"field": "latency", "title": "P99 Latency (ms)"}
            ]
          }
        },
        {
          "mark": {
            "type": "text",
            "align": "center",
            "baseline": "bottom",
            "dy": -10,
            "fontSize": 11,
            "font": "sans-serif"
          },
          "encoding": {
            "text": {"field": "latency", "type": "quantitative", "format": ".0f"},
            "color": {"value": "#2980b9"}
          }
        }
      ]
    }
  ],
  "resolve": {"scale": {"y": "independent"}}
}
```

SQLite fails immediately when concurrent writes collide; it does not automatically queue transactions.

### Mitigating Errors with Busy Timeout

Setting `PRAGMA busy_timeout` instructs the connection to retry for a specified duration before throwing a lock error.

I tested 400ms, 2000ms, and 5000ms timeouts:

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Busy Timeout Comparison - Latency and Errors vs Concurrency",
  "data": {
    "values": [
      {
        "concurrency": 1,
        "scenario": "400ms",
        "color": "#8e44ad",
        "latency": 1.9504549999983283,
        "errorCount": 0
      },
      {
        "concurrency": 2,
        "scenario": "400ms",
        "color": "#8e44ad",
        "latency": 4.995152000017697,
        "errorCount": 0
      },
      {
        "concurrency": 4,
        "scenario": "400ms",
        "color": "#8e44ad",
        "latency": 22.160992999968585,
        "errorCount": 0
      },
      {
        "concurrency": 8,
        "scenario": "400ms",
        "color": "#8e44ad",
        "latency": 92.72784500010312,
        "errorCount": 0
      },
      {
        "concurrency": 16,
        "scenario": "400ms",
        "color": "#8e44ad",
        "latency": 255.13572099991143,
        "errorCount": 74
      },
      {
        "concurrency": 32,
        "scenario": "400ms",
        "color": "#8e44ad",
        "latency": 426.84326699981466,
        "errorCount": 2744
      },
      {
        "concurrency": 64,
        "scenario": "400ms",
        "color": "#8e44ad",
        "latency": 442.24123500008136,
        "errorCount": 19142
      },
      {
        "concurrency": 128,
        "scenario": "400ms",
        "color": "#8e44ad",
        "latency": 544.6905419994146,
        "errorCount": 43582
      },
      {
        "concurrency": 1,
        "scenario": "2000ms",
        "color": "#f39c12",
        "latency": 1.948259999990114,
        "errorCount": 0
      },
      {
        "concurrency": 2,
        "scenario": "2000ms",
        "color": "#f39c12",
        "latency": 4.9837010000192095,
        "errorCount": 0
      },
      {
        "concurrency": 4,
        "scenario": "2000ms",
        "color": "#f39c12",
        "latency": 22.131762000033632,
        "errorCount": 0
      },
      {
        "concurrency": 8,
        "scenario": "2000ms",
        "color": "#f39c12",
        "latency": 92.52703699993435,
        "errorCount": 0
      },
      {
        "concurrency": 16,
        "scenario": "2000ms",
        "color": "#f39c12",
        "latency": 289.97224400006235,
        "errorCount": 0
      },
      {
        "concurrency": 32,
        "scenario": "2000ms",
        "color": "#f39c12",
        "latency": 666.2254380001687,
        "errorCount": 0
      },
      {
        "concurrency": 64,
        "scenario": "2000ms",
        "color": "#f39c12",
        "latency": 1714.531336999964,
        "errorCount": 354
      },
      {
        "concurrency": 128,
        "scenario": "2000ms",
        "color": "#f39c12",
        "latency": 2002.8102350002155,
        "errorCount": 1851
      },
      {
        "concurrency": 1,
        "scenario": "5000ms",
        "color": "#d35400",
        "latency": 1.3723310000059428,
        "errorCount": 0
      },
      {
        "concurrency": 2,
        "scenario": "5000ms",
        "color": "#d35400",
        "latency": 4.623919999998179,
        "errorCount": 0
      },
      {
        "concurrency": 4,
        "scenario": "5000ms",
        "color": "#d35400",
        "latency": 21.73486700002104,
        "errorCount": 0
      },
      {
        "concurrency": 8,
        "scenario": "5000ms",
        "color": "#d35400",
        "latency": 91.16516699991189,
        "errorCount": 0
      },
      {
        "concurrency": 16,
        "scenario": "5000ms",
        "color": "#d35400",
        "latency": 253.03985900012776,
        "errorCount": 0
      },
      {
        "concurrency": 32,
        "scenario": "5000ms",
        "color": "#d35400",
        "latency": 659.513145999983,
        "errorCount": 0
      },
      {
        "concurrency": 64,
        "scenario": "5000ms",
        "color": "#d35400",
        "latency": 1219.809957000427,
        "errorCount": 0
      },
      {
        "concurrency": 128,
        "scenario": "5000ms",
        "color": "#d35400",
        "latency": 2607.2363699991256,
        "errorCount": 5
      }
    ]
  },
  "width": 800,
  "height": 400,
  "resolve": {"scale": {"y": "independent"}},
  "layer": [
    {
      "mark": {
        "type": "bar",
        "fillOpacity": 0.6,
        "strokeWidth": 2,
        "cursor": "pointer",
        "tooltip": true
      },
      "encoding": {
        "x": {
          "field": "concurrency",
          "type": "ordinal",
          "title": "Number of Workers"
        },
        "xOffset": {"field": "scenario", "sort": ["400ms", "2000ms", "5000ms"]},
        "y": {
          "field": "errorCount",
          "type": "quantitative",
          "title": "Error Counts",
          "scale": {"type": "symlog", "constant": 1, "domainMin": 0},
          "axis": {
            "titleColor": "#e74c3c",
            "orient": "right",
            "grid": false,
            "titleFontWeight": "bold"
          }
        },
        "fill": {"field": "color", "scale": null},
        "stroke": {"value": "#e74c3c"},
        "tooltip": [
          {"field": "scenario", "title": "Timeout"},
          {"field": "concurrency", "title": "Workers"},
          {"field": "errorCount", "title": "Errors"}
        ]
      }
    },
    {
      "mark": {
        "type": "text",
        "fontSize": 10,
        "fontWeight": "bold",
        "dy": -10,
        "align": "center"
      },
      "encoding": {
        "x": {"field": "concurrency", "type": "ordinal"},
        "xOffset": {"field": "scenario", "sort": ["400ms", "2000ms", "5000ms"]},
        "y": {"field": "errorCount", "type": "quantitative", "axis": null},
        "text": {"field": "errorCount", "type": "quantitative"},
        "color": {"value": "black"}
      },
      "transform": [{"filter": "datum.errorCount > 0"}]
    },
    {
      "mark": {"type": "line", "point": true, "strokeWidth": 3},
      "encoding": {
        "x": {"field": "concurrency", "type": "ordinal"},
        "y": {
          "field": "latency",
          "type": "quantitative",
          "title": "P99 Latency (ms)",
          "scale": {"type": "log", "domainMin": 1},
          "axis": {
            "titleColor": "#333",
            "grid": true,
            "orient": "left",
            "titleFontWeight": "bold"
          }
        },
        "color": {
          "field": "scenario",
          "type": "nominal",
          "scale": {
            "domain": ["400ms", "2000ms", "5000ms"],
            "range": ["#8e44ad", "#f39c12", "#d35400"]
          },
          "title": "Timeout Setting"
        },
        "tooltip": [
          {"field": "scenario", "title": "Timeout"},
          {"field": "concurrency", "title": "Workers"},
          {"field": "latency", "title": "P99 Latency (ms)"}
        ]
      }
    }
  ]
}
```

There are no significant changes in `p99` latency with various busy timeout settings. The latency drop beyond 32 workers in the 400ms case is due to lock errors. Lock errors cause the latency metrics to drop inaccurately.

Increasing the busy timeout prevents these errors without affecting latency. I recommend a setting between 5 and 10 seconds. This gives us our first knob:

| SQLITE Production Configuration Knob | Value    | Description          |
| ------------------------------------ | -------- | -------------------- |
| `PRAGMA busy_timeout`                | 5s - 10s | Prevents lock errors |

## Enable WAL Journal

By default, SQLite uses `DELETE` journal mode. `DELETE` mode locks the database during write operations. Before a change is made to the database file, the original content of the modified database pages is copied into a separate rollback journal file (.db-journal). If a crash occurs, this journal file is used to restore the database to its original, consistent state.

SQLite’s Write-Ahead Logging (WAL) mode does not write changes directly to the database file. Every write transaction appends modified pages immediately to the `*.wal` file, leaving the main database file unchanged.

Readers see a consistent view by reading from the database file plus any newer pages present in the WAL. This separation is the core reason WAL dramatically improves write latency and read concurrency: writers append sequentially, and readers never block on writers.

**The WAL file is therefore a first-class data store, not a temporary buffer. At any moment, the authoritative state of the database is: database file + WAL file**

Changes are copied from the WAL back into the database file later during a checkpoint. A checkpoint is not time-based but is triggered by:

- WAL file size thresholds
- Auto-checkpoint settings or explicit `PRAGMA wal_checkpoint`
- Database close
- Page cache pressure

The charts below show the average and p99 write latency across different numbers of workers. Lock errors were negligible.

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Impact of WAL Mode - Latency Comparison",
  "data": {
    "values": [
      {
        "type": "data",
        "concurrency": 1,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "P99 Latency",
        "value": 1.3723310000059428
      },
      {
        "type": "data",
        "concurrency": 1,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 1.5661609999951907
      },
      {
        "type": "data",
        "concurrency": 1,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Avg Latency",
        "value": 0.7955622229099925
      },
      {
        "type": "data",
        "concurrency": 1,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 0.8174576630300454
      },
      {
        "type": "data",
        "concurrency": 2,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "P99 Latency",
        "value": 4.623919999998179
      },
      {
        "type": "data",
        "concurrency": 2,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 2.4762229999760166
      },
      {
        "type": "annotation",
        "concurrency": 2,
        "metric": "P99 Latency",
        "midpoint": 3.383763740872668,
        "label": "-46%"
      },
      {
        "type": "data",
        "concurrency": 2,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Avg Latency",
        "value": 1.5653911375999834
      },
      {
        "type": "data",
        "concurrency": 2,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 1.4002560940299993
      },
      {
        "type": "data",
        "concurrency": 4,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "P99 Latency",
        "value": 21.73486700002104
      },
      {
        "type": "data",
        "concurrency": 4,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 10.745245000056457
      },
      {
        "type": "annotation",
        "concurrency": 4,
        "metric": "P99 Latency",
        "midpoint": 15.282227290511948,
        "label": "-51%"
      },
      {
        "type": "data",
        "concurrency": 4,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Avg Latency",
        "value": 5.013621336090113
      },
      {
        "type": "data",
        "concurrency": 4,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 3.277602246799936
      },
      {
        "type": "annotation",
        "concurrency": 4,
        "metric": "Avg Latency",
        "midpoint": 4.0537213219180535,
        "label": "-35%"
      },
      {
        "type": "data",
        "concurrency": 8,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "P99 Latency",
        "value": 91.16516699991189
      },
      {
        "type": "data",
        "concurrency": 8,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 61.43524200003594
      },
      {
        "type": "annotation",
        "concurrency": 8,
        "metric": "P99 Latency",
        "midpoint": 74.838186085803,
        "label": "-33%"
      },
      {
        "type": "data",
        "concurrency": 8,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Avg Latency",
        "value": 23.783772884749958
      },
      {
        "type": "data",
        "concurrency": 8,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 12.102967314579923
      },
      {
        "type": "annotation",
        "concurrency": 8,
        "metric": "Avg Latency",
        "midpoint": 16.96626729252846,
        "label": "-49%"
      },
      {
        "type": "data",
        "concurrency": 16,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "P99 Latency",
        "value": 253.03985900012776
      },
      {
        "type": "data",
        "concurrency": 16,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 114.65533400001004
      },
      {
        "type": "annotation",
        "concurrency": 16,
        "metric": "P99 Latency",
        "midpoint": 170.33017803365055,
        "label": "-55%"
      },
      {
        "type": "data",
        "concurrency": 16,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Avg Latency",
        "value": 69.69499433829037
      },
      {
        "type": "data",
        "concurrency": 16,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 22.326900866899685
      },
      {
        "type": "annotation",
        "concurrency": 16,
        "metric": "Avg Latency",
        "midpoint": 39.447094056598694,
        "label": "-68%"
      },
      {
        "type": "data",
        "concurrency": 32,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "P99 Latency",
        "value": 659.513145999983
      },
      {
        "type": "data",
        "concurrency": 32,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 201.91397699993104
      },
      {
        "type": "annotation",
        "concurrency": 32,
        "metric": "P99 Latency",
        "midpoint": 364.917692353485,
        "label": "-69%"
      },
      {
        "type": "data",
        "concurrency": 32,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Avg Latency",
        "value": 127.66505692826975
      },
      {
        "type": "data",
        "concurrency": 32,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 36.79333517152001
      },
      {
        "type": "annotation",
        "concurrency": 32,
        "metric": "Avg Latency",
        "midpoint": 68.53629132987145,
        "label": "-71%"
      },
      {
        "type": "data",
        "concurrency": 64,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "P99 Latency",
        "value": 1219.809957000427
      },
      {
        "type": "data",
        "concurrency": 64,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 981.8456860000733
      },
      {
        "type": "annotation",
        "concurrency": 64,
        "metric": "P99 Latency",
        "midpoint": 1094.3788850397307,
        "label": "-20%"
      },
      {
        "type": "data",
        "concurrency": 64,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Avg Latency",
        "value": 248.93632333813005
      },
      {
        "type": "data",
        "concurrency": 64,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 107.49351636380175
      },
      {
        "type": "annotation",
        "concurrency": 64,
        "metric": "Avg Latency",
        "midpoint": 163.5819083709807,
        "label": "-57%"
      },
      {
        "type": "data",
        "concurrency": 128,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "P99 Latency",
        "value": 2607.2363699991256
      },
      {
        "type": "data",
        "concurrency": 128,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 1795.2708560000174
      },
      {
        "type": "annotation",
        "concurrency": 128,
        "metric": "P99 Latency",
        "midpoint": 2163.4914998129084,
        "label": "-31%"
      },
      {
        "type": "data",
        "concurrency": 128,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Avg Latency",
        "value": 603.8417842523386
      },
      {
        "type": "data",
        "concurrency": 128,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 264.41297013594345
      },
      {
        "type": "annotation",
        "concurrency": 128,
        "metric": "Avg Latency",
        "midpoint": 399.57927832452526,
        "label": "-56%"
      }
    ]
  },
  "facet": {
    "row": {
      "field": "metric",
      "title": null,
      "header": {"labelFontSize": 16, "labelFontWeight": "bold"}
    }
  },
  "spec": {
    "width": 800,
    "height": 300,
    "layer": [
      {
        "transform": [{"filter": "datum.type === 'data'"}],
        "mark": {"type": "line", "point": true, "strokeWidth": 3},
        "encoding": {
          "x": {
            "field": "concurrency",
            "type": "ordinal",
            "title": "Number of Workers",
            "axis": {"labelAngle": 0}
          },
          "y": {
            "field": "value",
            "type": "quantitative",
            "title": "Latency (ms)",
            "scale": {"type": "log", "domainMin": 0.1},
            "axis": {"grid": true}
          },
          "color": {
            "field": "scenario",
            "type": "nominal",
            "scale": {
              "domain": ["5s Timeout (Journal=DELETE)", "WAL Mode"],
              "range": ["#d35400", "#27ae60"]
            },
            "title": "Configuration"
          },
          "tooltip": [
            {"field": "scenario", "title": "Config"},
            {"field": "concurrency", "title": "Workers"},
            {"field": "value", "title": "Latency", "format": ".2f"}
          ]
        }
      },
      {
        "transform": [{"filter": "datum.type === 'annotation'"}],
        "mark": {
          "type": "text",
          "align": "center",
          "baseline": "middle",
          "dy": 0,
          "fontSize": 10,
          "fontWeight": "bold",
          "color": "#333",
          "fill": "#fff",
          "stroke": "#fff",
          "strokeWidth": 2
        },
        "encoding": {
          "x": {"field": "concurrency", "type": "ordinal"},
          "y": {"field": "midpoint", "type": "quantitative"},
          "text": {"field": "label"}
        }
      },
      {
        "transform": [{"filter": "datum.type === 'annotation'"}],
        "mark": {
          "type": "text",
          "align": "center",
          "baseline": "middle",
          "dy": 0,
          "fontSize": 10,
          "fontWeight": "bold",
          "color": "#333"
        },
        "encoding": {
          "x": {"field": "concurrency", "type": "ordinal"},
          "y": {"field": "midpoint", "type": "quantitative"},
          "text": {"field": "label"}
        }
      },
      {
        "transform": [
          {"filter": "datum.type === 'data'"},
          {"filter": "datum.scenario === 'WAL Mode'"}
        ],
        "mark": {
          "type": "text",
          "align": "center",
          "baseline": "top",
          "dy": 10,
          "fontSize": 10,
          "fontWeight": "bold"
        },
        "encoding": {
          "x": {"field": "concurrency", "type": "ordinal"},
          "y": {"field": "value", "type": "quantitative"},
          "text": {"field": "value", "type": "quantitative", "format": ".0f"},
          "color": {"value": "#27ae60"}
        }
      },
      {
        "transform": [
          {"filter": "datum.type === 'data'"},
          {"filter": "datum.scenario === '5s Timeout (Journal=DELETE)'"}
        ],
        "mark": {
          "type": "text",
          "align": "center",
          "baseline": "bottom",
          "dy": -10,
          "fontSize": 10,
          "fontWeight": "bold"
        },
        "encoding": {
          "x": {"field": "concurrency", "type": "ordinal"},
          "y": {"field": "value", "type": "quantitative"},
          "text": {"field": "value", "type": "quantitative", "format": ".0f"},
          "color": {"value": "#d35400"}
        }
      }
    ]
  },
  "resolve": {"scale": {"y": "independent"}}
}
```

Enabling WAL mode reduces p99 latency by 30-60% for more than 2 concurrent writers. Real-world applications with mixed read/write workloads should see even better performance improvements.

## WAL Mode Throughput (writes/sec)

At 1 and 2 concurrent connections, writing to WAL reduces throughput by 43% and 17% respectively.
Anything above that improves writes/second significantly.

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Impact of WAL Mode - Throughput Comparison",
  "data": {
    "values": [
      {
        "type": "data",
        "concurrency": 1,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Writes / Sec",
        "value": 982.7102231327108
      },
      {
        "type": "data",
        "concurrency": 1,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Writes / Sec",
        "value": 556.638536747916
      },
      {
        "type": "annotation",
        "concurrency": 1,
        "metric": "Writes / Sec",
        "midpoint": 739.6042054043569,
        "label": "-43%"
      },
      {
        "type": "data",
        "concurrency": 2,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Writes / Sec",
        "value": 775.6912969502893
      },
      {
        "type": "data",
        "concurrency": 2,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Writes / Sec",
        "value": 644.4552265899722
      },
      {
        "type": "annotation",
        "concurrency": 2,
        "metric": "Writes / Sec",
        "midpoint": 707.0348722234061,
        "label": "-17%"
      },
      {
        "type": "data",
        "concurrency": 4,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Writes / Sec",
        "value": 335.1200251071127
      },
      {
        "type": "data",
        "concurrency": 4,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Writes / Sec",
        "value": 496.3286700843251
      },
      {
        "type": "annotation",
        "concurrency": 4,
        "metric": "Writes / Sec",
        "midpoint": 407.8353544998752,
        "label": "+48%"
      },
      {
        "type": "data",
        "concurrency": 8,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Writes / Sec",
        "value": 121.80719961108112
      },
      {
        "type": "data",
        "concurrency": 8,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Writes / Sec",
        "value": 222.9519123520267
      },
      {
        "type": "annotation",
        "concurrency": 8,
        "metric": "Writes / Sec",
        "midpoint": 164.7942598864887,
        "label": "+83%"
      },
      {
        "type": "data",
        "concurrency": 16,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Writes / Sec",
        "value": 84.45075839810706
      },
      {
        "type": "data",
        "concurrency": 16,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Writes / Sec",
        "value": 214.07820131952937
      },
      {
        "type": "annotation",
        "concurrency": 16,
        "metric": "Writes / Sec",
        "midpoint": 134.45841906677654,
        "label": "+153%"
      },
      {
        "type": "data",
        "concurrency": 32,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Writes / Sec",
        "value": 71.3938524521745
      },
      {
        "type": "data",
        "concurrency": 32,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Writes / Sec",
        "value": 210.47194733536912
      },
      {
        "type": "annotation",
        "concurrency": 32,
        "metric": "Writes / Sec",
        "midpoint": 122.58223016972397,
        "label": "+195%"
      },
      {
        "type": "data",
        "concurrency": 64,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Writes / Sec",
        "value": 66.38679917325841
      },
      {
        "type": "data",
        "concurrency": 64,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Writes / Sec",
        "value": 100.9404094351442
      },
      {
        "type": "annotation",
        "concurrency": 64,
        "metric": "Writes / Sec",
        "midpoint": 81.86031205436122,
        "label": "+52%"
      },
      {
        "type": "data",
        "concurrency": 128,
        "scenario": "5s Timeout (Journal=DELETE)",
        "color": "#d35400",
        "metric": "Writes / Sec",
        "value": 61.27826156920206
      },
      {
        "type": "data",
        "concurrency": 128,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Writes / Sec",
        "value": 92.73853384054163
      },
      {
        "type": "annotation",
        "concurrency": 128,
        "metric": "Writes / Sec",
        "midpoint": 75.38472082739982,
        "label": "+51%"
      }
    ]
  },
  "width": 800,
  "height": 300,
  "layer": [
    {
      "transform": [{"filter": "datum.type === 'data'"}],
      "mark": {"type": "line", "point": true, "strokeWidth": 3},
      "encoding": {
        "x": {
          "field": "concurrency",
          "type": "ordinal",
          "title": "Number of Workers",
          "axis": {"labelAngle": 0}
        },
        "y": {
          "field": "value",
          "type": "quantitative",
          "title": "Writes / Second",
          "scale": {"type": "log", "domainMin": 1},
          "axis": {"grid": true}
        },
        "color": {
          "field": "scenario",
          "type": "nominal",
          "scale": {
            "domain": ["5s Timeout (Journal=DELETE)", "WAL Mode"],
            "range": ["#d35400", "#27ae60"]
          },
          "title": "Configuration"
        },
        "tooltip": [
          {"field": "scenario", "title": "Config"},
          {"field": "concurrency", "title": "Workers"},
          {"field": "value", "title": "Writes/Sec", "format": ",.0f"}
        ]
      }
    },
    {
      "transform": [{"filter": "datum.type === 'annotation'"}],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "middle",
        "dy": 0,
        "fontSize": 10,
        "fontWeight": "bold",
        "color": "#333",
        "fill": "#fff",
        "stroke": "#fff",
        "strokeWidth": 2
      },
      "encoding": {
        "x": {"field": "concurrency", "type": "ordinal"},
        "y": {"field": "midpoint", "type": "quantitative"},
        "text": {"field": "label"}
      }
    },
    {
      "transform": [{"filter": "datum.type === 'annotation'"}],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "middle",
        "dy": 0,
        "fontSize": 10,
        "fontWeight": "bold",
        "color": "#333"
      },
      "encoding": {
        "x": {"field": "concurrency", "type": "ordinal"},
        "y": {"field": "midpoint", "type": "quantitative"},
        "text": {"field": "label"}
      }
    },
    {
      "transform": [
        {"filter": "datum.type === 'data'"},
        {"filter": "datum.scenario === 'WAL Mode'"},
        {"filter": "datum.concurrency >= 4"}
      ],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "bottom",
        "dy": -10,
        "fontSize": 10,
        "fontWeight": "bold"
      },
      "encoding": {
        "x": {"field": "concurrency", "type": "ordinal"},
        "y": {"field": "value", "type": "quantitative"},
        "text": {"field": "value", "type": "quantitative", "format": ".0f"},
        "color": {"value": "#27ae60"}
      }
    },
    {
      "transform": [
        {"filter": "datum.type === 'data'"},
        {"filter": "datum.scenario === '5s Timeout (Journal=DELETE)'"},
        {"filter": "datum.concurrency >= 4"}
      ],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "top",
        "dy": 10,
        "fontSize": 10,
        "fontWeight": "bold"
      },
      "encoding": {
        "x": {"field": "concurrency", "type": "ordinal"},
        "y": {"field": "value", "type": "quantitative"},
        "text": {"field": "value", "type": "quantitative", "format": ".0f"},
        "color": {"value": "#d35400"}
      }
    },
    {
      "transform": [
        {"filter": "datum.type === 'data'"},
        {"filter": "datum.scenario === 'WAL Mode'"},
        {"filter": "datum.concurrency < 4"}
      ],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "top",
        "dy": 10,
        "fontSize": 10,
        "fontWeight": "bold"
      },
      "encoding": {
        "x": {"field": "concurrency", "type": "ordinal"},
        "y": {"field": "value", "type": "quantitative"},
        "text": {"field": "value", "type": "quantitative", "format": ".0f"},
        "color": {"value": "#27ae60"}
      }
    },
    {
      "transform": [
        {"filter": "datum.type === 'data'"},
        {"filter": "datum.scenario === '5s Timeout (Journal=DELETE)'"},
        {"filter": "datum.concurrency < 4"}
      ],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "top",
        "dy": 50,
        "fontSize": 10,
        "fontWeight": "bold"
      },
      "encoding": {
        "x": {"field": "concurrency", "type": "ordinal"},
        "y": {"field": "value", "type": "quantitative"},
        "text": {"field": "value", "type": "quantitative", "format": ".0f"},
        "color": {"value": "#d35400"}
      }
    }
  ]
}
```

WAL is the strongest knob we can tune to improve SQLite production performance.

| SQLITE Production Configuration Knob | Value    | Description                |
| ------------------------------------ | -------- | -------------------------- |
| `PRAGMA busy_timeout`                | 5s - 10s | Prevents lock errors       |
| `PRAGMA journal_mode`                | `WAL`    | Improves write concurrency |

## Sync Normal vs Full

By default, SQLite uses `PRAGMA synchronous = FULL`, ensuring every transaction is durably written to disk before returning. In WAL mode, switching to `PRAGMA synchronous = NORMAL` separates logical commits from durable commits. This guarantees atomicity and consistency, the database is never corrupted, but accepts a tiny risk of data loss on power failure in exchange for performance.

**Trade-offs:**

- **Safety**: Database corruption is impossible.
- **Durability**: Recent commits (last few milliseconds) may roll back on kernel panic or power loss.
- **Performance**: `fsync` is removed from the transaction commit critical path

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "WAL to WAL+Sync Normal - Latency Improvement",
  "data": {
    "values": [
      {
        "type": "data",
        "concurrency": 1,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 1.5661609999951907
      },
      {
        "type": "data",
        "concurrency": 1,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 1.2796220000018366
      },
      {
        "type": "annotation",
        "concurrency": 1,
        "metric": "P99 Latency",
        "midpoint": 1.4156602951056876,
        "label": "-18%"
      },
      {
        "type": "data",
        "concurrency": 1,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 0.8174576630300454
      },
      {
        "type": "data",
        "concurrency": 1,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Avg Latency",
        "value": 0.7671517123200041
      },
      {
        "type": "annotation",
        "concurrency": 1,
        "metric": "Avg Latency",
        "midpoint": 0.7919053263759552,
        "label": "-6%"
      },
      {
        "type": "data",
        "concurrency": 2,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 2.4762229999760166
      },
      {
        "type": "data",
        "concurrency": 2,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 2.209495999966748
      },
      {
        "type": "annotation",
        "concurrency": 2,
        "metric": "P99 Latency",
        "midpoint": 2.3390606690448776,
        "label": "-11%"
      },
      {
        "type": "data",
        "concurrency": 2,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 1.4002560940299993
      },
      {
        "type": "data",
        "concurrency": 2,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Avg Latency",
        "value": 1.3310670435499874
      },
      {
        "type": "data",
        "concurrency": 4,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 10.745245000056457
      },
      {
        "type": "data",
        "concurrency": 4,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 10.822876000020187
      },
      {
        "type": "data",
        "concurrency": 4,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 3.277602246799936
      },
      {
        "type": "data",
        "concurrency": 4,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Avg Latency",
        "value": 3.5939618898699313
      },
      {
        "type": "annotation",
        "concurrency": 4,
        "metric": "Avg Latency",
        "midpoint": 3.432138919850278,
        "label": "+10%"
      },
      {
        "type": "data",
        "concurrency": 8,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 61.43524200003594
      },
      {
        "type": "data",
        "concurrency": 8,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 59.18545699992683
      },
      {
        "type": "data",
        "concurrency": 8,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 12.102967314579923
      },
      {
        "type": "data",
        "concurrency": 8,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Avg Latency",
        "value": 10.12510157106024
      },
      {
        "type": "annotation",
        "concurrency": 8,
        "metric": "Avg Latency",
        "midpoint": 11.069949113313209,
        "label": "-16%"
      },
      {
        "type": "data",
        "concurrency": 16,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 114.65533400001004
      },
      {
        "type": "data",
        "concurrency": 16,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 121.70975300006103
      },
      {
        "type": "annotation",
        "concurrency": 16,
        "metric": "P99 Latency",
        "midpoint": 118.12989622140842,
        "label": "+6%"
      },
      {
        "type": "data",
        "concurrency": 16,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 22.326900866899685
      },
      {
        "type": "data",
        "concurrency": 16,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Avg Latency",
        "value": 23.95400490710971
      },
      {
        "type": "annotation",
        "concurrency": 16,
        "metric": "Avg Latency",
        "midpoint": 23.126147386157236,
        "label": "+7%"
      },
      {
        "type": "data",
        "concurrency": 32,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 201.91397699993104
      },
      {
        "type": "data",
        "concurrency": 32,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 220.18032000004314
      },
      {
        "type": "annotation",
        "concurrency": 32,
        "metric": "P99 Latency",
        "midpoint": 210.84943459332814,
        "label": "+9%"
      },
      {
        "type": "data",
        "concurrency": 32,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 36.79333517152001
      },
      {
        "type": "data",
        "concurrency": 32,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Avg Latency",
        "value": 37.320676191019984
      },
      {
        "type": "data",
        "concurrency": 64,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 981.8456860000733
      },
      {
        "type": "data",
        "concurrency": 64,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 867.1603470002301
      },
      {
        "type": "annotation",
        "concurrency": 64,
        "metric": "P99 Latency",
        "midpoint": 922.7229517967473,
        "label": "-12%"
      },
      {
        "type": "data",
        "concurrency": 64,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 107.49351636380175
      },
      {
        "type": "data",
        "concurrency": 64,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Avg Latency",
        "value": 101.06395757968984
      },
      {
        "type": "annotation",
        "concurrency": 64,
        "metric": "Avg Latency",
        "midpoint": 104.22917143431083,
        "label": "-6%"
      },
      {
        "type": "data",
        "concurrency": 128,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "P99 Latency",
        "value": 1795.2708560000174
      },
      {
        "type": "data",
        "concurrency": 128,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 1328.640372000169
      },
      {
        "type": "annotation",
        "concurrency": 128,
        "metric": "P99 Latency",
        "midpoint": 1544.4317200695293,
        "label": "-26%"
      },
      {
        "type": "data",
        "concurrency": 128,
        "scenario": "WAL Mode",
        "color": "#27ae60",
        "metric": "Avg Latency",
        "value": 264.41297013594345
      },
      {
        "type": "data",
        "concurrency": 128,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Avg Latency",
        "value": 194.31207284361076
      },
      {
        "type": "annotation",
        "concurrency": 128,
        "metric": "Avg Latency",
        "midpoint": 226.66855166487238,
        "label": "-27%"
      }
    ]
  },
  "facet": {
    "row": {
      "field": "metric",
      "title": null,
      "header": {"labelFontSize": 16, "labelFontWeight": "bold"}
    }
  },
  "spec": {
    "width": 800,
    "height": 300,
    "layer": [
      {
        "transform": [{"filter": "datum.type === 'data'"}],
        "mark": {"type": "line", "point": true, "strokeWidth": 3},
        "encoding": {
          "x": {
            "field": "concurrency",
            "type": "ordinal",
            "title": "Number of Workers",
            "axis": {"labelAngle": 0}
          },
          "y": {
            "field": "value",
            "type": "quantitative",
            "title": "Latency (ms)",
            "scale": {"type": "log", "domainMin": 0.1},
            "axis": {"grid": true}
          },
          "color": {
            "field": "scenario",
            "type": "nominal",
            "scale": {
              "domain": ["WAL Mode", "WAL + Sync NORMAL"],
              "range": ["#27ae60", "#00bcd4"]
            },
            "title": "Configuration"
          },
          "tooltip": [
            {"field": "scenario", "title": "Config"},
            {"field": "concurrency", "title": "Workers"},
            {"field": "value", "title": "Latency", "format": ".2f"}
          ]
        }
      },
      {
        "transform": [{"filter": "datum.type === 'annotation'"}],
        "mark": {
          "type": "text",
          "align": "center",
          "baseline": "middle",
          "dy": 0,
          "fontSize": 10,
          "fontWeight": "bold",
          "color": "#333",
          "fill": "#fff",
          "stroke": "#fff",
          "strokeWidth": 2
        },
        "encoding": {
          "x": {"field": "concurrency", "type": "ordinal"},
          "y": {"field": "midpoint", "type": "quantitative"},
          "text": {"field": "label"}
        }
      },
      {
        "transform": [{"filter": "datum.type === 'annotation'"}],
        "mark": {
          "type": "text",
          "align": "center",
          "baseline": "middle",
          "dy": 0,
          "fontSize": 10,
          "fontWeight": "bold",
          "color": "#333"
        },
        "encoding": {
          "x": {"field": "concurrency", "type": "ordinal"},
          "y": {"field": "midpoint", "type": "quantitative"},
          "text": {"field": "label"}
        }
      }
    ]
  },
  "resolve": {"scale": {"y": "independent"}}
}

```

On my machine, I didn't notice any significant difference between `NORMAL` and `FULL` in terms of latency. However, **these benchmarks were likely affected by macOS's durability issues**: The SQLite shipped by Apple on macOS has fsync patched out. While custom-compiled SQLite knows to call `fcntl(F_FULLSYNC)` for proper durability, [Apple's version replaces it with the weaker `fsync()`](https://transactional.blog/blog/2022-darwins-deceptive-durability) which only ensures write ordering but not durability. (Thanks to [this Reddit comment](https://www.reddit.com/r/Database/comments/1qa14m6/comment/nz0a1fg/) for pointing this out.)

| SQLITE Production Configuration Knob | Value    | Description                                |
| ------------------------------------ | -------- | ------------------------------------------ |
| `PRAGMA busy_timeout`                | 5s - 10s | Prevents lock errors                       |
| `PRAGMA journal_mode`                | `WAL`    | Improves write concurrency                 |
| `PRAGMA synchronous`                 | `NORMAL` | Reduces fsync (trade durability for speed) |

ChatGPT recommended to use `NORMAL` for most workloads (Web APIs, caches, event ingestion). Only use `FULL` if you strictly cannot afford to lose the last committed transaction, even at the cost of higher latency.

## Advanced WAL Tuning: Latency Comparison

Next we'll tune some advanced knobs that are very specific to your workload.

- `PRAGMA wal_autocheckpoint`: Adjusts how often we "checkpoint" (transfer) data from the WAL to the main database file.
- `PRAGMA mmap_size`: Reduces system call overhead by mapping the database file directly into memory.
- `PRAGMA temp_store`: Keeps temporary tables and indices entirely in RAM to avoid disk I/O.

Below is a chart of following configurations against the WAL Sync Normal mode for reference.

- WAL + Sync NORMAL
- WAL + NORMAL + Checkpoint 2k
- WAL + NORMAL + Checkpoint 4k
- WAL + NORMAL + Checkpoint 4k + 1GB MMAP

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Advanced Knobs - Latency Comparison",
  "data": {
    "values": [
      {
        "concurrency": 1,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Average Latency",
        "value": 0.7671517123200041
      },
      {
        "concurrency": 1,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 1.2796220000018366
      },
      {
        "concurrency": 2,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Average Latency",
        "value": 1.3310670435499874
      },
      {
        "concurrency": 2,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 2.209495999966748
      },
      {
        "concurrency": 4,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Average Latency",
        "value": 3.5939618898699313
      },
      {
        "concurrency": 4,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 10.822876000020187
      },
      {
        "concurrency": 8,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Average Latency",
        "value": 10.12510157106024
      },
      {
        "concurrency": 8,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 59.18545699992683
      },
      {
        "concurrency": 16,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Average Latency",
        "value": 23.95400490710971
      },
      {
        "concurrency": 16,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 121.70975300006103
      },
      {
        "concurrency": 32,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Average Latency",
        "value": 37.320676191019984
      },
      {
        "concurrency": 32,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 220.18032000004314
      },
      {
        "concurrency": 64,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Average Latency",
        "value": 101.06395757968984
      },
      {
        "concurrency": 64,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 867.1603470002301
      },
      {
        "concurrency": 128,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "Average Latency",
        "value": 194.31207284361076
      },
      {
        "concurrency": 128,
        "scenario": "WAL + Sync NORMAL",
        "color": "#00bcd4",
        "metric": "P99 Latency",
        "value": 1328.640372000169
      },
      {
        "concurrency": 1,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "Average Latency",
        "value": 0.9903028145199548
      },
      {
        "concurrency": 1,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "P99 Latency",
        "value": 2.186098000005586
      },
      {
        "concurrency": 2,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "Average Latency",
        "value": 1.506967474469917
      },
      {
        "concurrency": 2,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "P99 Latency",
        "value": 2.6349320000153966
      },
      {
        "concurrency": 4,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "Average Latency",
        "value": 3.4482159138500297
      },
      {
        "concurrency": 4,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "P99 Latency",
        "value": 10.931634999986272
      },
      {
        "concurrency": 8,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "Average Latency",
        "value": 11.04209515784978
      },
      {
        "concurrency": 8,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "P99 Latency",
        "value": 61.42211199994199
      },
      {
        "concurrency": 16,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "Average Latency",
        "value": 24.494503700640138
      },
      {
        "concurrency": 16,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "P99 Latency",
        "value": 119.54462400008924
      },
      {
        "concurrency": 32,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "Average Latency",
        "value": 41.88149210486042
      },
      {
        "concurrency": 32,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "P99 Latency",
        "value": 245.8750360000413
      },
      {
        "concurrency": 64,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "Average Latency",
        "value": 71.32890060729055
      },
      {
        "concurrency": 64,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "P99 Latency",
        "value": 557.5971429999918
      },
      {
        "concurrency": 128,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "Average Latency",
        "value": 179.771561407635
      },
      {
        "concurrency": 128,
        "scenario": "WAL/N/Checkpoint 2k",
        "color": "#2980b9",
        "metric": "P99 Latency",
        "value": 1191.4563100002706
      },
      {
        "concurrency": 1,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "Average Latency",
        "value": 1.0064493379799682
      },
      {
        "concurrency": 1,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "P99 Latency",
        "value": 2.223147999997309
      },
      {
        "concurrency": 2,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "Average Latency",
        "value": 1.5020356644299158
      },
      {
        "concurrency": 2,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "P99 Latency",
        "value": 2.846596999996109
      },
      {
        "concurrency": 4,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "Average Latency",
        "value": 3.453969275189968
      },
      {
        "concurrency": 4,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "P99 Latency",
        "value": 10.942916000029072
      },
      {
        "concurrency": 8,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "Average Latency",
        "value": 11.390019064270051
      },
      {
        "concurrency": 8,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "P99 Latency",
        "value": 61.84805499995127
      },
      {
        "concurrency": 16,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "Average Latency",
        "value": 24.467947118189908
      },
      {
        "concurrency": 16,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "P99 Latency",
        "value": 119.14742499997374
      },
      {
        "concurrency": 32,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "Average Latency",
        "value": 41.73233274015965
      },
      {
        "concurrency": 32,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "P99 Latency",
        "value": 244.60988299991004
      },
      {
        "concurrency": 64,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "Average Latency",
        "value": 69.32991572152034
      },
      {
        "concurrency": 64,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "P99 Latency",
        "value": 555.2882469999604
      },
      {
        "concurrency": 128,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "Average Latency",
        "value": 210.07008476076055
      },
      {
        "concurrency": 128,
        "scenario": "WAL/N/Checkpoint 4k",
        "color": "#e84393",
        "metric": "P99 Latency",
        "value": 1280.2398810000159
      },
      {
        "concurrency": 1,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "Average Latency",
        "value": 0.8657644203299767
      },
      {
        "concurrency": 1,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "P99 Latency",
        "value": 2.3957319999899482
      },
      {
        "concurrency": 2,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "Average Latency",
        "value": 1.371191709179958
      },
      {
        "concurrency": 2,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "P99 Latency",
        "value": 2.53922799997963
      },
      {
        "concurrency": 4,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "Average Latency",
        "value": 3.4843013121499498
      },
      {
        "concurrency": 4,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "P99 Latency",
        "value": 10.781565999961458
      },
      {
        "concurrency": 8,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "Average Latency",
        "value": 13.437719637910034
      },
      {
        "concurrency": 8,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "P99 Latency",
        "value": 63.078645000001416
      },
      {
        "concurrency": 16,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "Average Latency",
        "value": 29.664285159059716
      },
      {
        "concurrency": 16,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "P99 Latency",
        "value": 139.74099999992177
      },
      {
        "concurrency": 32,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "Average Latency",
        "value": 40.446170259000155
      },
      {
        "concurrency": 32,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "P99 Latency",
        "value": 200.9401750001125
      },
      {
        "concurrency": 64,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "Average Latency",
        "value": 93.00230120662026
      },
      {
        "concurrency": 64,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "P99 Latency",
        "value": 657.4366780002601
      },
      {
        "concurrency": 128,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "Average Latency",
        "value": 176.08483673393894
      },
      {
        "concurrency": 128,
        "scenario": "WAL/N/4k/1GB MMAP",
        "color": "#2c3e50",
        "metric": "P99 Latency",
        "value": 1162.1979370000772
      }
    ]
  },
  "facet": {
    "row": {
      "field": "metric",
      "title": null,
      "header": {"labelFontSize": 16, "labelFontWeight": "bold"}
    }
  },
  "spec": {
    "width": 800,
    "height": 300,
    "mark": {"type": "line", "point": true, "strokeWidth": 3},
    "encoding": {
      "x": {
        "field": "concurrency",
        "type": "ordinal",
        "title": "Number of Workers",
        "axis": {"labelAngle": 0}
      },
      "y": {
        "field": "value",
        "type": "quantitative",
        "title": "Latency (ms)",
        "scale": {"type": "log", "domainMin": 0.1},
        "axis": {"grid": true}
      },
      "color": {
        "field": "scenario",
        "type": "nominal",
        "scale": {
          "domain": [
            "WAL + Sync NORMAL",
            "WAL/N/Checkpoint 2k",
            "WAL/N/Checkpoint 4k",
            "WAL/N/4k/1GB MMAP"
          ],
          "range": ["#00bcd4", "#2980b9", "#e84393", "#2c3e50"]
        },
        "title": "Configuration"
      },
      "tooltip": [
        {"field": "scenario", "title": "Config"},
        {"field": "concurrency", "title": "Workers"},
        {"field": "value", "title": "Latency", "format": ".2f"}
      ]
    }
  },
  "resolve": {"scale": {"y": "independent"}}
}
```

On my machine, the difference in P99 and Average latency between these configurations was not very visible. This is likely because this particular test run emphasized write operations. The benefits of MMAP and larger checkpoints are typically more pronounced in read-heavy or mixed workloads where read lock contention and system call overhead become bottlenecks.

### Checkpoints: Quick vs Delayed "Bill Payments"

To understand `PRAGMA wal_autocheckpoint`, use the "billing analogy". Think of writing to the WAL as accumulating a tab, and running a checkpoint as paying the bill (syncing data to the main database file).

The `wal_autocheckpoint` setting defines how often you pay that bill (in number of pages).

- **Paying Often (Low Threshold, e.g., 1000 pages)**: The default setting. You pay your bill frequently. This keeps your debt (WAL file size) small and manageable, ensuring that readers have less WAL data to scan. However, the administrative overhead of logging in to pay (invoking the checkpointer and fsyncing) happens frequently, stealing cycles from your application.
- **Paying Later (High Threshold, e.g., 2000 or 4000 pages)**: You let the tab run up higher before paying. This is more efficient because you batch the "payment" work—you perform the expensive checkpoint operation less often. The tradeoff is that the "bill" (WAL file) gets larger. A larger WAL file can slightly slow down readers and means the eventual payment will take longer to process, potentially causing a minor latency spike.

For high-throughput write applications, increasing the checkpoint threshold (e.g., from 1000 to 4000) strikes a better balance, reducing the frequency of checkpoint freezes.

### Memory Mapped I/O (MMAP) and Temp Store

The final optimizations involve how SQLite interacts with memory.

- **MMAP (`PRAGMA mmap_size`)**: By default, SQLite reads data from disk using standard system calls (`read()`). This is like asking a librarian to fetch a book for you every time you need to look up a fact. Enabling MMAP (`mmap_size > 0`) allows the OS to map the database file directly into the process's memory space. It's equivalent to spreading the books out on your desk; you can access the data instantly without the overhead of asking the librarian. A 1GB MMAP limits syscalls and can significantly reduce CPU usage for reads.
- **Temp Store (`PRAGMA temp_store`)**: Complex queries often create temporary tables or indices. By setting `temp_store = 2` (Memory), you force SQLite to build these temporary structures in RAM rather than on the disk. This is a "free" performance win if you have memory to spare, preventing unnecessary I/O for transient data.

| SQLITE Production Configuration Knob | Value        | Description                                       |
| :----------------------------------- | :----------- | :------------------------------------------------ |
| `PRAGMA busy_timeout`                | 5s - 10s     | Prevents lock errors                              |
| `PRAGMA journal_mode`                | `WAL`        | Improves write concurrency                        |
| `PRAGMA synchronous`                 | `NORMAL`     | Reduces fsync (trade durability for speed)        |
| `PRAGMA wal_autocheckpoint`          | `4000`       | Checkpoint less often to improve write throughput |
| `PRAGMA mmap_size`                   | `1073741824` | (1GB) Reduces syscalls by mapping DB to RAM       |
| `PRAGMA temp_store`                  | `MEMORY`     | Stores temp tables in RAM instead of disk         |

# Mixed Read-Write Phase

In this phase of the benchmark, we introduce 4 different kinds of read queries to the mix. These queries are:

1. `posts_for_user`: Fetches the latest 100 posts for a specific user. This query involves a JOIN with the `user_posts` junction table to filter posts by user ID.
2. `posts_in_timeframe`: Retrieves a paginated list of 100 posts created within a specific start and end date range.
3. `single_post_with_details`: Fetches a single post along with its author and tags. This is a more complex query requiring multiple `LEFT JOIN`s to bring in data from `users`, `user_posts`, `posts_tags`, and `tags`.
4. `users_in_timeframe`: Selects a list of 100 users who joined the platform within a specified time window.

Along with the 4 read queries, we continue to write data to the database. 80% of total queries are read queries and 20% are write queries.

## Mixed Workload Database setup

The mixed workload database is configured with:

- Busy Timeout: 5s
- Journal Mode: WAL
- Synchronous: NORMAL
- WAL Autocheckpoint: 4000
- MMAP Size: 1GB
- Temp Store: MEMORY
- Page Cache: 64MB

Page Cache is similar to MMAP in that both utilize memory to accelerate data retrieval, but they function differently. The Page Cache (`PRAGMA cache_size`) is a user-space buffer managed by SQLite, meaning data is copied from the operating system's kernel cache into SQLite’s memory. MMAP, on the other hand, maps the file directly into the process's address space, allowing zero-copy access where the OS manages paging transparently. While MMAP acts as a "second layer" of caching that reduces syscall overhead, the Page Cache remains essential for managing dirty pages and handling write operations effectively.

## Ops per second

The benchmarks start after seeding 50000 records in the database. Then we run 1,048,576 (2^20) reads and 131,072 (2^17) writes.

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Mixed Read-Write Ops Per Second",
  "width": 800,
  "height": 300,
  "data": {
    "values": [
      {
        "workers": 2,
        "opsPerSec": 1245.6021742749856,
        "readP99": 0.5650330000789836,
        "writeP99": 1.382480000029318
      },
      {
        "workers": 4,
        "opsPerSec": 4114.854974575331,
        "readP99": 0.8443799999949988,
        "writeP99": 1.4680560000124387
      },
      {
        "workers": 6,
        "opsPerSec": 3088.82056844212,
        "readP99": 5.5767540000379086,
        "writeP99": 5.115320000011707
      },
      {
        "workers": 8,
        "opsPerSec": 9360.751065511678,
        "readP99": 0.9107289999956265,
        "writeP99": 3.429433000004792
      },
      {
        "workers": 10,
        "opsPerSec": 7960.46150186955,
        "readP99": 2.7917270000034478,
        "writeP99": 4.021329000010155
      },
      {
        "workers": 12,
        "opsPerSec": 7773.1977336763675,
        "readP99": 4.715248000000429,
        "writeP99": 8.711505000013858
      },
      {
        "workers": 14,
        "opsPerSec": 9393.377768364258,
        "readP99": 1.8022000000055414,
        "writeP99": 8.900903000001563
      },
      {
        "workers": 16,
        "opsPerSec": 5723.250623995946,
        "readP99": 6.622467000008328,
        "writeP99": 14.543749000004027
      },
      {
        "workers": 20,
        "opsPerSec": 6506.370298305349,
        "readP99": 5.058118999993894,
        "writeP99": 21.820833000005223
      },
      {
        "workers": 24,
        "opsPerSec": 8859.443187278357,
        "readP99": 2.84113200000138,
        "writeP99": 37.28009900000325
      },
      {
        "workers": 30,
        "opsPerSec": 7730.886710497171,
        "readP99": 3.999370999998064,
        "writeP99": 87.46703899998101
      },
      {
        "workers": 32,
        "opsPerSec": 8189.163949651795,
        "readP99": 3.958161000002292,
        "writeP99": 106.94816800000262
      },
      {
        "workers": 64,
        "opsPerSec": 7653.231184300172,
        "readP99": 5.767187000004924,
        "writeP99": 677.0870149999973
      }
    ]
  },
  "layer": [
    {
      "mark": {"type": "line", "point": true, "tooltip": true},
      "encoding": {
        "x": {"field": "workers", "type": "quantitative", "title": "Total Workers"},
        "y": {
          "field": "opsPerSec",
          "type": "quantitative",
          "title": "Total Ops / Sec"
        }
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "top",
        "dy": 10,
        "color": "#4c78a8"
      },
      "encoding": {
        "x": {"field": "workers", "type": "quantitative"},
        "y": {"field": "opsPerSec", "type": "quantitative"},
        "text": {"field": "workers"}
      }
    },
    {
      "transform": [
        {"calculate": "round(datum.opsPerSec/100)/10 + 'k'", "as": "opsLabel"}
      ],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "bottom",
        "dy": -10,
        "color": "black"
      },
      "encoding": {
        "x": {"field": "workers", "type": "quantitative"},
        "y": {"field": "opsPerSec", "type": "quantitative"},
        "text": {"field": "opsLabel"}
      }
    }
  ]
}
```

The drop from 14 to 20 workers feels unnatural. It could be due to my [laptop throttling under sustained load](https://stanislas.blog/2025/12/macos-thermal-throttling-app/). **The sweet spot for ops per second is between 8 to 14 concurrency or 80% of thread count (80% x 16 = 12.8)**.

## Detailed Read vs Write Latency

The p99 read latency consistently stays under 6ms, even at 60+ concurrent workers. This is a testament to SQLite's performance.

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Detailed Read Latency",
  "width": 800,
  "height": 300,
  "data": {
    "values": [
      {"x": 2, "metric": "Min", "latency": 0.048328000000765314},
      {"x": 2, "metric": "Avg", "latency": 0.22271887561793002},
      {"x": 2, "metric": "P50", "latency": 0.20201699994504452},
      {"x": 2, "metric": "P99", "latency": 0.5650330000789836},
      {"x": 2, "metric": "Max", "latency": 12.91521400003694},
      {"x": 4, "metric": "Min", "latency": 0.03982999999425374},
      {"x": 4, "metric": "Avg", "latency": 0.2690503588269431},
      {"x": 4, "metric": "P50", "latency": 0.24192000000039116},
      {"x": 4, "metric": "P99", "latency": 0.8443799999949988},
      {"x": 4, "metric": "Max", "latency": 3.4239250000100583},
      {"x": 6, "metric": "Min", "latency": 0.041546000000380445},
      {"x": 6, "metric": "Avg", "latency": 0.9232810004255276},
      {"x": 6, "metric": "P50", "latency": 0.40551099999720464},
      {"x": 6, "metric": "P99", "latency": 5.5767540000379086},
      {"x": 6, "metric": "Max", "latency": 50.18598900001962},
      {"x": 8, "metric": "Min", "latency": 0.04391399999985879},
      {"x": 8, "metric": "Avg", "latency": 0.35963139076466616},
      {"x": 8, "metric": "P50", "latency": 0.3063459999993938},
      {"x": 8, "metric": "P99", "latency": 0.9107289999956265},
      {"x": 8, "metric": "Max", "latency": 21.37514299999748},
      {"x": 10, "metric": "Min", "latency": 0.04489800000010291},
      {"x": 10, "metric": "Avg", "latency": 0.579021995454987},
      {"x": 10, "metric": "P50", "latency": 0.4533519999968121},
      {"x": 10, "metric": "P99", "latency": 2.7917270000034478},
      {"x": 10, "metric": "Max", "latency": 26.069272000000637},
      {"x": 12, "metric": "Min", "latency": 0.04688700000042445},
      {"x": 12, "metric": "Avg", "latency": 0.7076923415313783},
      {"x": 12, "metric": "P50", "latency": 0.5058159999898635},
      {"x": 12, "metric": "P99", "latency": 4.715248000000429},
      {"x": 12, "metric": "Max", "latency": 99.34007800000109},
      {"x": 14, "metric": "Min", "latency": 0.048381000000517815},
      {"x": 14, "metric": "Avg", "latency": 0.6701941778388022},
      {"x": 14, "metric": "P50", "latency": 0.5461190000060014},
      {"x": 14, "metric": "P99", "latency": 1.8022000000055414},
      {"x": 14, "metric": "Max", "latency": 118.79362399999809},
      {"x": 16, "metric": "Min", "latency": 0.05044900000029884},
      {"x": 16, "metric": "Avg", "latency": 1.346927951356575},
      {"x": 16, "metric": "P50", "latency": 0.9566219999978784},
      {"x": 16, "metric": "P99", "latency": 6.622467000008328},
      {"x": 16, "metric": "Max", "latency": 90.98276600000099},
      {"x": 20, "metric": "Min", "latency": 0.04899899999873014},
      {"x": 20, "metric": "Avg", "latency": 1.3388296904445798},
      {"x": 20, "metric": "P50", "latency": 1.0898920000036014},
      {"x": 20, "metric": "P99", "latency": 5.058118999993894},
      {"x": 20, "metric": "Max", "latency": 37.081830999999966},
      {"x": 24, "metric": "Min", "latency": 0.053294999997888226},
      {"x": 24, "metric": "Avg", "latency": 1.0252278511499926},
      {"x": 24, "metric": "P50", "latency": 0.9437890000008338},
      {"x": 24, "metric": "P99", "latency": 2.84113200000138},
      {"x": 24, "metric": "Max", "latency": 36.81533300000001},
      {"x": 30, "metric": "Min", "latency": 0.05305000000225846},
      {"x": 30, "metric": "Avg", "latency": 1.2889913725933644},
      {"x": 30, "metric": "P50", "latency": 1.1601680000021588},
      {"x": 30, "metric": "P99", "latency": 3.999370999998064},
      {"x": 30, "metric": "Max", "latency": 94.13252499999999},
      {"x": 32, "metric": "Min", "latency": 0.06039500000042608},
      {"x": 32, "metric": "Avg", "latency": 1.2302777897149282},
      {"x": 32, "metric": "P50", "latency": 1.104626999993343},
      {"x": 32, "metric": "P99", "latency": 3.958161000002292},
      {"x": 32, "metric": "Max", "latency": 64.95842000000039},
      {"x": 64, "metric": "Min", "latency": 0.05413600000247243},
      {"x": 64, "metric": "Avg", "latency": 1.477772625130105},
      {"x": 64, "metric": "P50", "latency": 1.2668010000052163},
      {"x": 64, "metric": "P99", "latency": 5.767187000004924},
      {"x": 64, "metric": "Max", "latency": 170.67241099999956}
    ]
  },
  "encoding": {
    "x": {"field": "x", "type": "quantitative", "title": "Total Workers"},
    "y": {
      "field": "latency",
      "type": "quantitative",
      "title": "Read Latency (ms)",
      "scale": {"type": "log"}
    },
    "color": {
      "field": "metric",
      "type": "nominal",
      "scale": {
        "domain": ["Min", "Avg", "P50", "P99", "Max"],
        "range": ["#4c78a8", "#72b7b2", "#54a24b", "#e45756", "#b279a2"]
      }
    }
  },
  "layer": [
    {"mark": {"type": "line", "point": true, "tooltip": true}},
    {
      "transform": [{"filter": "datum.metric == 'P99'"}],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "bottom",
        "dy": -10
      },
      "encoding": {
        "text": {"field": "latency", "type": "quantitative", "format": ".1f"},
        "color": {"value": "#e45756"}
      }
    }
  ]
}
```

For writes, the p99 stays under 10 when concurrency is less than thread count. Post that it starts increasing logarithmically.

```vega-lite

{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Detailed Write Latency",
  "width": 800,
  "height": 300,
  "data": {
    "values": [
      {"x": 2, "metric": "Min", "latency": 0.0625},
      {"x": 2, "metric": "Avg", "latency": 0.31529142790209236},
      {"x": 2, "metric": "P50", "latency": 0.2930300000589341},
      {"x": 2, "metric": "P99", "latency": 1.382480000029318},
      {"x": 2, "metric": "Max", "latency": 38.15984200002276},
      {"x": 4, "metric": "Min", "latency": 0.06366299999899638},
      {"x": 4, "metric": "Avg", "latency": 0.26652451448822156},
      {"x": 4, "metric": "P50", "latency": 0.1353629999794066},
      {"x": 4, "metric": "P99", "latency": 1.4680560000124387},
      {"x": 4, "metric": "Max", "latency": 71.60960199999863},
      {"x": 6, "metric": "Min", "latency": 0.06539000000339001},
      {"x": 6, "metric": "Avg", "latency": 0.5976800003280991},
      {"x": 6, "metric": "P50", "latency": 0.1747040000045672},
      {"x": 6, "metric": "P99", "latency": 5.115320000011707},
      {"x": 6, "metric": "Max", "latency": 57.633402000006754},
      {"x": 8, "metric": "Min", "latency": 0.06031499999517109},
      {"x": 8, "metric": "Avg", "latency": 0.36792517662047713},
      {"x": 8, "metric": "P50", "latency": 0.16527399999904446},
      {"x": 8, "metric": "P99", "latency": 3.429433000004792},
      {"x": 8, "metric": "Max", "latency": 79.33691800000088},
      {"x": 10, "metric": "Min", "latency": 0.05064200000197161},
      {"x": 10, "metric": "Avg", "latency": 0.5785547027893043},
      {"x": 10, "metric": "P50", "latency": 0.23760700001730584},
      {"x": 10, "metric": "P99", "latency": 4.021329000010155},
      {"x": 10, "metric": "Max", "latency": 61.16861600000266},
      {"x": 12, "metric": "Min", "latency": 0.05314400000133901},
      {"x": 12, "metric": "Avg", "latency": 0.829106601245132},
      {"x": 12, "metric": "P50", "latency": 0.30762500000128057},
      {"x": 12, "metric": "P99", "latency": 8.711505000013858},
      {"x": 12, "metric": "Max", "latency": 155.36747499997728},
      {"x": 14, "metric": "Min", "latency": 0.06144199999835109},
      {"x": 14, "metric": "Avg", "latency": 0.9299643031898258},
      {"x": 14, "metric": "P50", "latency": 0.3527689999973518},
      {"x": 14, "metric": "P99", "latency": 8.900903000001563},
      {"x": 14, "metric": "Max", "latency": 117.61509500000102},
      {"x": 16, "metric": "Min", "latency": 0.06225600000470877},
      {"x": 16, "metric": "Avg", "latency": 1.607889376823402},
      {"x": 16, "metric": "P50", "latency": 0.5874210000038147},
      {"x": 16, "metric": "P99", "latency": 14.543749000004027},
      {"x": 16, "metric": "Max", "latency": 244.7779789999986},
      {"x": 20, "metric": "Min", "latency": 0.06063200000062352},
      {"x": 20, "metric": "Avg", "latency": 2.30189911393471},
      {"x": 20, "metric": "P50", "latency": 1.0106460000024526},
      {"x": 20, "metric": "P99", "latency": 21.820833000005223},
      {"x": 20, "metric": "Max", "latency": 354.9602600000071},
      {"x": 24, "metric": "Min", "latency": 0.06284100000630133},
      {"x": 24, "metric": "Avg", "latency": 3.2472798010925286},
      {"x": 24, "metric": "P50", "latency": 1.3162699999957113},
      {"x": 24, "metric": "P99", "latency": 37.28009900000325},
      {"x": 24, "metric": "Max", "latency": 348.5184889999946},
      {"x": 30, "metric": "Min", "latency": 0.06221399999776622},
      {"x": 30, "metric": "Avg", "latency": 6.679048627193367},
      {"x": 30, "metric": "P50", "latency": 2.0618870000034804},
      {"x": 30, "metric": "P99", "latency": 87.46703899998101},
      {"x": 30, "metric": "Max", "latency": 1289.487570000012},
      {"x": 32, "metric": "Min", "latency": 0.0652669999981299},
      {"x": 32, "metric": "Avg", "latency": 7.802101319610649},
      {"x": 32, "metric": "P50", "latency": 2.1993640000000596},
      {"x": 32, "metric": "P99", "latency": 106.94816800000262},
      {"x": 32, "metric": "Max", "latency": 1595.9651109999977},
      {"x": 64, "metric": "Min", "latency": 0.06931099999928847},
      {"x": 64, "metric": "Avg", "latency": 37.29290343277653},
      {"x": 64, "metric": "P50", "latency": 4.767875000005006},
      {"x": 64, "metric": "P99", "latency": 677.0870149999973},
      {"x": 64, "metric": "Max", "latency": 2142.2118340000006}
    ]
  },
  "encoding": {
    "x": {"field": "x", "type": "quantitative", "title": "Total Workers"},
    "y": {
      "field": "latency",
      "type": "quantitative",
      "title": "Write Latency (ms)",
      "scale": {"type": "log"}
    },
    "color": {
      "field": "metric",
      "type": "nominal",
      "scale": {
        "domain": ["Min", "Avg", "P50", "P99", "Max"],
        "range": ["#4c78a8", "#72b7b2", "#54a24b", "#e45756", "#b279a2"]
      }
    }
  },
  "layer": [
    {"mark": {"type": "line", "point": true, "tooltip": true}},
    {
      "transform": [{"filter": "datum.metric == 'P99'"}],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "bottom",
        "dy": -10
      },
      "encoding": {
        "text": {"field": "latency", "type": "quantitative", "format": ".1f"},
        "color": {"value": "#e45756"}
      }
    },
    {
      "transform": [{"filter": "datum.metric == 'P99'"}],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "top",
        "dy": 10
      },
      "encoding": {
        "text": {"field": "x", "type": "quantitative"},
        "color": {"value": "black"}
      }
    }
  ]
}
```

I was honestly surprised to see sub 10ms write latency, and sub 5ms read latency. This is just a file on my machine—it's radically simple, faster and easier to work with.

## Impact of Page Cache Size on Ops/sec and Latency

In the next step of performance testing, I varied the page cache size and measured the ops/sec and latency. The following page cache sizes were tested: 8MB, 16MB, 32MB, 48MB, 56MB, 64MB, 128MB, 256MB, 512MB, 1024MB, 2048MB, 4096MB.

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Impact of Page Cache Size on mixed ops/sec",
  "width": 800,
  "height": 300,
  "data": {
    "values": [
      {"cacheSizeMB": 8, "opsPerSec": 4995.2930281816725},
      {"cacheSizeMB": 16, "opsPerSec": 8021.010125435269},
      {"cacheSizeMB": 32, "opsPerSec": 5771.453368866699},
      {"cacheSizeMB": 48, "opsPerSec": 3775.309878856733},
      {"cacheSizeMB": 56, "opsPerSec": 7875.525737000409},
      {"cacheSizeMB": 64, "opsPerSec": 7960.46150186955},
      {"cacheSizeMB": 128, "opsPerSec": 6358.327161813556},
      {"cacheSizeMB": 256, "opsPerSec": 8702.784608101741},
      {"cacheSizeMB": 512, "opsPerSec": 3933.29352913623},
      {"cacheSizeMB": 1024, "opsPerSec": 8243.052711739912},
      {"cacheSizeMB": 2048, "opsPerSec": 4653.872877017224},
      {"cacheSizeMB": 4096, "opsPerSec": 6521.565151493175}
    ]
  },
  "transform": [
    {
      "window": [{"op": "row_number", "as": "row_number"}],
      "sort": [{"field": "cacheSizeMB"}]
    },
    {"calculate": "round(datum.opsPerSec/100)/10 + 'k'", "as": "opsLabel"}
  ],
  "layer": [
    {
      "mark": {"type": "rule", "color": "gray", "opacity": 0.2},
      "encoding": {"y": null, "color": null}
    },
    {"mark": {"type": "line", "point": true, "tooltip": true}},
    {
      "transform": [{"filter": "datum.row_number % 2 == 1"}],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "bottom",
        "dy": -10,
        "color": "black"
      },
      "encoding": {
        "text": {"field": "opsLabel"}
      }
    },
    {
      "transform": [{"filter": "datum.row_number % 2 == 0"}],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "top",
        "dy": 10,
        "color": "black"
      },
      "encoding": {
        "text": {"field": "opsLabel"}
      }
    }
  ],
  "encoding": {
    "x": {
      "field": "cacheSizeMB",
      "type": "quantitative",
      "title": "Cache Size (MB)",
      "scale": {"type": "log"},
      "axis": {"values": [8, 16, 32, 48, 56, 64, 128, 256, 512, 1024, 2048, 4096]}
    },
    "y": {"field": "opsPerSec", "type": "quantitative", "title": "Ops / Sec"}
  }
}
```

Ops/sec were highest and latency was lowest at 256MB cache size. The data doesn't have a conclusive shape, and it could be caused by factors beyond control of the benchmark. One possible control factor is the random timing of WAL checkpoints. Checkpoints are I/O intensive events; if one test run happens to trigger a checkpoint more frequently than another purely due to timing alignment, it can significantly skew the average throughput.

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Impact of Page Cache Size on Mixed Ops P99 Latency",
  "width": 800,
  "height": 300,
  "data": {
    "values": [
      {"x": 8, "readP99": 5.668794999997772, "writeP99": 8.62358200000017},
      {"x": 16, "readP99": 3.7505979999987176, "writeP99": 4.928673999995226},
      {"x": 32, "readP99": 5.031717000005301, "writeP99": 7.371574999997392},
      {"x": 48, "readP99": 7.4822019999992335, "writeP99": 9.714397000003373},
      {"x": 56, "readP99": 3.7358060000042315, "writeP99": 5.137102000000596},
      {"x": 64, "readP99": 2.7917270000034478, "writeP99": 4.021329000010155},
      {"x": 128, "readP99": 4.5258019999891985, "writeP99": 6.413501000002725},
      {"x": 256, "readP99": 2.102448000005097, "writeP99": 3.756101999999373},
      {"x": 512, "readP99": 7.193738000001758, "writeP99": 9.093458999999712},
      {
        "x": 1024,
        "readP99": 2.0100340000062715,
        "writeP99": 3.9592499999998836
      },
      {"x": 2048, "readP99": 6.674324999999953, "writeP99": 8.646653999996488},
      {"x": 4096, "readP99": 5.602530000003753, "writeP99": 6.851680000021588}
    ]
  },
  "transform": [{"fold": ["readP99", "writeP99"], "as": ["Type", "Latency"]}],
  "encoding": {
    "x": {
      "field": "x",
      "type": "quantitative",
      "title": "Cache Size (MB)",
      "scale": {"type": "log"},
      "axis": {"values": [8, 16, 32, 48, 56, 64, 128, 256, 512, 1024, 2048, 4096]}
    },
    "y": {
      "field": "Latency",
      "type": "quantitative",
      "title": "P99 Latency (ms)",
      "scale": {"type": "log"}
    },
    "color": {"field": "Type", "type": "nominal"}
  },
  "layer": [
    {
      "mark": {"type": "rule", "color": "gray", "opacity": 0.2},
      "encoding": {"y": null, "color": null}
    },
    {"mark": {"type": "line", "point": true, "tooltip": true}},
    {
      "transform": [{"filter": "datum.Type == 'writeP99'"}],
      "mark": {"type": "text", "dy": -10, "format": ".1f"},
      "encoding": {"text": {"field": "Latency", "type": "quantitative", "format": ".1f"}}
    },
    {
      "transform": [{"filter": "datum.Type == 'readP99'"}],
      "mark": {"type": "text", "dy": 10, "format": ".1f"},
      "encoding": {"text": {"field": "Latency", "type": "quantitative", "format": ".1f"}}
    }
  ]
}
```

Since I got lucky with 256MB, here's the final set of fine tunes for a SQLite DB:

| SQLITE Production Configuration Knob | Value        | Description                                        |
| :----------------------------------- | :----------- | :------------------------------------------------- |
| `PRAGMA busy_timeout`                | `5s - 10s`   | Prevents lock errors                               |
| `PRAGMA journal_mode`                | `WAL`        | Improves write concurrency                         |
| `PRAGMA synchronous`                 | `NORMAL`     | Reduces fsync (trade durability for speed)         |
| `PRAGMA wal_autocheckpoint`          | `4000`       | Checkpoint less often to improve write throughput  |
| `PRAGMA mmap_size`                   | `1073741824` | (1GB) Reduces syscalls by mapping DB to RAM        |
| `PRAGMA temp_store`                  | `MEMORY`     | Stores temp tables in RAM instead of disk          |
| `PRAGMA cache_size`                  | `-262144`    | (256MB) Caches hot pages in RAM to reduce disk I/O |

# Tuning at the query level

Beyond database configuration, how you structure your queries and transactions plays a massive role in performance.

### BEGIN IMMEDIATE

By default, an SQLite transaction started with `BEGIN` is `deferred`. This means it starts as a read transaction and only upgrades to a write transaction when you actually try to write something.

In a high-concurrency environment, this can lead to frequent `SQLITE_BUSY` errors. Picture two connections both starting a transaction (reading) and then both trying to upgrade to a write lock at the same time. One will fail.

`BEGIN IMMEDIATE` solves this by acquiring the write lock at the start of the transaction. If it succeeds, you are guaranteed to be able to complete your writes without being blocked by another writer upgrading their lock mid-way.

### Batching Transactions

Every individual `INSERT` or `UPDATE` statement in SQLite is technically a transaction. If you run 1,000 inserts sequentially without an explicit transaction, SQLite initiates, commits, and syncs (fsync) a transaction 1,000 times. This is incredibly slow.

The single most effective optimization for writes is to wrap multiple operations in a single transaction:

```sql
BEGIN;
INSERT INTO posts ...;
INSERT INTO posts ...;
-- ... 1000 more inserts ...
COMMIT;
```

This reduces 1,000 fsync operations to just one, often resulting in a 100x-1000x speedup for bulk operations.

# Implementing a write queue

Even with WAL mode, SQLite enforces a "single-writer" policy. While multiple readers can operate concurrently, only one write transaction can commit at a time. If your code indiscriminately fires off write transactions from multiple concurrent web requests, they will eventually contend for the lock.

While `busy_timeout` helps by making them wait, a more robust architectural pattern for write-heavy applications is to **serialize writes at the application level** using a queue.

### How it works

1.  **Dedicated Writer**: Create a single, dedicated worker (thread or process) whose only job is to write to the database.
2.  **Job Queue**: When a web request needs to modify data, it doesn't touch the database directly. Instead, it pushes a "write job" (e.g., a closure or a data object) into an in-memory queue.
3.  **Processing**: The dedicated writer pulls jobs off the queue one by one and executes them.

### Benefits

- **Zero Contention**: Since there is only one writer, `SQLITE_BUSY` errors due to write-write conflicts become impossible.
- **Smart Batching**: The writer can peek at the queue. If there are 50 pending insert jobs, it can wrap them all in a single `BEGIN IMMEDIATE ... COMMIT` transaction, dramatically reducing I/O overhead.
- **Backpressure**: If the queue fills up, you can handle backpressure gracefully (e.g., return 503 Service Unavailable) rather than timing out threads deep in the database driver.

This pattern essentially turns SQLite into a highly efficient, single-threaded append-log engine for writes, while utilizing its multi-threaded read capabilities for serving data.

# Production Readiness

You've tuned SQLite for performance, but production deployment requires addressing a few more practical concerns: accessing the database for debugging, handling complex analytical queries, and ensuring data safety through backups.

## Accessing the Production Database

In a "one-person framework" philosophy, sometimes you need to jump into the production database to inspect or fix data quickly. While direct database access in production is generally discouraged in larger teams, for solo developers or small teams, pragmatism wins.

Options for safe production access:

- SSH + SQLite CLI: SSH into your server and use the `sqlite3` command-line tool to open your database file. Set `.mode` to something readable like `column` or `json`.
- Read-only connection string: When just inspecting data, open the database in read-only mode to prevent accidental writes: `sqlite3 'file:/path/to/production.db?mode=ro`
- Web-based admin panel: Build a lightweight admin interface in your app (protected by authentication) that lets you run read-only queries or perform common operations. Tools like [sqlite-web](https://github.com/coleifer/sqlite-web) can be run locally by copying the database file down first.
- Litestream restore to local: Use Litestream to restore a recent snapshot locally, then explore it without touching production.

## What About Complex Queries?

SQLite excels at OLTP (transactional) workloads—the kinds of queries you see in this benchmark: lookups by ID, paginated lists, simple joins. It is **not optimized for OLAP (analytical) workloads** like complex aggregations, multi-table joins across millions of rows, or heavy GROUP BY operations.

**Why?** Postgres runs as a separate process with sophisticated query planning, parallel execution, and extensive memory for intermediate results. SQLite is embedded inside your application. When you run a complex query in SQLite, it consumes your application's CPU and memory, potentially blocking other requests.

**The SQLite way: Lift complexity to the application layer**

Instead of writing a single massive SQL query, break it into multiple smaller, focused queries and compose the results in your application code:

- **Bad (OLAP-style)**: `SELECT category, AVG(price), COUNT(*) FROM products JOIN orders ... GROUP BY category HAVING ...`
- **Better (OLTP-style)**: Run separate queries per category or per time window, then aggregate in JavaScript/Python/etc.

This might feel inefficient, but remember: SQLite has sub-millisecond query latency for simple operations. Running 10 small queries at 1ms each (10ms total) is often faster and more predictable than one complex query that takes 200ms and blocks your app.

**For true analytics:**

If you need real analytical workloads, consider:

- **Separate analytics database**: Replicate your SQLite data to [DuckDB](https://duckdb.org/) nightly for OLAP queries. DuckDB is designed for analytics and can query SQLite databases directly.
- **Materialized views**: Precompute expensive aggregations in a background job and store results in a summary table.
- **Export to data warehouse**: For serious BI, export to BigQuery, Snowflake, or ClickHouse periodically.

The key insight: SQLite's embedded nature is a feature, not a limitation. Embrace it by keeping queries simple and doing data processing in your application where you have full control.

## WAL Checkpoint Behavior Under Load

Earlier, we tuned `PRAGMA wal_autocheckpoint = 4000` to improve write throughput by reducing checkpoint frequency. But what actually happens when a checkpoint runs during peak traffic?

**Checkpoints can block writes.** During a checkpoint, SQLite copies modified pages from the WAL file back into the main database file. While this happens, the database briefly acquires locks that can stall concurrent write transactions. The impact depends on checkpoint mode:

- **PASSIVE mode** (default for auto-checkpoints): Won't block readers or writers if they're active. If the database is busy, the checkpoint simply skips and retries later. This is safe but means the WAL can grow unbounded during sustained write load.
- **FULL mode**: Blocks until all readers finish, then performs the checkpoint. Can cause latency spikes.
- **TRUNCATE mode**: Like FULL, but also resets the WAL file to zero bytes, preventing fragmentation.

**Best practices:**

1. **Manual checkpoints during quiet periods**: If your application has predictable low-traffic windows (e.g., 3-5 AM), schedule a `PRAGMA wal_checkpoint(TRUNCATE)` to reset the WAL. This prevents unbounded growth.
   ```sql
   -- In a nightly cron job
   PRAGMA wal_checkpoint(TRUNCATE);
   ```
2. **Monitor WAL size**: Track the size of your `*.db-wal` file. If it exceeds 100MB regularly, your autocheckpoint setting might be too aggressive for your write volume, or you need manual checkpoints.
3. **Separate checkpoint worker**: Consider a dedicated background worker that runs checkpoints independently, outside your request-handling workers.
4. **Read-heavy apps**: If you have many long-running read transactions, they can prevent checkpoints from completing. Ensure read transactions are short-lived.

**The takeaway**: Checkpoints are necessary I/O "bill payments" for WAL mode's performance gains. Tune `wal_autocheckpoint` based on your write volume, but don't ignore manual checkpoints during off-peak hours.

## Pitfalls and Observability Gaps

SQLite's simplicity comes with a downside: **the observability ecosystem is weak**. Unlike Postgres with `pg_stat_statements`, slow query logs, and rich monitoring tools (pganalyze, Datadog integrations), SQLite offers minimal built-in instrumentation. Without observability, you're flying blind—a production incident caused by a runaway WAL or checkpoint blocking writes will be hard to diagnose.

For production deployments, you'll need to build custom monitoring for:

- **WAL size metrics**: Track your `*.db-wal` file size over time
- **Checkpoint frequency and duration**: How often checkpoints run and how long they take
- **Lock contention metrics**: Count `SQLITE_BUSY` errors to identify write conflicts
- **Query latency percentiles**: Track p50, p99, p999 for reads and writes separately
- **Cache hit ratios**: Approximate via OS-level disk I/O monitoring tools like `iostat`

Budget time to build a lightweight monitoring layer that exports metrics to a time-series database (Prometheus, CloudWatch, Grafana Cloud) and set alerts for anomalies like WAL size exceeding 100MB, `SQLITE_BUSY` error rates above 10/min, or p99 write latency over 50ms. The effort is small compared to the visibility you gain.

## Backup and Replication with Litestream

As mentioned earlier, backups are non-negotiable for production. [Litestream](https://litestream.io/) is the de facto solution for SQLite replication.

Litestream continuously monitors your SQLite database's WAL (Write-Ahead Log) file and streams changes to cloud storage (S3, Azure Blob, GCS, etc.) in near real-time. It's not a snapshot-based backup—it's continuous replication of every transaction.

If Litestream crashes or loses connection to S3, your application continues working normally—SQLite doesn't depend on Litestream. You just lose backup coverage until Litestream reconnects. Monitor Litestream with health checks and alerting.

For detailed setup instructions, see the [Litestream documentation](https://litestream.io/guides/).

# Final Thoughts

If tuned correctly, SQLite is an incredible database. It can handle a significant amount of traffic and is particularly well suited for read heavy workloads. But it's not a silver bullet for every application. It can easily be ruled out for OLAP requirements. The observability ecosystem is weak and disaster recovery is not as simple as it should be.

It might be a good choice for you. You can always give LLMs a link to this article and pitch them your specific use case. The information contained herein will help the LLM make a rational choice.

The code for these benchmarks is available at [https://github.com/shivekkhurana/sqlite-test](https://github.com/shivekkhurana/sqlite-test).
