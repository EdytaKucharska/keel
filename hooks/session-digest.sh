#!/usr/bin/env bash
# Keel ledger session digest — SessionStart hook.
# If the project has a .keel/ ledger, print a five-line digest so the session
# starts with decision memory ambient. Silent no-op when there is no ledger.
set -euo pipefail

LEDGER_DIR="${CLAUDE_PROJECT_DIR:-.}/.keel"
[ -d "$LEDGER_DIR" ] || exit 0

# Count real entries only: headers carry a number (## #1, ## A-1, ## L-1), so the
# placeholder examples inside the templates' <!-- Entry format --> comments
# (## #N, ## A-N, ## L-N) don't inflate the counts.
count() {
  if [ -f "$1" ]; then grep -c "$2" "$1" || true; else echo 0; fi
}

decisions=$(count "$LEDGER_DIR/decisions.md" '^## #[0-9]')
open_assumptions=$(count "$LEDGER_DIR/assumptions.md" '^- \*\*Status:\*\* open$')
lessons=$(count "$LEDGER_DIR/lessons.md" '^## L-[0-9]')

echo "=== KEEL LEDGER (.keel/) ==="
echo "Decisions on record: ${decisions} | Open assumptions: ${open_assumptions} | Lessons: ${lessons}"
if [ "$open_assumptions" -gt 0 ] && [ -f "$LEDGER_DIR/assumptions.md" ]; then
  echo "Open assumptions (check whether any trigger has fired before advising):"
  awk '/^## A-[0-9]/ { header = substr($0, 4) } /^- \*\*Status:\*\* open$/ { if (header != "") print "  - " header }' \
    "$LEDGER_DIR/assumptions.md" | head -5
fi
echo "Consult .keel/profile.md before asking context questions; append decisions and assumptions after recommending."
