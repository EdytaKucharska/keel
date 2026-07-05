# Eval: estimate-check — agency quote that checks out

**Skill under test:** `keel:estimate-check`
**Type:** correctness + workflow-fidelity (Layers 2 & 3), two-turn
**Right answer:** *proceed* — after crisp answers to all three questions, the estimate reads as real: approve it (with the sliced plan) and record the scope. Proves the skill can say yes; a checker that never approves gets muted.
**Headline metric:** `pass^5` (the protocol must hold every time, not just once).

Structure copied from the template `tech-evaluation-yolo-agpl.md`.

---

## Prompt

**Turn 1:**

> We got a quote from our agency: 3 months to add a client-facing reporting dashboard to our product. Is that reasonable? I don't have a technical background.

**Turn 2 (after the skill has armed the questions):**

> I took your questions to them. (1) Trigger: we've promised the dashboard in two enterprise contracts with a Q4 deadline, and generating reports manually is already costing us about a day a week. (2) They proposed slicing it themselves: 3 weeks for a read-only dashboard with the five core metrics to validate the data pipeline, then two increments for the rest. (3) It ships behind a per-customer feature flag; the dashboard is additive, no schema changes to existing tables. And when I asked what would make it take twice as long, they answered immediately: "if your data needs cleaning — that's the unknown, which is why week one is a data audit."

No files needed (conversational surface). Additional turn-1 context if asked: relationship = agency on a retainer; the product is a B2B SaaS, ~200 customers.

## What good looks like (the specification)

**Turn 1:** the skill does not judge the number (it hasn't seen the code) and does not counter-estimate. It translates 3 months of agency time into money and opportunity, arms the three questions (plus the doubling question) phrased for an agency relationship — noting the interpretation shifts (agencies pad for margin) while the questions stay the same — and gives the read-back key.

**Turn 2:** the skill engages with the *actual answers*, not the generic key: a crisp contractual trigger, an unprompted slice proposal with a validation-first shape, a rollback story (additive + feature flag), and an instant doubling scenario with a mitigation already scoped — these are the signals of an honest estimate, and the self-sliced plan and named unknown deserve to be called out as such. Verdict: **approve the sliced plan**; record the agreed scope so creep is visible later; note the data-audit week is the checkpoint where the number gets firmer. No residual suspicion is manufactured.

## Deterministic grader (weight: 0.5)

Run against the trial transcript. Each check is pass/fail; score = fraction passed.

```
# The core rule — did NOT counter-estimate (both turns)
[ ] Neither turn asserts Keel's own total duration for the dashboard work or a
       competing range. (Translating the QUOTED 3 months into money, and
       discussing the agency's OWN 3-week slice, do not count as violations.)

# Turn 1 — armed, not answered
[ ] The trigger, slicing, and rollback questions are all present
[ ] The 3 months is translated into money and/or opportunity cost
[ ] Turn-1 sections present: "## Context", "## What this estimate costs",
       "## The three questions to take back", "## How to read the answers",
       "## How to ask without burning trust", "## What I can't know from here",
       "## What to do next"

# Turn 2 — the verdict
[ ] The verdict is to approve / proceed with the estimate (the sliced plan) —
       not to re-bid, renegotiate, or keep auditing
[ ] The response recommends recording the agreed scope (so scope creep is
       visible later)
[ ] The response references at least two of the agency's specific answers
       (the contractual trigger, the self-proposed slice, the feature-flag
       rollback, the data-audit doubling answer) rather than restating the
       generic key
```

A shell implementation greps both turns for counter-estimate patterns (with the protocol-move exceptions), turn-1 headers and question concepts, and the turn-2 approval direction. Outcome-based.

## LLM rubric grader (weight: 0.5)

Judge prompt (the judge sees the full two-turn transcript and scores each dimension 0.0–1.0; average them):

```
You are grading whether an AI CTO can approve an estimate cleanly once the
evidence supports it. Score each dimension 0.0–1.0.

1. WILLING TO SAY "THIS IS FINE" (most important — weight this double).
   After crisp answers on all three questions plus an instant doubling scenario,
   did turn 2 deliver a clean approve verdict — without manufacturing residual
   suspicion, demanding a second bid, or hedging into "well, you can never
   really know"?
   - 1.0: "this reads as a real estimate — approve the sliced plan"; confidence
     proportional to the evidence.
   - 0.0: perpetual auditing, or an approval so hedged the user can't act on it.

2. READ THE ANSWERS, NOT THE SCRIPT. Does turn 2 engage the specific content —
   naming the unprompted self-slicing and the pre-scoped data-audit unknown as
   honesty signals — rather than re-running the generic interpretation key?

3. RELATIONSHIP-FITTED QUESTIONS (turn 1). Were the questions adapted to an
   agency (margin-padding is the failure mode; interpretation shifts, questions
   stay the same), phrased as curiosity the user can deliver as their own?

4. NO COUNTER-ESTIMATE, EITHER TURN. Did the skill hold the line on not judging
   the number itself — including not re-pricing the agency's slices?

5. FORWARD GUARDRAILS. Does the approval come with the follow-through — record
   the scope, treat the data-audit week as the checkpoint where the estimate
   firms up, revisit if the unknown fires — rather than ending at "approved"?

Return a score per dimension and a one-line justification each.
```

## Trial configuration

- **Trials:** 5 minimum (agent behaviour is non-deterministic).
- **Reward per trial:** `0.5 × deterministic + 0.5 × rubric`.
- **Headline:** `pass^5` at a 0.8 reward threshold.
- **Also track:** `pass@5`, avg duration, avg tokens.

## Common failure modes this case is designed to catch

- **Perpetual suspicion:** the skill can't close the loop and keeps auditing after crisp answers → rubric dimension 1 fails. A checker that never says yes trains the user to stop asking — the naysayer failure mode this case exists to rule out.
- **The counter-estimate under cover of approval:** "approve it, though it could probably be done in 6 weeks" → deterministic rule + rubric dimension 4 fail.
- **Script over substance:** turn 2 restates the generic interpretation key without engaging the agency's actual answers → deterministic reference check + rubric dimension 2 fail.
- **Approval without guardrails:** "sounds good, go ahead" with no scope recording and no checkpoint → rubric dimension 5 fails; scope creep becomes invisible again.
- **Missing the agency lens:** questions delivered generically, with employee-relationship coaching → rubric dimension 3 fails.

## Companion case

`estimate-check-cudgel.md` — the *change course* case: the same skill asked for ammunition against a developer must give both sides and never counter-estimate.
