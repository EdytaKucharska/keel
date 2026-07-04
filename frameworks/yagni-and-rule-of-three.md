# YAGNI and the Rule of Three

**Altitude:** Tactical.

## What it is

Two distinct principles that reinforce each other. Treat them as a pair.

**YAGNI — You Aren't Gonna Need It.** Don't build what current need doesn't justify. The principle is *about timing*, not value: the feature, the abstraction, the configuration knob may all be good ideas eventually, but eventually is not now. Build them when need is concrete, not when need is hypothetical. The cost of premature work is paid in three places: the time spent building, the time spent maintaining the thing that turned out wrong, and the time spent navigating around it once it's wrong-shaped.

**The rule of three.** Don't extract an abstraction until you've duplicated the underlying thing three times. The first time, just do it. The second time, you'll wince but copy it anyway. The third time, the shape of the abstraction is finally visible — *now* extract it. Extracting earlier guesses at a shape, and premature abstractions are expensive to undo because everything written against them has to be changed when the guess turns out wrong.

The two together: **YAGNI tells you when not to build; the rule of three tells you when not to abstract.** YAGNI is the broader principle; rule of three is its specific application to factoring decisions inside the code.

## Source

**YAGNI** — coined by Ron Jeffries during the early days of Extreme Programming (~1999) and recorded in *Extreme Programming Installed* (Jeffries, Anderson, Hendrickson, 2000). Jeffries's canonical formulation: *"Always implement things when you actually need them, never when you just foresee that you need them."* The phrase itself came from a Kent Beck / Chet Hendrickson exchange on the C3 project — Hendrickson would list capabilities the system would soon need, and Beck would reply *"you aren't going to need it"* to each one. The best modern restatement is [Martin Fowler's bliki entry on YAGNI](https://martinfowler.com/bliki/Yagni.html).

**The rule of three** — popularised by Martin Fowler in *Refactoring* (1999) and attributed in the book to Don Roberts. Fowler's phrasing:

> *"The first time you do something, you just do it. The second time you do something similar, you wince at the duplication, but you do the duplicate thing anyway. The third time you do something similar, you refactor."*

The deeper lineage goes back further — Roberts and Johnson's "Three Examples" pattern (1996) and Biggerstaff's "3-system rule": you can't see the right abstraction until you've built the concrete thing several times.

## When it applies

Load this card when the user is:

- **Proposing a "generic" or "future-proof" abstraction** before the concrete cases exist. Plugin systems with one plugin. Strategy patterns with one strategy. Configurable behaviour with one configuration value.
- **Building "in case we need it later" features.** Multi-tenancy infrastructure before there is a second tenant. Multi-region routing before there is a second region. A roles-and-permissions system before there are two roles.
- **Hearing an engineer say "let's make this flexible so we can…"** That sentence is the YAGNI trigger almost every time. The flexibility costs something concrete now; the case it serves is hypothetical.
- **Designing internal frameworks.** Internal frameworks built ahead of need are the canonical YAGNI failure — they encode the framework author's guess at what the future users will want, and the future users always want something different.
- **Adding configuration knobs to handle "edge cases."** Each knob is a permanent commitment to maintaining N behaviours; YAGNI says don't make the commitment until the edge case is real.

## When it doesn't apply

YAGNI and the rule of three are heuristics for *internal* engineering economy. They have limits.

- **The cost of not abstracting is genuinely catastrophic.** A data model that will be impossible to change once it has production data behind it. A public API contract that external consumers will write code against. An on-disk file format. For these, *one* example is enough to design carefully, because the cost of getting it wrong is paid in migrations, not refactors.
- **Duplication is across system boundaries where coupling is expensive.** Two functions in the same file duplicating logic: rule of three applies, just wait. Two services on opposite sides of a network boundary duplicating logic: the duplication is the contract, and the abstraction would couple them in ways you don't want. The rule of three is about *local* duplication; it's not a universal command to deduplicate.
- **The user is in a regulated context.** When future-proofing is a compliance requirement rather than a wish — audit logging from day one, data-residency knobs before the EU customer, soft-delete because the regulator requires retention — YAGNI is wrong. Compliance work has a real trigger; it's not speculative.
- **The abstraction is cheap to add and the cost of getting it wrong is small.** Some abstractions are reversible weekend work. Don't spend the framework on those — just decide.
- **YAGNI used to skip testing.** Testing isn't abstraction or speculative feature work; it's hygiene. "We don't need tests, YAGNI" is a category error. The framework targets premature *production code*, not the practices that make production code safe to change.

## Worked example

A founder building a B2B SaaS proposes a "settings system": the product currently has three configurable values (notification frequency, default timezone, currency), and the founder's engineer wants to build a generic typed-settings framework — UI for editing, schema migration, per-user override, per-organisation override, audit trail of changes.

The CTO's read: this is the textbook case. Run YAGNI and the rule of three.

> "You have three settings. Each one is two lines of code: a column on the user (or org) row, and a place in the UI where it's edited. Total cost: a few hours, including tests.
>
> What's being proposed is a *system for settings*: a generic schema, a UI that renders any setting type, a versioned migration story, per-user vs. per-org override resolution. That's a week of work, and once it exists, every future setting goes through it — which means every future setting pays the tax of working inside the framework instead of being two lines of code.
>
> YAGNI says: build the three settings as three settings. Hardcode the defaults. Change them in code when they change. The rule of three says: you have *three settings*, which is not three of the same thing — they're three different settings with different shapes (an enum, a string from a fixed list, an ISO 4217 code). Three usages of one shape would trigger an extraction. Three different shapes don't.
>
> Trigger to revisit: when you have ten or more settings that genuinely vary along the same axis (user-editable, schema'd, audited), the abstraction starts paying for itself. Until then, ship the three as three, and put the engineer-week back into the feature work."

The framework redirects the architecturally satisfying answer toward the operationally cheap one. The founder isn't wrong that a settings system is a thing that could exist. They're wrong about whether they need it yet.

## Common misuse

- **YAGNI used to skip writing tests.** Tests aren't a feature you might not need. They're how you change the code without breaking it. "YAGNI for tests" is reading the principle as "skip work" rather than "skip *speculative* work."
- **Rule of three used to justify never abstracting.** The rule says "wait until three," not "never extract." Some teams use the rule to refuse refactoring even after the duplication has been copied seven times. The signal the rule was waiting for has passed; the abstraction is now overdue.
- **YAGNI used to win arguments.** "You don't need that, YAGNI" deployed against any proposal as a thought-terminator. The framework is an evaluation criterion, not a veto stamp. The right form is *"What concrete need triggers this? If we can't name one, this is YAGNI."*
- **Treating "three" as exact.** The rule of three is a heuristic for *when the shape is visible*. Sometimes the shape is visible at two examples (especially if the two are obviously the same shape with different parameters); sometimes it isn't visible at five. Use the number as a default, not a ritual.
- **YAGNI weaponised to refuse to think ahead at all.** Some decisions *are* one-way doors (see [two-way-doors-vs-one-way-doors.md](two-way-doors-vs-one-way-doors.md)) and deserve thinking ahead about. YAGNI is about speculative *building*, not about speculative *thinking*. The thinking is cheap; the building is what to defer.

## How to cite it in a skill's output

When the skill invokes the framework, the persona phrases it something like:

- "**You don't need this yet — here's the trigger that says you do.**" (The operational form: YAGNI is paired with the named trigger that would reverse the recommendation.)
- "What's the concrete need this is solving today? If we can't name it, it's YAGNI — build it when the need is real."
- "Rule of three: you've got one. Wait until you've copied the same thing twice more before you extract it. The shape of the abstraction isn't visible yet — guessing now will cost more than the duplication you'd avoid."
- "Generic plugin systems with one plugin are a YAGNI flag. Build the one plugin as one plugin; let the framework emerge when the second and third arrive — *if* they arrive."
- "This is buying flexibility you don't have a use for yet, at a cost you do."
