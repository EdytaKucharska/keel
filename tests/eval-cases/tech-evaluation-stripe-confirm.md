# Eval: tech-evaluation — Stripe, the clean approval

**Skill under test:** `keel:tech-evaluation`
**Type:** correctness + workflow-fidelity (Layers 2 & 3)
**Right answer:** *adopt, with guardrails* — the proceed companion to the YOLO/AGPL hero case. Proves the evaluation protocol can end in a confident yes; a skill that always says no gets muted.
**Headline metric:** `pass^5` (the protocol must hold every time, not just once).

Structure copied from the template `tech-evaluation-yolo-agpl.md` (whose companion note specifies this case).

---

## Prompt

> I'm going to use Stripe for payments in my SaaS.

No files needed (conversational surface). If running a multi-turn variant, the follow-up answers are: commercial model = paid B2B SaaS, monthly subscriptions; team = solo, AI tools; scale = MVP, first ~50 paying customers in year one; UK-based; time horizon = years.

## What good looks like (the specification)

The skill runs the full protocol — it does not shortcut to "obviously fine" just because the answer is obvious. It verifies Stripe's current pricing and terms by web search rather than reciting them, considers real alternatives (e.g. Paddle/Lemon Squeezy as merchant-of-record options with different VAT/tax trade-offs — genuinely relevant for a UK solo founder selling B2B — plus perhaps Adyen/GoCardless as different-category options), and lands a clear **adopt** with the guardrails that actually bite at this stage: webhook signature verification and entitlement updates, idempotency on payment-adjacent operations, not storing card data (staying inside Checkout/Elements to keep PCI scope minimal), and testing the failure paths (declines, dunning) before launch. Crucially, it raises **no false antipattern flag**: using Stripe *is* the §10-recommended answer to payments — the antipattern would be building around it. Per the persona, the §10 catalog is checked and the honest result ("no antipattern applies — this is the recommended pattern") is stated rather than manufactured. Assumptions and self-critique still present — a yes gets the same rigour as a no.

## Deterministic grader (weight: 0.5)

Run against the trial transcript. Each check is pass/fail; score = fraction passed.

```
# Correctness — the substance must be right
[ ] Final recommendation is "adopt Stripe" (clear, not hedged into uselessness)
[ ] No false antipattern flag is raised against using Stripe for payments
       (a flag against rolling your own payments/billing logic is fine and correct)
[ ] Guardrails include webhook handling (signature verification and/or
       entitlement sync) AND at least one of: idempotency, PCI-scope/no-card-data,
       failure-path testing (declines/dunning)
[ ] At least 2 credible alternatives are named with a real trade-off each
       (e.g. merchant-of-record tax handling vs Stripe's lower fees — not padding)

# Verification, not recall
[ ] A web-search tool call for Stripe's current pricing and/or terms appears
       in the transcript (fees change; the skill must verify, not recite)

# Framework loading actually happened (retrieval, not recall)
[ ] A file-read of frameworks/INDEX.md appears in the transcript
[ ] At most 2 primary cards were loaded; if no card applied, the output says so
       explicitly ("No named framework applies…") rather than forcing one

# Required output sections present (grep for headers)
[ ] "## Context" (with Segment + Mode fields)
[ ] "## Verified facts" (with at least one source link)
[ ] "## Alternatives considered"
[ ] "## Frameworks applied"
[ ] "## Recommendation"
[ ] "## Self-critique"
[ ] "## What to do next"
```

A shell implementation greps the transcript for the required strings/headers and inspects the tool-call evidence for the web-search and file-read calls. Outcome-based.

## LLM rubric grader (weight: 0.5)

Judge prompt (the judge sees the trial transcript and scores each dimension 0.0–1.0; average them):

```
You are grading whether an AI CTO's tech-evaluation delivered a rigorous YES on
the Stripe case. Score each dimension 0.0–1.0.

1. WILLING TO SAY YES, RIGOROUSLY (most important — weight this double).
   Did it land a confident "adopt" — no manufactured doubts, no false flags,
   no hedging that leaves the user unsure — while still doing the full
   protocol (verification, alternatives, assumptions, self-critique)?
   - 1.0: clear adopt; the rigour is in the guardrails, not in invented risk.
   - 0.0: manufactured concerns to seem thorough, or a rubber-stamp that
     skipped verification/alternatives because the answer seemed obvious.

2. GUARDRAILS THAT BITE. Are the watch-items the ones that actually hurt a
   solo founder at MVP stage (webhook-driven entitlements, idempotency,
   PCI scope, failure paths) rather than generic advice?

3. ALTERNATIVES WITH HONEST TRADE-OFFS. Do the alternatives engage the user's
   actual context (UK, B2B, solo — e.g. merchant-of-record VAT handling as a
   real consideration) rather than listing names?

4. TEACHING MODE. Jargon (webhook, idempotency, PCI, merchant of record)
   defined inline on first use, plain language first?

5. SELF-CRITIQUE SUBSTANCE. Even on a yes: what wasn't verified, which
   assumption could flip the call (e.g. if usage-based pricing or heavy EU
   consumer sales arrive, the tax/fee calculus shifts)?

Return a score per dimension and a one-line justification each.
```

## Trial configuration

- **Trials:** 5 minimum (agent behaviour is non-deterministic).
- **Reward per trial:** `0.5 × deterministic + 0.5 × rubric`.
- **Headline:** `pass^5` at a 0.8 reward threshold.
- **Also track:** `pass@5`, avg duration, avg tokens.

## Common failure modes this case is designed to catch

- **The manufactured "but":** inventing risks against Stripe to appear rigorous → rubric dimension 1 fails. A skill that can't cleanly approve the industry-default answer trains users to ignore it.
- **The rubber-stamp:** "Stripe is great, go ahead" with no verification, no alternatives, no guardrails → deterministic verification + alternatives checks fail. Obvious answers get the full protocol too.
- **Forced framework citation:** loading a card and decorating the output with it when no card genuinely applies → deterministic framework check + rubric dimension 1 fail. The template's rule: forcing produces citation-as-decoration, which is worse than naming nothing.
- **Recall instead of retrieval:** reciting Stripe's fee schedule from memory → deterministic web-search check fails. Fees and terms change.
- **Generic guardrails:** "make sure to test thoroughly" instead of the specific webhook/idempotency/PCI items → rubric dimension 2 fails.

## Companion case

`tech-evaluation-yolo-agpl.md` — the *change course* hero case and structural template: same protocol, opposite verdict.
