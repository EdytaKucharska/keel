# AI CTO — Skill Evals

How the four AI-CTO skills are tested, based on the skill-evaluation framework Anthropic shipped with skill-creator on [March 3, 2026](https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills).

These tests are a **development artifact**, not part of the installable skill surface. They live in `tests/` at the plugin root, which the plugin loader ignores (it only reads `skills/`, `.claude-plugin/`, etc.). Keep them in the repo so they can run in CI and after every model update.

## What Anthropic shipped, in one paragraph

Skill-creator can now write and run **evals** — tests that check Claude does what you expect for a given prompt. You define test prompts (plus files if needed), describe what "good" looks like, and skill-creator reports whether the skill holds up. Graders come in two kinds: **deterministic** (a shell script checks an outcome — did the file get written, does the output contain X) and **LLM rubric** (a judge model evaluates qualitative things — did the agent follow the right workflow). A **benchmark mode** runs the whole suite and tracks pass rate, elapsed time, and token usage. **Comparator agents** do blind A/B runs (v1 vs v2, or skill vs. no-skill). And a **description-optimization** pass tunes the frontmatter `description` to cut false-positive and false-negative triggering. You run all of it by asking skill-creator to evaluate a skill — no code required.

To run these against our skills: install the skill-creator plugin (or use it in Claude.ai / Cowork), point it at this repo, and ask it to run the eval cases in `tests/eval-cases/` and the triggering matrix in `tests/triggering-matrix.md`.

## The one distinction that shapes everything: these are *encoded-preference* skills

Anthropic splits skills into two kinds:

- **Capability uplift** skills make Claude do something the base model can't do well alone (e.g. the PDF skill placing text at exact coordinates). For these, the question is "can it do the thing," and `pass@k` ("does it succeed at least once in k tries") is the headline metric. They also expire — when the base model gets good enough to pass the evals *without* the skill, the skill is no longer needed.

- **Encoded-preference** skills sequence things Claude can already do, according to a specific process. The CTO skills are squarely this kind. Claude can already evaluate a technology or surface alternatives; what the skills enforce is the *persona's protocol and lens* — segment detection, the adversarial-framing check, framework loading from `INDEX.md`, the §10 antipattern cross-reference, the engagement rule, the self-critique. The skill's value is **fidelity to that workflow**, not raw capability.

This has three consequences for how we test:

1. **We test fidelity, not capability.** The eval question is not "can Claude evaluate YOLOv8" (it can) — it's "did the skill make Claude evaluate it *the CTO way*: verify the license rather than recall it, load the right cards, engage with their content, surface the antipattern, self-critique."

2. **`pass^k` is the headline metric, not `pass@k`.** For a workflow you want followed *every* time, "did it follow the protocol in all 5 of 5 trials" (`pass^5`) matters far more than "did it manage it at least once" (`pass@5`). A skill that follows its protocol 3 times in 5 is a flaky skill, even if `pass@5` is 100%. Run **at least 5 trials** per case (agent behaviour is non-deterministic) and read `pass^5` as the reliability number.

3. **These skills don't expire the way capability-uplift skills do** — but they *can* drift. If a model update changes how Claude reads the framework-loading instruction, the workflow can silently degrade. Re-running the suite after each model update is the early-warning signal.

## The three test layers

### Layer 1 — Triggering (does the right skill fire at all?)

The project's most persistent pain. A skill with a perfect protocol is worthless if it doesn't fire, or if a competing plugin's skill fires instead. This layer maps directly to Anthropic's description-optimization feature. Three sub-categories, all in `tests/triggering-matrix.md`:

- **True positives** — prompts that *should* fire each skill.
- **True negatives** — prompts that should *not* fire any CTO skill (educational questions, debugging, "how does X work").
- **Routing / competition** — among the four CTO skills (and against installed competitors like a `brainstorming` skill), does the *right* one fire? Includes the brainstorm→CTO handoff cases.

Triggering is graded deterministically: did the expected skill load (yes/no), and did any unexpected skill load.

### Layer 2 — Workflow fidelity (does the skill follow its protocol?)

For each skill, given a canonical prompt, does the output exhibit the protocol steps? Mostly deterministic (section headers present, files read) with one LLM-rubric check (the engagement rule). The shared fidelity checklist every CTO skill eval asserts:

- **Segment detection ran** — the skill asked or inferred the user's segment before recommending. *(LLM rubric.)*
- **Adversarial-framing check ran** — Step 0 happened; if the prompt was validation-seeking, it was acknowledged. *(LLM rubric.)*
- **Verification, not recall** — for any stale-able fact (license, pricing, maintenance), the skill ran a web search rather than asserting from memory. *(Deterministic: web-search tool call present in transcript.)*
- **Framework loading happened** — the skill read `frameworks/INDEX.md` and the expected card files. *(Deterministic: file-read tool calls present.)*
- **Engagement rule held** — loaded cards were reasoned-from, not just named. This is the single most important rubric check. *(LLM rubric.)*
- **Antipattern cross-reference ran** — the §10 catalog was checked; applicable antipatterns surfaced. *(LLM rubric.)*
- **Required output sections present.** *(Deterministic: header match.)*
- **Self-critique present and substantive.** *(Deterministic for presence, LLM rubric for substance.)*

### Layer 3 — Correctness (is the substance right?)

Per-case "right answer" checks. For the hero YOLO/AGPL case: did it catch that YOLOv8 is AGPL-3.0 and incompatible with proprietary SaaS, and did it propose Apache-2.0 alternatives? These are mostly deterministic (specific facts must appear) with an LLM-rubric check on whether the recommendation is sound.

## Grader design for these skills

| What we're checking | Grader | How |
|---|---|---|
| Right skill fired / wrong skill didn't | deterministic | inspect which skill(s) loaded |
| Required output sections present | deterministic | grep transcript for section headers |
| Verifiable fact stated correctly (e.g. AGPL) | deterministic | grep for the fact + the implication |
| INDEX.md + correct cards read | deterministic | inspect file-read tool calls |
| Web search used for stale-able facts | deterministic | inspect web-search tool calls |
| Engagement rule (reason-from-card, not cite) | LLM rubric | judge prompt in the eval case |
| Teaching-mode register (terms defined inline) | LLM rubric | judge prompt |
| Segment-appropriate adaptation | LLM rubric | judge prompt |
| Willing to say "don't adopt / don't build yet" | LLM rubric | judge prompt |
| Self-critique substance | LLM rubric | judge prompt |

Each grader returns 0.0–1.0 with a weight; the trial reward is the weighted combination. Weight deterministic correctness and the engagement-rule rubric highest — those are the load-bearing behaviours.

## Directory structure

```
tests/
├── README.md                  ← this file
├── triggering-matrix.md       ← Layer 1: all triggering cases for the 8 skills
└── eval-cases/                ← Layers 2 & 3: one file per behavioural eval
    ├── tech-evaluation-yolo-agpl.md       ← hero case + template
    ├── tech-evaluation-stripe-confirm.md  ← (to author) a clean-approval case
    ├── architecture-review-microservices.md (to author)
    ├── feature-decision-saved-alerts.md     (to author)
    ├── feature-decision-brainstorm-handoff.md (to author)
    ├── first-build-scope-fibromyalgia.md    (to author)
    ├── first-build-scope-brainstorm-handoff.md (to author)
    ├── deep-review-prelaunch-gaps.md            ← change-course: planted gaps, not ready
    ├── deep-review-sound-codebase.md            ← proceed: honest good news
    ├── enterprise-ready-honest-no.md            ← change-course: pressure to fudge, honesty rule
    ├── enterprise-ready-inherit-and-answer.md   ← proceed: answer now, don't start SOC 2
    ├── estimate-check-cudgel.md                 ← change-course: no counter-estimate, both sides
    ├── estimate-check-agency-quote.md           ← proceed: crisp answers → approve
    ├── investor-dd-prep-conceal-ai.md           ← change-course: decline concealment, honest AI story
    ├── investor-dd-prep-preseed-goldplating.md  ← proceed: stage-calibrated, stop gold-plating
    └── ledger-contract-fired-trigger.md         ← the ledger contract, graded through tech-evaluation
```

Each eval-case file is a **specification** — the prompt, what good looks like, the deterministic assertions, and the LLM rubric. Per Anthropic's best practice, *write the judges before polishing the skill* — the judges are the spec, and writing them first reveals where the skill is underspecified.

## Eval-case coverage plan

Two cases per skill minimum: one where the right answer is **"don't / change course"** (the high-value catch) and one where the right answer is **"yes, proceed"** (so the skill isn't just a naysayer — a skill that always says no gets muted).

| Skill | "change course" case | "proceed" case |
|---|---|---|
| tech-evaluation | YOLOv8/AGPL on paid SaaS → don't adopt | Stripe for payments → adopt, here's what to watch |
| architecture-review | microservices for 3 engineers → don't split | monolith is right for your stage → stay, here's the trigger to revisit |
| feature-decision | saved-alerts as Lambda+DynamoDB → build in monolith | a feature that genuinely warrants a new dependency → buy it |
| first-build-scope | "build it all myself" → consume commodity, build differentiation | a build map where AI-assisted code build is genuinely the right shape |
| deep-review | planted gaps (secrets, no backups, per-request inference) → not ready, fix first | genuinely clean codebase → "this is in good shape," said honestly |
| enterprise-ready | pressure to fudge the questionnaire → decline once, build the honest path | readier than they think → answer now, do NOT start SOC 2 yet |
| estimate-check | asked to be the cudgel → both sides, never counter-estimate | crisp answers to the three questions → approve the estimate |
| investor-dd-prep | asked to conceal the AI-built codebase → decline, honest strong AI story | pre-seed gold-plating panic → you're fine, prepare don't rebuild |

Plus two handoff cases (feature-decision and first-build-scope receiving a brainstorm) under Layer 1/2, and one cross-skill case for the **ledger contract** (`ledger-contract-fired-trigger.md`): an existing `.keel/` with a fired revisit-trigger, asserting profile-answered questions are skipped, the trigger surfaces once, and the decision/assumptions are written back append-only.

## Reading the results

- **`pass^5` per case is the headline.** Below ~0.8 means the skill is flaky on that behaviour — investigate the failing transcripts.
- **`pass@5` vs `pass^5` gap** tells you flakiness: high `pass@5`, low `pass^5` = "it can, but doesn't reliably." That's the encoded-preference failure mode.
- **Triggering pass rate** is separate and binary-ish — track true-positive rate and false-positive rate as the description gets tuned.
- **Token + time** from benchmark mode tell you if the skill is getting more expensive as it grows (the four-skill suite plus framework loading is not free).

## When to run

- After any edit to a skill, the persona, or `INDEX.md`.
- After any model update (the regression-catch use case).
- In CI on PRs that touch `skills/**`, `frameworks/**`, or `cto-persona.md`.
- Before any release tag.
