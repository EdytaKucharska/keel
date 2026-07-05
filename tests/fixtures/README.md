# Eval fixtures

Committed props for the repo-aware eval cases in `../eval-cases/`. Each fixture is a small, plausible project a trial runs *against* — the skill reads these files; the graders then check what it found (or correctly didn't find).

| Fixture | Eval case | What it is |
|---|---|---|
| `deep-review-prelaunch-gaps/` | `deep-review-prelaunch-gaps.md` | A Claude-Code-flavoured Express + Postgres document-summariser with six planted issues (committed secrets, no backups, hand-rolled auth, sync per-request AI call, unpaginated/unindexed list, console.log-only errors). Every planted issue is genuinely present so the deterministic checks are outcome-based. |
| `deep-review-sound-codebase/` | `deep-review-sound-codebase.md` | The same shape of app, genuinely clean on the entire needed-yesterday checklist. Any needed-yesterday finding a trial produces here is by construction manufactured. Its only honest findings are the two planted defer-with-trigger items (no feature flags; Postgres full-text search). |
| `ledger-contract-fired-trigger/` | `ledger-contract-fired-trigger.md` | A project with an existing `.keel/` ledger whose open assumption A-1 fires on the eval prompt (8,000 users > the recorded ~5,000 trigger). |

## Rules for runners

- **No answer keys inside fixtures.** The skill under test READS the fixture files, so they deliberately contain no eval-referencing comments — the planted-issue documentation lives only in this README and the eval-case files. Copy **only the fixture directory** into the trial workspace; copying this README (or the case file) alongside it leaks the answers and invalidates the trial.
- **These are props, not applications.** They are not meant to be installed or run; dependency versions and code are plausible rather than tested. Graders inspect the *transcript and tool calls*, not fixture execution.
- **The "secrets" are fake.** `deep-review-prelaunch-gaps/.env` is committed *deliberately* — that's planted issue #1 — and every value in it is an obvious placeholder. Never put a real credential in a fixture.
- **Copy, don't run in place.** Run each trial against a fresh copy of the fixture in a scratch directory — especially `ledger-contract-fired-trigger/`, whose whole point is that the skill *mutates* `.keel/` (the grader diffs it before/after). A second trial on a dirty copy grades the previous trial's output.
- Keep fixtures in sync with the `## Fixture` section of their eval case — the case file is the specification; this directory is its committed instantiation.
