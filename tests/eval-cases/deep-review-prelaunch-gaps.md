# Eval: deep-review — pre-launch codebase with real gaps

**Skill under test:** `keel:deep-review`
**Type:** correctness + workflow-fidelity (Layers 2 & 3)
**Right answer:** *not ready for the stated stake — fix these first* — this is the high-value catch.
**Headline metric:** `pass^5` (the protocol must hold every time, not just once).

Structure copied from the template `tech-evaluation-yolo-agpl.md`.

---

## Prompt

> /keel:deep-review — I built this document-summariser SaaS with Claude Code and I'm launching to my waitlist in two weeks. Is it ready?

If running a multi-turn variant, the follow-up answers are: scale today = ~20 beta users; 12-month assumption = ~5,000 paying users; team = solo, AI tools; commercial model = paid SaaS; imminent stake = the waitlist launch (~400 people).

## Fixture

The trial runs in a small fixture repo (no `.keel/` directory) containing a plausible Claude-Code-generated Express + Postgres app with these planted issues:

- `.env` **committed to the repo** containing `OPENAI_API_KEY=sk-...` and `DATABASE_URL=...` (secrets in code).
- **No backup configuration** anywhere — no provider backup notes, no restore drill, nothing in the README.
- `server.js`: a **synchronous per-request OpenAI call** inside the `POST /summarise` handler — no queue, no caching, no batching (load-shape *and* cost).
- `GET /documents` returns **all rows, no pagination**, and the `documents` table has **no index on `user_id`**.
- **Hand-rolled password hashing and session handling** in `auth.js` (custom auth instead of a library).
- Error handling is `console.log` only — no error tracker, no uptime monitoring.

The fixture must genuinely contain each issue so deterministic checks are outcome-based, not keyword luck.

## What good looks like (the specification)

The skill maps the vessel first, then runs all four lenses in ONE pass and returns ONE ranked list ordered by blast radius at this user's stage and stake (a 400-person launch in two weeks, solo founder). It catches the committed secrets, the absent backups, the custom auth, and the per-request AI inference; it **prescribes `/security-review` rather than performing its own vulnerability scan**; the verdict is honest — *not ready for this launch as-is* — with a two-week plan that gets the non-negotiables done before the waitlist email goes out. AI-generated code is treated as prototype-needing-a-pass, never disparaged. Since there is no `.keel/`, it offers once to create one.

## Deterministic grader (weight: 0.5)

Run against the trial transcript. Each check is pass/fail; score = fraction passed.

```
# Correctness — the planted issues must be caught
[ ] Findings include the committed secrets (.env in the repo)
[ ] Findings include the absence of backups (and "tested, not just configured" framing)
[ ] Findings include the hand-rolled auth, with a library/managed alternative named
[ ] Findings include the per-request synchronous AI-inference call (load-shape or cost lens)
[ ] Verdict is "not ready for the stated stake as-is" / fix-first — not a rubber-stamp
       and NOT a rewrite recommendation

# Prescribe, don't rebuild
[ ] Transcript mentions /security-review as the prescribed code-level scanner
       (if it can't run in-session, it appears as the first item of the plan)
[ ] The skill did NOT present its own prose vulnerability scan as a substitute

# Repo-awareness actually happened (retrieval, not guessing)
[ ] File-read tool calls on the fixture's source files appear BEFORE the findings
       (at minimum server.js and auth.js or equivalents)

# One report, bounded
[ ] Ranked findings list contains at most 10 items
[ ] Required sections present (grep for headers): "## Context", "## The map",
       "## Verdict in one paragraph", "## Ranked findings", "## What's sound",
       "## Security posture note", "## Load-shape note", "## Cost note",
       "## Two-week plan", "## Ledger updates", "## Self-critique"

# Ledger contract (no .keel/ in fixture)
[ ] The skill offers once to create the ledger (or creates it on acceptance) —
       and does not repeat the offer after a decline
```

A shell implementation greps the transcript for the required strings/headers and inspects the tool-call log for the file reads. Outcome-based: it checks the planted issues were found and the shape held, not that any specific wording was used.

## LLM rubric grader (weight: 0.5)

Judge prompt (the judge sees the trial transcript and scores each dimension 0.0–1.0; average them):

```
You are grading whether an AI CTO's deep-review followed its intended workflow on a
pre-launch codebase with planted gaps. Score each dimension 0.0–1.0.

1. ONE LIST, RANKED BY BLAST RADIUS AT THE USER'S STAGE (most important — weight
   this double). Did the four lenses merge into a single ranked list ordered by
   blast radius for a solo founder launching to 400 people in two weeks — secrets
   and data-loss first, then launch-stake items, then interest-bearing debt?
   - 1.0: one list; secrets/backups at the top; each item classified
     needed-yesterday vs. defer-with-trigger (with the trigger named).
   - 0.0: four separate mini-reports, or a list ordered by abstract severity
     (CVSS-style) that ignores the stage and the stake.

2. READ, NOT MEASURED. For load-shape findings, did the skill say plainly that it
   was reading, not measuring — naming the trigger load (e.g. at roughly what user
   count the unpaginated query hurts) and how to measure cheaply before acting?

3. PROTOTYPE, NOT BAD CODE. Were AI-generated portions assessed against the three
   tests (understandable / testable / operable) and framed as "prototype code that
   needs a pass" — dignity preserved, no scolding, no rewrite talk?

4. ACTIONABLE FINDINGS. Does every ranked item carry a specific fix, an honest
   effort estimate, and a classification — and does the two-week plan sequence the
   non-negotiables before the launch?

5. SELF-CRITIQUE SUBSTANCE. Does it name what it couldn't inspect, which findings
   are read-not-measured, and whether the ranking flips if the stated scale
   assumption is wrong — rather than boilerplate?

Return a score per dimension and a one-line justification each.
```

## Trial configuration

- **Trials:** 5 minimum (agent behaviour is non-deterministic).
- **Reward per trial:** `0.5 × deterministic + 0.5 × rubric`.
- **Headline:** `pass^5` at a 0.8 reward threshold — does the protocol hold in *all* 5 trials?
- **Also track:** `pass@5`, avg duration, avg tokens (a four-lens repo pass is the most expensive invocation in the plugin — watch it).

## Common failure modes this case is designed to catch

- **Four reports instead of one list:** the skill degenerates into per-lens sections with no merged ranking → rubric dimension 1 fails. This is the regression the "one skill, not four" design exists to prevent.
- **Scanning instead of prescribing:** the skill writes its own vulnerability audit instead of routing to `/security-review` → deterministic prescribe-don't-rebuild checks fail (`ecosystem-tools.md` violation).
- **The 40-finding dump:** everything flagged, nothing ranked, cap ignored → deterministic ≤10 check fails. A report nobody acts on.
- **Moralising / rewrite reflex:** "this AI-generated code is poor quality, consider rebuilding" → rubric dimension 3 fails; persona §9.1/§9.6 violation.
- **Guessing without reading:** findings asserted without file-read tool calls on the fixture → deterministic repo-awareness checks fail. Works today, hallucinates tomorrow.

## Companion case

`deep-review-sound-codebase.md` — the *proceed* case: the same skill pointed at a codebase in genuinely good shape must say so honestly instead of manufacturing findings.
