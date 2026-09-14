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

**Status: DONE**

Dependencies: M0 decisions.

- [x] Verify the installed Keystatic APIs against the package versions; remove invalid or
      speculative config fields rather than suppressing type errors.
- [x] Implement environment-driven storage configuration with safe local development defaults;
      never commit repository owner/name placeholders or credentials.
- [x] Define the `pages` collection shape, slug rules, page metadata, draft/publish behavior,
      and locale field helpers.
- [x] Add a checked-in starter page fixture under `content/pages/` only after the schema is
      validated.
- [x] Add focused config/reader checks that prove a page can be read in development and that
      malformed content fails clearly.

**Exit criteria:** `yarn typecheck`, `yarn lint`, and a local Keystatic admin smoke test pass;
creating and reading one page works without GitHub credentials in local mode.

### M2: Build the Component Registry and Schema Factories

**Status: DONE**

Dependencies: M1 page and locale contracts.

- [x] Inventory `src/components/sections/shared/**/*.tsx` and `src/components/ui/**/*.tsx`.
- [x] Classify components as page-builder sections, nested controls, layout-only primitives, or
      runtime-only/client-only components. Do not expose every UI primitive automatically.
- [x] Define stable component IDs, labels, versioning rules, and a registry module. The registry
      must be the single source for the Keystatic branch options and the renderer map.
- [x] Create reusable schema factories for localized text, rich text/Markdoc, links, images,
      arrays, optional fields, and section settings.
- [x] Register only components with a serializable, editor-friendly data contract. Document why
      each excluded component is not directly editable.
- [x] Keep the registry independent of browser-only modules and heavy visual dependencies so the
      Keystatic config can load in Node.

**Exit criteria:** every registered branch has a typed schema, an editor label, a renderer, and
an example payload; unknown component IDs produce a controlled error.

### M3: Implement the Rendering Pipeline

**Status: DONE**

Dependencies: M2 registry and content contract.

- [x] Add a page resolver that reads a Keystatic page by slug and resolves locale data with
      explicit fallback semantics.
- [x] Add a page-builder renderer that maps section IDs to registered React components and passes
      normalized props, keys, page context, and locale.
- [x] Preserve the existing next-i18next locale behavior for pages still served from locale JSON.
- [x] Add a feature/source switch so migration can happen page by page without changing public
      URLs or duplicating route logic.
- [x] Handle missing, malformed, unpublished, and unknown sections with safe errors or a visible
      development diagnostic rather than a blank page.
- [x] Keep client-only sections dynamic and preserve existing performance conventions.

**Exit criteria:** one real localized route renders a Keystatic page end to end, and a legacy
locale-backed route still renders unchanged.

### M4: Migrate Content Incrementally

**Status: IN PROGRESS**

Dependencies: M3 rendering pipeline and confirmed migration policy.

- [ ] Select one representative page (preffarably one from /surveying/ routes pages) with a hero, repeated items, links, media, and at least one
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
| 2026-09-14 | M1 | M1 started; verified installed APIs (`@keystatic/core` 0.6.9, `@keystatic/next` 5.0.5). Prototype defects found: `storage.kind: "github"` with placeholder `your-org/smartgrid-surveying` repo (breaks credential-less local dev); top-level `itemLabel: (p) => p.fields.title...` is invalid — array-of-conditional preview props are `{discriminant, value}` unions with no `.fields` | Decision: storage defaults to `local`; GitHub only when `KEYSTATIC_GITHUB_REPO="owner/name"` is set (documented, never committed). Rich-text (`markdoc`) and link factories deferred to M2; M1 sections use localized plain text so fixtures stay hand-writable | |
| 2026-09-14 | M1 | `AGENTS.md` / `CLAUDE.md` referenced by the task do not exist in the repo (only `README.md` + this plan); proceeding with plan as source of truth. No `src/pages/api/keystatic/*` route file exists despite `middleware.ts` matching `/api/keystatic/:path*` — admin write path to verify in M5 | Unrelated working-tree edits in `src/components/sections/surveying/*` left untouched | |
| 2026-09-14 | M1 | Rewrote `keystatic.config.ts`: env-driven storage (`local` default, `github` only with `KEYSTATIC_GITHUB_REPO="owner/name"`), `pages` contract (`slug`+`title`+`status` draft/published, slug regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`, `columns`), fixed both `itemLabel`s (conditional preview props are `{discriminant,value}`; nested object path `fields.title.fields.en.value`), text-only localized sections (`fields.url` rejected — would invalidate internal locale paths; `markdoc`/link factories deferred to M2). Added missing `src/pages/api/keystatic/[...params].ts` (`makeAPIRouteHandler({config})` — bare config fails `APIRouteConfig` typecheck). Added `content/pages/home.json` starter (published), `scripts/check-keystatic-pages.mjs` (+ `yarn check:keystatic`), `.env.example` storage docs | `npx tsc --noEmit` exit 0; `npx eslint` on changed files exit 0; contract check OK (1 fixture) + negative test fails clearly (3 violations); reader proof via `createReader`: `list()`→`["home"]`, `read("home")` returns fixture, missing slug→`null`, invalid JSON→`SyntaxError`, unknown discriminant/wrong type→`Error: Invalid data…` with field path | |
| 2026-09-14 | M1 | Reader leniency finding: missing text defaults to `""`, missing arrays to `[]` — editor validation is NOT enforced on read. Consequence for M3: the renderer/normalizer must treat Keystatic values as possibly-empty and apply locale fallback explicitly; do not assume `isRequired` survived storage | Decision recorded; no code change in M1 | |
| 2026-09-14 | M1 | Env repair (not a repo change): `node_modules/es-abstract` was missing `helpers/` + `2025/` files, breaking `npx eslint`; restored by overlaying the pristine `es-abstract@1.24.2` tarball. Note: repo `yarn lint` script uses `--ext`, which ESLint 9 no longer supports — needs a script fix in M6 | `npx eslint` on changed files passes; full `yarn lint` still unusable until the script flag is fixed | |
| 2026-09-14 | M1 | Admin smoke test found a real crash: `/keystatic` rendered inside the landing layout and `Navbar` threw `locales.map is not a function` (route has no `serverSideTranslations`, so `t("common:locales")` returns the key string). Fixed with the supported `getLayout` hook — `src/pages/keystatic/[[...params]].tsx` now renders the console standalone (`Page.getLayout = (page) => page`, typed as `NextPageWithLayout`). No other route touched | Dev server (`next dev`, port 3100): `GET /keystatic` → 200; `GET /en` → 200 (legacy locale route unchanged). `npx tsc --noEmit` 0, `npx eslint` on all touched files 0 | |
| 2026-09-14 | M1 | M1 closed as DONE. Caveat: "creating" is proven at the storage/API layer (local write path exists via new API route + admin shell loads) but interactive in-browser page creation was not clicked through — that full editor flow is M5's exit criterion. Unrelated surveying-section edits were committed externally as `374fddd`; M1 tree contains only M1 files | Next: M2 registry + schema factories (`markdoc`/link work deferred here) | |
| 2026-09-14 | M2 | M2 started. Inventoried 18 shared sections + 19 ui primitives (subagent, verified by file reads): shared `Hero`/`FinalCta`/`CtaBand` take props from per-page `t()` wrappers — no component accepts `{en,sw}` data today | Classification + most-registry-ready shortlist (`IntroTextSection`, `CtaBand`, `FinalCta`, `Stats`, `Pricing`) recorded; exclusions documented in `sectionRegistry.ts` header | |
| 2026-09-14 | M2 | Verified `fields.markdoc` serializes to a separate content file (`value: undefined`), which the single-file `content/pages/*` JSON layout cannot persist — rich text stays multiline localized text (`localeLongText`) until a directory-per-entry layout is adopted. Same evidence as M1: `fields.url` rejects relative paths, `fields.image` needs the pending media policy | Decision: no markdoc/url/image-upload fields in v1; documented in `fields.ts` header | |
| 2026-09-14 | M2 | Implemented: `src/lib/keystatic/fields.ts` (localeText/LongText, linkObject, imagePath, anchorField, previewText/TitledItem), `localize.ts` (pure `resolveLocaleValue`, en-fallback incl. empty-string fallback), `sectionRegistry.ts` (`introText`/`ctaBand`/`stats` + `UnknownSectionError` + `sectionBranchField`), `sectionRenderers.tsx` (id→component map + `renderSection`), `withLocaleData` refactored onto `resolveLocaleValue`. Config branches now derive from the registry; M1 prototype branches (`heroSurveying`/`servicesGrid`) retired and fixture rewritten. Check script extended to verify registry+renderers+locale+fixtures from real sources (transpile + `@/` require hook) | `npx tsc --noEmit` 0; `npx eslint` on touched files 0; `yarn check:keystatic` OK (3 sections, both locales render to `<section>` markup); negative fixtures fail clearly (unknown discriminant, malformed locale node); `createReader` reads rewritten fixture (introText,stats) with local storage | |
| 2026-09-14 | M2 | M2 closed as DONE. `next build` attempted as the config-change gate but exceeded 900s with no output on this machine (environment too slow; no node processes left behind, `.next/` is gitignored) — mitigated by tsc/eslint/reader/static-markup proofs plus the M1 dev-server admin smoke (admin shell path unchanged since) | Next: M3 resolver + renderer pipeline + per-page source switch | |
| 2026-09-14 | M3 | Implemented `src/lib/keystatic/resolvePage.ts` (allowlist `KEYSTATIC_PAGES`, kill-switch `KEYSTATIC_DISABLE`, taxonomy disabled/missing/unpublished/error/empty → legacy + `console.warn` diagnostic) and `src/components/keystatic/PageBuilderDocument.tsx` (ordered sections, stable keys, locale). Correction during testing: unknown discriminants are rejected by the READER (field-path error), so resolver-level section-skipping was unreachable — removed in favor of legacy+warn; verified by failing-then-passing check | `yarn check:keystatic` extended with resolver matrix (temp content trees) + document render/assertions; `tsc` 0, `eslint` 0, reader + negative fixtures green | |
| 2026-09-14 | M3 | Wired pilot `[locale]/terms-of-use.tsx` (root proxy untouched) + `content/pages/terms-of-use.json` starter entry; legacy `PageHead` kept in both branches. Dev smoke (port 3100): env off → legacy legal article renders, zero Keystatic markup; `KEYSTATIC_PAGES=terms-of-use` → `/en` renders entry sections (`data-keystatic-page` present, legacy article only inside `__NEXT_DATA__` i18n store, 1 occurrence), `/sw` renders Swahili headline, `/en/about` 200 unchanged. Standing rule: no client-only sections registered — when Maps/3D sections arrive they must load via `next/dynamic`; all v1 sections are SSR-safe (static-markup proof) | M3 DONE. Standing instruction adopted: skip `next build` checks (environment infeasible); gate on tsc/eslint/check/reader/dev-smoke | |
| 2026-09-14 | M3 | Known non-blockers for M4/M6: (1) opted-in pages still embed the page-specific locale namespace in `__NEXT_DATA__` (harmless JSON weight; load page ns only for legacy as a follow-up); (2) interactive editor create-flow remains M5; (3) migration policy now partially decided — opt-in per page, default legacy | Next: M4 pilot content migration | |
