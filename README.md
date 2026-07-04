# ⚓ Keel

**The AI fractional CTO that lives in your repo — and remembers you.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code Plugin](https://img.shields.io/badge/Claude%20Code-plugin-d97757.svg)](https://code.claude.com/docs/en/plugins)
[![Skills](https://img.shields.io/badge/skills-8-2ea44f.svg)](#the-skills)

A keel is the weighted spine below a boat's waterline: invisible, and the only reason the vessel stays upright as it takes on load. Your AI tools already generate the app — the sails. **Keel is everything underneath**: the data-model decision that quietly determines whether you scale, the AGPL license caught before you build on it, the "you don't need this yet" said at exactly the right moment, and the assumption written down so someone notices when it breaks.

```
/plugin marketplace add EdytaKucharska/keel
/plugin install keel@keel
```

---

## Decisions, not standards

Plenty of plugins tell your AI *how code should look* — naming rules, API conventions, lint-grade standards. Keel is not one of them. Keel sits at the **decision moments**: *should we build this at all, which shape should it take, what breaks if we're wrong, and what does being wrong cost?*

It's built for people who direct AI rather than type code — solo founders shipping with Claude Code, PMs approving estimates they can't audit, early-stage founders whose team has skill but not yet judgment, and idea-stage builders who need to see the option-space before committing. The persona behind every skill is a calm, senior fractional CTO who asks *"what's your scale assumption?"* before answering, verifies licenses instead of recalling them, names the load-bearing assumptions under every recommendation — and is genuinely willing to say **"don't do this."**

## The CTO way, every time

Every Keel skill runs the same protocol, because judgment is a process, not a vibe:

**detect who you are** → **read the ledger** → **gather only missing context** → **catch validation-seeking framings** → **verify stale-able facts with real web searches** → **surface alternatives, always** → **load the named decision frameworks that apply** → **cross-reference an 18-item antipattern catalog** → **recommend with explicit reasoning** → **name the "this works if…" assumptions** → **self-critique, visibly** → **write it all down**

That last step is where Keel differs from every consultation you've ever had.

## The ledger — a CTO who remembers you

Most AI advice evaporates when the session ends. Keel writes its work into `.keel/` in **your** project — plain Markdown you can read, own, and commit:

```
.keel/
├── profile.md       # your segment, stage, stack, scale assumption — asked once, never re-asked
├── decisions.md     # every decision: what was chosen, what was rejected, and why
├── assumptions.md   # every "this works if…" — with the trigger that says it broke
└── lessons.md       # every correction, so it isn't repeated
```

The part that matters: **skills check the open assumptions on every invocation.** Tell Keel six months from now that you've hit 50,000 users, and it will answer your question — *and* tell you that the caching decision from March assumed 10,000, and needs revisiting. A session-start hook keeps the digest ambient; you decide when to act. (This is *decision* memory — for episodic "what did I do last week" memory, use [claude-mem](https://github.com/thedotmack/claude-mem); they coexist happily.)

## The skills

### The founder journey (fire on natural phrasing)

| Skill | The moment | What you get |
|---|---|---|
| **`first-build-scope`** | *"I have an idea — how do I build it?"* | A **build map**: 3–6 viable shapes, the riskiest assumption named, and the cheapest way to test it before any code exists. |
| **`feature-decision`** | *"We want to add X."* | A **decision memo**: alternatives, architectural-alignment check, tech-debt priced honestly, smallest viable version, an estimate you can hand to anyone. |
| **`tech-evaluation`** | *"I'm going to use X."* | **Due diligence**: license verified by search (the AGPL trap is caught here), maintenance health, alternatives, switching cost — and "don't adopt this" when that's the answer. |
| **`architecture-review`** | *"Should we split this / how should it be shaped?"* | A **structured review**: stage/scale/team fit, Conway's-Law check, one-way doors flagged before you walk through them. |

### The flagship

| Skill | The moment | What you get |
|---|---|---|
| **`deep-review`** | `/keel:deep-review` — *"is this thing sound?"* | **One ranked report, four lenses**: hygiene (backups, secrets, rollback), security posture (runs first-party `/security-review`, then stage-ranks its findings), load-shape (*what falls over first at your stated scale, and what it costs*), and cost (unit economics, AI-inference spend). Capped at 10 findings, ordered by blast radius at *your* stage, ending in a two-week plan. |

### The money moments (when the stakes walk in the door)

| Skill | The moment | What you get |
|---|---|---|
| **`enterprise-ready`** | The 200-item security questionnaire arrives. | What you can *truthfully* answer today, the cheap fixes that flip answers before you reply, and the stage-honest SOC 2 timing call. Will not help you answer dishonestly. |
| **`estimate-check`** | *"My engineer says six weeks. Is that real?"* | Not a counter-estimate — the **three questions** that make any estimate auditable, plus how to ask them without burning trust. |
| **`investor-dd-prep`** | Term sheet in hand; their technical advisor wants in. | A candid pre-mortem of what DD will flag, the fix-vs-frame split for the time you have, and the honest strong version of your AI-assisted-development story. |

## What Keel deliberately doesn't do

A CTO's judgment includes knowing what *not* to build. [`ecosystem-tools.md`](ecosystem-tools.md) is Keel's standing map of **prescribe, don't rebuild**:

- **Security scanning** → Claude Code's built-in `/security-review` is free and first-party. Keel tells you to run it (you probably didn't know it exists) and then does what scanners can't: rank the findings for *your* stage and commercial model.
- **PR-by-PR code review** → CodeRabbit / Greptile territory. Keel reviews decisions, not diffs.
- **Episodic session memory** → claude-mem. The ledger is a different layer.
- **Vendor setup** → Railway, Supabase, and friends ship their own agent skills. Keel advises *which* vendor; theirs does the wiring.
- **Coding standards** → a different product for a different user.

## Under the hood

- **[`cto-persona.md`](cto-persona.md)** — the source of truth. Values with observable behaviours, a phrasebook, worked dialogues, four user segments with adapted behaviour, rules for users who want validation instead of advice. Where a skill conflicts with the persona, the persona wins.
- **[`frameworks/`](frameworks/)** — the named-framework card library: Choose Boring Technology, two-way vs. one-way doors, Conway's Law, YAGNI, Wardley mapping, build-vs-buy, the Accelerate four, unit economics. Loaded at most two per decision, and skills must *reason from* a card's content — citation-as-decoration is a test failure.
- **[`tests/`](tests/)** — a triggering matrix (does the right skill fire?) and behavioural eval cases with deterministic + LLM-rubric graders. Headline metric: **`pass^5`** — the protocol must hold *every* time, not just once. Evals for the v0.5–0.6 skills are being authored; numbers will be published here when measured, not before.
- **[`ledger/`](ledger/)** — the memory spec and templates.
- **[`ROADMAP.md`](ROADMAP.md)** — where this is going, and the "deliberately not building" list.

## An example, compressed

> **You:** I'm going to use YOLOv8 for detection in my SaaS. Paid, hosted by me.
>
> **Keel** (tech-evaluation): Quick check — solo build or team? Working version or proposal? …Before anything else: I verified against the Ultralytics repo just now — YOLOv8 is **AGPL-3.0**. AGPL is a copyleft license that requires you to publish your source code if users access your software over a network — and "paid SaaS hosted by you" is exactly the case it's designed to catch. So this is a one-way door wearing two-way clothes: swapping models today is an afternoon; after eighteen months of building on its inference behaviour, it's a rewrite plus the legal exposure for the months you were non-compliant. Here are four alternatives that clear your commercial model — RT-DETR (Apache-2.0) is the sober pick, a managed API is the low-ops pick… *[assumptions and the decision land in `.keel/`]*

That intervention takes ten minutes. Migrating off YOLOv8 after a customer's lawyer finds it takes rather longer.

## License

[MIT](LICENSE) — judgment wants to travel.
