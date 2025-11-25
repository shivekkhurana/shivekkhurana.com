---
publishedOn: 2025-11-25T00:00:00.000Z
title: The Local-First Comeback You Didn’t See Coming
subTitle: Linear’s Secret Weapon and The Quiet Rebellion Against Slow and Stale Web Apps
heroImg: /img/content/posts/sync-engine-cover.png
featured: false
slug: sync-engines
tags: []
author: shivekkhurana
---

# The tradeoff: local-first gives UX; web-first gives multiplayer

Local-first tools like `vim` and `emacs` are snappy because data lives on your machine. No network calls, no loading spinners: just instant access to files. When you need to collaborate, you use Git: post changes to an immutable tree, pull from master, and resolve conflicts when they arise.

Web apps flip this model. They keep data in the cloud, which enables multiplayer by default—multiple users can write to the same database with proper transaction handling. But this comes at a cost: every interaction requires a network round-trip. Data freshness is uncertain. You fetch on load, fetch after mutations, and hope the cache is current.

Local-first gives UX; web-first gives multiplayer. Sync engines unify them.

# The sync engine contract

Sync engines solve the data freshness problem by establishing a three-part contract:

## 1. Query snapshot materialization

On load, the client defines queries that materialize a snapshot of server data locally. This snapshot contains all data needed to render the UI—ideally everything the user will interact with.

![Sync Engine Queries](/img/content/posts/sync-engine-queries.png)
_Sync Engine: All data is fetched on load_

## 2. Mutation queueing

User actions are queued locally and sent to the sync engine in order. If the client is offline, mutations queue locally and sync when connectivity returns. The queue ensures mutations are applied atomically and in the correct sequence, maintaining multiplayer correctness.

![Sync Engine Mutations](/img/content/posts/sync-engines-mutation.png)
_Sync Engine: User actions are queued_

## 3. Live invalidation and re-fetch

When a mutation occurs—whether from the current user or another client—the sync engine invalidates affected queries and pushes fresh data via a persistent connection. The UI updates automatically without manual intervention.

![Sync Engine Query Notification](/img/content/posts/sync-engine-query-notify.png)
_Sync Engine: When data changes on server, UI gets notified_

This contract delivers local-first UX with web-first multiplayer. Everything works offline.

# Tools to build on this new paradigm

The space is evolving and there are two approaches that projects are taking:

1. Build a database from scratch that is suited to syncing, and
2. Retrofit sync onto existing databases like Postgres

Major open source projects:

| Name                                                           | Description                                                        | Language   | License    | Sync Engine | Client Bindings | Stars  | Open Issues | Closed Issues |
| -------------------------------------------------------------- | ------------------------------------------------------------------ | ---------- | ---------- | ----------- | --------------- | ------ | ----------- | ------------- |
| [Convex](https://github.com/get-convex/convex-backend)         | Apache 2, but uses a custom data format                            | Rust       | Apache 2.0 | Yes         | Yes             | 8,265  | 98          | 85            |
| [Electric SQL](https://github.com/electric-sql/electric)       | Postgres plus Sync Engine                                          | Elixir     | Apache 2.0 | Yes         | Yes             | 9,489  | 165         | 725           |
| [PowerSync](https://github.com/powersync-ja/powersync-service) | Runs on any SQL database                                           | TypeScript | FSL        | Yes         | Yes             | 257    | 20          | 24            |
| [Jazz](https://github.com/garden-co/jazz)                      | Custom DB                                                          | TypeScript | Apache 2.0 | Yes         | Yes             | 2,218  | 273         | 1,033         |
| [Zero](https://github.com/rocicorp/mono)                       | Postgres plus Sync Engine                                          | TypeScript | MIT        | Yes         | Yes             | 2,449  | 169         | 0             |
| [LiveQuery](https://github.com/livestorejs/livestore)          | Sqlite plus Sync Engine                                            | TypeScript | Apache 2.0 | Yes         | Yes             | 3,289  | 233         | 161           |
| [TinyBase](https://github.com/tinyplex/tinybase)               | A reactive data store & sync engine                                | TypeScript | MIT        | Yes         | Yes             | 4,806  | 47          | 107           |
| [Triplit](https://github.com/aspen-cloud/triplit)              | A full-stack, syncing database that runs on both server and client | TypeScript | Apache 2.0 | Yes         | Yes             | 2,987  | 32          | 59            |
| [Instant](https://github.com/instantdb/instant)                | A modern Firebase alternative with real-time database              | Clojure    | MIT        | Yes         | Yes             | 9,462  | 11          | 104           |
| [PGLite](https://github.com/electric-sql/pglite)               | Embeddable Postgres with real-time, reactive bindings              | TypeScript | Apache 2.0 | No          | Yes             | 13,240 | 132         | 223           |
| TanStack DB                                                    | Client Bindings plus Sync Engine (with Electric or Custom)         | TypeScript | MIT        | No          | Yes             | -      | -           | -             |
| [Dexie](https://github.com/dexie/Dexie.js)                     | Client only library to interact with Cache, no sync engine         | TypeScript | Apache 2.0 | No          | Yes             | 13,765 | 594         | ~1,500        |
| [RxDB](https://github.com/pubkey/rxdb)                         | Sync Engine                                                        | TypeScript | Apache 2.0 | Yes         | Yes             | 22,825 | 30          | ~1,200        |

# Talks and presentations

When I started digging this rabbit hole, I came across videos from the trenches.

- [Scaling the Linear Sync Engine](https://www.youtube.com/watch?v=Wo2m3jaJixU)
- [#18 – James Arthur: ElectricSQL, read-path syncing, PGLite](https://www.youtube.com/watch?v=gNVpNU4gWos)
- [Zero Sync Makes Local-First Easy](https://www.youtube.com/watch?v=hAxdOUgjctk&t=230s)

The Linear talk is a historical log of how these systems evolve.
Electric SQL talk helps understand the perspective of a library developer. It also helps generalize the problem to fit in any domain.

# Linear: Syncing in the wild

Linear is a project management app that competes and wins in the saturated project management market. It demonstrates sync engines in production: it can run offline as a Chrome PWA, loads most pages in less than 50ms, and provides a snappy UX that rivals native applications.

![Linear Homepage 2025 November](/img/content/posts/sync-engine-linear.png)
_Linear Project Management: Landing Page_

Linear uses sync at the core of their data flow. This lets them fetch data efficiently, store mutations as a queue locally, and run offline. As a collaborative system with multiple users and organization support, Linear achieves the best of all worlds:

- A web app: runs on all platforms with the same codebase, and supports multiplayer out of the box
- Local data: no fetching delays, experience is snappy
- Data freshness guarantee: local data stays as fresh as possible
- Offline mode: works on a plane

The keyboard navigation works on Linear because all the data required to show the UI is available locally. No spinners, no loading states—a true power tool experience.

# Should you use Sync?

Use sync engines when you have **high read density** (users navigate frequently, need instant access to data) and **power user UX** requirements (keyboard navigation, offline capability, zero loading states). Examples: Linear, Superhuman, Figma.

Skip sync engines for **high write concurrency with low offline need** (traditional web apps with occasional reads) or **CRUD dashboards** (simple forms, infrequent navigation). The backend complexity isn't worth it.

Sync engines add backend complexity but simplify the frontend. They bring multiplayer support, offline mode, and mutation logs with minimal additional complexity—but only if your use case demands local-first performance.

# Conclusion

Sync engines bridge the gap between local-first UX and web-first multiplayer. The technology is still evolving—different projects are exploring approaches from custom databases to Postgres retrofits—but the pattern is clear: local data with intelligent synchronization is becoming the standard for power tools on the web.

As the ecosystem matures, sync engines may become as fundamental as REST APIs were a decade ago. For now, if speed and responsiveness matter—where users expect instant feedback—sync engines offer a path forward. They're not a silver bullet, but they're the closest thing we have to bringing the terminal experience to the browser.

The future of web apps might just be local-first.
