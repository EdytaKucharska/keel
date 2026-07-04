# Eval: tech-evaluation — YOLOv8 / AGPL license trap

**Skill under test:** `keel:tech-evaluation`
**Type:** correctness + workflow-fidelity (Layers 2 & 3)
**Right answer:** *don't adopt* — this is the high-value catch.
**Headline metric:** `pass^5` (the protocol must hold every time, not just once).

This is the hero case and the template for all other eval-case files. Copy this structure for new cases.

---

## Prompt

> I'm going to use YOLOv8 for object detection in a new SaaS I'm planning. Paid, hosted by me.

No files needed. The skill should ask its segment + context questions, then run the protocol.

If running a multi-turn variant, the follow-up answers are: use case = document/receipt detection; team = solo, AI tools; scale = MVP, first 100 paying users in year one.

## What good looks like (the specification)

The skill recognises that YOLOv8 is published by Ultralytics under **AGPL-3.0**, that AGPL is incompatible with a proprietary paid-hosted SaaS without either open-sourcing the backend or buying a commercial license, and it proposes permissively-licensed alternatives (Apache-2.0 / MIT) and/or managed APIs. It does this *the CTO way*: verifies the license rather than recalling it, loads the right framework cards and reasons from them, surfaces the license-trap antipattern, and self-critiques. It recommends *don't adopt YOLOv8 as-is*.

## Deterministic grader (weight: 0.5)

Run against the trial transcript. Each check is pass/fail; score = fraction passed.

```
# Correctness — the substance must be right
[ ] Transcript states YOLOv8 / Ultralytics license is AGPL-3.0
[ ] Transcript states AGPL is incompatible with proprietary/closed paid SaaS
       (or requires open-sourcing, or requires a commercial license)
[ ] Transcript proposes at least one permissive alternative
       (Apache-2.0 or MIT: RT-DETR, DETR, MMDetection, DocTR, PaddleOCR, or a managed API)
[ ] Final recommendation is "don't adopt YOLOv8 as-is" (not a rubber-stamp)

# Verification, not recall
[ ] A web-search tool call for the YOLOv8 / Ultralytics license appears in the transcript
       (the skill must verify, not assert from memory)

# Framework loading actually happened (retrieval, not recall)
[ ] A file-read of frameworks/INDEX.md appears in the transcript
[ ] File-reads of the two expected cards appear:
       two-way-doors-vs-one-way-doors.md AND build-vs-buy-test.md
[ ] No more than 2 primary cards were loaded (the cap held)
       — choose-boring-technology may be MENTIONED but not read

# Required output sections present (grep for headers)
[ ] "## Context" (with Segment + Mode fields)
[ ] "## Verified facts" (with at least one source link)
[ ] "## Alternatives considered"
[ ] "## Frameworks applied"
[ ] "## Antipatterns I see"
[ ] "## Recommendation"
[ ] "## Self-critique"
[ ] "## What to do next"
```

A shell implementation greps the transcript for the required strings/headers and inspects the tool-call log for the web-search and file-read calls. Outcome-based: it checks that the facts and sections are present, not that any specific wording was used.

## LLM rubric grader (weight: 0.5)

Judge prompt (the judge sees the trial transcript and scores each dimension 0.0–1.0; average them):

```
You are grading whether an AI CTO's tech-evaluation followed its intended workflow
on the YOLOv8/AGPL case. Score each dimension 0.0–1.0.

1. ENGAGEMENT RULE (most important — weight this double).
   Did the response REASON FROM the loaded framework cards, or merely NAME them?
   - 1.0: e.g. "Two-Way Doors says this is the 'appears two-way but isn't' category —
     swapping YOLOv8 today is an afternoon; after the product is built on its output
     it's a rewrite" — the card's content drives the reasoning.
   - 0.0: "Per Two-Way Doors, be careful" — cited as decoration, no reasoning.

2. TEACHING MODE.
   Was AGPL (and any other jargon) defined inline on first use, in plain language,
   before being used as a label? 1.0 = yes, clearly; 0.0 = assumed prior knowledge.

3. SEGMENT-APPROPRIATE.
   Did the skill detect the segment (solo / pre-product / paid SaaS) and adapt —
   e.g. lower technical register, buy-by-default bias for a solo builder?

4. WILLING TO SAY "DON'T".
   Did it clearly recommend against YOLOv8 with reasoning, rather than hedging or
   rubber-stamping? A great fractional CTO says no when the commercial model demands it.

5. SELF-CRITIQUE SUBSTANCE.
   Is the self-critique real (names what wasn't verified, what assumption could flip
   the recommendation, where a skeptic would push back) rather than boilerplate?

Return a score per dimension and a one-line justification each.
```

## Trial configuration

- **Trials:** 5 minimum (agent behaviour is non-deterministic).
- **Reward per trial:** `0.5 × deterministic + 0.5 × rubric`.
- **Headline:** `pass^5` at a 0.8 reward threshold — does the protocol hold in *all* 5 trials? For an encoded-preference skill, reliability is the point.
- **Also track:** `pass@5` (if it ever succeeds), avg duration, avg tokens (framework loading adds cost — watch it).

## Common failure modes this case is designed to catch

- **Citation-as-decoration:** cards named but not reasoned-from → rubric dimension 1 fails. This is the regression most likely to creep in after a model update.
- **Recall instead of retrieval:** the model "knows" YOLOv8 is AGPL and skips both the web search and the INDEX/card reads → deterministic verification + framework-loading checks fail. Works today, drifts tomorrow.
- **Over-loading cards:** loads 4 cards because the trigger lookup names 4 candidates → cap check fails.
- **Rubber-stamping:** "YOLOv8 is great, here's how to integrate it" → correctness + rubric dimension 4 fail. This is the default-Claude behaviour the skill exists to prevent.

## Companion case (author next)

`tech-evaluation-stripe-confirm.md` — the *proceed* case. Prompt: "I'm going to use Stripe for payments in my SaaS." Right answer: adopt, here's what to watch (idempotency, webhook handling). Proves the skill isn't just a naysayer — a skill that always says no gets muted. Same grader structure; the deterministic correctness checks flip to "recommendation is adopt-with-guardrails" and "no false antipattern flag raised against Stripe."
