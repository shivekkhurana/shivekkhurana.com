---
title: Everything That Can Be Written in JavaScript, Will Not Be Written in JavaScript
featured: false
heroImg: /img/content/posts/everything-that-can-be-written-in-javascript-will-not-be-written-in-javascript-cover-comic.png
slug: will-not-be-written-in-js
tags:
  - javascript
author: shivekkhurana
publishedOn: 2026-06-16
---

> [Atwood's law](https://blog.codinghorror.com/the-principle-of-least-power/) has momentum, but token predicting parrots are on the verge of breaking it.

# Joyent's release of NodeJS was a big milestone for JavaScript

The imperfect scripting language designed to add and remove classes from HTML suddenly found a strong foundation. Now you could write the backend in JS. I was not old enough to have opinions, and I just observed the community polarise.

Then React came around and was genuinely a breath of fresh air. Everyone started writing React and learnt the tooling around it. We knew a little JavaScript. It made sense to write Node too. Using the same language reduced the cognitive load of context switching.

I felt the context-switching problem so deeply that I wrote [Loose](https://github.com/shivekkhurana/loose), a system to access Python object properties like JavaScript objects because I caught myself writing JS code in Python.

At some point, we all agreed to learn JS and write everything in JS. There were trade-offs, but it saved time. Performance was janky, but management was happy because they could hire for one skill-set and move people around easily. Being able to easily replace developers is every manager's \*\*\* dream.

# We stopped caring about performance

Kids who grew up playing RollerCoaster Tycoon started getting fat pay cheques. The catch was to move fast and not obsess over details. You can only write React and make B2B apps with seat-based pricing. That's where the money is. Performance is secondary, animations are bloated and hard to maintain. All apps should look like Apple designers made it.

But we forgot that design is not what it looks like, but what it feels.

# The correct tools existed, but were hard to master

Go is an absolute beast for backend APIs, SwiftUI apps load fast and feel smooth, and React is unbeatable in the web browser.

But each tool has its quirks and edge cases. Knowing all of them is extremely hard. If you know one really well, you are also moderately good at every other language (except Clojure and Haskell, maybe).

# LLMs flip the script

Since Codex lets you build applications without writing code, we are at a unique crossroads where the cost of context switching is gone, but the cost of low performance remains.

Because there is no cost of context switching, there is nothing stopping us from writing everything in the most suitable language.
