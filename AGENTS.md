# Project Rules & Context

> Canonical team reference for the **SmartGrid Surveying & Civil Engineering Ltd** landing page.
> AI agents and human contributors should follow these conventions. Companion agent-specific
> files: `.clinerules` (Cline), `CLAUDE.md` (Claude Code).

## Project Overview
A performance-focused, internationalized marketing & content site for SmartGrid Surveying —
engineering-grade land, aerial, and civil surveying services across Kenya and East Africa.

- **Domain:** `https://smartgridsurveying.com`
- **Company:** SmartGrid Surveying & Civil Engineering Ltd
- **Tagline:** "Survey Smarter, Build Stronger"
- **HQ:** Nairobi (Ruiru), Kenya — active across East Africa & beyond

## Tech Stack & Architecture
- **Framework:** Next.js 16 (Pages Router) with a `src/` directory.
- **Language:** TypeScript (`strict: false`) + React 19.
- **Styling:** Tailwind CSS v4 (PostCSS) with CSS custom properties defined in `src/styles/globals.css`.
- **Internationalization:** `i18next` + `next-i18next`, backed by JSON locale files in `public/locales/`.
  A custom `useTranslation` wrapper lives at `src/hooks/useTranslation.ts`.
- **Content:** Sanity CMS (`src/lib/sanity.ts`); equipment/product registry in `public/locales/en/products.json`.
- **Animations:** Framer Motion, GSAP, Lenis (smooth scroll), Three.js / `@react-three/fiber` +
  `@react-three/drei` (code-split, client-only, device-gated).
- **State:** Zustand. **Validation:** Zod (env parsing).
- **Forms:** Formspree. **Analytics:** Vercel Analytics + Google Analytics (`@next/third-parties`).
- **Maps:** `@vis.gl/react-google-maps`. **Icons:** Material Design Icons (`@mdi/font`, loaded at runtime).
- **SEO:** `next-sitemap` (postbuild), custom `PageHead` component, Open Graph image convention.
- **Image optimization:** `next/image` with AVIF→WebP, quality 60/75.

## Supported Locales
`en` (default), `sw` — configured in `next-i18next.config.js`.

## Directory Layout (key areas)
```
src/
  pages/                          # Pages Router root proxies + error pages
  pages/[locale]/                 # Real localized routes (index, about, contact, ...)
  pages/{surveying,aerial-drones,civil,equipment-sale}/  # Nested route groups (proxy + [locale] mirrors)
  components/                     # Shared UI: sections/{home,about,...}, animations/, forms/, ui/
  layouts/LandingPage/            # Navbar, Footer, Layout (Lenis, ChatWidget, Whatsapp, ScrollTop, RippleSetup)
  lib/                            # i18n helpers, sanity, catalogue, env (zod), types, product
  hooks/                          # useTranslation (custom), useSetState
  styles/globals.css              # Tailwind + theme tokens (CSS vars, utilities, shimmer)
  types/next.d.ts                 # NextPageWithLayout, Service, Project, Metric
@types/                           # resources.ts (i18n type generator output), i18next.d.ts
public/                           # assets, fonts, img, geojson, locales/{lang}/*.json
```

## Coding Standards
- Use **functional components** with **explicit return types** (`function X(): ReactElement`).
- **Tabs, indent_size 4** (see `.editorconfig` + Prettier `useTabs: true`). Double quotes for JS/TS.
- Follow **strict semantic HTML** (`<section>`, `<header>`, `<nav>`, `<main>`, `<footer>`; headings in order).
- Keep **performance paramount**: code-split heavy deps (Three.js, GSAP) with `dynamic(..., { ssr: false })`;
  lazy-load off-screen images; mark the LCP hero image `priority`/`fetchPriority="high"`.
- **No unused imports** (ESLint `unused-imports/no-unused-imports: error`).
- Use the **`@/*`** path alias (maps to `./src/*`).
- Component exports: prefer named exports; default exports allowed for page sections.

## Codex Operating Instructions
- Treat this file as Codex's repository-level base instruction file. It supplements the
  project context above; avoid duplicating these rules in a second agent instruction file.
- Ground work in the repository. If an important requirement is genuinely ambiguous or cannot
  be discovered from the codebase, ask one concrete question before taking a risky direction.
- Edit the real localized page under `src/pages/[locale]/`; root page files are route proxies.
- Make requested, in-scope local changes autonomously. Ask for confirmation before destructive
  actions, external writes, purchases, or material scope expansion.
- Preserve unrelated work in a dirty working tree. Never commit secrets; `.env.local` remains
  untracked and only `.env.example` may be versioned.
- After a substantive change, run `npm run lint`, `npm run typecheck`, and `npm run build`.
  Check port 3000 before starting a dev server, and terminate any server started for verification.

## Internationalization Rules
- Adding/changing a key in any `public/locales/<locale>/*.json` must be **mirrored across all locale files**
  that have a corresponding file (`en`, `de`, `sw`, `fr`, `pt`).
  - For **text** → translate into the target language.
  - For **values** (URLs, slugs, hrefs, codes, IDs, numbers, image paths) → copy the exact value verbatim.
- Every new page namespace gets a JSON file per locale (e.g. `home.json`, `about.json`).
- Pages load namespaces via `getServerSideProps` → `getI18nProps(context, ["common", "meta", "<pageNS>"])`.
  The `contact` namespace is auto-loaded by the shared layout.
- Re-run `npm run toc` to regenerate `@types/resources.ts` when locale namespaces change.

## Component Patterns
- Sections are colocated under `src/components/sections/<page>/` with an `index.ts` barrel.
- Use the custom `useTranslation` hook (`@/hooks`) — import from there, not directly from `next-i18next`.
- Use `@/components/Link` (handles internal vs external, locale prefixes).
- Use `<PageHead pageName="..." />` for per-page SEO/meta.

## Build & Verification
- `npm run build` — production build (`next build` + `next-sitemap` postbuild).
  The build output dir is configurable via `NEXT_DIST_DIR`; never start a dev server that
  conflicts with an in-progress build's `.next` folder.
- `npm run lint` — ESLint, **fails on any warning** (`--max-warnings=0`).
- `npm run typecheck` — `tsc --noEmit`.
- `npm run lint:fix` — auto-fix lint issues.
- **Before starting a dev server:** check whether one is already running on port 3000; do not
  start a second. Stop and terminate it after verifications.
- Run `lint`, `typecheck`, and `build` after any substantial change.

## Environment
- if a .env or .env.local file does not exist, copy `.env.example` → `.env`. Required: Sanity project id/dataset/api version,
  Formspree form id, Google Analytics id. Optional: `SANITY_API_TOKEN`, Tawk.to, WhatsApp,
  Google Maps.
- Env vars are validated at runtime by Zod (`src/lib/env.ts`); invalid values crash startup
  with a readable error.

## Deployment
- Primary target: Vercel (see `vercel.json` — silent GitHub integration). Production domain:
  `https://smartgridsurveying.com`.
