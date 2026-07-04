#!/usr/bin/env bash
# Keel ledger session digest — SessionStart hook.
# If the project has a .keel/ ledger, print a five-line digest so the session
# starts with decision memory ambient. Silent no-op when there is no ledger.
set -euo pipefail

LEDGER_DIR="${CLAUDE_PROJECT_DIR:-.}/.keel"
[ -d "$LEDGER_DIR" ] || exit 0

decisions=0
open_assumptions=0
lessons=0

[ -f "$LEDGER_DIR/decisions.md" ] && decisions=$(grep -c '^## #' "$LEDGER_DIR/decisions.md" || true)
[ -f "$LEDGER_DIR/assumptions.md" ] && open_assumptions=$(grep -c '^\- \*\*Status:\*\* open' "$LEDGER_DIR/assumptions.md" || true)
[ -f "$LEDGER_DIR/lessons.md" ] && lessons=$(grep -c '^## L-' "$LEDGER_DIR/lessons.md" || true)

echo "=== KEEL LEDGER (.keel/) ==="
echo "Decisions on record: ${decisions} | Open assumptions: ${open_assumptions} | Lessons: ${lessons}"
if [ "$open_assumptions" -gt 0 ] && [ -f "$LEDGER_DIR/assumptions.md" ]; then
  echo "Open assumptions (check whether any trigger has fired before advising):"
  grep -B2 '^\- \*\*Status:\*\* open' "$LEDGER_DIR/assumptions.md" | grep '^## A-' | head -5 | sed 's/^## /  - /'
fi
echo "Consult .keel/profile.md before asking context questions; append decisions and assumptions after recommending."
