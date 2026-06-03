---
publishedOn: 2026-06-03T00:00:00.000Z
title: Five Levels of Adding AI to Your SaaS App
subTitle: A practical framework for moving from simple SaaS to an AI-native platform
featured: false
heroImg: /img/content/posts/five-levels-cover.png
slug: five-levels
tags:
  - ai
  - saas
  - llm
  - software-development
author: shivekkhurana
---

SaaS is conventionally built for humans, who like dashboards, reports, and RBAC. OpenAI, Anthropic, and others challenge this with conversational UI. Chat works, and it is more fluid. But this doesn't mean that all structured SaaS UI needs to become chat UI. Structured UI also works.

I have observed a shift in my users' perceptions and desires. I also realise that most users are free ChatGPT users, not developers running Claude Code on a VPS all day long.

Having built multiple internal agents, retrofitted AI into existing flows, and built a SaaS to be AI-first, here are the five levels of AI you can add to your existing SaaS to make your product AI-native. The goal is to give users the flexibility of a conversational interface while preserving the speed and familiarity of dashboards and reports.

## Level 1: Personal access tokens with an MCP server

![Watercolor skeleton illustration of Level 1 MCP integration](/img/content/posts/five-levels-1-mcp.png)

MCP lets you expose your API endpoints as a set of tools and prompts for the AI agent to access. The most important pathways in your SaaS can be exposed through an MCP server.

This is the most straightforward way to add AI support, because no UI changes are needed. Your SaaS data goes to ChatGPT or the Claude Desktop UI.

Setting up an MCP might be an onboarding hurdle depending on the nature of your users. But this gets the backend in place and builds the know-how of how building for agents and humans simultaneously affects your roadmap.

You might be compelled to introduce every feature of your SaaS as an MCP tool, but start with the smallest sample.

> Instead of exposing 100% of features, use this time to build a prompt library and evals. Evals give you confidence that your prompts continue to work for past use cases when you add new use cases.

Your SaaS UI will stay untouched, but users can point their agents to interact with your service.

## Level 2: Embedded AI chat window

The next iteration is to add a chat window, with tools defined in the MCP server and made available to the AI assistant. This is better than Level 1 because the onboarding hurdle to set up an MCP vanishes. Every user can access the AI assistant from the dashboard itself.

![Watercolor skeleton illustration of Level 2 embedded AI chat](/img/content/posts/five-levels-2-chat-window.png)

Things to keep in mind:

1. Add a streaming endpoint and measure the time to first token. LLM responses are slow, and we need help from UX to make them feel faster.
2. Add a markdown renderer in the chat box. This gives you tabular UI for free.
3. Send the current page state as the first message. This way, a user on `/posts/123` can ask "How many views did this post get?" and "this" can be substituted with the page context.
4. Since there is only one chat window, you will eventually need `/clear` and `/compact`. If you are just starting out, you can go a long way with auto-compaction. Models are only going to get cheaper.

A single chat will soon feel limiting, and that's when we can graduate to Level 3.

## Level 3: Conversation history, tool call state and confirmations

When I first built the tooling to take a SaaS to Level 2, it was clear that my users wanted chat history.

![Watercolor skeleton illustration of Level 3 conversation history and tool states](/img/content/posts/five-levels-3-conversation-history.png)

Chat history helps the user multitask and pick up tasks later. The downside is that chat history needs a dedicated page, and you will lose page context. But the gains in multitasking outweigh the loss.

The ChatGPT UI is the gold standard for what the Level 3 UX should be. At the minimum, we should have:

1. A list of historical conversations, with the ability to search
2. The ability to have multiple conversations in parallel
3. An auto-generated title for every conversation, which helps with future search

If you want to delight your users and your product manager, you can also add:

1. The ability to upload images and files
2. Dictation mode
3. Tool call states: show what the tool is doing, instead of just showing a spinner
4. Prompt libraries, so teams can share and improve on prompts

## Level 4: Custom UI generation for personalised reports and workflows

My old friend [Anand Chowdhary](https://anandchowdhary.com/), via [Sycamore](https://sycamore.so/), collaborated with me on building a framework for custom UI generation. This happened because I published my idea that [Claude should not be writing the actual UI code](https://shivekkhurana.com/blog/why-are-we-still-writing-crud-ui-with-hands/).

During that project, I realised the biggest unlock with Claude inside SaaS is custom dashboards, to the point of custom React components.

![Watercolor skeleton illustration of Level 4 generated UI workflows](/img/content/posts/five-levels-4-generated-ui.png)

The core idea is to expose a tool that can generate and render [JSON UI](https://www.jsonui.org/). Then the flow becomes:

1. The user asks for a report
2. The agent makes a tool call, gets tool data, and returns JSON
3. Another tool renders the JSON as a chart, table, card, or a custom component
4. The user gets the ability to pin the generated UI to their dashboard
5. The pin stores the JSON input, tool call, and output. It can be serialised and stored in the database
6. The user gets the power to set up their dashboard in a way that suits them

While building this, my first version had an index of components that the agent could pick from.

If I were to do it again, I'll let the agent make components on the fly. Generating pure UI is something LLMs are excellent at. It doesn't make sense to limit agents with a predefined index of UI. Let them generate their own UIs.

We can go one step further and generate mini apps. Long workflows can be collapsed into smaller steps, creating a more efficient process for the user and revenue lock-in (aka vendor lock-in) for the SaaS provider.

This is also the thesis behind [GigaCatalyst's three levels of adding AI to your SaaS](https://gigacatalyst.com/blog/three-levels-of-adding-ai-to-your-saas). GigaCatalyst is a SaaS that helps teams skip the intermediate scaffolding and move directly towards Level 4: custom AI-generated interfaces that sit inside the product.

## Level 5: Agentic harness with plan mode, scheduled tasks, memory and monitoring

Up to Level 4, the agent works but is not independent. Its agency is derived from the user's prompting. The next iteration is to let the agent run itself. That's where plan mode comes in. When you let the agent run on its own, you risk consuming more tokens than you are comfortable paying for, so the first step is to build a monitoring layer.

![Watercolor skeleton illustration of Level 5 scheduled AI task monitoring](/img/content/posts/five-levels-5-task-monitoring.png)

I have not reached this level yet, but I can foresee that a harness needs a planning tool, a routing tool, and a scheduling tool.

1. The planning tool can take a complex ask, break it down into solvable tasks, and execute them
2. The scheduling tool can trigger the agent, so it can send reports at 9 AM every day on its own
3. The routing tool can enable other models to optimise for cost, performance, and privacy.
4. Memory gives organisational context to the conversations

Level 5 is equivalent to having Claude Code custom-built for your SaaS. At Level 5, the distinction between structured UI and conversational UI fades. The human and the agent start operating at the same level.

## Beyond Level 5: System prompt customisation and self-improving agents

When your users get used to the AI harness, some power users might emerge and ask for more control. Your agents might also make mistakes, and users might repeatedly correct them.

This is where you can allow customisation of the system prompt, and add a tool that observes mistakes and suggests changes to the prompt so those mistakes are not repeated.

## Conclusion

The larger pattern is simple: adding AI to SaaS is not one feature, but a progression. You can start by exposing tools to external agents, then bring chat into the product, preserve conversations, generate custom interfaces, and eventually let agents plan and run work under supervision.

Do you want my help to build AI in your SaaS? I'm available to take 2-3 projects right now. HMU 🙏🏻
