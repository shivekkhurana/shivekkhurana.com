---
publishedOn: 2025-11-19
title: When Cloudflare's Edge Crashed Under Its Own Weight - November 18 Outage Explained
canonicalUrl: https://www.linkedin.com/pulse/when-cloudflares-edge-crashed-under-its-own-weight-18-khurana--2ozxf/
featured: false
heroImg: /img/content/posts/cloudflare-outage.png
slug: cloudflare-edge-crashed-november-18-outage
tags:
  - cloudflare
  - infrastructure
  - outage
author: shivekkhurana
---

Cover image generated with AI tools

Cloudflare provides networking and infrastructure for a large portion of the internet. By their own estimates, they route about 20% of the world's internet traffic. And that number doesn't even include the massive surface area of Cloudflare's Bot Protection.

Cloudflare operates a global web-network that accelerates websites and filters bad traffic. During a routine database configuration change (intended to improve permissions and security), one of their systems generated a "feature configuration file" for Bot Management that unexpectedly became much larger than normal.

The software responsible for loading this file wasn't designed to handle such a large size. When the oversized file propagated across the network, the parser crashed, taking down Cloudflare's core proxy.

As a result, many websites behind Cloudflare were suddenly unable to serve traffic, and users saw waves of HTTP 500 errors.

> The sites themselves were fine. What broke was Cloudflare's ability to distinguish legitimate users from unwanted bots, which effectively crippled large parts of the internet, including ChatGPT.

At first, the pattern looked like a coordinated attack, but the root cause turned out to be the internal configuration change.

Cloudflare mitigated the issue by rolling back the faulty file, restoring the last known good version, and restarting affected systems. By around 17:06 UTC, normal operation resumed.

According to Cloudflare's Incident Report, this was their most severe outage since 2019.
