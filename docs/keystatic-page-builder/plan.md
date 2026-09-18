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
      (standing M3 environment skip — final check only when all milestones are complete).
      Update 2026-09-17: dev-smoke parity user-confirmed for M8 (`home` 15
      sections, `/en` + `/sw`) and M9 (`site` layout on multiple routes,
      `/en` + `/sw`); both entries reverted to `draft` after
      (`company-profile` stays `published` per M4). Still open: `yarn build`
      (standing skip) + keyboard/responsive/visual + perf sampling — M6 stays
      IN PROGRESS on those browser residuals.)
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

**Status: DONE** (2026-09-16 — all static routes wired or deferred-with-reason, equipment
decided file-based, deferred validation green; see close-out log row).

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
- Wired to Keystatic today (30 of ~34 static + equipment file-based): `terms-of-use` (M3),
  `company-profile` (M4, hybrid tail), `privacy-policy` (M7 batch 1),
  `contact` + `careers` (M7 batch 2, hybrid tails), `about` (M7 batch 3,
  interleaved hybrid, entry `draft`),   `surveying` + `civil` hubs (M7 batch 4,
  hybrid tails, entries `draft`), `topographical-surveys` (M7 batch 5 pilot,
  interleaved hybrid, entry `draft`), `sectional-properties` (M7 batch 6,
  interleaved hybrid, entry `draft`), `bathymetric-surveys` (M7 batch 7,
  interleaved hybrid, entry `draft`), `resource-mapping` + `building-site-surveys`
  (M7 batch 8, interleaved hybrids, entries `draft`), `aerial-surveys` +
  `cadastral-surveys` (M7 batch 9, interleaved hybrids, entries `draft`),
  `ground-penetrating-radar` + `gis-mapping` (M7 batch 10, interleaved hybrids,
  entries `draft`),   `highway-surveys` + `civil/as-built-surveys` (M7 batch 11,
  interleaved hybrids, entries `draft`),   `bim` + `site-engineering` +
  `site-setting-out` + `volumetric-surveys` (M7 batch 12, interleaved hybrids,
  entries `draft`), `solar-panel-drone-surveys` + `landfill-quarry-drone-surveys`
  (M7 batch 13, interleaved hybrids, entries `draft`), `monitoring-and-evaluation` +
  `aerial-drones-as-built-surveys` (M7 batch 14, interleaved hybrids, entries
  `draft`), `agricultural-ndvi-mapping` + `lidar-mapping` (M7 batch 15,
  interleaved hybrids, entries   `draft`). `aerial-drones/volumetric-surveys` is
  DEFERRED — no `sw` locale namespace exists (see batch 15 log).
  `aerial-drones/landing`, `aerial-drones/drone-imagery-surveys` and
  `aerial-drones/photography-video-marketing` are DEFERRED as bespoke-only pages
  (see batch 16 log — zero registry-contract sections). All other `[locale]`
  routes render legacy only — no `resolveKeystaticPage` call.

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
- [x] Decide the equipment-sale content model (`products.json` + per-product locale files
      vs. one Keystatic entry per product vs. catalogue-only editing) and record the
      decision with date before implementing. (Decided 2026-09-16, batch 16: equipment
      stays FILE-BASED — `public/locales/<locale>/products.json` registry +
      per-product locale files (`dji-air-3s.json`, …) remain the source of truth; product
      pages are a product-registry model, not ordered page sections, so they never become
      `pageBuilder` entries. Rationale: no shared-section usage on product routes; forcing
      products into page sections would fork the registry contract for a single use case.
      Revisit only if product pages gain marketing sections. User may override.)
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
      Batch 9 done 2026-09-16: `aerial-surveys.tsx` (hero with footnote chips +
      precision splitMedia, 2 sections) + `cadastral-surveys.tsx` (hero only,
      1 section) wired as interleaved hybrids (count guards → legacy fallback).
      Batch 10 done 2026-09-16: `ground-penetrating-radar.tsx` (technicalCta ctaBand +
      faqs faq with still-curious card, 2 sections) + `gis-mapping.tsx`
      (consultationCta ctaBand, 1 section) wired as interleaved hybrids
      (count guards → legacy fallback).
      Batch 11 done 2026-09-16: `civil/highway-surveys.tsx` (hero + overview introText +
      benefits cardGrid, 3 sections) + `civil/as-built-surveys.tsx` (hero + 3 introTexts
      + 2 cardGrids, 6 sections) wired as interleaved hybrids (count guards → legacy
      fallback).
      Batch 12 done 2026-09-16: `civil/bim.tsx` (secondary-only hero + cta, 2 sections) +
      `civil/site-engineering.tsx` (cta only, 1 section) +
      `civil/site-setting-out.tsx` (dual-pill hero + faq, 2 sections) +
      `civil/volumetric-surveys.tsx` (hero + 2 introTexts + splitMedia + cta, 5 sections)
      wired as interleaved hybrids (count guards → legacy fallback).
      Batch 13 done 2026-09-16: `aerial-drones/solar-panel-drone-surveys.tsx` (hero +
      centred cta with hardcoded arrow icon, 2 sections) +
      `aerial-drones/landfill-quarry-drone-surveys.tsx` (hero + 2 introTexts,
      3 sections) wired as interleaved hybrids (count guards → legacy fallback).
      Batch 14 done 2026-09-16: `aerial-drones/monitoring-and-evaluation.tsx` (hero +
      3 introTexts + centred cta, 5 sections) + `aerial-drones/as-built-surveys.tsx`
      (hero + stats band + bleed cta with images, 3 sections, hub-prefixed slug
      `aerial-drones-as-built-surveys`) wired as interleaved hybrids (count guards →
      legacy fallback).
      Batch 15 done 2026-09-16: `aerial-drones/agricultural-ndvi-mapping.tsx` (hero only,
      1 section) + `aerial-drones/lidar-mapping.tsx` (hero + 2 wide splitMedias,
      3 sections) wired as interleaved hybrids (count guards → legacy fallback).
      Batch 17 done 2026-09-16: home (5 sections) wired; deferred validation green
      (see close-out row). `check:keystatic` fixture/render coverage: 30 fixtures,
      11 sections.)
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
      per M7 test-deferral policy.
      Batch 9 — aerial-surveys (hero with 3 footnote chips, first footnote migration +
      precision splitMedia, 2 sections) + cadastral-surveys (hero only with empty
      description optText, 1 section; whatsABoundarySurvey DORMANT — IntroSection
      commented out of route — postHeroCta bespoke band tail) — done 2026-09-16,
      both `draft`, entries generated via `--write` (no gaps); all validation DEFERRED
      per M7 test-deferral policy.
      Batch 10 — ground-penetrating-radar (split/shimmer/hairline ctaBand + faq with
      question/answer items + still-curious card from `cta`, 2 sections) +
      gis-mapping (split/shimmer/hairline consultation ctaBand, 1 section; bespoke
      hero with `<bold>` markup + all cardGrids on non-contract props stay legacy) —
      done 2026-09-16, both `draft`, entries generated via `--write` (no gaps); all
      validation DEFERRED per M7 test-deferral policy.
      Batch 11 — highway-surveys (hero + surface introText + cols-3 surface cardGrid,
      3 sections) + as-built-surveys (hero + default/surface/default introTexts +
      centred default/surface cardGrids, 6 sections; indexed solutions grid +
      deliverables explorer stay legacy) — done 2026-09-16, both `draft`, entries
      generated via `--write` (no gaps); all validation DEFERRED per M7
      test-deferral policy.
      Batch 12 — bim (secondary-only hero + centred cta, 2 sections) +
      site-engineering (centred cta only, 1 section; `<bold>` hero + `Split`
      overview + indexed/media-bg grids stay legacy) + site-setting-out
      (dual-pill hero + 9-item faq, 2 sections) + volumetric-surveys (dual-pill
      hero + default/surface introTexts + right splitMedia + centred cta,
      5 sections; left-aligned services grid + deliverables stay legacy) — done
      2026-09-16, all four `draft`, entries generated via `--write` (no gaps); all
      validation DEFERRED per M7 test-deferral policy.
      Batch 13 — solar-panel-drone-surveys (hero + centred cta with wrapper-hardcoded
      arrow icon stored as shared literal, 2 sections; iconShape/indexed grids stay
      legacy) + landfill-quarry-drone-surveys (hero + default/surface introTexts,
      3 sections; iconShape/fallbackIcons grids stay legacy) — done 2026-09-16, both
      `draft`, entries generated via `--write` (no gaps); all validation DEFERRED per
      M7 test-deferral policy.
      Batch 14 — monitoring-and-evaluation (hero + default/surface/default introTexts +
      centred cta, 5 sections; fallbackIcons/iconShape/actions/leadImages grids stay
      legacy) + aerial as-built (hero without title key + stats band + first bleed +
      first images cta, 3 sections) — done 2026-09-16, both `draft`, entries generated
      via `--write` (no gaps after 2 mapping fixes); all validation DEFERRED per M7
      test-deferral policy.
      Batch 15 — agricultural-ndvi-mapping (hero only, 1 section; split-cards +
      layout/columns tails) + lidar-mapping (hero + left/surface/wide + right/default/
      wide splitMedias, 3 sections; indexed grid + layout/columns process + normalizeHref
      cta stay legacy) — done 2026-09-16, both `draft`, entries generated via `--write`
      (no gaps); all validation DEFERRED per M7 test-deferral policy. DECISION 2026-09-16:
      `aerial-drones/volumetric-surveys` DEFERRED — `public/locales/sw/aerial-drones/`
      has no `volumetric-surveys.json` (page is en-only today); cannot migrate without a
      `sw` translation — revisit when the namespace exists (same rule will apply to any
      other page missing a locale side).)
      Batch 16 — planning batch (no code): (a) bespoke-only deferrals confirmed for the
      last three aerial-drones pages — `landing` (bespoke hero, popup cards, fleet,
      tiles, globe, photo section; zero shared-section usage, carried from batch 4),
      `drone-imagery-surveys` (AerialServiceHero local-shared hero, bespoke offer/drones/
      deliverables, client-only ProjectsGlobe; zero registry-contract sections),
      `photography-video-marketing` (custom gradient hero, raw Slider — not Gallery —,
      hand-rolled services grid with positional fallback icons + bespoke CTA pill; zero
      registry-contract sections) — all deferred until new sections are registered, no
      entry, no wiring; (b) equipment model decided file-based (see checklist);
      (c) home inventory done — home splits into batches 17+ (migratable:
      ActionCta x2 split/shimmer, Industries label→title cardGrid, Faq, masked Cta;
      tails: WebGL hero, global LeadGenBar, headerRow/hoverArrow/watermarkedIndexed
      CoreExpertise, client-only CoverageArea globe, bespoke remainder).
      Batch 17 done 2026-09-16: `[locale]/index.tsx` home (2 split/shimmer ActionCtas +
      label→title Industries cardGrid + faq + masked Cta with id, 5 sections) wired as
      interleaved hybrid (count guard → legacy fallback; nested layout divs preserved;
      overwrites the M1 starter fixture with the real migrated home, stays `draft`).
      Close-out 2026-09-16 (deferred validation, all green): `check:keystatic` OK
      (11 sections, 30 fixtures; 3 fallback warnings = expected negative diagnostics;
      fixed 1 stale assertion — M1 starter home expectation → migrated home + temp
      publish in check); `--verify` clean for all 30 mapped pages; `yarn typecheck`
      clean (13s); `yarn lint` clean (44s); dev-smoke user-confirmed good (all 30
      routes en+sw with temp publish flips, reverted to `draft` after; company-profile
      stays `published` as committed in M4); README section list 6→11 + `.env.example`
      allowlist example updated. Residuals: `yarn build` standing skip (environment),
      keyboard/responsive/visual + perf sampling need a browser session (M6 items).
- [x] Update the README operator guide + `.env.example` allowlist examples as the editable
      set grows; keep rollback (per-page allowlist/draft flip + `KEYSTATIC_DISABLE=1`)
      tested for the new pages. (Done in close-out: README 11 sections + multi-slug
      allowlist example; rollback covered by the resolver matrix in `check:keystatic`.)

**Exit criteria:** every static locale route (plus equipment per its model decision) has a
checked-in published-or-draft entry, a wired source switch, `--verify` parity with locale
JSON in both locales, dev-smoke parity per page, and full quality gates green; the
bespoke/tail strategy for each page is documented; rollback is tested for the new pages.

### M8: Register Migrated Home Shared Sections

**Status: DONE** (2026-09-17 — all 12 in-scope sections resolved; dev-smoke parity user-confirmed; see close-out log row).

Dependencies: M2 registry + schema factories, M7 coverage (home entry + interleaved
wiring); HEAD migration `89e0767` (new shared components under
`src/components/sections/shared/`).

Scope (per user request 2026-09-16): the shared section components created/migrated
from `/` in the HEAD commit must be registered in Keystatic so they are editable in
`/` and addable to any page:

- `About`, `Certifications`, `CoreExpertise`, `CoverageArea`, `IndustriesWeServe`,
  `KeyFacts`, `Metrics`, `PlanningInfographic`, `SurveyCost`, `Trustees`,
  `WhyChooseUs`, `SurveyingInstruments`.

Notes / constraints recorded before implementing:

- These wrappers are thin `data`-prop adapters over shared components (see
  `src/components/sections/home/*Section.tsx` + `src/components/sections/shared/index.ts`);
  schemas must model the shared `*Content` interfaces, not the locale-namespace wrappers.
- `CoverageArea` embeds a client-only WebGL globe (`next/dynamic` ssr:false +
  `DeferredMount`); per the M3 standing rule new sections must stay SSR-safe —
  register the data contract but keep globe loading via `next/dynamic` in the renderer
  (same precedent as `Gallery`'s effect-only `Slider`).
- `SurveyCost` is stateful (`useState` tab index) but SSR-safe on first render;
  check-script static-markup proof must render it in both locales.
- `Metrics`/`CoreExpertise`/`IndustriesWeServe` overlap existing `stats`/`cardGrid`
  contracts — record per-section whether they are new ids or additive versions, never
  renames (registry versioning rules).
- `PlanningInfographic` renders its closing statement via `<Trans>` against
  `common:planningInfographic.closingStatement`, not from `data` — schema must either
  carry that string as data or the renderer keeps the `<Trans>` lookup; record the
  decision per section so Keystatic edits actually change output.
- `CoreExpertise` hardcodes `headerRow`/`hoverArrow`/`watermarkedIndexed` presentation
  flags (outside the `cardGrid` v2 contract); decide new id vs extended `cardGrid` v3.
- `LeadGenBar` takes no `data` prop today (reads `t()` directly) — out of scope until
  refactored to a props-driven shared section, same rule as layout-only exclusions.

- [x] Inventory each HEAD shared component's `*Content` interface + SSR-safety
      (browser APIs only in effects / dynamic / event handlers) and decide new id vs
      version bump vs out-of-scope. (2026-09-16: first section `trustees` proven —
      `TrusteesContent` `{tag?, headline?, items: [{label, logoUrl}]}`; SSR-safe:
      `FadeUp` is `IntersectionObserver`-in-`useEffect` only, `Blob` is a pure
      span,       `next/image` renders statically. New id `trustees` v1 — no overlap
      with `stats`/`cardGrid`. 2026-09-17: `certifications` (`{tag?, headline?,
      description?, items: [{icon?, name, label}]}` — `name` shared literal,
      `label`/`description` localized) and `keyFacts` (`{tag?, headline?,
      description?, items: [{icon?, label, description}]}` — `icon` shared
      with positional fallback) inventoried — both SSR-safe (effect-only
      `FadeUp`, pure-span `Blob`, framer-motion `Parallax` static first
      render) and registered as new ids v1. Batch A: `metrics` (`{tag?,
      headline?, description?, items: [{icon?, name, value}]}` — `name`
      localized, `value` shared integer via `fields.integer`, positional
      `METRIC_ICONS` fallback; `CountUp` renders a static span, animation in
      `useEffect`) registered as new id v1 — but NOT migrated: the wrapper is
      commented out of `[locale]/index.tsx`, so `common:metrics` is
      unrendered on `/` (stays in home `skipped`; addable to any page).
      `whyChooseUs` (`{tag?, headline?, description?, items: [{icon?, name,
      label, description}]}` — `icon`/`name` shared literals, `name`
      rendered as the item eyebrow) registered as new id v1. Batch B:
      `about` (narrative + whoWeAre/mission + featureImg + cards; `url`/
      `icon`/`href` shared) and `surveyingInstruments` (`[{label, img,
      href?}]`; empty `href` renders `<article>`, preserved by normalize)
      registered as new ids v1. Batch C: `coreExpertise` registered as new
      id v1 (NOT `cardGrid` v3 — `headerRow`/`hoverArrow`/
      `watermarkedIndexed` + positional numbering are outside the v2
      contract); `industriesWeServe` needs NO new id (decided 2026-09-17 —
      bare `CardGrid columns={3}`, fully inside v2, already migrates AS
      `cardGrid`); `planningInfographic` registered as new id v1 with
      `closingStatement` carried as data but GATE-ONLY (component keeps the
      `<Trans>` locale lookup — editing the text does not change output
      until a props-driven refactor; field description warns editors).
      Batch D: `coverageArea` (stats `value`/`suffix` shared, group chips
      localized — last group diverges; globe stays `dynamic ssr:false`) and
      `surveyCost` (nested factors/ranges, `price` integers, CTA `href`s
      shared; `useState` tab index is SSR-safe) registered as new ids v1.
      All 12 in-scope sections resolved (10 migrated into `home.json`,
      `metrics` registered-only, `industriesWeServe` covered by `cardGrid`).)
- [x] Register schemas + examples + normalizers in `sectionRegistry.ts` (single source),
      renderers in `sectionRenderers.tsx`, extend `scripts/check-keystatic-pages.mjs`
      coverage + migration mappings where the home `skipped` list shrinks.
      (2026-09-16: `trustees` done — registry id + schema + example + normalize
      (`{tag,headline,items,id}` → `{data:{...},id}` to match `TrusteesProps`),
      renderer, check-script `resolve-real-fixture` extended to
      `ctaBand,cardGrid,faq,ctaBand,ctaBand,trustees`; home `skipped` drops
      `trustees`. 2026-09-17: `certifications` done — new id v1 (`tag?,
      headline?, description?, items: [{icon?, name, label}], id`), `name` a
      shared literal via `sharedValue` gate, `icon` optional shared MDI slug,
      renderer, fixture extended with `,certifications`; home `skipped` drops
      `certifications`. 2026-09-17: `keyFacts` done — new id v1 (`tag?,
      headline?, description?, items: [{icon?, label, description}], id`),
      `icon` shared with positional `FACT_ICONS` fallback, renderer, fixture
      extended with `,keyFacts`; home `skipped` drops `keyFacts`. Batch A:
      `metrics` (new id v1, registered-only — commented out of the route, not
      migrated) + `whyChooseUs` (new id v1, migrated); fixture
      `...,keyFacts,whyChooseUs`; `skipped` drops `whyChooseUs`. Batch B:
      `about` + `surveyingInstruments` (new ids v1, migrated); fixture
      `...,whyChooseUs,about,surveyingInstruments`; `skipped` drops both.
      Batch C: `coreExpertise` + `planningInfographic` (new ids v1,
      migrated; `industriesWeServe` decided covered-by-`cardGrid`, no code);
      fixture `...,surveyingInstruments,coreExpertise,planningInfographic`;
      `skipped` drops both. Batch D: `coverageArea` + `surveyCost` (new ids
      v1, migrated); fixture
      `...,planningInfographic,surveyCost,coverageArea`; home `skipped` is
      now `["hero", "drones", "services", "metrics"]`. Each batch committed
      separately with `check:keystatic` + `--verify` + `typecheck` + `eslint`
      green.)
- [x] Migrate `/` content for the newly registered sections (extend
      `scripts/migrate-locale-to-keystatic.mjs` home mapping, regenerate
      `content/pages/home.json`, keep `draft` until dev-smoke parity).
      (2026-09-16: `trusteesBuild` added — labels per-locale via `reqText`,
      `logoUrl` shared via `sharedValue` gate; `contentNamespace: "common"`
      added to `generate()` because HEAD `9b3f8d0` moved all home content nodes
      to `common.json`; pre-existing `from: "cta"` corrected to
      `from: "defaultCta"` — `home:cta` exists nowhere, `CtaSection` reads
      `common:defaultCta`; `home.json` regenerated to 6 sections.
      2026-09-17: `certificationsBuild` + `keyFactsBuild` added (4 items each,
      no gaps); `home.json` regenerated to 8 sections, `--verify` clean.
      Batches A–D: `whyChooseUsBuild` (6 items), `aboutBuild`
      (whoWeAre/mission/featureImg/cards), `surveyingInstrumentsBuild`
      (7 items), `coreExpertiseBuild` (5 items),
      `planningInfographicBuild` (5 benefits, closingStatement verbatim as
      gate), `coverageAreaBuild` (3 stats + 3 groups, shared-number gate),
      `surveyCostBuild` (3 factors + 3 ranges + includes bullets + CTAs);
      `home.json` now 15 sections, `--verify` clean every batch. Batch D
      fix: mapping entries ordered `surveyCost` then `coverageArea` to match
      page order (first attempt had them swapped and failed the fixture
      string — caught by `check:keystatic`, fixed, green.)
- [x] Rewire `[locale]/index.tsx` interleaved hybrid (count guard + fixed tails) and
      prove `yarn check:keystatic` + `--verify` + `typecheck` + `lint` + dev-smoke parity.
      (2026-09-16: rewired — `KEYSTATIC_SECTION_COUNT` 5→6, `renderAt(5)` replaces
      legacy `<TrusteesSection/>` in the Keystatic branch (legacy branch untouched);
      `check:keystatic` OK (12 sections), `--verify` OK (home 6 sections, no gaps),
      `tsc --noEmit` 0, `eslint --max-warnings=0` 0 on touched files.
      2026-09-17: rewired — count 6→7→8, `renderAt(6)` replaces legacy
      `<CertificationsSection/>`, `renderAt(7)` replaces legacy
      `<KeyFactsSection/>` (legacy branch untouched; visual order preserved:
      keyFacts → certifications → trustees);
      `check:keystatic` OK (14 sections), `--verify` OK (home 8 sections, no gaps),
      `tsc --noEmit` 0, `eslint --max-warnings=0` 0 on touched files.
      Batches A–D: count 8→9→11→13→15; `renderAt(8)` whyChooseUs,
      `renderAt(9)` about, `renderAt(10)` surveyingInstruments, `renderAt(11)`
      coreExpertise, `renderAt(12)` planningInfographic, `renderAt(13)`
      surveyCost, `renderAt(14)` coverageArea (legacy branch untouched
      throughout); final `check:keystatic` OK (22 sections),
      `--verify` OK (15 sections, no gaps), `tsc --noEmit` 0,
      `eslint --max-warnings=0` 0 on touched files.
      DONE 2026-09-17: dev-smoke parity user-confirmed (`home` temp publish
      flip, `/en` + `/sw` Keystatic vs legacy, reverted to `draft` after;
      `company-profile` stays `published` per M4). M8 exit criteria met.)

**Exit criteria:** every in-scope HEAD shared section has a registry id + schema +
example + renderer + check coverage; `home.json` carries its content; `/en` + `/sw`
render it from Keystatic when opted in, legacy otherwise; unknown/missing values still
fail safe per M3 taxonomy.

### M9: Editable Common Layout Content

**Status: DONE** (2026-09-17 — singleton live behind `site` opt-in; dev-smoke parity user-confirmed; see close-out log row).

Dependencies: M8 (registry pattern proven on the new sections); layout sources today:
`src/layouts/LandingPage/Navbar.tsx` (`common:nav` + `common:contacts` + `meta:site`),
`src/layouts/LandingPage/Footer*.tsx` (`common:footer` + `contact:talkToUs.contacts` +
`contact:social.channels`), `src/components/CookieConsent.tsx` (`common:cookies`),
socials (`common:socials`, `contact:social`), contacts (`common:contacts`).

Scope (per user request 2026-09-16): editors must be able to edit common layout
content in Keystatic — navbar, footer, cookie consent, socials, contacts — once, with
both `en`/`sw` values, applied site-wide.

Design constraint (to confirm before implementing): layout content is singleton
site-wide data, not ordered page sections — model as a new Keystatic
singleton/collection (e.g. `content/site.json` or `content/layout/*.json`), NOT a
`pageBuilder` branch; pages keep rendering layout outside `<main>` per
`src/layouts/LandingPage/Layout.tsx`.

- [x] Decide the layout content model (singleton vs collection, file path(s),
      relationship to `common.json`/`contact.json` namespaces) and record with date.
      (Decided 2026-09-17, Stage 1 inventory: ONE Keystatic singleton `site` →
      `content/site.json` with `status` draft/published — site-wide data, NOT
      `pageBuilder` branches. Reader inventory proves the owned surface:
      Navbar reads `common:nav.{links,logo,logo_light,logo_alt}` +
      `common:contacts` (PageTransitionLoader also reads `nav.logo` — inherits
      the override); both Footers read `common:footer.*` +
      `contact:talkToUs.contacts` + `contact:social.channels`; CookieConsent
      reads `common:cookies.*`. Delivery is a server-side STORE OVERRIDE in
      `getI18nProps` (single touch point, zero component changes): published +
      allowlisted singleton → deep-merge owned slices into
      `_nextI18Next.initialI18nStore`, then `signMediaDeep` (so Keystatic
      media refs are signed too); otherwise the legacy store ships
      byte-identical. Opt-in reuses the M3 switch: reserved slug `site` in
      `KEYSTATIC_PAGES` + `KEYSTATIC_DISABLE` kill-switch, same taxonomy.
      Side effect (documented): legacy `/contact` tail (`TalkToUsSection`
      reads whole `contact:talkToUs`) follows the singleton too — single
      source; the `/contact` page ENTRY copy wins on `/contact` when opted
      in. Explicitly OUT: `common:socials` (unrendered dead content),
      `nav.ctaPrimary/ctaSecondary/ctaSearch` + `nav.logo_dark`
      (unrendered), `common:locales`/`common:misc` (routing), `meta:site`
      (brand/SEO, legacy-owned).)
- [x] Define typed schemas (nav links incl. nested `links`, footer columns, contact
      items, social channels, cookie-consent copy) with `en`/`sw` parity + fallback.
      (Stage 2, 2026-09-17: `src/lib/keystatic/siteLayout.ts` — single source
      for the `site` singleton schema (`siteLayoutSchema`), normalize
      (`normalizeSiteLayout`) and example (`siteLayoutExample`); config adds
      `singletons.site` with `path: "content/site"` (prefix — the reader
      appends `.json`; `content/site.json` on disk). `resolveLayout.ts`
      implements the M3 taxonomy for the reserved slug `site` + `mergeSiteLayoutIntoStore`.
      Migration `scripts/migrate-layout-to-keystatic.mjs` (`--write`/`--verify`,
      `yarn migrate:layout`) generated `content/site.json` (`draft`, no gaps).
      Fixes found by checks: singleton path prefix (was `content/site.json` →
      reader looked for `content/site.json.json`); `previewText` path for
      localeText arrays is `["fields","en","value"]`. Check script pins:
      schema keys, example normalization, resolver matrix
      (disabled/missing/unpublished/malformed → legacy), real-fixture
      resolution (sw: 6 nav links, `Upimaji` first label, 6 footer contacts,
      4 social channels), merge replacement + `nav` additivity, and full
      en+sw owned-slice parity with legacy.)
- [x] Wire `Navbar`/`Footer`/`CookieConsent` to the Keystatic reader with legacy
      locale-JSON fallback (same M3 taxonomy: disabled/missing/unpublished/error →
      legacy + warn, never blank).
      (Stage 3, 2026-09-17: zero component changes — `getI18nProps`
      (`src/lib/i18n.ts`, the single funnel for every page incl.
      `makeStaticProps`) resolves the singleton and merges owned slices into
      the serialized store before `signMediaDeep`. Two normalize fixes from
      the parity proof: empty nav `links` omitted (legacy Contact pill has no
      `links` key) and store keys stay snake_case (`logo_light`,
      `logo_alt`); `nav` merges additively so dead keys (`logo_dark`,
      `cta*`) survive. Ops: `check:keystatic` chain + `migrate:layout`
      helper in `package.json`; `site` slug documented in `.env.example`.)
- [x] Prove `check:keystatic` + `typecheck` + `lint` + dev-smoke parity (layout change
      visible on multiple routes, rollback via kill-switch).
      (`check:keystatic` OK incl. layout matrix + parity, `typecheck` clean,
      `eslint` clean on touched files — all 2026-09-17. DONE 2026-09-17:
      dev-smoke user-confirmed (allowlist `site` + temp publish flip, layout
      change visible on multiple routes in `/en` + `/sw`, reverted to `draft`
      after; verified `home: draft`, `site: draft`, `company-profile:
      published`). M9 exit criteria met.)

**Exit criteria:** an editor can change navbar/footer/cookie-consent/socials/contacts
once in Keystatic (both locales) and see it site-wide; legacy locale JSON still renders
when the layout entry is absent/unpublished/unreadable.

### M10: New Keystatic Pages Resolve to Real Routes (No 404)

**Status: IN PROGRESS**

Dependencies: M3 resolver + per-page source switch (`resolveKeystaticPage`,
`KEYSTATIC_PAGES` allowlist, `KEYSTATIC_DISABLE` kill-switch); M7 per-page wiring
pattern (localized route + root proxy).

Problem (per user report 2026-09-16): pages newly created in Keystatic
(e.g. `content/pages/test-custom.json`, slug `test-custom`, `status: published`)
redirect/404 — there is no matching Next.js route, so no URL exists to serve them
on. Evidence: `content/pages/*.json` holds 31 entries (incl. `test-custom.json`)
while `src/pages/[locale]/` only has a fixed set of route files; every renderable
page today needs BOTH a content entry AND a route file calling
`resolveKeystaticPage("<slug>", lang)` (e.g. `[locale]/about.tsx` ↔ slug `about`,
root `about.tsx` re-exporting it). A content-only entry (no route file, no locale
namespace in `getI18nProps`, no slug→route mapping) can never resolve — the 404
comes from Next.js routing, before Keystatic is even consulted.

- [x] Decide the URL model for editor-created pages: fixed route per page (current
      M7 pattern: new `[locale]/<slug>.tsx` + root `<slug>.tsx` proxy) vs. a generic
      catch-all route (e.g. `[locale]/[...slug].tsx`) that resolves any Keystatic
      slug. Record the decision + date; see "Decisions To Confirm" (canonical page
      URL model).
      (Decided 2026-09-17, Stage 1: CATCH-ALL. Fixed-route-per-page requires a
      code change + deploy for every editor-created page, defeating the goal
      "a page created in Keystatic renders". `src/pages/[locale]/[...slug].tsx`
      (+ root `[...slug].tsx` proxy, same pattern as `about.tsx`) resolves any
      single-segment slug with no top-level fixed file via the unchanged M3
      pipeline; fixed routes take Next.js precedence and are unaffected.
      Content-only pages have no legacy implementation, so every non-keystatic
      outcome (disabled/missing/unpublished/error, multi-segment, reserved or
      `home` slugs) is a 404 + server warn — never blank. Known limitation
      (documented, same class as the M8 Trans gate): published + allowlisted
      nested/hub entries ALSO resolve at their flat `/<slug>` URL; don't link
      those — the fixed route is canonical.)
- [x] If fixed-route: document the new-page checklist (route file + root proxy +
      locale namespace(s) in `getI18nProps` + `content/pages/<slug>.json` +
      `KEYSTATIC_PAGES` opt-in + sitemap/nav entry) and wire the missing route(s).
      (N/A 2026-09-17 — catch-all decided instead; the checklist below replaces it.
      New-page checklist (no code deploy): 1) create the entry in Keystatic admin
      (`Pages` → slug: single-segment lowercase/hyphens, MUST NOT collide with a
      fixed route or `home`); 2) compose registry sections in both locales;
      3) set `status: published`; 4) add the slug to `KEYSTATIC_PAGES`;
      5) optional: add a nav link via the `site` singleton + link to it from
      content. Rollback: drop the slug / re-draft / `KEYSTATIC_DISABLE=1`.)
- [x] If catch-all: implement the fallback route with the M3 taxonomy
      (disabled/missing/unpublished/error/empty → legacy or 404 + `console.warn`,
      never blank), locale-prefixed URLs (`/en/<slug>`, `/sw/<slug>`), and sitemap
      coverage. Prove existing fixed routes are unaffected.
      (Stage 2, 2026-09-17, commit `f0a2eba`: `src/pages/[locale]/[...slug].tsx`
      + root `[...slug].tsx` proxy (default-locale unprefixed URLs, same pattern
      as `about.tsx`). Single-segment, non-reserved (`home`, `keystatic`),
      published + allowlisted → `PageBuilderDocument`; everything else 404s
      (content-only pages have no legacy). Fixed routes take Next.js precedence
      — untouched. `PageHead` degrades gracefully (unknown `meta:pages` key →
      site title + humanized breadcrumbs). Sitemap: `getKeystaticSitemapSlugs`
      (build-time, pinned by checks) lists published + allowlisted + unwired
      slugs — wired detection greps `src/pages` for
      `resolveKeystaticPage("<slug>")` literals + `home`. Pilot fixture
      `content/pages/test-custom.json` (`draft`, hero + ctaBand) committed for
      publish-flip smoke.)
- [ ] Prove `check:keystatic` + `typecheck` + `lint` + dev-smoke (new page renders
      in both locales when published+allowlisted, 404s otherwise, rollback via
      kill-switch).
      (`check:keystatic` OK incl. catch-all file contract, novel-slug
      resolution (published → keystatic, draft → legacy), pilot-fixture
      resolution and sitemap helper; `typecheck` clean; `eslint` clean on
      touched files — all 2026-09-17. PENDING: dev-smoke — flip `test-custom`
      to published + `KEYSTATIC_PAGES=test-custom`, confirm `/en/test-custom`
      + `/sw/test-custom` render and an unknown slug 404s, revert to `draft`.
      Needs a browser session.)

**Exit criteria:** a page created in Keystatic renders at its locale-prefixed URL in
both locales when published and allowlisted (no 404); unpublished/unallowlisted
slugs fall back per the M3 taxonomy; the authoring checklist (or catch-all
behavior) is documented so the next new page does not 404.

### M11: Register Unregistered Page Sections as Unique Sections

**Status: IN PROGRESS** (home pilot: `homeHero` + `homeDrones`; remaining pages batched after).

Dependencies: M2 registry + schema factories, M7 per-page wiring, M8/M9 additive-`data`
precedent (`LeadGenBar`, `ServicesSection`).

Problem (per user request 2026-09-18): every interleaved-hybrid route still renders
one or more legacy tails that have no registry branch — e.g. the `/` WebGL hero
(`HeroSection`) and drones grid (`DronesSection`) render from locale JSON even when
`home` is opted in, so editors cannot touch them. Shared ids are for shared
components; page-specific tails become page-scoped UNIQUE section ids
(e.g. `homeHero`, `homeDrones`) that are never reused on another page.

Rules (decided 2026-09-18, before implementing):

- Follow the M9 additive-`data` precedent: refactor the wrapper to an optional
  `data` prop (omitted = legacy `t()` render, bare callers untouched); register
  schema + example + normalizer in `sectionRegistry.ts`, renderer in
  `sectionRenderers.tsx`, migration build where the content lives in locale JSON.
- New sections must stay statically renderable (client-only behavior via
  `next/dynamic ssr:false` + effect-only code) — proven by the check-script
  render proof for every example in both locales.
- Pseudo-markup (`<primary>`/`<accent>`/`<bold>`) lives in locale JSON and is
  rendered via `<Trans>` there; where a unique section must render it from DATA,
  the wrapper parses the inline tags itself so Keystatic edits change output
  (no gate-only fields for unique sections — the component is page-owned).
- Truly runtime-only tails with no serializable content (forms posting to
  Formsprey, Maps JS, PDF-viewer iframe, globe canvas itself) keep behavior in
  the renderer; only their STRINGS become data. If a tail has no editable
  strings at all, record it out-of-scope with reason instead of forcing a branch.
- Batches: home pilot first (`homeHero` from `home:hero`, `homeDrones` from
  `common:drones`); then per-page batches for the remaining opted-in routes'
  tails (about 3, hubs, children, contact/careers/company-profile/legal tails).
  One commit per batch with a simple message.

- [x] Home pilot: `homeHero` (badge/headline/description/CTAs/location) +
      `homeDrones` (tag/headline/description/items) registered, migrated into
      `home.json`, wired into `[locale]/index.tsx` (legacy branch untouched).
      (Done 2026-09-18: additive-`data` refactor on both wrappers; headline
      `<primary>`/`<accent>` parsed from data; `home.json` 17→19 sections,
      `skipped` now `["metrics"]`; count guard 17→19; README 24→26 sections.
      Validation: `check:keystatic` OK, `--verify` clean, typecheck + lint
      clean; dev-smoke DEFERRED per M11/M12 policy.)
- [ ] Per-page batches: each opted-in route's remaining legacy tails registered
      as unique sections (or recorded out-of-scope with reason), migrated, wired.
- [ ] README operator list + `.env.example` untouched (no new env); check-script
      fixture/render coverage extended per batch.

**Exit criteria:** every in-scope legacy tail has a registry id + schema +
example + renderer + check coverage; entries carry its content; `/en` + `/sw`
render it from Keystatic when opted in, legacy otherwise.

### M12: Keystatic Order Becomes Page Order (Remove renderAt Indexes)

**Status: NOT STARTED**

Dependencies: M11 per page (a page can only drop its indexes once ALL its
sections are Keystatic-owned).

Problem (per user request 2026-09-18): interleaved hybrids render Keystatic
sections by hardcoded index (`renderAt(0)` … `renderAt(16)`), so the entry order
is an implementation detail instead of the page order — reordering blocks in the
editor silently misplaces sections (guarded only by the count check). Once a
page's sections are all defined in Keystatic, the entry order must BE the page
order and the route must render sequentially with no index literals.

Rules (decided 2026-09-18, before implementing):

- Reorder each entry's `pageBuilder` into legacy page order (migration mapping
  order = entry order; regenerate via `--write`).
- Replace index-based `renderAt(n)` with order-based sequential rendering at the
  legacy positions (a cursor consuming sections in JSX order, which mirrors the
  legacy branch); no `renderAt({index})` literals remain.
- Keep a section-count guard → legacy fallback (misplacement is worse than
  legacy); keep the legacy branch byte-identical; keep route-level layout chrome
  (centering divs, overlap positioning) outside the registry (never `className`
  in content).
- Home first (all sections Keystatic-owned after the M11 pilot except
  commented-out `metrics`), then each M11-completed page in turn.

- [ ] Home: `home.json` reordered into page order; `[locale]/index.tsx`
      Keystatic branch renders sequentially with no index literals.
- [ ] Remaining M11-completed pages: same reorder + sequential render, one batch
      at a time.
- [ ] `check:keystatic` fixture strings + `--verify` green per batch.

**Exit criteria:** no `renderAt(<index>)` literals remain on migrated pages;
entry order == page order; reordering blocks in the editor reorders the page;
legacy fallback still guards count mismatches.

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
| 2026-09-16 | M7 | Batch 8 DONE (resource-mapping + building-site-surveys, tests deferred): resource-mapping = hero dual-pill + whyStandOut cardGrid (cols 4 centred surface) via existing `cardGridBuild`, 2 sections; building-site = section1 introText split via `introTextBuild`, actionCta ctaBand split/shimmer, exploreMore gallery grid via `galleryBuild`, cta ctaBand centred/hairline, 4 sections. Both entries generated via `--write` (no gaps — generation only). Routes wired interleaved with count guards (resource KS at 0,9; building-site KS at 1,6,10,11). Tails stay legacy: resource sector/leadImages + fallbackIcons grids + workflow/deliverables/finalCta bespoke; building-site bespoke hero + indexed/fallbackIcons grids + Process layout/columns (outside registry contract) + deliverables explorer | Validation DEFERRED per M7 policy: no `--verify`/`check:keystatic`/`typecheck`/`lint`/dev-smoke this batch; run once after all M7 stages | |
| 2026-09-16 | M7 | Batch 9 DONE (aerial-surveys + cadastral-surveys, tests deferred): aerial = hero with 3 footnote chips (icons shared, text localized — first footnote migration) + precision splitMedia right/surface, 2 sections; cadastral = hero only (empty description via optText), 1 section. Both entries generated via `--write` (no gaps — generation only). Routes wired interleaved with count guards (aerial KS at 0,4; cadastral KS at 0). Tails stay legacy: aerial bespoke intro + popup services + workflow/deliverables + fallbackIcons grids + size/pill-override CtaBands + projects/additional/final; cadastral whatsABoundarySurvey DORMANT (IntroSection commented out — not migrated) + bespoke postHeroCta band + case-work tails | Validation DEFERRED per M7 policy: no `--verify`/`check:keystatic`/`typecheck`/`lint`/dev-smoke this batch; run once after all M7 stages | |
| 2026-09-16 | M7 | Batch 10 DONE (ground-penetrating-radar + gis-mapping, tests deferred): GPR = technicalCta ctaBand split/shimmer/hairline + faqs faq (6 question/answer items + still-curious card from `cta`), 2 sections; GIS = consultationCta ctaBand split/shimmer/hairline, 1 section. Both entries generated via `--write` (no gaps — generation only). Routes wired interleaved with count guards (GPR KS at 1,15; GIS KS at 2). Tails stay legacy: GPR bespoke hero + indexed/fallbackIcons grids + bespoke deliverables/sue/limitations/beforeAfter/technology/summary/highlights/jumpNav/overview/methodology/featuredProjects/finalCta; GIS bespoke hero (`<bold>` markup) + all cardGrids on non-contract props + bespoke remainder | Validation DEFERRED per M7 policy: no `--verify`/`check:keystatic`/`typecheck`/`lint`/dev-smoke this batch; run once after all M7 stages | |
| 2026-09-16 | M7 | Batch 11 DONE (civil highway-surveys + as-built-surveys, tests deferred): highway = hero + overview introText surface + benefits cardGrid cols-3 surface, 3 sections; as-built = hero + whatAre/maxProductivity/actionableInsights introTexts + keyIndustries/applications cardGrids, 6 sections. Both entries generated via `--write` (no gaps — generation only). Routes wired interleaved with count guards (highway KS at 0,1,3; as-built KS at 0,1,3,4,5,6). Tails stay legacy: highway `indexed` services grid + deliverables explorer; as-built `indexed` solutions grid + deliverables explorer | Validation DEFERRED per M7 policy: no `--verify`/`check:keystatic`/`typecheck`/`lint`/dev-smoke this batch; run once after all M7 stages | |
| 2026-09-16 | M7 | Batch 12 DONE (civil bim + site-engineering + site-setting-out + volumetric-surveys, tests deferred): bim = secondary-only hero (absent ctaPrimary → empty/null) + centred cta, 2 sections; site-engineering = centred cta only, 1 section; site-setting-out = dual-pill hero + 9-item faq (icon/title/description), 2 sections; volumetric = dual-pill hero + 2 introTexts + right splitMedia + centred cta, 5 sections. All four entries generated via `--write` (no gaps — generation only). Routes wired interleaved with count guards (bim KS at 0,3; se KS at 4; sso KS at 0,4; vol KS at 0,1,2,4,6). Tails stay legacy: bim `indexed` grid + deliverables; se `<bold>` hero + `Split` overview + indexed/media-bg grids + deliverables; sso indexed/mediaBadged grids + deliverables; vol left-aligned services grid + deliverables. Fixed a plan-edit misplacement (batch 11/12 ordering + duplicate batch 9 block) in the same change | Validation DEFERRED per M7 policy: no `--verify`/`check:keystatic`/`typecheck`/`lint`/dev-smoke this batch; run once after all M7 stages | |
| 2026-09-16 | M7 | Batch 13 DONE (aerial-drones solar-panel + landfill-quarry, tests deferred): solar = hero + centred cta (wrapper-hardcoded arrow icon stored as shared literal), 2 sections; landfill = hero + quarryServices/maximizeProductivity introTexts, 3 sections. Both entries generated via `--write` (no gaps — generation only). Routes wired interleaved with count guards (solar KS at 0,3; landfill KS at 0,1,3). Tails stay legacy: solar `card.iconShape: "xl"` grid + `indexed` process; landfill iconShape + fallbackIcons grids. Per-batch commit workflow adopted (commit per batch, then proceed) | Validation DEFERRED per M7 policy: no `--verify`/`check:keystatic`/`typecheck`/`lint`/dev-smoke this batch; run once after all M7 stages | |
| 2026-09-16 | M7 | Batch 14 DONE (aerial-drones monitoring-and-evaluation + as-built-surveys, tests deferred): M&E = hero + 3 introTexts + centred cta, 5 sections; as-built = hero (no title key → optText, h1 falls back to description) + metrics stats band + first bleed-variant + first images cta, 3 sections under hub-prefixed slug `aerial-drones-as-built-surveys` (bare slug taken by civil child). Completeness gate caught 2 real gaps, fixed: hero title optText + `sw` cta href curly-apostrophe aligned to en (one-char mailto fix, batch-2 precedent). Entries generated via `--write` (no gaps after fixes — generation only). Routes wired interleaved with count guards (M&E KS at 0,1,3,5,8; as-built KS at 0,3,4). Tails stay legacy: M&E fallbackIcons/iconShape/actions/leadImages grids; as-built fallbackIcons grid + layout/columns process | Validation DEFERRED per M7 policy: no `--verify`/`check:keystatic`/`typecheck`/`lint`/dev-smoke this batch; run once after all M7 stages | |
| 2026-09-16 | M7 | Batch 15 DONE (aerial-drones agricultural-ndvi + lidar, tests deferred): agri = hero only, 1 section; lidar = hero + forestry/left-surface-wide + construction/right-default-wide splitMedias, 3 sections. Both entries generated via `--write` (no gaps — generation only). Routes wired interleaved with count guards (agri KS at 0; lidar KS at 0,4,5). Tails stay legacy: agri split-cards + layout/columns process; lidar indexed grid + layout/columns process + normalizeHref cta. DECISION: `aerial-drones/volumetric-surveys` DEFERRED — no `sw` namespace exists (en-only page); revisit when translated | Validation DEFERRED per M7 policy: no `--verify`/`check:keystatic`/`typecheck`/`lint`/dev-smoke this batch; run once after all M7 stages | |
| 2026-09-16 | M7 | Batch 16 DONE (planning batch, no code): confirmed bespoke-only deferrals for `aerial-drones/landing` (carried from batch 4), `drone-imagery-surveys` and `photography-video-marketing` (zero registry-contract sections each — documented per page); equipment model decided file-based (checklist ticked, user may override); home inventory recorded (migratable: 2 ActionCtas, Industries, Faq, masked Cta; tails: WebGL hero, LeadGenBar, CoreExpertise extras, globe, bespoke rest) — home implementation splits into batches 17+. Also fixed two plan-edit misplacements in-session (non-unique oldString edits); rule going forward: always anchor plan edits with batch-specific context | No tests run (plan-only change; deferred validation unaffected) | |
| 2026-09-16 | M7 | Batch 17 DONE (home, tests deferred): 2 split/shimmer ActionCtas + Industries label→title cardGrid (CardList renders `title ?? label`, stored title identical) + faq with direct still-curious object + masked/id Cta, 5 sections, `draft` (overwrites M1 starter). Entry generated via `--write` (no gaps — generation only). `[locale]/index.tsx` wired interleaved with count guard 5 (nested layout divs preserved). Tails stay legacy: WebGL hero, global LeadGenBar, CoreExpertise extras grid, CoverageArea globe, bespoke rest | Validation DEFERRED per M7 policy: no `--verify`/`check:keystatic`/`typecheck`/`lint`/dev-smoke this batch; run once after all M7 stages | |
| 2026-09-16 | M7 | CLOSE-OUT — M7 DONE. Deferred validation run once across the whole site, all green: `check:keystatic` OK (11 sections, 30 fixtures; 1 stale assertion fixed — M1 starter home → migrated home + temp publish); `--verify` clean for all 30 mapped pages; `yarn typecheck` clean; `yarn lint` clean; dev-smoke user-confirmed good (all 30 routes en+sw, temp publish flips reverted; company-profile stays `published` per M4); README (11 sections) + `.env.example` (multi-slug allowlist) updated; rollback covered by resolver matrix. M7 exit criteria met: 30 wired (`draft` except company-profile) + 4 deferred-with-reason (landing/drone-imagery/photography bespoke-only, aerial-volumetric en-only) + equipment file-based. Residuals → M6: `yarn build` standing skip, keyboard/responsive/visual + perf need a browser session. NOTE: unrelated `Process/index.tsx` timeline-visual tweak in working tree — not reviewed, not committed, left for its owner | M7 DONE; M6 stays IN PROGRESS on browser residuals only | |
| 2026-09-17 | M8 | `certifications` + `keyFacts` registered (new ids v1, schema + example + normalize + renderer each; `certifications.name` shared literal via `sharedValue` gate, `keyFacts.icon` shared with positional fallback; itemLabel previews fixed — `keyFacts` items carry `label` not `title`, so inline `previewText` on `fields.label` instead of `previewTitledItem`). Migration: `certificationsBuild` + `keyFactsBuild` (4 items each, no gaps), home `skipped` drops both, `home.json` 6→8 sections, `--verify` clean. Route: count guard 6→7→8, `renderAt(6)` replaces legacy `<CertificationsSection/>`, `renderAt(7)` replaces legacy `<KeyFactsSection/>` (legacy branch untouched, visual order preserved). README section list 11→14. Files: `sectionRegistry.ts`, `sectionRenderers.tsx`, `migrate-locale-to-keystatic.mjs`, `check-keystatic-pages.mjs`, `[locale]/index.tsx`, `content/pages/home.json`, README, plan | `check:keystatic` OK (14 sections, 30 fixtures; 3 fallback warnings = expected negatives); `--verify` home clean (8 sections, no gaps); `yarn typecheck` clean (23s); `eslint --max-warnings=0` clean on touched files. PENDING: dev-smoke parity (publish-flip `home`, compare `/en` + `/sw`, revert to `draft`) — needs a browser session; 9 M8 sections remain (About, CoreExpertise, CoverageArea, IndustriesWeServe, Metrics, PlanningInfographic, SurveyCost, WhyChooseUs, SurveyingInstruments) | |
| 2026-09-17 | M8 | Batches A–D DONE (all 9 remaining sections resolved, one commit per batch with simple message). A: `metrics` (new id v1, registered-only — wrapper commented out of route) + `whyChooseUs` (new id v1, migrated, 6 items). B: `about` (whoWeAre/mission/featureImg/cards) + `surveyingInstruments` (7 items, empty-href→`<article>` branch preserved) — fixed an `eslint` unused-arg warning in the `block` helper. C: `coreExpertise` (new id v1, NOT `cardGrid` v3 — presentation flags outside v2 contract) + `planningInfographic` (closingStatement verbatim as visibility gate; component keeps `<Trans>` lookup — check-script emits the expected `NO_I18NEXT_INSTANCE` notice in its isolated render); `industriesWeServe` decided covered-by-`cardGrid`, no code. D: `coverageArea` (shared-number gate for stat values, localized chips) + `surveyCost` (nested factors/ranges/includes, integer prices, CTA hrefs shared); fixed a mapping-order swap (surveyCost/coverageArea) caught by the fixture string. Route count guard 8→9→11→13→15; legacy branch untouched throughout. `home.json` 8→15 sections (stays `draft`); `skipped` now `["hero", "drones", "services", "metrics"]`; README list 14→22 | `check:keystatic` OK every batch (final: 22 sections, 30 fixtures); `--verify` home clean every batch (final: 15 sections, no gaps); `yarn typecheck` clean every batch; `eslint --max-warnings=0` clean on touched files every batch. Commits: batch A `6a0e24a`, batch B `2731207`, batch C `c62aa14`, batch D `97b3508`, docs `50af3b3`. REMAINING to close M8: dev-smoke parity only (publish-flip `home`, compare `/en` + `/sw`, revert to `draft`) — needs a browser session | | |
| 2026-09-17 | M9 | Stage 1 DONE (model decided: one `site` singleton → `content/site.json`, store-override delivery in `getI18nProps`, reserved slug `site` + kill-switch, exclusions recorded). Stage 2 DONE (commit `2dce4e3`): `siteLayout.ts` (schema + normalize + example), `resolveLayout.ts` (taxonomy + merge helper), config singleton (`path: "content/site"` — prefix, reader appends `.json`), `migrate-layout-to-keystatic.mjs` + `content/site.json` (`draft`, no gaps), check-script layout matrix. Fixes: singleton path prefix; localeText-array `itemLabel` path `["fields","en","value"]`. Stage 3 DONE (commit `72b7106`): `getI18nProps` merge (zero component changes) + `check:keystatic` chain + `migrate:layout` helper + `.env.example` `site` docs. Parity proof fixes: empty nav `links` omitted; store keys snake_case; `nav` merges additively (dead keys survive). Docs commit (this change): plan checklist + README operator guide | `check:keystatic` OK (22 sections + layout matrix + en/sw parity); `migrate-layout --verify` clean; `yarn typecheck` clean; `eslint` clean on touched files. REMAINING to close M9: dev-smoke only (allowlist `site` + temp publish flip on multiple routes en+sw, revert to `draft`, kill-switch rollback) — needs a browser session | |
| 2026-09-17 | M8 | CLOSE-OUT — M8 DONE. Dev-smoke parity user-confirmed (`home` temp publish flip, `/en` + `/sw` Keystatic vs legacy good); entries verified reverted (`home: draft`, `company-profile: published` per M4). All 12 in-scope sections resolved (10 migrated, `metrics` registered-only, `industriesWeServe` covered by `cardGrid`); full gates green every batch | M8 DONE; M6 stays IN PROGRESS on browser residuals only | |
| 2026-09-17 | M9 | CLOSE-OUT — M9 DONE. Dev-smoke parity user-confirmed (allowlist `site` + temp publish flip, layout change visible on multiple routes `/en` + `/sw` good, kill-switch rollback confirmed); entry verified reverted (`site: draft`). Singleton serves navbar/footer/contacts/socials/cookies site-wide in both locales when published + allowlisted; legacy locale JSON renders otherwise per the M3 taxonomy | M9 DONE; next up M10 (NOT STARTED) | |
| 2026-09-17 | M9 | FOLLOW-UP (per user request): `leadGenBar` + `services` registered on `/` (commits `1347e68`, `6a13133`). `LeadGenBar` refactored to additive optional `data` (omitted = legacy `t()`; bare `careers` caller untouched); description stays `<Trans>`-rendered (gate-only, field warns); `title`/`link` keys unrendered → excluded. Home rewire keeps `-mt-48` positioning via route-level `cloneElement` (registry stores content, never `className`). `ServicesSection` refactored to additive optional `data` (other pages' bare callers untouched). LEGACY BUG FIX (visible, recorded): component read tag/headline from `home:services.*`, which no longer exists — legacy renders raw key strings; Keystatic branch sources `common:services` instead, so opting in fixes the header. String offers migrate to `{label, href: ""}` (renders identically). Home 15→17 sections, count guard 15→17, `skipped` now `["hero", "drones", "metrics"]`; registry 22→24 sections; README list updated | `check:keystatic` OK (24 sections, 31 fixtures); `--verify` home clean (17 sections, no gaps); `typecheck` + `eslint` clean. PENDING: dev-smoke for the two rewired sections (publish-flip `home`, `/en` + `/sw`, revert to `draft`) — needs a browser session | |
| 2026-09-18 | M11/M12 | New milestones added per user request (unique page sections + Keystatic page order) + instructions.md smoke-deferral policy (dev-smoke last; check/verify/typecheck/lint per batch). M11 home pilot DONE: `homeHero` + `homeDrones` registered (schema + example + normalize + renderer each; headline `<primary>`/`<accent>` parsed from data, not gate-only); `homeHeroBuild` (`ns: "home"` override in `generate()`) + `homeDronesBuild`; `home.json` 17→19 sections (appended; M12 reorders), `skipped` now `["metrics"]`; route count guard 17→19, `renderAt(17)` replaces legacy hero, `renderAt(18)` replaces legacy drones (legacy branch untouched); README 24→26 sections | `check:keystatic` OK (26 sections, 31 fixtures); `--verify` home clean (19 sections, no gaps); `yarn typecheck` clean; `yarn lint` clean. Dev-smoke DEFERRED per policy | |
