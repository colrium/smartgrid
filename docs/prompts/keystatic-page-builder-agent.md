# Agent Handoff Prompt: Keystatic Page Builder

Copy the prompt below into a new agent session when starting or resuming implementation.

---

You are implementing the Keystatic page builder in the SmartGrid Surveying landing page.
Read `AGENTS.md`, `CLAUDE.md`, and `docs/keystatic-page-builder-plan.md` before changing code.
The plan is the shared source of truth for milestones, dependencies, acceptance criteria, and
progress updates.

## Repository Context

- Next.js 16 Pages Router, React 19, TypeScript, Tailwind CSS v4.
- Locales are `en` and `sw`; existing locale content is under `public/locales/<locale>/`.
- Keystatic dependencies are already installed: `@keystatic/core` and `@keystatic/next`.
- The prototype config is `keystatic.config.ts`.
- The admin route is `src/pages/keystatic/[[...params]].tsx`.
- Production middleware protection is in `middleware.ts`.
- Keystatic utilities are in `src/lib/keystatic/`.
- Reusable UI components are under `src/components/ui/**/*.tsx`.
- Candidate shared page sections are under `src/components/sections/shared/**/*.tsx`.
- The prototype assumes `content/pages/`, but that directory does not yet exist.
- Do not reintroduce Sanity. Do not edit root route proxies when the real localized page is under
  `src/pages/[locale]/`.

## Objective

Implement a maintainable, typed page-builder system in which approved shared section components
can be selected, ordered, configured, localized, and rendered from Keystatic content. The existing
next-i18next locale JSON must remain the default content source during migration, with explicit
and tested fallback/source-precedence behavior.

## Required Workflow

1. Inspect the current code and the installed Keystatic package API before making assumptions.
2. Open `docs/keystatic-page-builder-plan.md` and update the affected milestone to `IN PROGRESS`.
3. State the smallest falsifiable implementation hypothesis and the focused check that will test it.
4. Make the smallest coherent change. Preserve unrelated working-tree changes.
5. Register a component only if it has a serializable, editor-friendly data contract and a safe
   renderer. Do not automatically expose browser-only or layout-only UI primitives.
6. Keep the component registry as the single source for editor options and renderer mappings.
7. Use reusable schema helpers for localized text, rich text, links, media, arrays, and optional
   fields. Preserve `en`/`sw` structure and copy non-text values exactly during migration.
8. Ensure unknown, missing, malformed, and unpublished sections fail safely and diagnostically.
9. Never commit credentials, placeholder production repository values, or `.env.local`.
10. Add or update focused tests/checks with each behavior change.
11. Run the narrowest useful validation immediately after each substantive edit. At minimum, run
    `yarn typecheck` and `yarn lint` before closing a milestone; run `yarn build` for final or
    routing/configuration changes.
12. Update the plan checklist and append a dated status-log entry containing files changed,
    validation, decisions, and blockers.

## First Task

Start with M1 in the plan:

- Verify the installed Keystatic APIs and explain any invalid prototype fields.
- Decide or request the storage mode only if the repository cannot establish it from existing
  configuration; local development must remain possible without GitHub credentials.
- Make `keystatic.config.ts` valid, environment-safe, and explicit about the page/locale contract.
- Add the smallest starter page fixture only after the config is validated.
- Confirm the admin route and reader can load the starter page.

Do not jump to registering every component before the config and content contract are stable.
When M1 is complete, record its exit-criteria validation and continue to M2 only if no decision
or blocker remains.

## Handoff Format

At the end of the session, report:

- milestone and checklist items completed;
- files changed;
- commands run and their results;
- decisions made or still required;
- blockers and the exact next action;
- the next plan milestone to pick up.

Keep the final report concise, but leave the plan accurate enough that another agent can resume
without reconstructing the session from chat history.
