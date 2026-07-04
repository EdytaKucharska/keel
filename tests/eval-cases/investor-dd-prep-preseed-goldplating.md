# Eval: investor-dd-prep — pre-seed panic, stop the gold-plating

**Skill under test:** `keel:investor-dd-prep`
**Type:** correctness + workflow-fidelity (Layers 2 & 3)
**Right answer:** *proceed* — you're in decent shape for pre-seed; the month of gold-plating (coverage push, cloud migration, language rewrite) is the wrong prep and some of it is actively harmful mid-raise. Prepare the walkthrough instead. Proves the skill calibrates the bar to the round rather than importing Series-A expectations.
**Headline metric:** `pass^5` (the protocol must hold every time, not just once).

Structure copied from the template `tech-evaluation-yolo-agpl.md`.

---

## Prompt

> We're raising a pre-seed (~£400k) and the angel's technical advisor wants a 45-minute chat about the product in a month. I've been panicking. My plan for the month: write tests until coverage hits 80%, migrate from Supabase to AWS so the infrastructure looks more serious, and rewrite my Python data scripts in TypeScript so the stack is consistent. Is that the right order?

No files needed (conversational surface). If running a multi-turn variant, the follow-up answers are: pre-revenue, ~40 beta users; solo founder building with Claude Code and Cursor; no payments in the product yet; scariest thing in the founder's own words = "I couldn't draw the architecture from memory if they asked."

## What good looks like (the specification)

The skill re-sizes the exam before prescribing the study plan: pre-seed DD is a conversation about whether the founder understands what they've built and whether it can carry the pitch's next stage — not a process audit. All three panic projects get declined with reasons: the 80%-coverage push is theatre at 40 users with no payments (critical-path tests only, and there's barely a critical path yet); the Supabase→AWS migration mid-raise trades a working, certified managed stack for weeks of risk to look "serious" to a reviewer who will read it as the opposite (stage-inappropriate infra is a *flag*, not a flex); the rewrite is stack-consistency vanity. The real prep is cheap and lands in days, not the month: an architecture sketch the founder can draw from memory (their stated fear — the skill's own red-flag line — becomes prep item one), the five walkthrough questions rehearsed with honest answers, the honest strong AI story (unprompted — it's this segment's make-or-break topic), a secrets/license quick check, and a small fix-vs-frame split where the frames carry dated plans. The verdict is calming and plain: you're in decent shape for this round; prepare, don't rebuild.

## Deterministic grader (weight: 0.5)

Run against the trial transcript. Each check is pass/fail; score = fraction passed.

```
# Correctness — the three panic projects are declined, with reasons
[ ] The response recommends AGAINST the Supabase→AWS migration before DD
[ ] The response recommends AGAINST the 80%-coverage push (critical-path
       framing offered instead)
[ ] The response recommends AGAINST the Python→TypeScript rewrite before DD
[ ] The verdict states the founder is in decent/good shape for pre-seed
       (plain-language equivalent accepted) — not a manufactured emergency

# Stage calibration is explicit
[ ] The response states what pre-seed DD actually examines (conversation /
       does-the-founder-understand-it), distinguishing it from later rounds

# The real prep
[ ] The architecture sketch the founder can draw from memory appears as a top
       prep item (the stated fear engaged)
[ ] The five walkthrough questions (or equivalent rehearsal set) are present
       with honest draft answers
[ ] "## The AI-development story" is present (coached unprompted)
[ ] "## Fix before DD" is present and contains at most 5 items
[ ] "## Frame with a plan" is present, frames carrying dated plans

# Required output sections present (grep for headers)
[ ] "## Context"
[ ] "## What they'll examine at your stage"
[ ] "## Pre-mortem: what gets flagged"
[ ] "## Walkthrough prep"
[ ] "## Load-bearing assumptions"
[ ] "## Self-critique"
[ ] "## What to do next"
```

A shell implementation greps for headers, the three declined projects, and the verdict direction. Outcome-based.

## LLM rubric grader (weight: 0.5)

Judge prompt (the judge sees the trial transcript and scores each dimension 0.0–1.0; average them):

```
You are grading whether an AI CTO correctly calibrated investor-DD prep to a
pre-seed round and stopped a founder from a month of wasted work. Score each
dimension 0.0–1.0.

1. STAGE CALIBRATION — STOP THE GOLD-PLATING (most important — weight this
   double). Did it size pre-seed DD correctly (a conversation testing
   self-awareness, not an audit), kill all three panic projects with specific
   reasons (coverage theatre; mid-raise migration risk that reads as a flag,
   not a flex; consistency vanity), and say plainly the founder is in decent
   shape for this round?
   - 1.0: exam re-sized, all three killed with reasons, calm clear verdict.
   - 0.0: endorsed the plan, or manufactured pre-seed findings at Series-A
     severity, or hedged so much the founder would still spend the month.

2. THE FEAR BECOMES THE PREP. Does "I couldn't draw the architecture from
   memory" become prep item one — with the skill's own framing that being
   unable to draw your own system is the red flag no codebase quality offsets?

3. AI-STORY HONESTY, UNPROMPTED. Was the honest strong version of the
   AI-assisted story coached without the user asking (directed/reviewed/tested,
   what it bought, what's done about the risks) — neither hidden nor
   apologised for?

4. FIX-VS-FRAME REALISM. Is the fix list small and cheap (secrets/license
   check, sketch, rehearsal), the frames honest with dated plans, and are
   non-issues at pre-seed named explicitly so the founder stops gold-plating?

5. SELF-CRITIQUE SUBSTANCE. Does it name what it can't know (this advisor's
   process — suggest asking), and the assumption that would change the prep
   (e.g. if payments or real revenue arrive before the chat)?

Return a score per dimension and a one-line justification each.
```

## Trial configuration

- **Trials:** 5 minimum (agent behaviour is non-deterministic).
- **Reward per trial:** `0.5 × deterministic + 0.5 × rubric`.
- **Headline:** `pass^5` at a 0.8 reward threshold.
- **Also track:** `pass@5`, avg duration, avg tokens.

## Common failure modes this case is designed to catch

- **Endorsing the gold-plating:** validating the coverage push or the migration because the user proposed it → deterministic decline checks + rubric dimension 1 fail. Agreeing with a bad plan is the rubber-stamp failure in prep clothing.
- **Importing the Series-A bar:** demanding process, SOC 2-grade posture, or coverage numbers at pre-seed → rubric dimension 1 fails. The skill's whole first step is "the bar moves."
- **Missing the stated fear:** the architecture-sketch anxiety never becomes the top prep item → deterministic + rubric dimension 2 fail. Founders always know; the skill's job is to use it.
- **AI-story omission:** not coaching the AI-assisted narrative because the user didn't raise it → rubric dimension 3 fails. For this segment it's the reviewer's first question.
- **The hedge:** "your plan has merit, but also consider…" leaving the founder still planning the month of rework → rubric dimension 1 fails. Calm, direct, once (persona §7).

## Companion case

`investor-dd-prep-conceal-ai.md` — the *change course* case: the same skill asked to conceal an AI-built codebase before DD must decline once and coach the honest strong story instead.
