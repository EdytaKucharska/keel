# Triggering Test Matrix

Layer 1 of the eval suite (see `README.md`). Tests whether the *right* skill fires — the project's most persistent failure mode. This is the input to Anthropic's skill-creator description-optimization pass: feed it these prompts and it tunes each skill's `description` to cut false positives and false negatives.

**How to grade.** Each row is run ≥5 trials. The check is binary per trial: did the expected skill load, and did any unexpected CTO skill load? Report true-positive rate (should-fire prompts that fired) and false-positive rate (should-not-fire prompts that fired anyway). For routing rows, "correct" means the expected skill fired *and* the others didn't.

**Important caveat.** Triggering is contested when other plugins are installed. Run this matrix twice: once with **only keel installed** (measures the descriptions in absolute terms) and once with **your real plugin set** including competitors like a `brainstorming` skill (measures real-world routing). The gap between the two is the "losing to a competitor" effect — see the routing section.

---

## tech-evaluation

### Should fire (true positives)

| Prompt | Notes |
|---|---|
| "I'm going to use YOLOv8 for object detection in my SaaS." | canonical; names tech + adoption verb |
| "Should I use Supabase or build my own auth?" | comparison; build-your-own-auth is also a §10 flag |
| "Let's add Stripe for payments." | named tech, adoption |
| "I'll use Pinecone for the vector store." | named tech, adoption |
| "We're thinking of switching from MySQL to Mongo." | migration between named techs |
| "I'm planning to use Clerk for authentication." | "planning to use" — the phrasing that previously under-triggered |
| "My stack will be Next.js + Postgres + Resend." | architecture-naming without an explicit adoption verb (previously a miss) |

### Should NOT fire (true negatives)

| Prompt | Why it shouldn't fire |
|---|---|
| "How does Postgres MVCC work?" | educational, no adoption |
| "Explain the difference between SQL and NoSQL." | educational |
| "Fix this bug in my Stripe webhook handler." | debugging adopted tech |
| "What's the syntax for a Supabase RLS policy?" | usage help, already adopted |

---

## architecture-review

### Should fire (true positives)

| Prompt | Notes |
|---|---|
| "Should we split our monolith into microservices?" | canonical structural decision |
| "We're going to separate the frontend and backend into two services." | service decomposition |
| "Should user data and product data be in separate databases?" | data-model / boundary decision |
| "Our backend is doing too much — should we break it up?" | existing-system structural question |
| "Here's our architecture, what would you change?" | explicit review (repo-aware) |
| "We want to add a queue between the API and the workers." | structural component decision |

### Should NOT fire (true negatives)

| Prompt | Why it shouldn't fire |
|---|---|
| "How does a message queue work?" | educational |
| "Explain Conway's Law." | educational (even though we have a card for it) |
| "Fix the race condition in our worker." | debugging |
| "What's the difference between SQS and Kafka?" | comparison of named techs → routes to **tech-evaluation**, not architecture-review |

---

## feature-decision

### Should fire (true positives)

| Prompt | Notes |
|---|---|
| "We want to add saved alerts where users set a threshold and get notified." | canonical feature decision |
| "How should we build export-to-CSV?" | feature build approach |
| "Users keep asking for team workspaces — how do we add that?" | feature with structural implications |
| "Should we add a settings system or just hardcode the three values?" | feature-level YAGNI decision |
| "Now how should we build this?" *(after a brainstorm clarified the feature)* | **handoff trigger** — see routing |
| "What's the technical approach for the notifications feature?" | technical-approach phrasing |

### Should NOT fire (true negatives)

| Prompt | Why it shouldn't fire |
|---|---|
| "Fix the bug in our notifications feature." | debugging an existing feature |
| "What should our next feature be?" | product-priority question, not a technical decision |
| "How do WebSockets work?" | educational |

---

## first-build-scope

### Should fire (true positives)

| Prompt | Notes |
|---|---|
| "I want to build a mobile app for fibromyalgia patients to track symptoms and generate GP reports." | canonical idea-stage (the case that exposed the gap) |
| "I'm planning a SaaS for sales teams — where do I start?" | idea stage, no artifact |
| "I have an idea for a tool that summarises Reddit threads — how would I build it?" | idea stage |
| "What stack should I use for a new B2B analytics product?" | idea-stage stack question |
| "Now how do I actually build this?" *(after a brainstorm clarified the idea)* | **handoff trigger** |

### Should NOT fire (true negatives)

| Prompt | Why it shouldn't fire |
|---|---|
| "How do I add a feature to my existing app?" | existing system → routes to **feature-decision** |
| "Should I rewrite my Rails monolith in Next.js?" | existing system → routes to **architecture-review** |
| "What's the best database for beginners?" | educational |

---

## Routing / competition (the hard layer)

These cases test whether the *right* skill fires when several could plausibly apply. "Correct" = expected skill fires, others don't.

| Prompt | Expected skill | Why (and what it must beat) |
|---|---|---|
| "I want to build an app for X" (no artifact, no team) | first-build-scope | must beat tech-evaluation (no named tech) and architecture-review (no structure yet) |
| "We want to add feature X to our existing product" | feature-decision | must beat first-build-scope (there IS an artifact) and architecture-review (it's a feature, not a system-shape decision) |
| "Should we use X or Y for [feature]?" | tech-evaluation | named-tech comparison wins over feature-decision |
| "Should we restructure the whole system into services?" | architecture-review | system shape wins over feature-decision |
| "I'm going to use YOLOv8 in my new app idea" | tech-evaluation OR first-build-scope | ambiguous — name a tech AND pre-product. Document which one you want to win; this is a description-tuning decision |

### Brainstorm handoff cases (multi-plugin)

Run these **with a `brainstorming` skill installed** to reproduce the real competition. The chain (persona §12) is: brainstorming owns "what should this be," the CTO owns "how do we build it."

| Sequence | Expected behaviour |
|---|---|
| "I want to build a new feature: a whitelabel gallery shared via WhatsApp link." | brainstorming fires (exploratory). **This is acceptable** — it's the intent-clarification moment. |
| ...then: "Now how should I build it?" | feature-decision fires, runs its **intake/handoff check**, restates the clarified feature in 1–2 lines, does NOT re-ask what the feature is, goes straight to technical evaluation. |
| "I have an idea for a fibromyalgia tracking app." | brainstorming fires (exploratory). |
| ...then: "Ok, how do I actually build this?" | first-build-scope fires, runs its intake/handoff check, treats intent as settled, produces the build map. |

The known-flaky part: whether the "Now how should I build it?" auto-fires the CTO skill *without* an explicit `/keel:` prefix when a brainstorming plugin is also installed. If this routing case fails consistently, it's the signal that the descriptions need the skill-creator description-optimization pass against the specific competitor — that's the "thorough phrase research" deferred earlier in the project.

---

## What to do with the results

1. **Run with only keel installed.** Establish the baseline true-positive / false-positive rates per skill. If a should-fire prompt misses here, the description is weak in absolute terms.
2. **Run with the real plugin set.** Compare. Any case that fired solo but misses now is being out-competed — a routing problem, not a description-weakness problem.
3. **Feed both result sets to skill-creator's description-optimization.** It tunes each description against the prompts to cut false positives and false negatives. Re-run to confirm improvement (Anthropic saw gains on 5/6 of their own public skills).
4. **Re-run after every description edit and every model update.** Triggering drifts.
