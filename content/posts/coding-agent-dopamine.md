---
publishedOn: 2026-05-27T00:00:00.000Z
title: AI coding agents ships at the cost of intuition and taste
subTitle: Software developers used to work for hours to get the dopamine hit of a working system. Codex and Claude give this hit without the work.
featured: false
heroImg: /img/content/posts/coding-agent-dopamine-cover.png
slug: coding-agent-dopamine
tags:
  - ai
  - llm
  - software-development
author: shivekkhurana
---

I am a system architect, and I started learning to program when my access to the internet and a computer was limited. I used to read Bjarne Stroustrup's books on C++ and then wait until I got time in the school computer lab to practise what I had learned. When something worked, I knew exactly why, because I had spent time on versions that did not work.

My learning happened when the system was broken. The working system was a dopamine reward.

Codex gives the dopamine reward without the work. I'm pro-AI, and I believe that coding changed forever when Claude Code went mainstream last year. But I want to write this opinion piece so I remember the old days.

## Feeling stuck, dopamine hits and developing intuition

There are kinds of work where growth is linear. If you work in a trade, you get a little better every day. You cut straighter, weld cleaner, make fewer mistakes and gain speed. Effort and improvement remain close enough that the loop is visible.

With knowledge work, you can spend months feeling stuck. Then, one day, something clicks and a whole class of problems becomes obvious. You are not one percent better; you are ten times more useful. These painful periods develop taste and intuition. The working product is just a dopamine reward.

Codex helps you work faster, but often at the cost of developing intuition. You get dopamine rewards on a pay-to-play basis. Instead of investing time, you invest tokens. This has led to "builder psychosis". Everyone is building, but we are not getting better anymore.

```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Visible Progress vs. Compounding Insight",
  "description": "A conceptual comparison of steady visible progress in manual work and the delayed breakthrough pattern of knowledge work.",
  "width": 600,
  "height": 360,
  "data": {
    "values": [
      {"time": 0, "growth": 0, "path": "Work with your hands"},
      {"time": 1, "growth": 10, "path": "Work with your hands"},
      {"time": 2, "growth": 20, "path": "Work with your hands"},
      {"time": 3, "growth": 30, "path": "Work with your hands"},
      {"time": 4, "growth": 40, "path": "Work with your hands"},
      {"time": 5, "growth": 50, "path": "Work with your hands"},
      {"time": 6, "growth": 60, "path": "Work with your hands"},
      {"time": 7, "growth": 70, "path": "Work with your hands"},
      {"time": 8, "growth": 80, "path": "Work with your hands"},
      {"time": 9, "growth": 90, "path": "Work with your hands"},
      {"time": 10, "growth": 100, "path": "Work with your hands"},
      {"time": 0, "growth": 0, "path": "Knowledge work"},
      {"time": 1, "growth": 2, "path": "Knowledge work"},
      {"time": 2, "growth": 3, "path": "Knowledge work"},
      {"time": 3, "growth": 4, "path": "Knowledge work"},
      {"time": 4, "growth": 5, "path": "Knowledge work"},
      {"time": 5, "growth": 7, "path": "Knowledge work"},
      {"time": 6, "growth": 10, "path": "Knowledge work"},
      {"time": 7, "growth": 18, "path": "Knowledge work"},
      {"time": 8, "growth": 42, "path": "Knowledge work"},
      {"time": 9, "growth": 88, "path": "Knowledge work"},
      {"time": 10, "growth": 150, "path": "Knowledge work"}
    ]
  },
  "encoding": {
    "x": {
      "field": "time",
      "type": "quantitative",
      "title": "Time spent practising",
      "axis": {"labels": false, "ticks": false}
    },
    "y": {
      "field": "growth",
      "type": "quantitative",
      "title": "Perceived ability",
      "axis": {"labels": false, "ticks": false}
    },
    "color": {
      "field": "path",
      "type": "nominal",
      "title": null,
      "scale": {
        "domain": ["Work with your hands", "Knowledge work"],
        "range": ["#2563eb", "#f97316"]
      },
      "legend": {"orient": "bottom"}
    }
  },
  "layer": [
    {
      "transform": [{"filter": "datum.path === 'Work with your hands'"}],
      "mark": {"type": "line", "interpolate": "step-after", "strokeWidth": 3}
    },
    {
      "transform": [{"filter": "datum.path === 'Knowledge work'"}],
      "mark": {"type": "line", "interpolate": "monotone", "strokeWidth": 3}
    }
  ],
  "config": {
    "view": {"stroke": null}
  }
}
```

The graph is not literal, but the distinction matters: knowledge work can feel unrewarding for a painfully long time before the mental model compounds.

The dopamine rush of solving an issue that took a week to discover is essential to this process. It teaches you that the dread was worth tolerating. The next time you get stuck, you know that you can stay with the problem long enough to cross the other side.

Coding agents give you the dopamine hit without the struggle. You can say, "make this database query faster," and get back an index, a rewritten query and a benchmark showing a lower p99. The patch may even be right. But if you never had to learn why the index helped, why writes were contending or why eventually consistent coordination failed, you did not build the mental model. You just consumed the reward.

## Butterfly's struggle makes them stronger

There is a familiar image of a butterfly struggling out of a cocoon. Help it escape too early and it emerges without the strength required to fly. Whether or not every detail of the metaphor maps neatly to biology, it maps very well to learning.

![Pencil illustration of hands helping a butterfly escape a cocoon, followed by the butterfly sitting weakly on a branch, generated by OpenAI](/img/content/posts/coding-agent-dopamine-butterfly.png)

For me, struggle was not an incidental inconvenience in software engineering. It was a catalyst that forced me to form a model of the world instead of collecting a working snippet. This struggle does not exist anymore.

## Maybe we are all cyborg butterflies now

![Pencil illustration of a cyborg butterfly wearing a mechanical flight harness engraved with the OpenAI logo, generated by OpenAI](/img/content/posts/coding-agent-dopamine-cyborg-butterfly.png)

Maybe the butterfly doesn't need to struggle anymore because there is a cyborg harness to enhance its strength. Even if it didn't struggle to break the cocoon, this harness will still help it fly. And it can navigate its way just by learning how to steer it. That's what we do now. We don't fly; we just steer the harness that lifts us.

How are we going to developer intuition and taste in the post-claude world ? I do not know.
