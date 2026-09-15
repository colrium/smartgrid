# Agent Handoff Instructions: Keystatic Page Builder

---

You are implementing the Keystatic page builder in the SmartGrid Surveying landing page.
Read `AGENTS.md`, `CLAUDE.md`, and `docs/keystatic-page-builder/plan.md` before changing code.
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
2. Open `docs/keystatic-page-builder/plan.md` and update the affected milestone to `IN PROGRESS`.
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
11. Run the narrowest useful validation immediately after a substantive edit(> 1000 loc changed). At minimum, run
    `yarn typecheck` and `yarn lint` before closing a milestone; 
12. Only run `yarn build` as final check when all milestones are complete or there are routing/configuration changes.
13. Update the plan checklist and append a dated status-log entry containing files changed,
    validation, decisions, and blockers.
14. When done with a task automatically start on the next

## Your First/Next task

Start with the next task whose status is "NOT STARTED" in the plan only if one of the following:

1. There is no task with status "IN PROGRESS" and no decision/blocker remains OR 
2. The "IN PROGRESS" task changes will not affect the next changes.

OTHERWISE PROMPT AND CONFIRM WITH ME FIRST.

### Example scenarios on how to decide which task/action to pick (following the plan). 

a. If M1 status is "DONE" and there are no decision/blocker remains for M1 in the plan and M2 task status is "NOT STARTED"  then start with M2.
b. If M2 status is "IN PROGRESS" only proceed with M3("NOT STARTED") only if M2 changes do not affect/block in any way M3 AND after confirming with USER.
c. If M2 status is "IN PROGRESS" and changes affect/block M3("NOT STARTED") prompt USER and WAIT for either for user confirmation or M2 to complete(Poll/check M2 status in the plan every 1 minute to check if "DONE"). 


Do not jump any incomplete task unless asked by user to do so. e.g. Do not continue to registering every component before the config and content contract are stable.
When a task is complete, record its exit-criteria validation and continue to the next task only if no decision or blocker remains. e.g.


## Handoff Format

At the end of the session, report:

- milestone and checklist items completed;
- files changed;
- commands run and their results;
- decisions made or still required;
- blockers and the exact next action;
- the next plan milestone to pick up.

Keep the final report concise, but leave the plan accurate enough that another agent can resume without reconstructing the session from chat history.


# Agent Handoff Instructions: Keystatic Page Builder

---

You are implementing the Keystatic page builder in the SmartGrid Surveying landing page.
Read `AGENTS.md`, `CLAUDE.md`, and `docs/keystatic-page-builder/plan.md` before changing code.
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
2. Open `docs/keystatic-page-builder/plan.md` and update the affected milestone to `IN PROGRESS`.
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
11. Run the narrowest useful validation immediately after a substantive edit(> 1000 loc changed). At minimum, run
    `yarn typecheck` and `yarn lint` before closing a milestone; 
12. Only run `yarn build` as final check when all milestones are complete or there are routing/configuration changes.
13. Update the plan checklist and append a dated status-log entry containing files changed,
    validation, decisions, and blockers.
14. When done with a task automatically start on the next

## Your First/Next task

Start with the next task whose status is "NOT STARTED" in the plan only if one of the following:

1. There is no task with status "IN PROGRESS" and no decision/blocker remains OR 
2. The "IN PROGRESS" task changes will not block/affect the next changes.

OTHERWISE ASK FOR CONFIRMATION FOR ONE OF THE FOLLOWING:
    - Pick up, Evaluate progress and resume "IN PROGRESS" task
    - Wait for M2 to complete(Poll/check M2 status in the plan every 1 minute to check if "DONE")
    - Proceed with M3("NOT STARTED") task

### Example scenarios on how to decide which task/action to pick first/next (following the plan). 

a. If M1 status is "DONE" and there are no decision/blocker remains for M1 in the plan and M2 task status is "NOT STARTED"  then start with M2.
b. If M2 status is "IN PROGRESS" only proceed with M3("NOT STARTED") only if M2 changes do not affect/block in any way M3 AND after confirming with USER.
c. If M2 status is "IN PROGRESS" and changes affect/block M3("NOT STARTED") ask and WAIT for confirmation to take one of the following: 
    - Pick up, Evaluate progress and resume the M2 "IN PROGRESS" task OR
    - Wait for M2 to complete(Poll/check M2 status in the plan every 1 minute to check if "DONE") OR
    - Proceed with M3("NOT STARTED") task


Do not jump any incomplete task unless asked by user to do so. e.g. Do not continue to registering every component before the config and content contract are stable.
When a task is complete, record its exit-criteria validation and continue to the next task only if no decision or blocker remains. e.g.


## Handoff Format

At the end of the session, report:

- milestone and checklist items completed;
- files changed;
- commands run and their results;
- decisions made or still required;
- blockers and the exact next action;
- the next plan milestone to pick up.

Keep the final report concise, but leave the plan accurate enough that another agent can resume without reconstructing the session from chat history.