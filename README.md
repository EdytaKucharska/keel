# Keel

**An AI fractional CTO that lives in your editor.**

Keel is a [Claude Code](https://claude.com/claude-code) plugin for product builders who don't have a senior technical voice in the room — solo founders building with AI tools, PMs making tech-adjacent calls without an engineer to lean on, and early-stage founders whose team has skill but not yet judgment.

A keel is the weighted spine below a boat's waterline: invisible, and the only reason the vessel stays upright as it takes on load. The AI tools you already use generate the app — the sails. Keel is everything underneath: the architecture decision that determines whether you scale, the license trap caught before you build on it, the "you don't need this yet" said at the right moment.

## What it does

Four skills covering the founder workflow end-to-end. Each one is invoked at a specific decision moment:

| Skill | Decision moment | What you get |
|---|---|---|
| **`first-build-scope`** | *"I have an idea — how do I build it?"* | A **build map**: 3–6 viable shapes for the first build, the riskiest technical assumption named, and the cheapest way to test it before writing code. |
| **`feature-decision`** | *"We want to add X — how should we build it?"* | A **decision memo**: technical alternatives, architectural-alignment check, tech-debt pricing, the smallest viable version, and an estimate you can hand to an engineer or AI tool. |
| **`tech-evaluation`** | *"I'm going to use X"* (a library, model, vendor, framework) | **Due diligence**: license verified (not recalled), maintenance health, credible alternatives, switching cost, and a willingness to say "don't adopt this." |
| **`architecture-review`** | *"Should we split this / how should the system be shaped?"* | A **structured review**: stage/scale/team fit, Conway's-Law check, one-way doors flagged, antipatterns caught, and at least two credible alternative shapes. |

Every skill follows the same protocol: detect who you are → gather context → check for validation-seeking framings → **verify stale-able facts with web search** → surface alternatives → load the applicable decision frameworks → cross-reference an 18-item antipattern catalog → recommend with explicit reasoning → name the load-bearing assumptions → self-critique visibly.

## What makes it different

- **A real persona, not a prompt.** All four skills operate under [`cto-persona.md`](cto-persona.md) — a specification of who this CTO is: values with observable behaviours, a phrasebook, worked dialogues, segment-specific adaptation, and rules for handling users who want validation rather than advice. Where a skill conflicts with the persona, the persona wins.
- **Named frameworks, loaded on demand.** [`frameworks/`](frameworks/) is a card library — Choose Boring Technology, two-way vs. one-way doors, Conway's Law, YAGNI, Wardley mapping, build-vs-buy, the Accelerate four, unit-economics decomposition. Skills load at most two cards per decision and must *reason from* the card's content, never cite it as decoration. Each card documents when it applies, when it doesn't, and how it gets misused.
- **An antipattern catalog with teeth.** License traps (AGPL in proprietary SaaS), custom auth, microservices for three engineers, NoSQL "for flexibility," untested backups, secrets in code — the persona flags these whether you asked or not.
- **Verification over recall.** Any fact that changes — licenses, pricing, maintenance status — gets a web search, not a confident memory. The evals enforce it.
- **Tested like a product.** [`tests/`](tests/) contains a triggering matrix (does the right skill fire?) and behavioural eval cases with deterministic + LLM-rubric graders, built on Anthropic's skill-evaluation framework. Headline metric is `pass^5`: the protocol must hold every time, not just once.

## Install

Keel is a standard Claude Code plugin.

```
/plugin marketplace add EdytaKucharska/keel
/plugin install keel@keel
```

Then either invoke a skill explicitly —

```
/keel:first-build-scope   I want to build an app that helps X do Y
/keel:tech-evaluation     I'm going to use YOLOv8 for detection in my SaaS
```

— or just describe the decision naturally ("should we split our monolith?", "we want to add saved alerts") and the right skill fires on its own.

## Who it's for

- **The solo builder shipping with AI tools.** You have a working product you don't fully understand. Keel makes the invisible visible: what's load-bearing, what's fragile, what's needed *yesterday* vs. what you genuinely don't need yet.
- **The PM in a small startup.** You approve estimates and vendor picks without the language to push back. Keel arms you with the three questions to take back to the team.
- **The founder with junior engineers.** Your team ships but lacks the judgment that prevents foreseeable mistakes. Keel is the senior second opinion in the room.
- **The pre-product founder.** You have an idea and no code. Keel lays out the option-space in plain language before you commit to anything.

## Repository layout

```
keel/
├── cto-persona.md          # who this CTO is — the source of truth every skill derives from
├── cto-research.md         # the research synthesis the persona was built on
├── skills/                 # the four v1 skills
│   ├── first-build-scope/
│   ├── feature-decision/
│   ├── tech-evaluation/
│   └── architecture-review/
├── frameworks/             # decision-framework cards + INDEX.md (progressive disclosure)
├── tests/                  # triggering matrix + behavioural eval cases
├── v2-backlog/             # parked skills (infra-cost-assessment, tech-hygiene-audit)
└── .claude-plugin/         # plugin + marketplace manifests
```

## Roadmap

- **Memory.** The single biggest planned addition: a per-project decision ledger, so recommendations, load-bearing assumptions, and revisit-triggers persist across sessions — a CTO who *remembers you*, not four consultations.
- **`ship-ready-check`** (from the parked `tech-hygiene-audit`): the repo-aware launch audit — backups, secrets, observability, and the three tests on AI-generated code — with a two-week professionalisation plan.
- **`infra-cost-assessment`**: bill decomposition, unit economics, and the top three optimisations with ROI.

## License

[MIT](LICENSE)
