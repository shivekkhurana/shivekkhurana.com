---
publishedOn: 2026-07-05T00:00:00.000Z
title: How I Use AI Agents for Personal Accounting, Diet Logs, Body Measurements and Journalling
subTitle: How voice, Markdown, and Git turned scattered personal workflows into systems I can maintain without data-entry friction.
featured: false
heroImg: /img/content/posts/how-i-use-ai-cover-v2.png
slug: how-i-use-agents-in-my-daily-life
tags:
  - ai
  - ai-agents
  - accounting
  - personal-growth
author: shivekkhurana
---

I have been working with AI systems professionally since 2025. It has been my full-time job. Before that, I was tinkering like everyone else: every few hours, I would talk to ChatGPT, copy-paste the answer into my editor, and sit there in awe.

Then the Claude Code movement happened, and suddenly my laptop was my agent's playground.

This helped me streamline many processes in my life that would not have been possible without AI. Here is what I use AI to do.

# Accounting

The first and most important quality-of-life change due to AI is my accounting system.

## Why traditional accounting software did not work

I am a huge accounting nerd. I maintain a personal set of books and a set of books for my professional company. Because I travel a lot, my accounting is spread across geographies, multiple currencies, and some crypto DeFi holdings.

No traditional accounting software was flexible enough to meet my needs and generate reports in the way I wanted. My workflow before AI was to use GnuCash with a set of custom scripts that I wrote to get the reports I wanted and to inject data into GnuCash.

Anybody who has managed books knows that the biggest pain of accounting is getting the data to the right place. If you pair this with multiple data sources, multiple bank accounts, and multiple currencies, the pain gets bigger.

Usually, my books used to stay in a one-week to five-week delay. They were not reconciled for one to five weeks. Then every two weeks, or once every month, I would sit down, get all the transactions, record them manually, and do the reconciliation.

## Teaching an agent my bookkeeping rules

This changed when last year I took a bet on hledger. I was already using Claude Code, and I saw how good it was with text files in my code. So I thought: why not teach Claude how I do the data ingestion process, how I classify certain expenses, which accounts they go to, and so on?

This led to the evolution of my hledger `AGENTS.md` file. Now I have probably thirty rules in that file. To import transactions, I can copy-paste or screenshot my bank account app and give it to Claude. Or I can export PDF statements from my bank account and give them to Claude.

It gets the job done with 95% to 99% accuracy. Whenever it fails, I make a point to record the failure in `AGENTS.md` so it does not repeat again. I am extremely happy with how this system works.

Now sometimes I can even talk to the agent and say, "Hey, I spent 2200 INR to buy snacks for my niece from this particular account," and it will make the entry.

## Reports and asset prices

Since hledger is a CLI that can generate accounting reports, I also took help from Claude to generate reports exactly how I want to see them. I can see my monthly expenses, monthly income, net income over the years, net worth over the years, and the cost basis of my assets.

I also wrote an agent skill that can update the prices of different assets I hold. Most assets are priced, but some of them are not. For example, it is very hard to get the price of Setu USD without actually going to their website and checking the current exchange rate.

So with the agent, I gave it the power to browse the web and turned it into a skill to update prices. That gives me an almost real-time snapshot of my net worth.

## What is still missing

I would like agents to read my email and sync transactions when they happen, instead of me having to ask them. Whenever I make a transaction, I get an email from my bank account with all the details. That should be enough for an agent to find transactions, reconcile my books, and message me.

# Journalling and Second Brain

Workouts felt out of place as the second pillar. They are part of a larger system that I kept postponing because I thought I had to build it properly before I could use it.

## Psychological reflection, not just notes

That system was a journaling engine where I could log my thoughts, log my emotions, and look back to see how changes in my mental condition affected my psychological state. I have been trying to build a second brain, but more as a psychological reflection. Sometimes it includes things that bother me. Sometimes it includes things that I am studying: hovercrafts, hypervisors, how to use a QEMU system with KVM, or how to use Pulumi for infrastructure deployment.

This was my second brain of sorts. It had some structure, but it was mostly fluid.

## Twelve years of notes in too many places

The problem was that this second brain has been evolving for years. Maybe more than 10, 11, or 12 years. I do not even remember where my first note was. Initially, I started writing on paper, and I have at least five kilograms worth of paper with all my notes since my university days. Most of it is not useful, but a lot of it matters because it shows my thought process at that moment.

After my notebook shenanigans, I moved to Apple Notes because Apple Notes is super cool. I also tried Google Keep before Apple Notes, but that was short-lived. I just ignored those Google Keep notes later.

After Apple Notes, I thought: this is simple, this is good, but I am not satisfied because it does not have backlinking. So I moved to Roam Research, and then I stopped paying for it because it was too expensive. Then I moved to the open-source version of it called Athens, which shut down within one year of happening.

In between these switches, I would move to Obsidian, and I also had a lot of notes in Markdown that I would publish on my website. The Markdown version stayed the most consistent, and it has the best showcase, as you can see on this blog.

In the end, I made up my mind that I am just going to write Markdown. For things I do not care about, I will use paper for my daily to-do list.

## A Markdown specification for my mind

Moving years' worth of data spread across different formats and handwritten notes was a task that I did not want to partake in. I only stopped postponing it when I realized that I could make an agent loop go through all my notes and convert them into a new Markdown specification, which I have done now.

My notes now fall into four types: journal, observation, meditation, or topic. Journal, observation, and meditation notes are timestamped, so they get a date in the title. Topics are ongoing information dumps of things I am interested in.

I made an [agent-styled Markdown file](https://github.com/shivekkhurana/state-of-being/blob/master/AGENTS.md) that can dump my voice into one of these correct note structures. It has proper Markdown, it has frontmatter, and it has enough tags for me to be able to make a dashboard in the future.

## Voice removes the friction

My note-taking friction is completely gone. Now, whenever I am thinking about something, I open my Codex app with remote control and say what I am thinking. It automatically files the journal or topic entry in the right location.

All of this is plain text, recorded in Git. In the future, I can make dashboards on top of it.

# Workouts

The next part I moved from my legacy system into State of Being was [workouts](https://github.com/shivekkhurana/state-of-being/blob/master/vault/workouts.json).

## The old spreadsheet system

I have been working out on and off since 2013. But in the last four years, I worked with trainers, got proper plans, and measured my lifts.

I used to do this in an Excel sheet. I would put the date, see my past lifts, and record the current day's lifts. All of this used to sync through a GitHub worker that would read from the sheet and generate a JSON file that goes to my website to show these statistics.

All of this was handwritten and three or four years old. It worked really well, but I hated the user interface.

When I was in the gym, my internet was not always there, so I had to wait for the sheet to load. Then it was very hard to pinch and zoom into a huge sheet with four years' worth of data, see what exercises I was supposed to do, and record the current day's workout. This was very tricky.

## The workout assistant

I changed it completely. Now I have a workout assistant inside State of Being.

My current process is that when I am done at the gym, I just talk to it. I tell it what exercises I have done, and it makes a record and pushes it to my [State of Being GitHub repository](https://github.com/shivekkhurana/state-of-being), which triggers a build on my website.

A positive side effect is that I can ask, "What did I do last week on this day?" Or, "What was my highest lift?" Or, "What is my PR this month for a particular deadlift?" Then I can try to match it.

The structure collapsed, but in a good way. Because the agent can process raw thoughts and raw text, and because the source of truth is just a text file, I do not have to interact with that clunky UI.

It is just the Codex app on my phone, which I use as a remote control. Everything goes to my GitHub repository, and then to the website.

# Diet logs and body measurements

The most recent system I implemented is [diet logs](https://github.com/shivekkhurana/state-of-being/tree/master/vault/diet-logs).

## The data I was missing

I like to work out and lift heavy. But I have a South Asian belly. My BMI is great. My [RHR](https://github.com/shivekkhurana/state-of-being/blob/master/vault/healthkit/restingHeartRate.json) and [HRV](https://github.com/shivekkhurana/state-of-being/blob/master/vault/healthkit/hrv.json) are great. But this belly is aesthetically backwards. I do not like its presence.

I know that the only way to lose belly fat, or any fat in general, is to be in a caloric deficit. I know enough about calories, but over the long span of things, I do not know how many calories I eat in a week or a month, whether I need to go down or up, or what my baseline calorie needs are.

Inspired by my note-taking system, I made a [diet](https://github.com/shivekkhurana/state-of-being/tree/master/vault/diet-logs) and [body measurements](https://github.com/shivekkhurana/state-of-being/blob/master/vault/measurements.json) tracker. You can check both of these out in my [State of Being GitHub repository](https://github.com/shivekkhurana/state-of-being).

## Logging food by speaking

Whenever I eat something, I say what I am eating, and the agent is smart enough to figure out the macros and post them in the right file. Then, in the frontmatter of that Markdown file, I compute the total macros.

I take measurements in a similar way with my measuring tape. I measure my body and keep ChatGPT on in voice mode. As I am measuring, I say, "My belly is 87 centimeters," and "My shoulders are 96 centimeters," and "My hips are a certain number." As I speak, all of this gets recorded in the format I want and gets pushed to my repository on GitHub.

## Why the data matters

Once I have data for two or three months, I will know what my baseline caloric needs are. I will know how my weight is changing. This will not give me a perfect sense of the fat breakdown in my body, or water mass, or muscle mass, but just seeing data over time will help me figure out more than guessing.

The biggest hurdle to this measurement is recording data, and I have completely removed that because now I just need to say what I want.

If I were to do this on my own without AI, this data entry alone would take at least 20 to 30 minutes of my day. But now, since I have agents working for me 24/7, I can get this done in an instant without feeling any friction, just using my voice.

# Conclusion

Are you also using agents for your work? Have you seen quality-of-life improvements in your personal life? I would love to know them. Message me on Twitter and tell me how you are using agents in your day-to-day life.
