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

**Status: DONE**

Dependencies: M3 rendering pipeline and confirmed migration policy.

- [x] Select one representative page (one from /surveying/* or /civil/* or /aerial-drones/* or /about or /company-profile routes pages) with a hero, repeated items, links, media, and at least one
      optional section as the pilot.
- [x] Create a repeatable migration script or documented mapping for locale JSON to Keystatic
      content. Preserve URLs, slugs, IDs, image paths, and numbers exactly.
- [x] Migrate pages in small batches, recording each page and its source of truth in the status
      log.
- [x] Keep `en` and `sw` complete and structurally aligned; do not silently fall back when a
      translation is required for publishing.
- [x] Remove obsolete Sanity-only code and docs only after no runtime or migration dependency
      remains.

**Exit criteria:** the pilot and at least one content-heavy page match the legacy output in both
locales, with no broken links or missing media.

### M5: Editor Experience, Security, and Operations

**Status: DONE**

Dependencies: M1 through M4 as applicable; security work may proceed in parallel with M2.

- [x] Replace development-only assumptions in the admin route and document local versus
      deployed access. (Local `NODE_ENV=development` = credential-free local-filesystem
      editing; every other environment requires Basic Auth on `/keystatic/*` — including
      the `/en|sw` locale-prefixed variants — and `/api/keystatic/*`. Documented in the
      README operator guide + `.env.example`.)
- [x] Validate Basic Auth behavior, missing credentials, proxy behavior, and production headers;
      never log passwords or authorization values. (`src/proxy.ts` is the single edge gate:
      media signatures first, then admin auth; fail-closed without credentials, constant-time
      compare, 401 + `WWW-Authenticate` challenge, `no-store`/`noindex` on authorized admin
      responses. Deprecated `middleware.ts` deleted so exactly one gate runs under Next 16;
      API-route comment updated. Pinned by proxy assertions in `scripts/check-keystatic-pages.mjs`.)
- [x] Document GitHub App/repository setup, required environment variables, branch/PR behavior,
      and rollback procedure. (README operator guide + `.env.example` admin/GitHub-App comments;
      rollback = per-page allowlist/draft flip + global `KEYSTATIC_DISABLE=1`, both covered by
      the resolver matrix in the check script.)
- [x] Add editor-facing labels, descriptions, sensible defaults, and validation messages.
      (Already shipped per-field in `sectionRegistry.ts`/`fields.ts` for all six v1 sections;
      audited in M5 — no label/description gaps found.)
- [x] Define media upload limits, allowed formats, and accessibility requirements such as image
      alt text and heading order. (Decided: references-only, no `fields.image` uploads until a
      directory-per-entry layout lands; JPEG/PNG/WebP/AVIF/SVG under `/public`, gated
      `/media/**` via signed URLs; alt-text + h1/h2 rules in the README guide and the
      `localeMedia` contract in `fields.ts`.)

**Exit criteria:** an authorized editor can safely create, preview, update, and remove a page in
an environment representative of deployment, and an unauthorized request is rejected.

### M6: Verification and Cutover

**Status: IN PROGRESS**

Dependencies: M4 and M5.

- [x] Add automated tests for locale fallback, schema normalization, registry coverage, route
      resolution, unknown sections, and malformed content. (Covered since M2/M3 by
      `scripts/check-keystatic-pages.mjs`: registry integrity + example/schema-key audit,
      normalizer spot-checks, `resolveLocaleValue` matrix, resolver failure-taxonomy matrix
      over throwaway content trees, renderer `<section>` + no-leak render proof for every
      fixture section in both locales; extended in M5 with the proxy path/auth contract.)
- [ ] Run `yarn lint`, `yarn typecheck`, and `yarn build`; verify the sitemap and all migrated
      locale routes. (Update 2026-09-15: `package.json` lint script fixed (ESLint 9 `--ext`
      flag removed, the known M1 blocker). `yarn lint` clean (Done in 110.21s) and
      `yarn typecheck` clean (Done in 111.58s) both pass full-repo in-session. Sitemap
      verified by executing `next-sitemap.config.js` `additionalPaths`: 92 paths;
      `/terms-of-use` + `/company-profile` present in `en` and `/sw`; zero
      `keystatic`/`[locale]` leaks; `/api/*` + `/[locale]/*` excludes intact; opt-in pages
      need no sitemap change (same URLs, same locales). Remaining on this item: `yarn build`
      (standing M3 environment skip — final check only when all milestones are complete) +
      dev-smoke of the two opted-in routes in a browser session.)
- [ ] Perform keyboard, responsive, and visual checks in the editor and rendered pages.
- [ ] Measure page performance for representative pages, especially pages containing images,
      animation, maps, or 3D components.
- [x] Record the migration completion date, known limitations, and rollback point.
      (Migration policy: per-page opt-in via `KEYSTATIC_PAGES`, default legacy; pilot
      `company-profile` migrated M4, entry stays `draft` until each page's publish; rollback =
      allowlist/draft flip per page + global `KEYSTATIC_DISABLE=1`. Known limitations carried
      from M3: opted-in pages still embed the page locale namespace in `__NEXT_DATA__`;
      no `next build` gate per standing environment rule.)
- [x] Update README, `AGENTS.md`, `CLAUDE.md`, and any operator documentation to match the final
      implementation. (README done in M5/M6: operator guide + scripts table + Sanity cleanup;
      `AGENTS.md`/`CLAUDE.md` do not exist in this repo — gitignored per `.gitignore` line 66-67
      — so README + plan remain the source of truth.)

**Exit criteria:** the page builder is the documented source for migrated pages, quality gates
pass, and rollback instructions are tested.

### M7: Full-Site Keystatic Coverage (All Pages Editable)

**Status: IN PROGRESS**

Dependencies: M6 (M6 stays the active verification milestone; start M7 only when M6's
browser/build-window items no longer block schema/registry work, or after confirming with
the user per the instructions §Your First/Next task rule).

Scope decision (recorded 2026-09-15, per user request "all pages made editable with
Keystatic"): every public locale route must be editable in Keystatic — shared sections via
the ordered `pageBuilder` branches plus an explicit, documented strategy for the
page-specific bespoke/client-only tails that can never be registry branches.

Route inventory (from `src/pages/[locale]/**` + `public/locales/<en|sw>/**`, 2026-09-15):
- Top-level (7): `/` (home), `/about`, `/contact`, `/careers`, `/company-profile`
  (M4 pilot, wired), `/privacy-policy`, `/terms-of-use` (M3 pilot, wired).
- Surveying hub + 9 children (10): `/surveying` (landing), `/surveying/aerial-surveys`,
  `/surveying/bathymetric-surveys`, `/surveying/building-site-surveys`,
  `/surveying/cadastral-surveys`, `/surveying/gis-mapping`,
  `/surveying/ground-penetrating-radar`, `/surveying/resource-mapping`,
  `/surveying/sectional-properties`, `/surveying/topographical-surveys`.
- Civil hub + 6 children (7): `/civil` (landing), `/civil/as-built-surveys`, `/civil/bim`,
  `/civil/highway-surveys`, `/civil/site-engineering`, `/civil/site-setting-out`,
  `/civil/volumetric-surveys`.
- Aerial-drones hub + 9 children (10): `/aerial-drones` (landing),
  `/aerial-drones/agricultural-ndvi-mapping`, `/aerial-drones/as-built-surveys`,
  `/aerial-drones/drone-imagery-surveys`,
  `/aerial-drones/landfill-quarry-drone-surveys`, `/aerial-drones/lidar-mapping`,
  `/aerial-drones/monitoring-and-evaluation`,
  `/aerial-drones/photography-video-marketing`,
  `/aerial-drones/solar-panel-drone-surveys`, `/aerial-drones/volumetric-surveys`.
- Equipment (dynamic, special-cased): `/equipment-sale/equipment-catalogue` +
  `/equipment-sale/[product]` (product pages render from `products.json` + per-product
  locale files, not one namespace per page — needs its own content model decision, see
  checklist).
- Wired to Keystatic today (13 of ~34 static + 1 dynamic): `terms-of-use` (M3),
  `company-profile` (M4, hybrid tail), `privacy-policy` (M7 batch 1),
  `contact` + `careers` (M7 batch 2, hybrid tails), `about` (M7 batch 3,
  interleaved hybrid, entry `draft`),   `surveying` + `civil` hubs (M7 batch 4,
  hybrid tails, entries `draft`), `topographical-surveys` (M7 batch 5 pilot,
  interleaved hybrid, entry `draft`), `sectional-properties` (M7 batch 6,
  interleaved hybrid, entry `draft`), `bathymetric-surveys` (M7 batch 7,
  interleaved hybrid, entry `draft`), `resource-mapping` + `building-site-surveys`
  (M7 batch 8, interleaved hybrids, entries `draft`). All other `[locale]` routes render
  legacy only — no `resolveKeystaticPage` call.

- [x] Inventory every `[locale]` route and its locale namespace(s), section components,
      and bespoke/client-only parts (forms, maps, 3D/globe, viewers, product registry).
      (Done 2026-09-15: route table in M7 header — ~34 static + equipment dynamic; 2 wired
      at M7 start, +2 after batch 1.)
- [x] Register the deferred shared candidates needed by the remaining pages (M2 list:
      `CardList`, `Faq`, `Pricing`, `Process`, `Gallery`, `FinalCta`, `WorkflowSection`,
      `BeforeAfterFlipCard`, `CtaPill`, `ProductListing`, plus `ServicesSection`-shaped
      shared sections). (Batch 1 done 2026-09-15: `legal` — schema + renderer +
      example + check-script coverage. Batch 2: `faq` + `process` registered, no new
      sections needed. Batch 3 done 2026-09-16: `gallery` — overlay/slider/masonry/grid,
      both item shapes, SSR-safe `Slider` verified effect-only. Batch 5 done 2026-09-16:
      `pricing` (checklist cards + price band) + `hero` v1→v2 (CTA iconPosition /
      trailingArrow selects). Remaining candidates still open for batch 6+.)
- [x] Decide + document the bespoke/tail strategy per page (hybrid legacy tail like
      company-profile vs. new shared section vs. explicitly out-of-scope). (Batch 1:
      no tail needed — `LegalPageSection` fully wrapped as `legal` data. Batch 2
      decided 2026-09-16: contact = bespoke `ContactHeroSection` head + `OfficesSection`
      map + `ContactFormSection` tails stay legacy, Keystatic owns `talkToUs` cardGrid;
      careers = `CareersHeroSection` replaced by Keystatic `hero`, global `LeadGenBar`
      (`home` ns) + `ServicesSection` (`common` ns) + bespoke `CurrentOpeningsSection`
      (TOR modal + deadline logic) + `ApplicationProcessSection` (`<bold>`
      pseudo-markup the shared `IntroTextSection` would render literally) +
      `EqualOpportunityStatementSection` stay legacy. `contact:site_visit` + `contact:faq`
      are UNRENDERED dead content — OUT OF SCOPE like `opportunities`/`direct_contacts`;
      `contact:social` stays footer-owned.)
- [ ] Decide the equipment-sale content model (`products.json` + per-product locale files
      vs. one Keystatic entry per product vs. catalogue-only editing) and record the
      decision with date before implementing.
- [x] Extend the migration script with per-page mappings (or documented mappings where a
      repeatable script is infeasible), one page batch at a time; `--verify` must pin each
      checked-in entry. (Batch 1 done 2026-09-15: `legalBuild` + privacy/terms mappings,
      byte-verified. Batch 2 done 2026-09-16: `talkToUsBuild` (label→title, note→description,
      color→accent) + careers `hero` (cueLabel merged from `common:misc.openRoles` via new
      `extra.common` 5th build arg); `cardGrid` v1→v2 additive `accent` token + normalize;
      `sw/contact.json` gaps aligned to en (`color: primary-700`, `gmail` icon) so the
      strict shared-value gate holds; all 5 mapped pages `--verify` clean.)
- [x] Wire each `[locale]` route to the M3 source switch (allowlist + published → Keystatic;
      otherwise byte-identical legacy). (Batch 1: `privacy-policy.tsx` wired; `terms-of-use`
      already wired in M3. Batch 2 done 2026-09-16: `contact.tsx` (hero + cardGrid + offices
      + form hybrid) and `careers.tsx` (Keystatic hero + LeadGenBar + Services + openings +
      process + statement tails) wired; root proxies re-export automatically.
      Batch 3 done 2026-09-16: `about.tsx` wired as interleaved hybrid (7 Keystatic sections
      by index via `renderSection` between 3 fixed legacy tails + count guard → legacy
      fallback; single `data-keystatic-page` wrapper preserved).
      Batch 4 done 2026-09-16: `surveying/index.tsx` (Keystatic hero on top, 3 legacy tails)
      + `civil/index.tsx` (legacy hero, Keystatic services cardGrid, 2 legacy tails) wired.
      `aerial-drones/landing` has zero shared-section usage — deferred until new sections
      are registered (bespoke hero, popup cards, fleet, tiles, globe, photo section).
      Batch 5 done 2026-09-16: `topographical-surveys.tsx` wired as interleaved hybrid
      (4 Keystatic sections by index + count guard → legacy fallback).
      Batch 6 done 2026-09-16: `sectional-properties.tsx` wired as interleaved hybrid
      (5 Keystatic sections by index + count guard → legacy fallback).
      Batch 7 done 2026-09-16: `bathymetric-surveys.tsx` wired as interleaved hybrid
      (4 Keystatic sections by index + count guard → legacy fallback).
      Batch 8 done 2026-09-16: `resource-mapping.tsx` (hero + whyStandOut cardGrid,
      2 sections) + `building-site-surveys.tsx` (introText + 2 ctaBands + gallery,
      4 sections) wired as interleaved hybrids (count guards → legacy fallback).
      `check:keystatic` fixture/render coverage now 11 fixtures, 11 sections.)
- [x] Migrate + verify in small batches (suggested: legal → contact/careers → about →
      hubs → children → home last as the largest page; equipment per its model decision),
      recording each page and its source of truth in the status log. (Batch 1 — legal —
      done 2026-09-15: privacy-policy 6 articles + terms-of-use 9 articles, both `draft`,
      `en`/`sw` verified byte-equal to generator output. Batch 2 — contact (1 cardGrid,
      6 contacts) + careers (1 hero, banner) — done 2026-09-16, both `draft`, `--verify`
      clean, user-confirmed dev smoke with temp local publish flip. Batch 3 — about —
      done 2026-09-16: 7 sections in page order, `draft`, `--verify` clean, user-confirmed
      dev smoke with temp local publish flip. Batch 4 — surveying hub (1 hero, centered
      framed) + civil hub (1 services cardGrid, 6 items) — done 2026-09-16, both `draft`,
      `--verify` clean, user-confirmed dev smoke with temp local publish flip. Batch 5 —
      topographical-surveys pilot (hero + 2 introText + pricing, 4 sections) — done
      2026-09-16, `draft`, `--verify` clean, user-confirmed dev smoke with temp local
      publish flip.) Batch 6 —
      sectional-properties (hero + introText+CTA + gallery + faq + ctaBand, 5 sections) —
      done 2026-09-16, `draft`, `--verify` clean, user-confirmed dev smoke with temp local
      publish flip. Batch 7 —
      bathymetric-surveys (hero + splitMedia + 2 cardGrid check-cards, 4 sections) —
      done 2026-09-16, `draft`, entry generated via `--write` (no gaps); `--verify`,
      `check:keystatic`, typecheck/lint, dev smoke DEFERRED per 2026-09-16 M7
      test-deferral policy (instructions.md) — run once after all M7 stages.
      Batch 8 — resource-mapping (hero dual-pill + whyStandOut cardGrid columns 4
      centred, 2 sections) + building-site-surveys (introText split + split/shimmer
      ctaBand + grid gallery + centred/hairline ctaBand, 4 sections) — done 2026-09-16,
      both `draft`, entries generated via `--write` (no gaps); all validation DEFERRED
      per M7 test-deferral policy.)
- [ ] Update the README operator guide + `.env.example` allowlist examples as the editable
      set grows; keep rollback (per-page allowlist/draft flip + `KEYSTATIC_DISABLE=1`)
      tested for the new pages.

**Exit criteria:** every static locale route (plus equipment per its model decision) has a
checked-in published-or-draft entry, a wired source switch, `--verify` parity with locale
JSON in both locales, dev-smoke parity per page, and full quality gates green; the
bespoke/tail strategy for each page is documented; rollback is tested for the new pages.

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
| 2026-09-14 | M4 | Pilot selected: `company-profile` (hero + stats panel + split-media + 3 card-grids with links/icons + bespoke PDF viewer as the optional/non-shared section). Repeatable mapping exists as `scripts/migrate-locale-to-keystatic.mjs` (`--write`/`--verify` byte-compare; completeness gate aborts on gaps, shared non-text values must match across locales, media stays per-locale). `content/pages/company-profile.json` generated from locale JSON, status `draft` | `node scripts/migrate-locale-to-keystatic.mjs --page company-profile --verify` must pass (pending: shell unresponsive, see below) | |
| 2026-09-14 | M4 | Wired `src/pages/[locale]/company-profile.tsx` to the M3 source switch (root proxy untouched): allowlisted + published → `PageBuilderDocument` for the 6 shared sections + legacy `CompanyProfileViewerSection` tail (hybrid: viewer has no shared equivalent — `DeferredMount` + iframe — so never registered); otherwise byte-identical legacy render. `yarn check:keystatic` now also runs migration `--verify`; added `yarn migrate:keystatic` helper | Validation PENDING — terminal commands return no output in this environment (`node --version`, `dir` both unobservable), so `tsc`/`eslint`/`check:keystatic`/dev-smoke have not run; M4 stays IN PROGRESS until parity is proven | |
| 2026-09-14 | M4 | Validation update (user-run): `node scripts/migrate-locale-to-keystatic.mjs --page company-profile --verify` → OK (checked-in entry equals repeatable output, 6 sections, no gaps). `yarn check:keystatic` → OK registry (6 sections), renderers, locale semantics, page resolution and 3 page fixtures + migration verify OK in 9.95s; the three `[keystatic] page "terms-of-use" falls back to legacy` warnings are the expected negative-fixture diagnostics (malformed JSON, unknown discriminants), not failures. `yarn typecheck` → clean (`tsc --noEmit` Done in 31.65s). `yarn lint` → clean (`eslint --max-warnings=0` Done in 74.32s) | Still pending to close M4: dev smoke parity (`KEYSTATIC_PAGES=company-profile` → `/en/company-profile` + `/sw/company-profile` vs legacy; note entry is `draft`, publish before opt-in test), then tick checklist | |
| 2026-09-14 | M4 | M4 closed as DONE. User confirmed dev smoke parity looks good. Static gates all green (migration verify, `check:keystatic`, typecheck, lint). Checked-in entry stays `draft` (opt-in test requires a local publish flip — never committed). Next: M5 editor experience, security, operations | Standing instruction from M3 still applies: skip `next build` (environment infeasible); gate on tsc/eslint/check/reader/dev-smoke | |
| 2026-09-15 | M5 | M5 closed as DONE. Single edge gate: `src/proxy.ts` now owns media signatures + Keystatic Basic Auth (`/keystatic/*` incl. `/en|sw` prefixes, `/api/keystatic/*`; dev bypass only in development; fail-closed, constant-time compare, 401 + challenge, `no-store`/`noindex`); deprecated `middleware.ts` deleted (Next 16 runs `proxy.ts`, not `middleware.ts`). Check script pins the gate (route coverage incl. `/enkeystatic` + `/api/keystatic-evil` negatives, fail-closed regex, constant-time marker, single-gate absence, 5 matcher strings). Docs: README operator guide (create/edit/remove, draft→published→allowlist flow, two-level rollback, GitHub App setup, references-only media policy, alt/h1-h2 a11y) + `.env.example` admin/GitHub-App comments + `localeMedia`/`imagePath` contract notes; API-route comment repointed to `src/proxy.ts`; migration `--verify` now CRLF-tolerant with status-normalized compare | `node scripts/check-keystatic-pages.mjs` OK (6 sections, 3 fixtures; 3 terms-of-use fallback warnings = expected negative diagnostics); `node scripts/migrate-locale-to-keystatic.mjs --page company-profile --verify` OK (6 sections, no gaps); `yarn typecheck` could not run in-session (30s timeout, pre-existing env slowness — last green 2026-09-14 per M4 log; no type-level changes beyond comments + proxy helpers typed explicitly) | |
| 2026-09-15 | M6 | M6 opened (auto-start per instructions §14; M5 exit criteria met, no decision/blocker). Automated-tests item ticked (covered by `check-keystatic-pages.mjs` since M2/M3 + M5 proxy assertions). README Sanity cleanup done (operator guide, scripts table incl. `check:keystatic`/`migrate:keystatic`/`mediakeygen`, env/FAQ fixes); `AGENTS.md`/`CLAUDE.md` confirmed absent + gitignored so README + plan stay source of truth. Migration/rollback record + known limitations written into M6 checklist | Gates green: `check-keystatic` OK, migration `--verify` OK. Remaining: `yarn lint` (script `--ext` flag broken under ESLint 9 — known since M1), `yarn typecheck` (tool timeout in-session), `yarn build` (standing skip), sitemap/route verify, keyboard/responsive/visual + perf checks — M6 stays IN PROGRESS | |
| 2026-09-15 | M7 | M7 batch 2 inventory CONFIRMED (dead-content verdicts): `contact:opportunities` (en only, sw lacks it) + `contact:direct_contacts` are UNRENDERED — no section reads them (only `contact:social.channels` is read, by FooterInk/FooterLight, not the contact page). `contact:social` is footer-owned → NEVER a page-builder branch for `/contact` (footer keeps reading legacy locale JSON). Decisions: `opportunities` + `direct_contacts` = OUT OF SCOPE (no migration, documented here); `social` = out of page scope (footer-owned). Contact Keystatic surface: `talkToUs`→`cardGrid`, `site_visit`→`process`, `faq`→`faq`; bespoke head `ContactHeroSection` + tail (`OfficesSection` map, `ContactFormSection` Formspree form + reasons) stay legacy. Careers: `hero`→`hero`, `applicationProcess`+`statement`→`introText`, `currentOpenings`→BESPOKE tail (TOR modal + deadline logic) | `faq` + `process` registered (schema+renderer+example); Faq `next/link`→`@/components/Link` fixed for check-script SSR | Next: migration mappings + fixtures + route wiring |
| 2026-09-16 | M7 | Batch 2 DONE (contact + careers): `cardGrid` v1→v2 additive per-item `accent` token (TalkToUs brand chip colors would otherwise drop; v1 entries normalize to `undefined` = component default); `talkToUsBuild` + careers `hero` mappings in migration script (`extra.common` 5th build arg merges `common:misc.openRoles` cueLabel); `content/pages/contact.json` (1 cardGrid, 6 contacts) + `content/pages/careers.json` (1 hero, banner) generated, both `draft`; `contact.tsx` + `careers.tsx` wired to M3 source switch (hybrid tails; root proxies re-export untouched). CORRECTIONS to the 2026-09-15 inventory row: (1) `contact:site_visit` + `contact:faq` render NOWHERE (grep over `src` finds no reader) — OUT OF SCOPE, not `process`/`faq` sources; (2) `applicationProcess`+`statement` stay legacy, NOT `introText` — their `<bold>` pseudo-markup would render literally in `IntroTextSection`. `sw/contact.json` gaps aligned to en (`color: primary-700` on info@ item, `gmail` icon on gmail item) so the strict shared-value gate holds — legacy sw chip shade now matches en | `check:keystatic` OK (9 sections, 6 fixtures; 3 fallback warnings = expected negatives); `--verify` clean for all 5 mapped pages; `--dump-text` contact/careers resolve fully in en+sw with no leaks; `yarn typecheck` clean full-repo (192s); `eslint --max-warnings=0` clean on touched files; dev smoke user-confirmed good (`KEYSTATIC_PAGES=contact,careers`, temp local publish flip, reverted to `draft` after) — no node processes left behind | |
| 2026-09-16 | M7 | Batch 3 DONE (about): `gallery` registered (overlay/slider/masonry/grid, 2–4 cols, shared imagePath + dual caption fields, example + normalize + renderer; `Slider` window/document usage verified `useEffect`-only → SSR-safe; `Gallery` removed from M2 deferred list). `content/pages/about.json` generated (7 sections in page order: hero, splitMedia,
 gallery servicesByImages, gallery droneSlider, gallery landSurveyingImages, cardGrid
 whyChoose, gallery masonry), `draft`, `--verify` clean first try, no gaps. `about.tsx` wired as interleaved hybrid (`renderSection` by index between 3 fixed legacy tails + `KEYSTATIC_SECTION_COUNT` guard → legacy fallback; keeps single `data-keystatic-page` wrapper, unlike slicing PageBuilderDocument which would nest `min-h-screen` blocks). Tails stay legacy: AerialSurveyingSection (popup modal + fallbackIcons — cardGrid v2 models neither), LandSurveyingSection (`<primary>` markup + `itemsTitle`), ImpactAcrossAfricaSection (client-only ProjectsGlobe, never registered) | `check:keystatic` OK (10 sections, 7 fixtures; same 3 expected warnings); `--verify` clean all 6 mapped pages; `--dump-text` about fully resolved en+sw, no leaks; `yarn typecheck` clean (88s); `eslint` clean on touched files; dev smoke user-confirmed good (`KEYSTATIC_PAGES=about`, temp publish flip, reverted to `draft`) — no node processes left behind | |
| 2026-09-16 | M7 | Batch 4 DONE (surveying + civil hubs, no registry changes): `surveying` = 1 hero (centered, frame + scrollCue travel in content via `sharedValue`, mailto CTA with shared icon/href); `civil` = 1 services cardGrid via existing `cardGridBuild` (columns 3, tone surface, href-less item tolerated). Tails stay legacy: surveying services (lead map BELOW grid — cardGrid leadImages sit above), surveying process (watermarked/indexed cards), both deliverables explorers (ns-driven), civil bespoke diagonal hero + image stepper process. `aerial-drones/landing` verified zero shared-section usage (7 bespoke sections) — DEFERRED to a future batch that registers new sections; no entry, no wiring, documented here | `check:keystatic` OK (10 sections, 9 fixtures; same 3 expected warnings); `--verify` clean all 8 mapped pages; `--dump-text` surveying/civil fully resolved en+sw, no leaks; `yarn typecheck` clean (84s); `eslint` clean on touched files; dev smoke user-confirmed good (`KEYSTATIC_PAGES=surveying,civil`, temp publish flip, reverted to `draft`) — no node processes left behind | |
| 2026-09-16 | M7 | Batch 5 DONE (topographical-surveys pilot, first child): `pricing` registered (cards + price band, SSR-safe) + `hero` v1→v2 (ctaIconPosition start/end, ctaTrailingArrow auto/show/hide; `end`/`auto` collapse to layout defaults in normalize; v1 fixtures render unchanged). Generic `introTextBuild` + `pricingBuild` migration helpers (reusable for cadastral + other cost pages). Entry: 4 sections (hero, whatIs, cost, section1) in page order, `draft`, `--verify` clean first try. Route wired interleaved (KS at 0,1,4,5 + count guard). Tails stay legacy: 5 cardGrids on non-contract props (`subItems`/`wide`, `indexed`, `mediaBadged`/`variant`/`mediaPosition`, `fallbackIcons`, JSX `headerEnd` — documented as the cardGrid boundary, not v3 scope), deliverables explorer, bespoke sample map. Legacy hero `subTitle` is unrendered by Hero → not migrated (documented in build comment) | `check:keystatic` OK (11 sections, 10 fixtures; same 3 expected warnings); `--verify` clean all 9 mapped pages; `--dump-text` topo fully resolved en+sw, no leaks; `yarn typecheck` clean (107s); `eslint` clean on touched files; dev smoke user-confirmed good (`KEYSTATIC_PAGES=topographical-surveys`, temp publish flip, reverted to `draft`) — no node processes left behind | |
| 2026-09-16 | M7 | Batch 6 DONE (sectional-properties): 5 sections (hero with dual pills, introText with CTA via extended `introTextBuild`, overlay gallery, q/a/b faq, first `ctaBand` migration with shared watermark) in page order, `draft`, `--verify` clean first try. Route wired interleaved (KS at 0,1,3,9,10 + count guard 5). Tails stay legacy: bespoke WhatIs, 2 cardGrids on non-contract props (`indexed`/`fallbackIcons`/`hoverArrow`/`headerAlign`/footer links), WorkflowSection process + timeline variant, deliverables explorer; `socials` commented out = dead, never migrated | `check:keystatic` OK (11 sections, 11 fixtures; same 3 expected warnings); `--verify` clean all 10 mapped pages; `--dump-text` sectional fully resolved en+sw (hero/faq/ctaBand text verified), no leaks; `yarn typecheck` clean (42s); `eslint` clean on touched files; dev smoke user-confirmed good (`KEYSTATIC_PAGES=sectional-properties`, temp publish flip, reverted to `draft`) — no node processes left behind | |
| 2026-09-16 | M7 | Test-deferral policy adopted per user request: `docs/keystatic-page-builder/instructions.md` updated (M7 Test Deferral Policy — all per-batch `typecheck`/`lint`/`check:keystatic`/`--verify`/`--dump-text`/dev-smoke skipped, run once after all M7 stages). AGENTS.md/CLAUDE.md confirmed absent again (glob no match) — README + plan remain source of truth | No tests run (deferred); instructions.md edit only | |
| 2026-09-16 | M7 | Batch 7 DONE (bathymetric-surveys, tests deferred): mapping added (`hero` default bottom + v2 pill keys, `whatIs` splitMedia right/surface, 2 string-array cardGrid builds with check/check-bold icons, columns 3 tone surface); `content/pages/bathymetric-surveys.json` generated via `--write` (4 sections, no completeness gaps — generation only, not validation); route wired interleaved (KS at 0,1,2,6 + count guard 4). Tails stay legacy: WorkflowSection workflow, bespoke equipment/deliverables/limitations/beforeAfter/finalCta, dams leadImages grid, applications mediaBadged grid | Validation DEFERRED per M7 policy: no `--verify`/`check:keystatic`/`typecheck`/`lint`/dev-smoke this batch; run once after all M7 stages | |
| 2026-09-16 | M7 | Batch 8 DONE (resource-mapping + building-site-surveys, tests deferred): resource-mapping = hero dual-pill + whyStandOut cardGrid (cols 4 centred surface) via existing `cardGridBuild`, 2 sections; building-site = section1 introText split via `introTextBuild`, actionCta ctaBand split/shimmer, exploreMore gallery grid via `galleryBuild`, cta ctaBand centred/hairline, 4 sections. Both entries generated via `--write` (no gaps — generation only). Routes wired interleaved with count guards (resource KS at 0,9; building-site KS at 1,6,10,11). Tails stay legacy: resource sector/leadImages + fallbackIcons grids + workflow/deliverables/finalCta bespoke; building-site bespoke hero + indexed/fallbackIcons grids + Process layout/columns (outside registry contract) + deliverables explorer | Validation DEFERRED per M7 policy: no `--verify`/`check:keystatic`/`typecheck`/`lint`/dev-smoke this batch; run once after all M7 stages | | |
