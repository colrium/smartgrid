# SmartGrid Surveying & Civil Engineering Ltd

> Engineering-Grade Surveying & Geospatial Solutions Across Kenya and East Africa

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript 5.x](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-06b6d4?logo=tailwindcss)
![i18next 26.x](https://img.shields.io/badge/i18next-26.x-26a69a?logo=i18next)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Last commit](https://img.shields.io/github/last-commit/colrium/smartgrid)

A performance-focused, internationalized marketing & content site for SmartGrid Surveying -
a Nairobi-based company delivering engineering-grade **land surveying**, **aerial/drone
surveys**, **civil engineering**, and **surveying equipment** services across Kenya and East Africa.

- 🌐 **Live site:** [https://smartgrid-phi.vercel.app](https://smartgrid-phi.vercel.app)
- 📍 **Headquarters:** Nairobi (Ruiru), Kenya
- 🌍 **Locales:** English, Swahili (auto-detected)
- 🏗️ **Built with:** Next.js 16 · TypeScript · Tailwind CSS · i18next · Keystatic

---

## Table of Contents

- [Demo / Live Site](#demo--live-site)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Dev Server](#running-the-dev-server)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
  - [Routing & Pages](#routing--pages)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [Styling & Theme](#styling--theme)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [SEO & Performance](#seo--performance)
- [Deployment](#deployment)
- [Available Scripts](#available-scripts)
- [Team Coding Standards](#team-coding-standards)
- [FAQ](#faq)
- [License](#license)

---

## Demo / Live Site

- **Production:** https://smartgridsurveying.com
- **Staging / Preview:** https://smartgrid-phi.vercel.app/

---

## Features

- **5 locales** with automatic browser-language detection and a language switcher.
- **Keystatic page builder** for structured pages composed from reusable shared sections.
- **next-i18next locale content** remains the default/fallback source while pages are migrated.
- **Equipment catalogue** driven by a JSON registry (`products.json`) — adding a product listing
  is a single JSON entry plus a per-product locale file.
- **Code-split 3D WebGL hero** (`three.js` / `@react-three/fiber`) — loaded client-only and only
  on capable desktop devices to keep LCP fast on mobile.
- **Animations** via Framer Motion, GSAP, and Lenis smooth-scroll, with scroll-based reveals.
- **Glass-morphism UI**, custom **shimmer** effects, and a curated color system (primary teal,
  accent amber).
- **Forms** powered by Formspree; **WhatsApp** and **Calendly** contact options.
- **Google Maps** integration for office locations (`@vis.gl/react-google-maps`).
- **Analytics** via Vercel Analytics + Google Analytics (`@next/third-parties`).
- **SEO**: `next-sitemap` (sitemap + robots.txt), per-page meta via a `<PageHead>` component,
  Open Graph images, structured product metadata.
- **Image optimization**: AVIF → WebP with quality tiers (60 for large photos, 75 default).
- **MDI icons** loaded at runtime (kept off the initial document critical path).

---

## Tech Stack

| Layer              | Technology                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| Framework          | [Next.js 16](https://nextjs.org) (Pages Router) + React 19                  |
| Language           | TypeScript (`strict: false`, bundler module resolution)                   |
| Styling            | [Tailwind CSS v4](https://tailwindcss.com) + PostCSS                        |
| Internationalization | [i18next](https://www.i18next.com/) + [next-i18next](https://github.com/i18next/next-i18next) |
| Content / CMS      | [Keystatic](https://keystatic.com) (`@keystatic/core`, `@keystatic/next`)  |
| 3D / WebGL         | `three`, `@react-three/fiber`, `@react-three/drei`, `ogl` (code-split)      |
| Animations         | `framer-motion`, `gsap`, `lenis` (smooth scroll)                            |
| State              | `zustand`                                                                    |
| Validation         | `zod` (env parsing)                                                          |
| Forms / Contacts   | `@formspree/react`, Google Maps, WhatsApp, Tawk.to (optional)                |
| Analytics          | `@vercel/analytics`, `@next/third-parties` (Google Analytics)               |
| Icons              | `@mdi/font` (Material Design Icons, runtime-loaded)                         |
| Image assets       | DRACO codec assets, custom cursors, brand imagery in `public/`              |
| Lint / Format      | ESLint 9 (flat config) + `eslint-plugin-unused-imports`, Prettier            |
| Editor config      | `.editorconfig` + `.prettierrc` (tabs, 4, double quotes, 100 cols)            |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (tested with Next.js 16)
- **npm** (a `package-lock.json` is committed; Yarn/PNPM are not the source of truth)

### Installation

```bash
git clone https://github.com/colrium/smartgrid.git
cd smartgrid
npm install
```

### Environment Variables

Copy the example and fill in the required values (Formspree form ID and Google Analytics / Maps
keys). Keystatic uses local storage during development unless a deployed GitHub-backed storage
mode is configured.

```bash
cp .env.example .env.local
```

| Variable                          | Required | Description                                         |
| --------------------------------- | -------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`            | no       | Site URL (used by sitemap / analytics)              |
| `NEXT_PUBLIC_FORMSPREE_FORM_ID`   | no       | Formspree contact form ID                           |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`   | no       | Google Analytics 4 measurement ID                   |
| `NEXT_PUBLIC_TAWK_PROPERTY_ID`    | no       | Tawk.to live-chat property ID                       |
| `NEXT_PUBLIC_TAWK_WIDGET_ID`      | no       | Tawk.to widget ID                                   |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`     | no       | WhatsApp contact number (digits / intl format)      |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | no       | Google Maps JS API key (maps section)               |
| `KEYSTATIC_ADMIN_USER`            | deploy   | Production Keystatic Basic Auth username           |
| `KEYSTATIC_ADMIN_PASSWORD`        | deploy   | Production Keystatic Basic Auth password           |
| `KEYSTATIC_GITHUB_REPO`           | deploy   | GitHub storage as `owner/name` (enables GitHub-backed editing) |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | deploy | Keystatic GitHub App URL slug                    |
| `KEYSTATIC_GITHUB_CLIENT_ID`      | deploy   | Keystatic GitHub App client ID                     |
| `KEYSTATIC_GITHUB_CLIENT_SECRET`  | deploy   | Keystatic GitHub App client secret                 |
| `KEYSTATIC_SECRET`                | deploy   | Session-signing secret, ≥32 random chars           |

Keystatic administration is available at `/keystatic` and `/api/keystatic/*`. Development is
unrestricted; production requests are protected by the middleware Basic Auth gate. Configure the
storage repository and GitHub integration in `keystatic.config.ts` through deployment-safe
environment variables before enabling GitHub-backed editing.

> Environment variables are validated at runtime with Zod (`src/lib/env.ts`). Invalid values
> will crash the app at startup with a readable error.

### Running the Dev Server

```bash
npm run dev
# → http://localhost:3000
```

> **Heads up:** Before starting a dev server, check whether one is already running on
> **port 3000** and avoid starting a second instance. Stop it after verification.

---

## Project Structure

```
smartgrid/
├─ .clinerules              # Cline agent rules
├─ AGENTS.md                # Canonical team coding standards & context
├─ CLAUDE.md                # Claude Code instructions
├─ README.md                # this file
├─ package.json
├─ keystatic.config.ts                 # Keystatic schema and storage configuration
├─ tsconfig.json            # @/* -> ./src/*, bundler resolution
├─ next.config.js           # i18n, image formats/qualities, distDir
├─ next-i18next.config.js   # locales: en, de, sw, fr, pt
├─ next-sitemap.config.js   # siteUrl: smartgridsurveying.com
├─ tailwind.config.ts
├─ eslint.config.mjs
├─ postcss.config.mjs
├─ .prettierrc / .editorconfig
├─ @types/
│   ├─ resources.ts         # generated i18n resource types (npm run toc)
│   └─ i18next.d.ts
├─ src/
│   ├─ pages/               # Pages Router routes
│   │   ├─ _app.tsx / _document.tsx
│   │   ├─ 404.tsx / 500.tsx
│   │   ├─ index.tsx, about.tsx, contact.tsx, ...        # root proxies
│   │   └─ [locale]/...                                # real localized routes
│   │   ├─ surveying/ | aerial-drones/ | civil/ | equipment-sale/
│   │   │   └─ (proxy + [locale] mirrors)
│   ├─ components/
│   │   ├─ sections/{home,about,surveying,aerial-drones,civil,equipment-sale}/...
│   │   ├─ animations/       # Fade, ScrollReveal, ClipReveal, ParallaxTile, ...
│   │   └─ ui/               # Avatar, Drawer, Menu, MenuItem, IconButton, ...
│   ├─ layouts/LandingPage/  # Navbar, Footer, Layout (Lenis, ChatWidget, ...)
│   ├─ lib/                  # i18n, keystatic, catalogue, env(zod), types, product
│   ├─ hooks/                # useTranslation (custom), useSetState
│   ├─ styles/globals.css    # Tailwind theme + design tokens + utilities
│   └─ types/next.d.ts
└─ public/
   ├─ locales/{en,sw}/*.json   # i18n namespaces
   ├─ img/{earth,flags,instruments,products,...}
   ├─ fonts/              # Plus Jakarta Sans, Google Sans Flex, Brother 1816
      └─ geojson/            # world countries geometry for maps
    ├─ content/pages/             # Keystatic page documents (created during migration)
    └─ docs/
       ├─ keystatic-page-builder-plan.md
       └─ prompts/keystatic-page-builder-agent.md
```

---

## Architecture Overview

### Routing & Pages

The site uses Next.js **Pages Router** with **locale subpaths**.

- **Real route implementations** live under `src/pages/[locale]/...` (e.g.
  `src/pages/[locale]/index.tsx`, `src/pages/[locale]/about.tsx`).
- **Root-level pages** (`src/pages/index.tsx`, `src/pages/about.tsx`, ...) are thin proxies that
  simply re-export the `[locale]` counterpart — this keeps the default-locale path (`/`) working
  while all real content is served from `/[locale]/`.
- Nested sections (`surveying/`, `aerial-drones/`, `civil/`, `equipment-sale/`) follow the same
  proxy + `[locale]` mirror pattern; `equipment-sale/[product].tsx` is a dynamic route.
- Every page uses `getServerSideProps` → `getI18nProps(context, ["common", "meta", "<pageNS>"])`
  to load its namespaces. The shared layout auto-loads the `contact` namespace.

### Content / Page Builder

Keystatic is the structured page editor. `keystatic.config.ts` defines the page collection and
ordered section data. `src/lib/keystatic/` contains the reader, locale normalization, and
page-builder helpers. The approved component registry will connect serializable components from
`src/components/sections/shared/` (and selected `src/components/ui/` components) to both the
Keystatic schema and the runtime renderer.

The existing `public/locales/{en,sw}/` files remain the default content source during the
incremental migration. Each migrated page must document its source precedence and preserve the
existing localized URL.

### Internationalization (i18n)

- **Locales:** `en` (default), `sw` — see `next-i18next.config.js`.
- **Namespaces:** one JSON file per concern per locale, e.g. `common.json`, `meta.json`,
  `home.json`, `about.json`, `contact.json`, `<service>.json`, `<product>.json`.
- **Custom hook:** components use `src/hooks/useTranslation.ts` — a wrapper around
  `next-i18next`'s `useTranslation` that adds a typed `tObject` helper for `returnObjects`.
- **Sync rule:** whenever you add or change a key in one locale file, apply the same key to every
  locale that has a matching file — **translate the text**, but **copy URLs, slugs, hrefs, codes,
  IDs, numbers, and image paths verbatim**. After adding namespaces, run `npm run toc` to
  regenerate `@types/resources.ts`.
- **Language detection** is handled by `next-language-detector` (`src/lib/languageDetector.ts`);
  the user can override via the Navbar language switcher.

### Styling & Theme

- **Tailwind CSS v4** with custom CSS variables in `src/styles/globals.css`:
  - Primary: teal `#0097b2` (scale 50→900)
  - Secondary: black `#000000`
  - Accent: amber/gold `#975604` (scale 50→900)
  - Surface/Paper/Ink tokens, surface tints, border & ring tokens.
- Custom utilities: `glass`, `glass-dark`, `hairline`, `hairline-dark`, `card-shadow`,
  `card-shadow-lift`, `pale-panel`, `ink-panel`, shimmer variants, and a `:root` shimmer config.
- Fonts: **Plus Jakarta Sans** (body/sans), **Google Sans Flex** (sans-serif), **Brother 1816**
  (display) — all loaded via `next/font` with `display: swap`.
- Dark mode is enabled at the root (`<Html className="dark">`), themed via CSS variables.

---

## Development Workflow

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local   # fill in Formspree / GA / media + Keystatic values

# 3. Develop
npm run dev                  # http://localhost:3000

# 4. Quality gates (run before opening a PR)
npm run lint                 # ESLint (fails on any warning)
npm run typecheck            # tsc --noEmit
npm run build               # production build + next-sitemap
```

**Common tasks**

- **Add a translatable string:** add the key to `public/locales/en/<ns>.json`, translate it in
  every other locale, then run `npm run toc` to refresh `@types/resources.ts`.
- **Add a page:** create `src/pages/[locale]/<page>.tsx` + a root proxy `src/pages/<page>.tsx`,
  add a namespace JSON per locale, load via `getI18nProps(context, ["common","meta","<page>"])`.
- **Add an equipment/product:** register it in `public/locales/en/products.json` and add a
  per-product locale file (e.g. `dji-mavic-3-pro.json`) for each locale.

---

## Code Standards

- **Components:** functional components with **explicit return types**
  (`function HeroSection(): ReactElement`).
- **Formatting:** tabs (indent 4), double quotes, es5 trailing commas, 100-column print width
  (Prettier + `.editorconfig`).
- **HTML:** strict **semantic** markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`);
  headings in logical order; prefer the shared `@/components/Link` over raw `<a>`.
- **Imports:** use the `@/*` alias (→ `./src/*`); never import `useTranslation` from
  `next-i18next` directly — use `@/hooks`.
- **Performance:** code-split heavy libraries with `dynamic(..., { ssr: false })`; mark the LCP
  hero image `priority` + `fetchPriority="high"`; lazy-load off-screen images.
- **Linting:** no unused imports (`unused-imports` is an error); `npm run lint` fails on any
  warning (`--max-warnings=0`).
- **Commits:** `.env.local` is gitignored — never commit secrets. Only `.env.example` is versioned.

Full, canonical standards live in [`AGENTS.md`](./AGENTS.md).

---

## SEO & Performance

- **`<PageHead pageName="..."/>`** renders `<title>`, `<meta name="description">`, and Open Graph
  tags from the `meta` locale namespace (`meta:pages.<page>`).
- **`next-sitemap`** (run as a `postbuild` step) generates `public/sitemap.xml` and
  `public/robots.txt` at build time.
- **Image optimization**: `next/image` serves **AVIF** with **WebP** fallback; large decorative
  photos use quality 60, default stays 75 (see `next.config.js` `images` block).
- **Critical path:** the Material Design Icons stylesheet is injected at runtime (not inlined)
  to keep the initial document lean; heavy Three.js scenes are code-split and device-gated.

---

## Deployment

- **Primary platform:** Vercel (silent GitHub integration — see `vercel.json`).
- **Production domain:** `https://smartgridsurveying.com`
- **Preview deployments:** each PR/commit on `main` builds a preview via Vercel.
- The build output directory (`distDir`) is configurable via `NEXT_DIST_DIR`; this lets CI run a
  verification build into a separate `.next` folder without colliding with a running dev server.

---

## Available Scripts

| Script               | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Start the Next.js dev server (port 3000)         |
| `npm run build`      | Production build (`next build` + `next-sitemap`) |
| `npm run start`      | Serve the production build locally on port 3000  |
| `npm run lint`       | Lint all files (fails on any warning)            |
| `npm run lint:fix`   | Auto-fix lint issues                             |
| `npm run typecheck`  | Type-check with `tsc --noEmit`                   |
| `npm run check:keystatic` | Verify page-builder registry, renderers, fixtures + migration |
| `npm run migrate:keystatic` | Generate/verify a Keystatic page from locale JSON (`--page <slug> --write\|--verify`) |
| `npm run mediakeygen` | Generate a random secret (admin password / media signing key) |
| `npm run clean`      | Remove the `.next` build folder                  |
| `npm run nuke:install` | Remove `node_modules` + lockfile (fresh install) |
| `npm run toc`        | Regenerate `@types/resources.ts` from locale files |
| `npm run merge`      | Merge locale resources into `@types/resources.json` |
| `npm run interface`  | Generate `i18next` type definitions              |

> Note: the dev script is registered as `"dev": "next"` in `package.json`; running
> `npm run dev` starts the Next.js dev server.

---

## Keystatic Page Builder (operator guide)

Structured pages are composed in the Keystatic admin (`/keystatic`, local dev needs
no login) from one hundred eighteen registered sections: `introText`, `ctaBand`, `stats`, `hero`,
`cardGrid`, `splitMedia`, `legal`, `faq`, `process`, `gallery`, `pricing`, `trustees`,
`certifications`, `keyFacts`, `metrics`, `whyChooseUs`, `about`,
`surveyingInstruments`, `coreExpertise`, `planningInfographic`, `coverageArea`,
`surveyCost`, `leadGenBar`, `services`, `homeHero`, `homeDrones`, `contactHero`,
`contactOffices`, `contactForm`, `careersOpenings`, `careersProcess`,
`careersStatement`, `companyProfileViewer`, `aboutAerialSurveying`,
`aboutLandSurveying`, `aboutImpact`, `surveyingServices`, `surveyingProcess`,
`civilHero`, `civilProcess`, `deliverables`, `topoWhenYouNeed`, `topoWhatWeOffer`,
`topoDetailedSurveys`, `topoSampleMap`, `topoInstruments`, `topoWhyConduct`,
`sectionalWhatIs`, `sectionalServicesDetail`, `sectionalWorkflow`,
`sectionalTimeline`, `sectionalWhoNeeds`, `bathyEquipment`,
`bathyLimitations`, `bathyDamsLakes`, `bathyApplications`, `bathyBeforeAfter`,
`rmWhatIs`, `rmTypes`, `rmSector`, `rmWorkflow`, `rmWhoUses`,
`rmTechStack`, `rmDataAccuracy`, `bsHero`, `bsSection2`,
`bsSiteEngineering`, `bsProcess`, `bsAccuracyMatters`, `bsTechnology`,
`bsConsultation`, `aerialIntro`, `aerialWhyDrones`, `aerialServices`,
`workflow`, `aerialSurveyingGrid`, `aerialIndustries`, `aerialIndustryCta`,
`aerialTechStack`, `aerialCapabilityCta`, `finalCta`, `aerialProjects`,
`aerialAdditionalServices`, `cadastralPostHeroCta`, `cadastralWhenYouNeed`,
`cadastralProcessCta`, `cadastralCost`, `cadastralTimeline`,
`cadastralCompliance`, `cadastralCaseStudy`, `gprHero`,
`gprHighlights`, `gprJumpNav`, `gprOverview`, `gprMethodology`, `gprApplications`,
`gprDetect`, `gprSue`, `gprLimitations`, `gprBeforeAfter`, `gprTechnology`,
`gprFeaturedProjects`, `gprSummary`, `gisHero`, `gisWhatIs`,
`gisImportance`, `gisServices`, `gisIndustries`, `gisTechStack`, `gisWhatsappCta`,
`gisComponents`, `gisWhySmartgrid`, `gisDataAccuracy`,
`gisBeforeAfter`, `gisProjectImpact`, `gisRelatedServices`, `highwayServices`,
`asBuiltSolutions`, `bimServices`, `seHero`, `seOverview`, `seWhatWeDo`,
`seExploreMore`, `ssoServices`, `ssoInstruments`, `vsServices`, `solWhatWeDo`,
`solProcess`, `lqQuarryServicesItems`, `lqWhatWeOffer`, `meOurCapabilities`,
`meImpact`, `meSmartMonitoring`, `meWhatWeOffer`, `abWhyUseDrones`, `abProcess`,
`agWhyUseDrones`, `agProcess`, `lidIndustries`, `lidWhyChoose`, `lidPowerline`,
`lidHowItWorks`, `lidCta`. See
`src/lib/keystatic/sectionRegistry.ts` — the single
source for editor options and renderer mappings.

- **Create / edit / remove:** open the `Pages` collection, draft entries with the
  section blocks (labels, descriptions, and defaults ship with every field), reorder
  blocks, then set `status: published` to make the entry servable. Deleting or
  re-drafting an entry falls back to legacy content — never a blank page.
- **Preview / publish flow:** `draft` = invisible to visitors; `published` + slug
  listed in `KEYSTATIC_PAGES` = served from Keystatic (`resolveKeystaticPage` in
  `src/lib/keystatic/resolvePage.ts`, checked by `yarn check:keystatic`). Content
  edits commit straight to the branch Keystatic writes to (local filesystem in dev,
  `KEYSTATIC_GITHUB_REPO` on a deployed CMS environment); there is no separate
  preview deploy — verify with `KEYSTATIC_PAGES=<slug> yarn dev` before widening
  the allowlist.
- **Rollback (two levels):** per-page — remove the slug from `KEYSTATIC_PAGES` or
  set the entry back to `draft`; global kill-switch — `KEYSTATIC_DISABLE=1` forces
  every route to legacy locale JSON. Both are tested in
  `scripts/check-keystatic-pages.mjs` (resolver matrix).
- **Site layout (navbar / footer / contacts / socials / cookie consent / WhatsApp
  chat button):** edit
  once in the `Site layout` singleton (`content/site.json`), in both locales, and
  it applies site-wide — no component changes needed (the server merges the
  published layout into the i18n store in `getI18nProps`). Publish flow is the
  same as pages: `status: published` **plus** the reserved slug `site` in
  `KEYSTATIC_PAGES`; rollback is per-site (drop `site` / re-draft) or the same
  global `KEYSTATIC_DISABLE=1`. Regenerate/verify with
  `node scripts/migrate-layout-to-keystatic.mjs --write|--verify`
  (`yarn migrate:layout`). Notes: `common:socials`, `nav.cta*`, `nav.logo_dark`,
  `common:locales`/`misc` and `meta:site` stay legacy-owned (unrendered or
  routing/brand); the legacy `/contact` tail follows the singleton, while the
  `/contact` page entry copy wins on `/contact` when opted in.
- **New pages (no code deploy):** create the entry in `Pages` (single-segment
  slug — lowercase/hyphens, must not collide with a fixed route or `home`),
  compose sections in both locales, publish it, and add the slug to
  `KEYSTATIC_PAGES`. It renders at `/<slug>` (default locale) and `/sw/<slug>`
  via the catch-all route (`src/pages/[locale]/[...slug].tsx`); unpublished or
  unallowlisted slugs 404. Published + allowlisted entries are picked up by the
  sitemap automatically (wired pages are excluded — they keep their
  `meta.json` URLs). Rollback: drop the slug / re-draft / `KEYSTATIC_DISABLE=1`.
- **Admin access:** non-development `/keystatic/*` and `/api/keystatic/*` require
  HTTP Basic Auth (`KEYSTATIC_ADMIN_USER` / `KEYSTATIC_ADMIN_PASSWORD`, fail-closed,
  constant-time compare in `src/proxy.ts`). Generate the password with
  `yarn mediakeygen`, store it in the host env (Vercel → Project Settings →
  Environment Variables), and rotate regularly. Never commit credentials.
- **GitHub-backed editing (deployed CMS, step by step):** editors' changes commit
  straight to the GitHub repository instead of local files.
  1. Install the [Keystatic GitHub App](https://github.com/apps/keystatic) on the
     repo (`colrium/smartgrid` or your fork) — grant access to **content/** and
     **public/** (all it writes).
  2. From the app's settings page, copy the **App Slug**, **Client ID**, and
     generate a **Client Secret**.
  3. Create a session secret: `node -e "console.log(require('crypto').randomBytes(40).toString('hex'))"`.
  4. Set five env vars on the deployed environment (Vercel → Project Settings →
     Environment Variables) and in `.env.local` for local testing of GitHub mode:
     `KEYSTATIC_GITHUB_REPO=owner/name`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=<app slug>`,
     `KEYSTATIC_GITHUB_CLIENT_ID=<client id>`, `KEYSTATIC_GITHUB_CLIENT_SECRET=<client secret>`,
     `KEYSTATIC_SECRET=<session secret>`. Omitting `KEYSTATIC_GITHUB_REPO` keeps
     local-filesystem storage (`keystatic.config.ts` decides by env — local dev stays
     credential-free by default).
  5. Sign in at `/keystatic` with the GitHub account the app was installed for;
     edits commit to the deployment branch by default (branch/PR behavior follows
     the Keystatic GitHub app configuration). Keep the Basic Auth
     (`KEYSTATIC_ADMIN_USER`/`KEYSTATIC_ADMIN_PASSWORD`) gate enabled — it protects
     `/keystatic/*` and `/api/keystatic/*` before GitHub auth even starts. Never
     commit credentials; rotate the client secret and `KEYSTATIC_SECRET` regularly.
- **Media policy (decided):** no uploads — images are referenced as `/public` paths
  (`imagePath` / `localeMedia` fields); `fields.image` uploads stay disabled until a
  directory-per-entry layout is adopted. Allowed formats follow the existing
  library: JPEG/PNG/WebP/AVIF/SVG under `public/` (gated `/media/**` photos are
  served via short-lived HMAC-signed URLs — see `src/lib/mediaShared.ts`).
- **Accessibility rules for editors:** every image path must render with meaningful
  alt text (shared components fall back to the headline/title — never ship an empty
  `alt` on a content image); keep one `h1` per page (the hero) with section
  headlines as `h2` in stored order — do not skip heading levels when ordering
  blocks.

---

## Team Coding Standards

This repository ships agent/IDE instruction files so that both automated agents and humans share
one set of conventions:

| File          | Purpose                                             |
| ------------- | --------------------------------------------------- |
| `AGENTS.md`   | Canonical project context & coding standards        |
| `.clinerules` | Cline agent operating instructions & guardrails     |
| `CLAUDE.md`   | Claude Code-specific project guidance               |

Key shared rules: functional components with explicit return types, tabs (4) + double quotes,
semantic HTML, performance-first defaults, strict i18n sync, and `lint`/`typecheck`/`build` as
the quality gate. See [`AGENTS.md`](./AGENTS.md) for the full reference.

---

## FAQ

**Do I need a CMS dataset to run locally?**
No. Copy `.env.example` to `.env.local`, run `yarn dev`, and open `/keystatic` —
local editing works credential-free against filesystem storage. Set
`KEYSTATIC_PAGES=<slug>` to preview a published entry, or `KEYSTATIC_DISABLE=1`
to force legacy locale-JSON rendering.

**I added a translation key but TypeScript can't see it.**
Run `npm run toc` to regenerate `@types/resources.ts`, then restart the dev server.

**Are the root-level pages real?**
No — `src/pages/*.tsx` are proxies that re-export from `src/pages/[locale]/...`. Edit the
`[locale]` source.

**Which locales do I need to update?**
`en`, `sw`. If a locale file doesn't yet exist for a namespace, create it.

---

## License

MIT © SmartGrid Surveying & Civil Engineering Ltd.

---

*Made by the SmartGrid Surveying & Civil Engineering team. Survey smarter, build stronger.* 🛰️