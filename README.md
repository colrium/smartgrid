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
- 🏗️ **Built with:** Next.js 16 · TypeScript · Tailwind CSS · i18next · Sanity CMS

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
- **Sanity CMS** driven content (team, projects, certifications, metrics).
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
| Content / CMS      | [Sanity](https://www.sanity.io) (`next-sanity`, `@sanity/image-url`)       |
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

Copy the example and fill in the required values (Sanity credentials, Formspree form ID,
Google Analytics / Maps keys):

```bash
cp .env.example .env.local
```

| Variable                          | Required | Description                                         |
| --------------------------------- | -------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`            | no       | Site URL (used by sitemap / analytics)              |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`   | **yes**  | Sanity project ID                                   |
| `NEXT_PUBLIC_SANITY_DATASET`      | **yes**  | Sanity dataset (e.g. `production`)                  |
| `NEXT_PUBLIC_SANITY_API_VERSION`  | no       | Sanity API date version (default `2024-01-01`)      |
| `NEXT_PUBLIC_SANITY_USE_CDN`      | no       | Use CDN for reads (default `true`)                  |
| `SANITY_API_TOKEN`                | no       | Token for preview/write operations                  |
| `NEXT_PUBLIC_FORMSPREE_FORM_ID`   | no       | Formspree contact form ID                           |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`   | no       | Google Analytics 4 measurement ID                   |
| `NEXT_PUBLIC_TAWK_PROPERTY_ID`    | no       | Tawk.to live-chat property ID                       |
| `NEXT_PUBLIC_TAWK_WIDGET_ID`      | no       | Tawk.to widget ID                                   |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`     | no       | WhatsApp contact number (digits / intl format)      |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | no       | Google Maps JS API key (maps section)               |

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
│   ├─ lib/                  # i18n, sanity, catalogue, env(zod), types, product
│   ├─ hooks/                # useTranslation (custom), useSetState
│   ├─ styles/globals.css    # Tailwind theme + design tokens + utilities
│   └─ types/next.d.ts
└─ public/
   ├─ locales/{en,sw}/*.json   # i18n namespaces
   ├─ img/{earth,flags,instruments,products,...}
   ├─ fonts/              # Plus Jakarta Sans, Google Sans Flex, Brother 1816
      └─ geojson/            # world countries geometry for maps
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
cp .env.example .env.local   # fill in Sanity / Formspree / GA values

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
- **Regenerate Sanity types:** `npm run typegen` (runs `sanity schema extract && sanity typegen`).

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
| `npm run clean`      | Remove the `.next` build folder                  |
| `npm run nuke:install` | Remove `node_modules` + lockfile (fresh install) |
| `npm run toc`        | Regenerate `@types/resources.ts` from locale files |
| `npm run merge`      | Merge locale resources into `@types/resources.json` |
| `npm run interface`  | Generate `i18next` type definitions              |
| `npm run typegen`    | Sanity schema extract + typegen                  |

> Note: the dev script is registered as `"dev": "next"` in `package.json`; running
> `npm run dev` starts the Next.js dev server.

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

**Do I need a Sanity dataset to run locally?**
Only `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are *required* (Zod will
fail-fast otherwise). If you don't have a Sanity project, point them at any value to start; pages
that query Sanity will simply not render their dynamic content.

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