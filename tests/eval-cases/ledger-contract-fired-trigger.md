# Eval: the ledger contract — existing .keel/, fired trigger, write-back

**Skill under test:** the ledger contract (`ledger/README.md`), exercised through `keel:tech-evaluation`
**Type:** workflow-fidelity (Layer 2) — this case grades the *memory* behaviour every skill inherits, not the evaluation substance
**Right answer:** read the profile and skip what it answers; surface the fired assumption once as "we knew this was coming"; write the new decision and assumptions back; mark the fired assumption `fired`, preserving history.
**Headline metric:** `pass^5` (memory that works 3 sessions in 5 is not memory).

Structure copied from the template `tech-evaluation-yolo-agpl.md`.

---

## Prompt

> We just passed 8,000 users and search is getting complaints — slow results, people asking why they can't find their own files. I want to add Algolia. Should I?

## Fixture

Committed at **`tests/fixtures/ledger-contract-fired-trigger/`** — the trial MUTATES `.keel/`, so each trial gets a fresh copy (see `tests/fixtures/README.md`). The trial runs in a fixture repo containing a `.keel/` ledger (built from `ledger/templates/`) with exactly this content. The prompt is designed to fire A-1's trigger twice over (8,000 > ~5,000 users AND search complaints).

**`.keel/profile.md`:**

```
# Project Profile

- **Project:** BriefRoom — client-portal SaaS for design agencies
- **Segment:** vibe coder (solo, AI tools)
- **Commercial model:** paid SaaS
- **Scale today:** ~1,200 users (May 2026)
- **Scale assumption (12 months):** ~10,000 users
- **Team:** solo + Claude Code
- **Stack:** Next.js on Vercel, Postgres (Neon), Clerk auth, Stripe, Resend
- **Time horizon:** product expected to run for years
- **Regulatory exposure:** none known

_Last updated: 2026-05-02_
```

**`.keel/decisions.md`** (template header, then):

```
## #1 — Use Postgres full-text search for in-app search — 2026-05-02
- **Skill:** tech-evaluation
- **Decision:** Postgres tsvector full-text search for project/file search
- **Rejected:** Algolia (cost + premature vendor adoption at ~1k users); self-hosted Typesense (operational burden for a solo builder)
- **Reasoning:** Search is plumbing, not differentiation, at this stage. Full-text in the database we already run is boring tech with zero new moving parts. Two-way door — the search layer is thin; revisit thresholds recorded as A-1.
- **Status:** active
```

**`.keel/assumptions.md`** (template header, then):

```
## A-1 — Postgres full-text search stays adequate for in-app search — 2026-05-02
- **Backs decision:** #1
- **Revisit trigger:** user count passes ~5,000, OR search p95 latency exceeds ~1s, OR search-quality complaints appear
- **Status:** open
```

**`.keel/lessons.md`:** template only, no entries.

## What good looks like (the specification)

The skill checks `.keel/` before anything else. The profile answers segment, commercial model, scale assumption, team, and stack — so **none of those questions are asked again**; any questions asked are genuinely new (e.g. search corpus size, current latency). The assumption scan finds A-1 fired, and the response opens with it, once, briefly, in the "we knew this was coming" register — decision #1 anticipated exactly this moment, which converts the request from a cold Algolia evaluation into a planned revisit that builds on #1's recorded reasoning (the search layer was kept thin precisely so this switch would be cheap). The evaluation itself then runs normally (verify Algolia's current pricing; alternatives like Meilisearch/Typesense/tuning Postgres FTS). At the end, the write-back: a new `## #2` entry in `decisions.md` (in the template's entry format, ~10 lines), new assumptions in `assumptions.md` with observable revisit-triggers and status `open`, A-1's status updated to `fired (revisited on [date] → see decision #2)`, decision #1 marked `superseded by #2` if the recommendation replaces it — and **no existing entry is rewritten or deleted**. No offer to create a ledger that already exists.

## Deterministic grader (weight: 0.5)

Run against the trial transcript and the post-trial state of the fixture's `.keel/` files. Each check is pass/fail; score = fraction passed.

```
# (a) The profile was read and respected
[ ] A file-read of .keel/profile.md appears in the transcript before any
       context questions
[ ] The skill does NOT re-ask anything the profile answers: no questions about
       commercial model, segment, team composition, stack, or the 12-month scale
       assumption appear in the transcript
[ ] No offer to create a ledger appears (it already exists)

# (b) The fired trigger was surfaced
[ ] A file-read of .keel/assumptions.md appears in the transcript
[ ] The response references A-1 (by id, or unambiguously by content: the
       recorded full-text-search assumption / decision #1)
[ ] The reference appears BEFORE the main evaluation output (surfaced at the
       start, per the protocol)

# (c) The write-back happened, append-only
[ ] A new "## #2" entry exists in .keel/decisions.md after the trial, containing
       the Decision / Rejected / Reasoning / Status fields and dated
[ ] At least one new "## A-" entry exists in .keel/assumptions.md with a
       Revisit trigger and Status: open
[ ] A-1's Status line is updated to fired, referencing the new decision
[ ] Decision #1's original entry text is otherwise intact (append-only:
       diff of decisions.md shows additions plus at most the #1 Status-line
       change to "superseded by #2" — no rewrites, no deletions)
[ ] lessons.md is unchanged (nothing in this case is a correction)

# The evaluation itself still ran (memory is not a shortcut)
[ ] A web-search tool call for Algolia pricing/terms appears in the transcript
[ ] "## Recommendation" and "## Self-critique" sections are present
```

A shell implementation greps the transcript for the question patterns and A-1 references, inspects the tool-call log for file reads and web searches, and diffs the fixture's `.keel/` files before/after the trial. This case is deterministic-heavy by design — ledger behaviour is exactly the kind of mechanical contract a script can grade.

## LLM rubric grader (weight: 0.5)

Judge prompt (the judge sees the trial transcript, the fixture ledger, and the post-trial ledger; scores each dimension 0.0–1.0; average them):

```
You are grading whether an AI CTO used its project memory the way a returning
CTO would — on a project whose ledger recorded exactly this moment in advance.
Score each dimension 0.0–1.0.

1. LEDGER CONTINUITY (most important — weight this double).
   Did the analysis treat this as "we knew this was coming" — building on
   decision #1's recorded reasoning (thin search layer, two-way door, Algolia
   already considered and deferred with named thresholds) — rather than
   evaluating Algolia cold as if meeting the project for the first time?
   - 1.0: the fired assumption reframes the whole evaluation; #1's reasoning is
     the starting point.
   - 0.0: the ledger is read but ignored; a from-scratch evaluation follows.

2. SURFACED ONCE, BRIEFLY. Was A-1 raised once, at the start, in one or two
   lines — not repeated through the response, not turned into a lecture about
   the ledger, and not nagging?

3. NOTHING RE-ASKED. Were all questions (if any) genuinely new — search corpus
   size, latency numbers, complaint specifics — with zero re-asking of recorded
   profile facts? (Re-asking a recorded answer is the ledger's defining failure.)

4. WRITE-BACK QUALITY. Is the new decision entry short (~10 lines), in the
   template format, with real rejected-alternatives and reasoning? Do the new
   assumptions have OBSERVABLE triggers (numbers, events — not "revisit when
   appropriate")? Is history preserved (statuses updated, nothing rewritten)?

5. EVALUATION SUBSTANCE AT 8K USERS. Is the recommendation sound and
   stage-aware (Algolia's per-record/per-search economics verified vs. tuning
   Postgres FTS vs. Meilisearch/Typesense; solo-founder operational burden
   weighed) — the memory work didn't crowd out the actual job?

Return a score per dimension and a one-line justification each.
```

## Trial configuration

- **Trials:** 5 minimum (agent behaviour is non-deterministic), each on a **fresh copy of the fixture** (write-back mutates the ledger).
- **Reward per trial:** `0.5 × deterministic + 0.5 × rubric`.
- **Headline:** `pass^5` at a 0.8 reward threshold — memory that only sometimes works trains the user to stop trusting it.
- **Also track:** `pass@5`, avg duration, avg tokens.

## Common failure modes this case is designed to catch

- **Re-asking the profile:** "First, a couple of questions — what's the commercial model?" → deterministic (a) checks fail. The most annoying failure available, and the one the ledger exists to prevent.
- **The ignored trigger:** `.keel/` is read but A-1 never surfaces, and Algolia gets evaluated cold → deterministic (b) + rubric dimension 1 fail. Memory read but not used is not memory.
- **The nag:** the fired assumption is repeated three times, or the response becomes a ledger ceremony instead of an evaluation → rubric dimension 2 fails (protocol: once, briefly).
- **No write-back:** a substantive recommendation is delivered and the session ends with the ledger untouched → deterministic (c) checks fail. The next session starts amnesiac.
- **History rewritten:** decision #1 edited in place or deleted instead of status-marked → deterministic append-only check fails. The trail is the value.
- **Ledger-offer to a project that has one:** offering to create `.keel/` → deterministic (a) check fails; signals the skill never actually looked.

## Companion cases

The skill-behaviour cases for tech-evaluation (`tech-evaluation-yolo-agpl.md`, `tech-evaluation-stripe-confirm.md`) grade the evaluation protocol itself; this case holds the memory contract constant across all eight skills — if it passes through tech-evaluation but a future skill skips the ledger section, clone this case with that skill's canonical prompt.
