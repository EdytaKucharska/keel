# The Keel Ledger

> Decision memory for a project. This is what turns four consultations into a CTO who remembers you.

Every Keel skill produces recommendations that rest on named assumptions ("this works if you stay under 10k users") with revisit-triggers ("revisit when reports start blocking the primary database"). Without memory, those bookmarks evaporate when the session ends. The ledger is where they live: a `.keel/` directory of plain Markdown in the **user's project**, readable by the user, written and consulted by the skills.

The ledger is *decision* memory, not episodic memory. It does not record what happened in a session (tools like claude-mem do that well — see `../ecosystem-tools.md`). It records **what was decided, why, under which assumptions, and when to revisit** — the things a returning CTO would ask about first.

## Layout

```
.keel/                  # in the user's project root
├── profile.md          # who this project is — asked once, read by every skill
├── decisions.md        # ADR-lite log: choice, alternatives rejected, reasoning
├── assumptions.md      # "this works if…" ledger with explicit revisit-triggers
└── lessons.md          # corrections captured so they aren't repeated
```

Templates for all four files are in [`templates/`](templates/). Skills copy them when creating a ledger.

## Protocol — what every skill does

**At the start of an invocation (repo-aware surface):**

1. Check for `.keel/` in the project root. If absent, proceed normally — and at the end, offer once to create it. Respect a no; don't re-offer in the same session.
2. If `profile.md` exists, read it and **skip every context question it already answers.** Re-asking a recorded segment or commercial model is the ledger equivalent of re-running a brainstorm after a handoff — the most annoying failure available. If the user's request contradicts the profile (profile says solo, user says "my team"), confirm the change and update the profile rather than silently believing either.
3. If `assumptions.md` exists, scan the **open** assumptions. If anything in the current conversation fires a recorded revisit-trigger, surface it once, briefly, at the start: *"Before your question — the ledger has an open assumption that just fired: [X]. Want me to fold that into this analysis, or park it?"* Never more than one interruption per invocation; if multiple triggers fire, name the most consequential and list the rest in one line.

**At the end of an invocation (after a substantive recommendation):**

4. Append the decision to `decisions.md` using the template's entry format — the choice, the 1–2 alternatives rejected, the one-paragraph reasoning, the date, the skill that produced it.
5. Append each load-bearing assumption to `assumptions.md` with its revisit-trigger, status `open`.
6. When a prior decision is revisited and changed, don't edit history: mark the old entry `superseded by #N` and add the new one. The trail is the value.

**On the conversational surface (no filesystem):** skip all of this silently. Never ask a chat-only user to paste ledger files.

## Rules

- **Plain Markdown, human-readable, no tooling required.** The user must be able to open any ledger file and understand it — the ledger is *their* record, not the plugin's database.
- **Append, don't rewrite.** History is the point. The only in-place edits are status fields (`open` → `revisited` / `superseded`) and profile updates.
- **Short entries.** A decision entry is ~10 lines. If it needs more, the reasoning belongs in the conversation; the ledger stores the conclusion.
- **The user can decline.** The ledger is offered, never imposed. A project without `.keel/` gets the same advice — it just doesn't accumulate.
- **Never store secrets** — no API keys, no customer data, no credentials. It's a decision log, and it may be committed to a repo.

## The session digest hook

`hooks/session-digest.sh` (wired in `hooks/hooks.json`) runs at SessionStart: if `.keel/` exists, it prints a five-line digest — decision count, open assumptions, and any assumption older than 90 days (stale-check). This makes the memory *ambient*: the model starts every session knowing the ledger exists and what's open, and the **user** decides when to act. Keel deliberately does not interject beyond this digest (see ROADMAP: "aggressive proactive interjection — feasible; taste says no").
