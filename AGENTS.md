# Agent Instructions

## Build Commands

Use `bun` for project builds and package scripts.

Do not run the full build as the default validation step after every change.
Prefer a focused typecheck or a route-level check first. Run the full build
only when the user asks for it or when the change specifically needs build
output validation.

## Domain Types

Every domain module should keep its exported domain-specific types in a sibling `*.types.ts` file. For example, diet types belong in `src/domain/diet.types.ts`, not in another domain's type file or only in `src/domain/diet.ts`.

## Commit Messages

Every commit message must start with a relevant emoji prefix.

Use the existing commit history for examples, such as:

- `📝 Add update about Sarvam open-sourcing models`
- `🎨 Style TrustedBy logos with flex layout, add subtitle`
- `🪛 Fix typing issues`

Prefer the emoji categories documented in `CLAUDE.md`, and keep the rest of the message concise, present tense, and without a trailing period.
