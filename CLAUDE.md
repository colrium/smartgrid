# CLAUDE.md — SmartGrid Landing Page (for Claude Code)

## Project Overview
**SmartGrid Surveying & Civil Engineering Ltd** landing site.
Next.js 16 (Pages Router) + TypeScript + Tailwind CSS v4. Internationalization with
`next-i18next` (locales: `en, de, sw, fr, pt`). Content from Sanity CMS and
`public/locales/*/....json`.

## Key Files
- **Config:** `next.config.js`, `next-i18next.config.js`, `next-sitemap.config.js`,
  `tsconfig.json`, `tailwind.config.ts`, `eslint.config.mjs`, `.prettierrc`,
  `.editorconfig`, `postcss.config.mjs`.
- **Entry points:** `src/pages/_app.tsx` (i18n + `LandingPageLayout`), `src/pages/_document.tsx`
  (language detection, Google Analytics).
- **Routing:** real localized pages under `src/pages/[locale]/`; root `src/pages/*.tsx` are
  re-export proxies (edit the `[locale]` source).
- **i18n:** `src/lib/i18n.ts` (`getI18nProps`, `getLocale`, `getStaticPaths`),
  `src/lib/languageDetector.ts`, custom hook `src/hooks/useTranslation.ts`.
- **Layout:** `src/layouts/LandingPage/` — `Navbar`, `Footer`, `Layout`
  (Lenis, `ChatWidget`, `WhatsappButton`, `ScrollTop`, `RippleSetup`).
- **Components:** `src/components/sections/<page>/index.ts` barrels,
  `src/components/animations/`, `src/components/ui/` (Avatar, Drawer, Menu, MenuItem,
  IconButton, ScrollIndicator).
- **Env:** `src/lib/env.ts` (Zod-validated). Copy `.env.example` → `.env.local`.

## Commands
```bash
npm install              # install dependencies (npm lockfile)
cp .env.example .env.local   # fill Sanity / Formspree / GA values
npm run dev              # -> http://localhost:3000 (check port 3000 first)
npm run build            # production build + next-sitemap
npm run lint             # ESLint (max-warnings=0)
npm run lint:fix         # auto-fix
npm run typecheck        # tsc --noEmit
npm run toc              # refresh @types/resources.ts (i18n)
npm run typegen          # Sanity schema + typegen
```

## Workflow Notes
- **New page:** add `src/pages/[locale]/<page>.tsx` + a root proxy `src/pages/<page>.tsx`;
  add a namespace JSON to every locale; load namespaces via
  `getServerSideProps` → `getI18nProps(context, ["common", "meta", "<page>"])`.
- **New translatable string:** add to `public/locales/en/<ns>.json`, translate in all
  locales, run `npm run toc` to refresh types.
- **Equipment/product:** add to `public/locales/en/products.json` (registry) + a per-product
  locale JSON (e.g. `dji-mavic-3-pro.json`); the catalogue is built from these.
- **Before committing:** verification scales with change size — small edits (≤300 changed
  lines) → `npm run lint`; large edits (>300 changed lines) → full build verification
  (`npm run lint && npm run typecheck && npm run build`).
- **i18n sync:** every locale file that exists for `en` must exist for `de, sw, fr, pt` with
  the same keys; URLs/slugs/codes are copied verbatim, text is translated.

## Coding Conventions
- Functional components with explicit return types.
- Tabs (4), double quotes, es5 trailing commas, 100 cols (Prettier + EditorConfig).
- Semantic HTML; import `useTranslation` from `@/hooks`; links via `@/components/Link`;
  SEO via `<PageHead pageName="..." />`.
- Performance: code-split heavy libs (`dynamic(..., { ssr: false })`); `priority` +
  `fetchPriority="high"` on LCP hero images; lazy-load off-screen images.
- **`ink-panel` is reserved for CTA sections only** (book/quote/contact/WhatsApp/email bands).
  Content sections, cards, and tiles must not use it — style them with light tokens
  (`bg-surface`, `bg-paper`, `pale-panel`, or the default page background). Use solid `bg-ink`
  when a dark surface is genuinely required outside a CTA (e.g. hero image fallbacks).
- See `AGENTS.md` for the full canonical standards and project context.