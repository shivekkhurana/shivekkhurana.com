---
publishedOn: 2026-02-19T00:00:00.000Z
title: "Could Sarvam Be India's Answer to DeepSeek and Mistral?"
subTitle: Sarvam AI unveiled 30B and 105B parameter models at India's AI Summit. The claims are bold. The receipts are missing.
featured: false
heroImg: /img/content/posts/sarvam-intro.png
slug: sarvam-ai-summit
tags:
  - ai
  - india
  - llm
  - open-source
author: shivekkhurana
---

Yesterday, at [India's AI Impact Summit](https://indiaaisummit.com/) in New Delhi, a startup called [Sarvam AI](https://www.sarvam.ai/) walked on stage and made the boldest claim yet from the subcontinent: two foundation models (30 billion and 105 billion parameters) trained from scratch on domestic infrastructure, optimized for 22 Indian languages, and allegedly outperforming Gemini Flash on local benchmarks.

[DeepSeek](https://github.com/deepseek-ai/DeepSeek-R1) dropped R1 in January 2025 and proved China could build frontier-class reasoning models at a fraction of the cost. [Mistral](https://mistral.ai/) emerged from Paris as Europe's answer to OpenAI, with open weights, sovereign data, and regulatory compliance baked in.

> But as of today, Sarvam has published no technical reports. No system card. No weights on Hugging Face. No public demo. Just claims.

This is either India's genuine AI coming-of-age moment, or a well-produced summit demo that will fade.

## What Was Actually Announced

Sarvam unveiled two models at the summit:

### Sarvam 30B

| Specification                 | Value                                                         |
| ----------------------------- | ------------------------------------------------------------- |
| Total Parameters              | 30 billion                                                    |
| Active Parameters (per token) | 1 billion                                                     |
| Architecture                  | MoE: 19 layers (1 dense + 18 MoE), 128 experts, top-6 routing |
| Context Window                | 32,000 tokens                                                 |
| Training Data                 | 16 trillion tokens                                            |

### Sarvam 105B

| Specification                 | Value                                                              |
| ----------------------------- | ------------------------------------------------------------------ |
| Total Parameters              | 105 billion                                                        |
| Active Parameters (per token) | 9 billion                                                          |
| Architecture                  | MoE: 32 layers (1 dense + 31 MoE), 128 experts, top-8 routing, MLA |
| Context Window                | 128,000 tokens                                                     |

The architecture details come from [NVIDIA's technical blog](https://developer.nvidia.com/blog/how-nvidia-extreme-hardware-software-co-design-delivered-a-large-inference-boost-for-sarvam-ais-sovereign-models/), not Sarvam directly. (NVIDIA's blog refers to a 100B model; the summit announced 105B. Likely the same architecture with minor variations.) NVIDIA worked closely with them on inference optimization, achieving 2x speedups on H100s and 4x on Blackwell with NVFP4 quantization.

Both models use Mixture-of-Experts, the same architecture that makes Mistral and DeepSeek efficient. The 30B model activates only 1B parameters per token, which dramatically reduces inference costs. This is the right architectural choice for a market where cost sensitivity is extreme.

## The Claims (Unverified)

Here's what [various](https://www.business-standard.com/technology/tech-news/ai-startup-sarvam-launches-two-made-in-india-large-language-models-126021801397_1.html) [press](https://techcrunch.com/2026/02/18/indian-ai-lab-sarvams-new-models-are-a-major-bet-on-the-viability-of-open-source-ai/) [reports](https://inc42.com/buzz/sarvam-launches-two-llms-with-advanced-reasoning-abilities/) attributed to Sarvam:

- "Outperforms Gemini 2.5 Flash on Indian language tasks"
- "Beats GPT-120B on MMLU-Pro"
- "At par with Gemma 27B, Mistral-32-24B, Qwen-30B on reasoning and coding"
- "Cheaper than Gemini Flash while delivering better performance"

Notice what's missing: actual benchmark scores. No tables. No percentages. No methodology.

When DeepSeek released R1, they published a [detailed technical report](https://github.com/deepseek-ai/DeepSeek-R1) with benchmark tables, training methodology, and full model weights on day one. When Mistral releases a model, the weights hit Hugging Face within hours.

Sarvam said they "plan to open source" the models.

## What's Actually Shipping Today

While the 30B/105B models are vaporware until proven otherwise, Sarvam has a production stack that's real and differentiated:

### Saaras V3 (Speech-to-Text)

Their [STT model](https://www.sarvam.ai/apis/speech-to-text/) claims to [beat GPT-4o-Transcribe and Gemini-3-Flash](https://www.businesstoday.in/technology/news/story/sarvam-launches-sarvam-audio-claims-to-offer-better-accuracy-than-gpt-4o-gemini-3-flash-514361-2026-02-03) on Indian speech benchmarks. The evaluation methodology is notable. Beyond standard Word Error Rate, they measure intent and entity preservation, which matters more for voice assistants than raw transcription accuracy.

- **Languages**: 22 Indian languages + Indian English
- **WER**: ~19% on IndicVoices benchmark
- **Latency**: Streaming in milliseconds
- **Pricing**: ₹30/hour (~$0.36/hour)

For context, that's comparable to OpenAI's Whisper API pricing ($0.36/hour), but optimized for Indian accents and code-mixing (the natural blending of Hindi-English, Tamil-English, etc.).

### [Bulbul V3](https://docs.sarvam.ai/api-reference-docs/getting-started/models/bulbul) (Text-to-Speech)

- **Latency**: P90 ~400ms
- **Voices**: 30+ speakers across 11 languages
- **Pricing**: [₹15-30 per 10K characters](https://docs.sarvam.ai/api-reference-docs/getting-started/pricing) (~$0.18-0.36)
- **Strength**: Outperforms competitors on telephony-grade (8kHz) audio quality

### [Sarvam-M](https://huggingface.co/sarvamai/sarvam-m) (Chat/Reasoning)

Their existing chat model is currently free:

- **Pricing**: [₹0/token](https://docs.sarvam.ai/api-reference-docs/getting-started/pricing)
- **Performance on MILU-IN**: 0.75 (competitive with much larger models)

The pricing strategy is aggressive. Free LLM inference, dirt-cheap speech APIs. This only makes sense if you're playing for market share in a price-sensitive market, subsidized by [$54M in VC funding](https://www.thearcweb.com/article/indias-largest-ai-round-sarvam-41-mn-lightspeed-khosla-ventures-peak-xv-nZXvkfCKmdxpeLHa) and government compute credits.

## The MILU Benchmark: India's Quiet Contribution

While the models grabbed headlines, there's a more substantive Indian contribution to global AI that Silicon Valley might have missed.

[MILU](https://github.com/AI4Bharat/MILU) (Multi-task Indic Language Understanding) is a benchmark created by [AI4Bharat](https://ai4bharat.iitm.ac.in/), co-founded by Sarvam's own Pratyush Kumar when he was at IIT Madras. It contains [80,000 questions across 11 Indian languages](https://huggingface.co/datasets/ai4bharat/MILU) covering 41 subjects, from STEM to regional history, arts, and law.

Here's why it matters: MILU is now featured in [Anthropic's Claude Sonnet 4.6 system card](https://www-cdn.anthropic.com/78073f739564e986ff3e28522761a7a0b4484f84.pdf) (section 2.19) as a multilingual evaluation metric. Claude Sonnet 4.6 shows a -2.3% English-to-Indic gap on MILU, the best among Claude models.

This is the kind of infrastructure contribution that outlasts any single model. By creating a rigorous evaluation framework, AI4Bharat forced global labs to care about Indic language performance. [GPT-4o scores 74% on MILU](https://arxiv.org/abs/2411.02538). Most open models barely beat random chance.

## The Sovereign AI Play

To understand what Sarvam is attempting, you need to understand the broader Indian government bet.

The [IndiaAI Mission](https://indiaai.gov.in/) is a ₹10,372 crore (~$1.2B) initiative to build domestic AI capacity. The government has allocated [34,000+ GPUs through subsidized access programs](https://indiaai.gov.in/hub/indiaai-compute-capacity). [NVIDIA is deploying 20,000+ Blackwell GPUs](https://blogs.nvidia.com/blog/india-ai-mission-infrastructure-models/) across Indian data centers ([Yotta](https://www.yotta.com/), [E2E Networks](https://www.e2enetworks.com/), L&T).

Sarvam received [4,096 H100 GPUs through Yotta](https://www.digit.in/features/general/sarvam-to-yotta-nvidia-enabling-india-ai-ecosystem-at-scale.html) and \~₹99 crore (\~$12M) in subsidies from this program, making them the biggest beneficiary of the IndiaAI Mission. They trained their models on domestic infrastructure rather than renting from US hyperscalers.

The strategic logic mirrors what France did with Mistral: build national AI champions that keep data sovereign, reduce dependency on American infrastructure, and capture value domestically.

But there's a key difference. France bet on Mistral to compete on frontier capabilities with open weights. India, so far, is betting on Sarvam to solve a different problem: making AI work for 1.4 billion people who don't speak English as their first language, many of whom access the internet through voice on $100 smartphones.

## The DeepSeek Comparison

Everyone's making this comparison, so let's be precise about it:

|                      | DeepSeek R1    | Mistral 3  | Sarvam 30B/105B |
| -------------------- | -------------- | ---------- | --------------- |
| Weights on launch    | Yes            | Yes        | No              |
| Technical report     | Yes (detailed) | Yes        | No              |
| Benchmark tables     | Yes            | Yes        | Claims only     |
| Open-source license  | MIT            | Apache 2.0 | TBD             |
| Days to Hugging Face | 0              | 0          | Unknown         |

DeepSeek earned credibility by shipping. They released R1 with full weights, a technical report explaining their reinforcement learning approach, and benchmark tables that could be independently verified. Within days, the community confirmed their claims.

Sarvam has made claims at a government summit. The verification comes when, and if, they release weights.

## The Founders

The founding team is credible, which is why I'm not dismissing this outright.

**[Pratyush Kumar](https://www.linkedin.com/in/pratyush-kumar-8844a8a3/)** has a PhD from ETH Zurich, worked at IBM Research and Microsoft Research, and was adjunct faculty at IIT Madras. He co-founded [AI4Bharat](https://ai4bharat.iitm.ac.in/), which built the open datasets and models ([IndicBERT](https://huggingface.co/ai4bharat/indic-bert), [IndicTrans](https://huggingface.co/ai4bharat/indictrans2-en-indic-1B)) that most Indian language AI research builds on. He's not a summit showman. He's published real research.

**[Vivek Raghavan](https://www.linkedin.com/in/vivek-raghavan-16005424/)** did his PhD at Carnegie Mellon, then spent years at [EkStep Foundation](https://ekstep.org/) working on India's digital public infrastructure. He was involved with Aadhaar and [Bhashini](https://bhashini.gov.in/) (India's national language translation platform).

These are infrastructure people, not hype merchants. Which makes the lack of technical documentation more puzzling than damning.

## Why This Matters Beyond India

### 1. The 22-Language Problem is Real

India has 22 constitutionally recognized languages, each with tens of millions of speakers. Hindi has over 600 million speakers, more than Spanish. Bengali, Tamil, Telugu, and Marathi each have over 80 million speakers.

If Sarvam's models actually work well across these languages, that's a genuine technical achievement. Multilingual models typically degrade on low-resource languages. Building something that handles Odia and Malayalam as well as Hindi would be impressive. [Krutrim](https://www.olakrutrim.com/), backed by Ola's Bhavish Aggarwal, is also chasing this problem and claims to support all 22 scheduled languages. The race to own India's linguistic diversity is heating up.

### 2. Voice-First for the Next Billion

Sarvam's thesis is that typing is friction for most of the world. Their [Kaze smart glasses](https://www.digit.in/news/general/india-ai-impact-summit-2026-sarvam-ai-unveils-kaze-smartglasses-pm-modi-tries-on-a-made-in-india-ai-wearable.html) (launching May 2026) and feature-phone integrations suggest they're building for voice-first interaction across dozens of languages and dialects simultaneously. That's a harder problem than English-only voice interfaces.

### 3. Pricing Pressure is Coming

Sarvam's pricing (free LLM inference, $0.36/hour STT) is unsustainable without subsidies. But it signals where the market is heading. If Indian developers build on these APIs, they'll expect similar pricing globally.

DeepSeek already compressed API margins. Indian players could compress them further for multilingual use cases.

### 4. MILU Sets a Precedent

The inclusion of [MILU in Claude's system cards](https://www-cdn.anthropic.com/78073f739564e986ff3e28522761a7a0b4484f84.pdf) is significant. It means Anthropic now optimizes for Indian language performance as a first-class metric. Expect other labs to follow, and expect similar benchmarks from other regions.

## Claims Without Proof Are Just Marketing

**No weights, no verification.** The AI community has been burned by demo-ware before. Until independent researchers can run these models, the claims are marketing.

**Competition is fierce.** [Krutrim](https://www.olakrutrim.com/) (backed by Ola's Bhavish Aggarwal) raised $50M and is building similar models. Google has a massive Indic language team. Meta's Llama is being fine-tuned for Indian languages by multiple groups.

**Government showcases incentivize theater.** When the Prime Minister is in the audience, the pressure to announce something big is immense. DeepSeek's release was a quiet GitHub drop, not a summit keynote.

**The "cheaper than Gemini" claim is fuzzy.** Cheaper at what quality level? On which tasks? Without benchmarks, this is meaningless.

## The Bottom Line

India announced its DeepSeek moment. The architecture looks right (MoE, aggressive parameter efficiency), the team is credible (AI4Bharat pedigree), the infrastructure exists (IndiaAI Mission, domestic GPU clusters), and the existing speech stack is production-ready.

But DeepSeek earned its moment by shipping weights and a technical report on day one. Mistral earned its moment by putting models on Hugging Face hours after announcement.

Sarvam has made promises at a summit. The receipts are pending.

I'll update this post when they release the models. Until then, file this under "interesting if true."
