# Keystatic Page Builder Implementation Plan

## Purpose

Replace the removed Sanity content workflow with a Keystatic-backed page builder for the
SmartGrid landing page. Editors should be able to create, reorder, edit, and remove reusable
page sections, while each translatable field supports the existing `en` and `sw` locales.
Existing locale JSON remains the default content source during the migration and a page must
not regress when an optional Keystatic value is absent.

This plan is intentionally implementation-oriented. It is the shared progress record for agents
and humans working on the page builder.

## Current Baseline

- Keystatic packages are installed: `@keystatic/core` and `@keystatic/next`.
- `keystatic.config.ts` contains a prototype `pages` collection with `heroSurveying` and
  `servicesGrid` branches, but uses placeholder GitHub storage values.
- The admin route exists at `src/pages/keystatic/[[...params]].tsx` and is protected in
  production by `middleware.ts` using `KEYSTATIC_ADMIN_USER` and `KEYSTATIC_ADMIN_PASSWORD`.
- Keystatic readers/utilities exist in `src/lib/keystatic/` but are not yet connected to the
  localized site pages.
- `src/components/ui/` has reusable UI components and
  `src/components/sections/shared/` has reusable page sections; most are not yet registered.
- No `content/pages/` tree exists yet.
- The installed TypeScript baseline currently passes with `yarn typecheck`.
- The old Sanity references in project documentation must be removed or explicitly marked as
  historical; Sanity is not part of the active runtime workflow.

## Decisions To Confirm Before Production

Record the decision and date in the status log before implementing the relevant milestone.

- [ ] Storage mode: local filesystem for development plus GitHub storage for deployed editing,
      or another supported Keystatic storage strategy.
- [ ] Canonical page URL model: locale-prefixed routes such as `/en/about`, default-locale
      redirects, and the relationship between a page slug and a Next.js route.
- [ ] Migration policy: Keystatic overrides locale JSON immediately, or pages opt in one at a
      time using a source/mode field.
- [ ] Media policy: existing `public/` paths only, Keystatic-managed assets, or both.
- [ ] Publish policy: direct commits, pull requests, preview-only editing, and who can access
      production administration.

## Milestones

Status values: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `DONE`.
Update the status in this document when work begins or ends; do not infer progress from git
history alone.

### M0: Contract and Inventory

**Status: DONE**

- [x] Confirm the active framework, locale set, Keystatic package versions, route, middleware,
      utilities, and existing component directories.
- [x] Identify prototype assumptions and absent `content/pages/` storage.
- [x] Define the page-builder boundary: Keystatic owns structured page composition; shared
      components remain the rendering implementation.
- [x] Document the migration and source-precedence decisions that still require confirmation.

**Exit criteria:** the team agrees on the data shape, route model, storage mode, and fallback
behavior before broad schema work starts.

### M1: Make Keystatic Configuration Production-Safe

**Status: NOT STARTED**

Dependencies: M0 decisions.

- [ ] Verify the installed Keystatic APIs against the package versions; remove invalid or
      speculative config fields rather than suppressing type errors.
- [ ] Implement environment-driven storage configuration with safe local development defaults;
      never commit repository owner/name placeholders or credentials.
- [ ] Define the `pages` collection shape, slug rules, page metadata, draft/publish behavior,
      and locale field helpers.
- [ ] Add a checked-in starter page fixture under `content/pages/` only after the schema is
      validated.
- [ ] Add focused config/reader checks that prove a page can be read in development and that
      malformed content fails clearly.

**Exit criteria:** `yarn typecheck`, `yarn lint`, and a local Keystatic admin smoke test pass;
creating and reading one page works without GitHub credentials in local mode.

### M2: Build the Component Registry and Schema Factories

**Status: NOT STARTED**

Dependencies: M1 page and locale contracts.

- [ ] Inventory `src/components/sections/shared/**/*.tsx` and `src/components/ui/**/*.tsx`.
- [ ] Classify components as page-builder sections, nested controls, layout-only primitives, or
      runtime-only/client-only components. Do not expose every UI primitive automatically.
- [ ] Define stable component IDs, labels, versioning rules, and a registry module. The registry
      must be the single source for the Keystatic branch options and the renderer map.
- [ ] Create reusable schema factories for localized text, rich text/Markdoc, links, images,
      arrays, optional fields, and section settings.
- [ ] Register only components with a serializable, editor-friendly data contract. Document why
      each excluded component is not directly editable.
- [ ] Keep the registry independent of browser-only modules and heavy visual dependencies so the
      Keystatic config can load in Node.

**Exit criteria:** every registered branch has a typed schema, an editor label, a renderer, and
an example payload; unknown component IDs produce a controlled error.

### M3: Implement the Rendering Pipeline

**Status: NOT STARTED**

Dependencies: M2 registry and content contract.

- [ ] Add a page resolver that reads a Keystatic page by slug and resolves locale data with
      explicit fallback semantics.
- [ ] Add a page-builder renderer that maps section IDs to registered React components and passes
      normalized props, keys, page context, and locale.
- [ ] Preserve the existing next-i18next locale behavior for pages still served from locale JSON.
- [ ] Add a feature/source switch so migration can happen page by page without changing public
      URLs or duplicating route logic.
- [ ] Handle missing, malformed, unpublished, and unknown sections with safe errors or a visible
      development diagnostic rather than a blank page.
- [ ] Keep client-only sections dynamic and preserve existing performance conventions.

**Exit criteria:** one real localized route renders a Keystatic page end to end, and a legacy
locale-backed route still renders unchanged.

### M4: Migrate Content Incrementally

**Status: NOT STARTED**

Dependencies: M3 rendering pipeline and confirmed migration policy.

- [ ] Select one representative page with a hero, repeated items, links, media, and at least one
      optional section as the pilot.
- [ ] Create a repeatable migration script or documented mapping for locale JSON to Keystatic
      content. Preserve URLs, slugs, IDs, image paths, and numbers exactly.
- [ ] Migrate pages in small batches, recording each page and its source of truth in the status
      log.
- [ ] Keep `en` and `sw` complete and structurally aligned; do not silently fall back when a
      translation is required for publishing.
- [ ] Remove obsolete Sanity-only code and docs only after no runtime or migration dependency
      remains.

**Exit criteria:** the pilot and at least one content-heavy page match the legacy output in both
locales, with no broken links or missing media.

### M5: Editor Experience, Security, and Operations

**Status: NOT STARTED**

Dependencies: M1 through M4 as applicable; security work may proceed in parallel with M2.

- [ ] Replace development-only assumptions in the admin route and document local versus
      deployed access.
- [ ] Validate Basic Auth behavior, missing credentials, proxy behavior, and production headers;
      never log passwords or authorization values.
- [ ] Document GitHub App/repository setup, required environment variables, branch/PR behavior,
      and rollback procedure.
- [ ] Add editor-facing labels, descriptions, sensible defaults, and validation messages.
- [ ] Define media upload limits, allowed formats, and accessibility requirements such as image
      alt text and heading order.

**Exit criteria:** an authorized editor can safely create, preview, update, and remove a page in
an environment representative of deployment, and an unauthorized request is rejected.

### M6: Verification and Cutover

**Status: NOT STARTED**

Dependencies: M4 and M5.

- [ ] Add automated tests for locale fallback, schema normalization, registry coverage, route
      resolution, unknown sections, and malformed content.
- [ ] Run `yarn lint`, `yarn typecheck`, and `yarn build`; verify the sitemap and all migrated
      locale routes.
- [ ] Perform keyboard, responsive, and visual checks in the editor and rendered pages.
- [ ] Measure page performance for representative pages, especially pages containing images,
      animation, maps, or 3D components.
- [ ] Record the migration completion date, known limitations, and rollback point.
- [ ] Update README, `AGENTS.md`, `CLAUDE.md`, and any operator documentation to match the final
      implementation.

**Exit criteria:** the page builder is the documented source for migrated pages, quality gates
pass, and rollback instructions are tested.

## Parallel Workstreams

These may proceed independently after their stated dependencies are met:

- **Schema work:** locale helpers, field factories, and component contracts after M1.
- **Registry work:** component inventory and registry metadata after M0; renderer integration waits
  for M2 contracts.
- **Security/operations:** environment variable and deployment documentation after the storage
  decision; production auth testing can happen before content migration.
- **Migration tooling:** mapping analysis can begin after the locale contract is fixed; execution
  waits for the renderer.
- **Testing:** contract tests can be added alongside each milestone rather than deferred to M6.

## Definition Of Done

The feature is complete when all of the following are true:

- Keystatic config uses valid installed APIs and has no placeholders or committed secrets.
- A documented registry connects approved shared components to both schema branches and renderers.
- Pages can be edited as ordered reusable sections with localized `en`/`sw` content.
- Public routes preserve their current URL and locale behavior during and after migration.
- Existing locale JSON has an explicit, tested fallback or migration role.
- Admin access, storage, publishing, media, and rollback behavior are documented and tested.
- `yarn lint`, `yarn typecheck`, and `yarn build` pass for the final implementation.

## Progress Update Protocol

For every implementation change:

1. Set the affected milestone to `IN PROGRESS` before starting.
2. Add a short dated entry to the log below with the files changed, validation run, and any
   blocker or decision.
3. Mark individual checklist items `[x]` only when the code and its verification are complete.
4. Use `BLOCKED` when work cannot continue; state the exact blocker and the smallest decision or
   input needed to unblock it.
5. Mark a milestone `DONE` only when its exit criteria pass. If later work invalidates it, change
   it back to `IN PROGRESS` and explain why in the log.
6. Keep this plan updated in the same change as the implementation whenever practical.

### Status Log

| Date | Milestone | Change | Validation / Decision | Owner |
| --- | --- | --- | --- | --- |
| 2026-09-13 | M0 | Baseline inventory and plan created | `yarn typecheck` passes; config/content gaps recorded | |
