import { fields } from "@keystatic/core";
import type { ComponentSchema, ObjectField } from "@keystatic/core";
import {
	anchorField,
	imagePath,
	linkObject,
	localeLongText,
	localeMedia,
	localeText,
	previewText,
	previewTitledItem,
} from "./fields";

/**
 * Page-builder section registry (M2).
 *
 * The SINGLE SOURCE for:
 * - the Keystatic editor branch options (`sectionBranchField`, consumed by
 *   `keystatic.config.ts`), and
 * - the renderer mapping (`sectionRenderers.tsx` keys off `SectionId`).
 *
 * Node-safety: this module (like `fields.ts`) imports only
 * `@keystatic/core`, so the Keystatic config keeps loading in plain Node.
 * Component implementations are referenced exclusively from
 * `sectionRenderers.tsx`, which is loaded by pages, never by the config.
 *
 * Versioning rules: section `id`s are stable and never renamed — a
 * breaking data change ships as a new `id`. Additive, backwards-compatible
 * field additions bump `version`. Stored entries carry no version stamp in
 * v1; `version` documents the contract age for future migrations.
 *
 * Registration policy (M2 inventory, 18 shared + 19 ui modules reviewed):
 * registered v1: `introText`, `ctaBand`, `stats` — flat/array string
 * contracts, no browser APIs. Deliberately NOT registered:
 * - UI primitives (Button/Card/Menu/Accordion/…) — nested controls, not
 *   page sections; they compose inside sections, never stand alone.
 * - `DeferredMount`, `Drawer`, `Menu`, `GoogleMap`, `ModelViewer`,
 *   `MorphSlider`, `ProjectsGlobe` — runtime-only / client-only (window,
 *   document, portals, WebGL, Maps JS); no serializable editor contract.
 * - `SectionShell`, `Split` — layout-only (`ReactNode` slots, not data).
 * - `CardList` (grid+modal behavior, no `<section>`), `Pricing`,
 *   `FinalCta`, `WorkflowSection`,
 *   `BeforeAfterFlipCard`, `CtaPill`, `ProductListing` — valid future
 *   candidates, deferred until migration needs them; each needs its own
 *   schema + renderer + example. (`Faq` and `Process` were on this list
 *   until M7 batch 2 registered them, `Gallery` until M7 batch 3 — see
 *   below.)
 * - Page-specific bespoke sections (`CurrentOpeningsSection`,
 *   `CompanyProfileViewerSection`, …) are never registered: the registry
 *   stays shared-only so branch options make sense for every page. Hybrid
 *   strategy (decided M4, company-profile pilot): Keystatic owns the shared
 *   sections while the bespoke tail keeps rendering from legacy locale JSON
 *   in the same route — never a registry branch, never a renderer key.
 *
 * M7 full-site coverage (first batch, 2026-09-15): `legal` wraps the bespoke
 * `LegalPageSection` (privacy-policy, terms-of-use) as shared data — label,
 * title, description, last-updated line, article list (title + paragraphs),
 * contact action + note. Legacy `site_title` interpolation stays in the
 * migration mapping (values copied verbatim, not re-interpolated at render).
 * `contactHref` is per-locale (not shared): legacy terms links diverge
 * (`/contact?reason=compliance-legal` en vs `…#contact-form` sw), same
 * per-locale precedent as `localeMedia`.
 *
 * M7 batch 2 (contact + careers, 2026-09-15): `faq` wraps the shared `Faq`
 * (question/answer/points/icon items + optional still-curious side card);
 * `process` wraps the shared `Process` grid (phase/title/description/outcome/
 * icon items + note/cta footer). Both components are SSR-safe (`"use client"`
 * without browser-only APIs on first render). NOTE (corrected 2026-09-16):
 * `contact:site_visit` and `contact:faq` render NOWHERE (no reader in `src`;
 * same dead-content verdict as `opportunities`/`direct_contacts`) — they are
 * OUT OF SCOPE, not `process`/`faq` migration sources. The contact Keystatic
 * surface is `talkToUs` → `cardGrid` only.
 *
 * M7 batch 2 continued (2026-09-16): `cardGrid` items gain an optional
 * `accent` token (v1 → v2, additive). `TalkToUsSection` passes each contact's
 * brand `color` as the card `accent` (`Card` documents the token set:
 * `primary|primary-500|primary-700|whatsapp|gmail|calendly`); without the
 * field the contact migration would silently drop every chip color. Existing
 * v1 entries omit `accent` and normalize to `undefined` (component default),
 * so the addition is backwards-compatible.
 *
 * M7 batch 3 (about, 2026-09-16): `gallery` wraps the shared `Gallery`
 * (overlay cards, slider, masonry + grid layouts, 2–4 columns, both item
 * shapes: bare image paths and `{image,title,label,description}` objects).
 * All three about layouts are SSR-safe: `Slider` touches `window`/`document`
 * only inside `useEffect`, so static-markup render is unaffected. Image
 * paths are shared (not per-locale): legacy about galleries use identical
 * paths in `en`/`sw`, and the migration's `sharedValue` gate aborts on any
 * divergence instead of silently dropping one locale's media.
 *
 * M7 batch 5 (topographical pilot, 2026-09-16): `hero` v1 → v2 stores the
 * pill overrides (`ctaIconPosition`, `ctaTrailingArrow`) the topographical
 * hero sets; `pricing` wraps the shared `Pricing` cost guidance (checklist
 * cards + price band). The pilot also confirms the cardGrid boundary: five
 * topographical card grids stay legacy — they use `subItems`/`wide`,
 * `indexed` numbering, `mediaBadged`/`variant`/`mediaPosition` media cards,
 * `fallbackIcons`, and JSX `headerEnd` glyphs, none of which are
 * editor-friendly v2/v3 contracts.
 *
 * M8 (home shared sections, 2026-09-16): `trustees` wraps the shared
 * `Trustees` logo wall (tag + headline + `{label,logoUrl}` items). Labels
 * are localized (`DJI` today, but free text for future renames); `logoUrl`
 * is a shared `/public` reference — legacy en/sw logo paths are identical,
 * and the migration's `sharedValue` gate aborts on divergence instead of
 * silently dropping one locale's media. SSR-safe: `FadeUp` touches
 * `IntersectionObserver` only inside `useEffect`, `Blob` is a pure span, and
 * `next/image` renders statically.
 *
 * M8 continued (2026-09-17): `certifications` wraps the shared
 * `Certifications` badge grid (tag + headline + description + `{icon?,
 * name, label}` items). `name` (ISK/NEMA/…) is a shared literal identical in
 * en/sw — the migration's `sharedValue` gate aborts on divergence; `label`
 * is localized free text. `icon` is an optional shared MDI slug (null in
 * legacy). SSR-safe: `FadeUp` is `useEffect`-only, `Parallax` is
 * framer-motion `useScroll`/`useSpring` (static first render, same class as
 * the M7 `Gallery` Slider precedent), `Blob` is a pure span.
 *
 * M8 continued (2026-09-17): `keyFacts` wraps the shared `KeyFacts` panel
 * (tag + headline + description + `{icon?, label, description}` items).
 * `icon` is a shared MDI slug with a positional `FACT_ICONS` fallback in
 * the component (empty = default by index); `label`/`description` are
 * localized. Same SSR-safety story as `certifications` (effect-only
 * `FadeUp`, pure-span `Blob`, framer-motion `Parallax`).
 *
 * M8 batch A (2026-09-17): `metrics` wraps the shared `Metrics` scale band
 * (tag + headline + description + `{icon?, name, value}` items). `name` is
 * localized (`Countries` en vs `Nchi` sw — unlike `stats`, whose value is
 * the localized node); `value` is a shared integer, identical in en/sw
 * (the migration aborts on divergence); `icon` is an optional shared MDI
 * slug with a positional `METRIC_ICONS` fallback.
 * SSR-safe: `CountUp` renders a static span (animation runs in `useEffect`
 * via `requestAnimationFrame`), `FadeUp` is `useEffect`-only. New id v1 —
 * no overlap with `stats` (string values + layout/tone/columns contract).
 * NOTE: `<MetricsSection/>` is commented out of `[locale]/index.tsx`, so
 * `common:metrics` is unrendered on `/` — the id is registered (addable to
 * any page) but NOT migrated into `home.json` (nothing renders it there).
 *
 * M8 batch A (2026-09-17): `whyChooseUs` wraps the shared `WhyChooseUs`
 * sticky-list section (tag + headline + description + `{icon?, name, label,
 * description}` items). `icon` is shared; `name` is a shared literal
 * (identical camelCase keys in en/sw, rendered as the item eyebrow —
 * `sharedValue` gate aborts on divergence); `label`/`description` are
 * localized. SSR-safe: `FadeUp`/`SectionHeader` have no browser APIs on
 * first render.
 *
 * M8 batch B (2026-09-17): `about` wraps the shared `About` narrative
 * (tag + headline + description + `whoWeAre`/`mission` `{title,
 * description}` blocks + `featureImg` `{url, alt, caption, title,
 * description}` + `cards` `[{icon?, href, label, description}]`). `url`,
 * `icon` and `href` are shared (`sharedValue` gate); all other strings are
 * localized. SSR-safe: `FadeUp`/`FadeLeft` are `useEffect`-only,
 * `next/image` + `next/link` render statically.
 *
 * M8 batch B (2026-09-17): `surveyingInstruments` wraps the shared
 * `SurveyingInstruments` image-card grid (tag + headline + description +
 * `items` `[{label, img, href?}]`). `img` is a shared `/public` reference
 * and `href` a shared path (both `sharedValue`-gated); `label` is
 * localized. Empty `href` renders a plain `<article>` instead of a link
 * (component branch, preserved by normalize). SSR-safe: effect-only
 * `FadeUp`, framer-motion `Parallax` (static first render), pure-span
 * `Blob`, static `next/image`.
 *
 * M8 batch C (2026-09-17): `coreExpertise` wraps the shared `CoreExpertise`
 * adapter (tag + headline + description + `items` `[{icon?, label,
 * description, href?}]`). New id v1 — NOT a `cardGrid` v3: the wrapper
 * hardcodes `headerRow` + `hoverArrow` + `watermarkedIndexed` presentation
 * plus positional `index` numbering, all outside the `cardGrid` v2
 * contract; forking v3 for one page's flags would burden every cardGrid
 * editor. `icon`/`href` are shared (`href`s are locale-identical route
 * paths); `label`/`description` are localized. SSR-safe: plain `CardGrid`
 * adapter, no browser APIs.
 *
 * M8 batch C (2026-09-17): `industriesWeServe` needs NO new id (decided,
 * same date) — the wrapper is a bare `CardGrid columns={3}` with no
 * presentation extras, fully inside the `cardGrid` v2 contract, and `/`
 * already migrates `common:industriesWeServe` AS `cardGrid` (M7 batch 17).
 * Editors edit it under the Card grid branch; a duplicate id would fork
 * the contract for zero gain.
 *
 * M8 batch C (2026-09-17): `planningInfographic` wraps the shared
 * `PlanningInfographic` benefits grid (tag + headline + description +
 * `benefits` `[{icon, label, description?}]` + `closingStatement?`).
 * `icon` is shared; `label`/`description` are localized. `closingStatement`
 * is carried as localized data but acts as a VISIBILITY GATE ONLY: the
 * component renders the statement text via `<Trans
 * i18nKey="common:planningInfographic.closingStatement">` (locale JSON,
 * `<bold>` pseudo-markup), not from `data` — clearing the field hides the
 * statement, but editing its text does not change output until the
 * component is refactored props-driven (field description warns editors).
 * SSR-safe: effect-only `FadeUp`, pure-span `Blob`.
 */

export const SECTION_IDS = ["introText", "ctaBand", "stats", "hero", "cardGrid", "splitMedia", "legal", "faq", "process", "gallery", "pricing", "trustees", "certifications", "keyFacts", "metrics", "whyChooseUs", "about", "surveyingInstruments", "coreExpertise", "planningInfographic"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface SectionDefinition {
	/** Stable id. Also the Keystatic branch discriminant and renderer key. */
	id: SectionId;
	/** Contract version (see rules above). */
	version: number;
	/** Editor sidebar label. */
	label: string;
	/** Editor help text. */
	description: string;
	/** Keystatic object schema for the branch `value`. */
	schema: ObjectField<Record<string, ComponentSchema>>;
	/**
	 * Example `value` payload (post-discriminant). Must only use top-level
	 * keys present in `schema` — enforced by `yarn check:keystatic`.
	 */
	example: Record<string, unknown>;
	/**
	 * Map a locale-resolved `value` to component props. Handles the
	 * editor-optional shapes the component null-guards (e.g. a link
	 * object with an empty `href` becomes `null`).
	 */
	normalize: (resolved: Record<string, any>) => Record<string, any>;
}

export class UnknownSectionError extends Error {
	readonly sectionId: string;
	constructor(sectionId: string, knownIds: readonly string[] = SECTION_IDS) {
		super(`Unknown page-builder section ${JSON.stringify(sectionId)}. Known sections: ${knownIds.join(", ")}.`);
		this.name = "UnknownSectionError";
		this.sectionId = sectionId;
	}
}

/** A link object with an empty `href` is absent (matches component guards). */
function presentLink(link: any): any | null {
	if (!link || typeof link !== "object") return null;
	const href = typeof link.href === "string" ? link.href.trim() : "";
	if (!href) return null;
	return { ...link, href };
}

/**
 * Hero primary CTA: `linkObject` plus the two pill overrides the shared
 * `Hero` reads (`iconPosition`, `trailingArrow`). M7 batch 5 (hero v2):
 * topographical hero sets both, so they are stored explicitly instead of
 * dropped — layout defaults still win when they are absent (v1 entries omit
 * both keys and normalize to `undefined`, rendering unchanged).
 */
function heroCta(label: string) {
	return fields.object(
		{
			label: localeText("Label", { optionalInEnglish: true }),
			href: fields.text({ label: "Link", description: "Internal path (/en/contact) or full URL." }),
			icon: fields.text({
				label: "MDI icon (optional)",
				description: "Icon slug without the `mdi-` prefix.",
			}),
			iconPosition: fields.select({
				label: "Icon position",
				description: "Leading icon (`start`) or trailing (`end`, bottom-layout default). Centered/light/banner layouts always lead.",
				options: [
					{ label: "End (default)", value: "end" },
					{ label: "Start (leading)", value: "start" },
				],
				defaultValue: "end",
			}),
			trailingArrow: fields.select({
				label: "Trailing arrow",
				description: "Automatic follows the layout default (arrow everywhere except the bottom layout).",
				options: [
					{ label: "Automatic", value: "auto" },
					{ label: "Always show", value: "show" },
					{ label: "Always hide", value: "hide" },
				],
				defaultValue: "auto",
			}),
		},
		{ label }
	);
}

/** Normalize a stored hero CTA to `HeroContent["ctaPrimary"]` (or `null`). */
function presentHeroCta(cta: any): any | null {
	const base = presentLink(cta);
	if (!base) return null;
	const { iconPosition, trailingArrow, ...rest } = base;
	return {
		...rest,
		// `end` collapses to `undefined`: the bottom layout defaults to a
		// trailing icon and the other layouts force a leading one, so an
		// explicit `end` renders identically to absent.
		iconPosition: iconPosition === "start" ? "start" : undefined,
		trailingArrow: trailingArrow === "show" ? true : trailingArrow === "hide" ? false : undefined,
	};
}

const introText: SectionDefinition = {
	id: "introText",
	version: 1,
	label: "Intro text",
	description: "Kicker tag, headline and an optional lede paragraph with one CTA pill.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		tone: fields.select({
			label: "Tone",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Surface", value: "surface" },
			],
			defaultValue: "default",
		}),
		align: fields.select({
			label: "Alignment",
			options: [
				{ label: "Left", value: "left" },
				{ label: "Center", value: "center" },
			],
			defaultValue: "left",
		}),
		split: fields.checkbox({ label: "Split layout (description beside header)", defaultValue: false }),
		cta: linkObject("CTA (leave the link empty to hide)"),
		id: anchorField(),
		// className is intentionally not editable: arbitrary classes are not
		// an editor-friendly contract.
	}),
	example: {
		tag: { en: "Surveying", sw: "Upimaji" },
		headline: { en: "Precise data for every project", sw: "Data sahihi kwa kila mradi" },
		description: { en: "Boundary, topographic and aerial surveys.", sw: "" },
		tone: "default",
		align: "left",
		split: false,
		cta: { label: { en: "Contact us", sw: "Wasiliana nasi" }, href: "/en/contact", icon: "" },
		id: "",
	},
	normalize: (resolved) => ({ ...resolved, cta: presentLink(resolved.cta) }),
};

const ctaBand: SectionDefinition = {
	id: "ctaBand",
	version: 1,
	label: "CTA band",
	description: "Framed call-to-action band with up to two pill actions and lead images.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		primary: linkObject("Primary action"),
		secondary: linkObject("Secondary action"),
		layout: fields.select({
			label: "Layout",
			options: [
				{ label: "Centered", value: "centered" },
				{ label: "Split", value: "split" },
			],
			defaultValue: "centered",
		}),
		variant: fields.select({
			label: "Variant",
			options: [
				{ label: "Panel", value: "panel" },
				{ label: "Bleed", value: "bleed" },
			],
			defaultValue: "panel",
		}),
		decor: fields.select({
			label: "Background decor",
			options: [
				{ label: "Glow", value: "glow" },
				{ label: "Masked", value: "masked" },
				{ label: "None", value: "none" },
			],
			defaultValue: "glow",
		}),
		watermark: fields.text({
			label: "Watermark MDI icon (optional)",
			description: "Icon slug without the `mdi-` prefix.",
		}),
		images: fields.array(imagePath("Image"), {
			label: "Lead images",
			itemLabel: (item) => previewText(item, ["value"], "Image"),
		}),
		shimmer: fields.checkbox({ label: "Gold shimmer top edge", defaultValue: false }),
		hairline: fields.checkbox({ label: "Inset hairline ring", defaultValue: false }),
		id: anchorField(),
		// Excluded from v1 (documented): `size` (derived from layout when
		// unset), `glyph`, `imagesAspect` and `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "Get started", sw: "Anza" },
		headline: { en: "Let's map your site", sw: "Turamani eneo lako" },
		description: { en: "Tell us about your project.", sw: "" },
		primary: { label: { en: "Request a quote", sw: "Omba nukuu" }, href: "/en/contact", icon: "arrow-right" },
		secondary: { label: { en: "", sw: "" }, href: "", icon: "" },
		layout: "centered",
		variant: "panel",
		decor: "glow",
		watermark: "",
		images: [],
		shimmer: false,
		hairline: false,
		id: "",
	},
	normalize: (resolved) => ({
		...resolved,
		primary: presentLink(resolved.primary),
		secondary: presentLink(resolved.secondary),
	}),
};

const stats: SectionDefinition = {
	id: "stats",
	version: 1,
	label: "Stats",
	description: "Metric band, cards or panel strip. Renders nothing without items.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline", { optionalInEnglish: true }),
		description: localeLongText("Description"),
			items: fields.array(
			fields.object({
				// Localized: legacy content proves values can diverge per
				// locale (e.g. "cm-Level" vs "Kiwango cha cm"). Resolves to
				// a string; the component also accepts numbers.
				value: localeText("Value", { optionalInEnglish: true }),
				label: localeText("Label", { optionalInEnglish: true }),
				description: localeLongText("Description"),
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix.",
				}),
			}),
			{
				label: "Stats",
				itemLabel: previewTitledItem("Stat"),
			}
		),
		layout: fields.select({
			label: "Layout",
			options: [
				{ label: "Band", value: "band" },
				{ label: "Cards", value: "cards" },
				{ label: "Panel", value: "panel" },
			],
			defaultValue: "band",
		}),
		tone: fields.select({
			label: "Tone",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Surface", value: "surface" },
			],
			defaultValue: "default",
		}),
		columns: fields.integer({ label: "Columns", defaultValue: 3, validation: { min: 2, max: 4 } }),
		id: anchorField(),
		// The component also accepts the legacy `metrics` alias for `items`;
		// the registry contract uses `items` only.
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "SmartGrid in numbers", sw: "SmartGrid kwa takwimu" },
		description: { en: "", sw: "" },
		items: [
			{
				value: { en: "250+", sw: "250+" },
				label: { en: "Projects completed", sw: "Miradi iliyokamilika" },
				description: { en: "", sw: "" },
				icon: "check-decagram",
			},
		],
		layout: "band",
		tone: "default",
		columns: 3,
		id: "",
	},
	normalize: (resolved) => ({
		...resolved,
		items: Array.isArray(resolved.items) ? resolved.items : [],
		columns: resolved.columns === 2 || resolved.columns === 4 ? resolved.columns : 3,
	}),
};

const hero: SectionDefinition = {
	id: "hero",
	version: 2,
	label: "Hero",
	description: "Page hero in any of the four layouts, with pill CTAs and footnote chips.",
	schema: fields.object({
		headline: localeText("Headline", { optionalInEnglish: true }),
		title: localeText("Title", { optionalInEnglish: true }),
		description: localeLongText("Description"),
		image: imagePath("Background image (optional)"),
		layout: fields.select({
			label: "Layout",
			description: "Copied from the legacy content entry; presentation keys live in content.",
			options: [
				{ label: "Bottom", value: "bottom" },
				{ label: "Centered", value: "centered" },
				{ label: "Banner", value: "banner" },
				{ label: "Light", value: "light" },
			],
			defaultValue: "bottom",
		}),
		frame: fields.checkbox({ label: "Framed ring (centered layout)", defaultValue: false }),
		scrollCue: fields.checkbox({ label: "Scroll cue", defaultValue: false }),
		cueLabel: localeText("Scroll cue label", { optionalInEnglish: true }),
		footnoteItems: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix.",
				}),
				text: localeText("Text", { optionalInEnglish: true }),
			}),
			{
				label: "Footnote chips",
				itemLabel: (item) => previewText(item, ["fields", "text", "fields", "en", "value"], "Footnote"),
			}
		),
		ctaPrimary: heroCta("Primary action"),
		ctaSecondary: linkObject("Secondary action"),
		id: anchorField(),
		// Excluded from v2 (documented): `className`.
	}),
	example: {
		headline: { en: "SMARTGRID SURVEYING & CIVIL WORKS", sw: "SMARTGRID SURVEYING & CIVIL WORKS" },
		title: { en: "Company Profile", sw: "Wasifu wa Kampuni" },
		description: {
			en: "Survey Smarter, Build Stronger. Building Trust and Integrity every step of the way.",
			sw: "Pima kwa Akili, Jenga kwa Nguvu. Kujenga Uaminifu na Uadilifu katika kila hatua.",
		},
		image: "",
		layout: "light",
		frame: false,
		scrollCue: false,
		cueLabel: { en: "", sw: "" },
		footnoteItems: [],
		ctaPrimary: {
			label: { en: "Download Company Profile", sw: "Pakua Wasifu wa Kampuni" },
			href: "https://drive.google.com/file/d/1LuUk8Hl_J84tMHb-NKqBvs1QFdJGVTpH/view",
			icon: "cloud-download",
			iconPosition: "end",
			trailingArrow: "auto",
		},
		ctaSecondary: { label: { en: "", sw: "" }, href: "", icon: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			headline: resolved.headline,
			title: resolved.title,
			description: resolved.description,
			image: resolved.image,
			layout: resolved.layout,
			frame: resolved.frame,
			scrollCue: resolved.scrollCue,
			cueLabel: resolved.cueLabel,
			footnoteItems: Array.isArray(resolved.footnoteItems) ? resolved.footnoteItems : [],
			ctaPrimary: presentHeroCta(resolved.ctaPrimary),
			ctaSecondary: presentLink(resolved.ctaSecondary),
		},
		id: resolved.id || undefined,
	}),
};

const cardGrid: SectionDefinition = {
	id: "cardGrid",
	version: 2,
	label: "Card grid",
	description: "Header plus a responsive card grid with optional icons, images and links.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		subheading: localeText("Subheading", { optionalInEnglish: true }),
		// Narrowed from the component's `ReactNode` to localized text:
		// every legacy caller passes plain strings.
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix.",
				}),
				title: localeText("Title", { optionalInEnglish: true }),
				description: localeLongText("Description"),
				image: imagePath("Image (optional)"),
				href: fields.text({ label: "Link (optional)", description: "Card links to this URL when set." }),
				accent: fields.text({
					label: "Brand accent (optional)",
					description: "Icon-chip color token (`primary`, `primary-500`, `primary-700`, `whatsapp`, `gmail`, `calendly`). Empty = default.",
				}),
			}),
			{
				label: "Cards",
				itemLabel: previewTitledItem("Card"),
			}
		),
		columns: fields.select({
			label: "Columns",
			options: [
				{ label: "2", value: "2" },
				{ label: "3", value: "3" },
				{ label: "4", value: "4" },
				{ label: "5", value: "5" },
			],
			defaultValue: "3",
		}),
		tone: fields.select({
			label: "Tone",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Surface", value: "surface" },
			],
			defaultValue: "default",
		}),
		align: fields.select({
			label: "Alignment",
			options: [
				{ label: "Left", value: "left" },
				{ label: "Center", value: "center" },
			],
			defaultValue: "left",
		}),
		headerRow: fields.checkbox({ label: "Header row layout", defaultValue: false }),
		cardDensity: fields.select({
			label: "Card density",
			options: [
				{ label: "Comfortable", value: "comfortable" },
				{ label: "Roomy", value: "roomy" },
			],
			defaultValue: "comfortable",
		}),
		cardIconSize: fields.select({
			label: "Card icon size",
			options: [
				{ label: "Small", value: "sm" },
				{ label: "Medium", value: "md" },
				{ label: "Large", value: "lg" },
			],
			defaultValue: "md",
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `headerAlign`, `hoverArrow`,
		// `watermarkedIndexed`, `indexed`, `mediaBadged`, `kicker`,
		// `fallbackIcons`, `popupTrigger`, `leadImages`, `leadAspect`,
		// `actions` and `className` — visual tuning with no legacy caller in
		// the migrated pages; each is an additive v2 candidate.
	}),
	example: {
		tag: { en: "Our Foundation", sw: "Msingi Wetu" },
		headline: { en: "Mission, Vision & Core Values", sw: "Dhamira, Maono na Maadili ya Msingi" },
		subheading: { en: "", sw: "" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "flag-variant-outline",
				title: { en: "Our Mission", sw: "Dhamira Yetu" },
				description: {
					en: "To deliver innovative, high-precision surveying and civil works solutions.",
					sw: "Kutoa suluhisho sahihi za kijiografia na uhandisi.",
				},
				image: "",
				href: "",
				accent: "",
			},
		],
		columns: "3",
		tone: "surface",
		align: "center",
		headerRow: false,
		cardDensity: "roomy",
		cardIconSize: "lg",
		id: "",
	},
	normalize: (resolved) => ({
		...resolved,
		items: (Array.isArray(resolved.items) ? resolved.items : []).map((item: any) => ({
			...item,
			image: item.image || undefined,
			href: item.href && item.href.trim() ? item.href : undefined,
			// Empty/blank accents fall back to the component default chip
			// (keeps v1 entries without the field rendering unchanged).
			accent: typeof item.accent === "string" && item.accent.trim() ? item.accent.trim() : undefined,
		})),
		columns: Number(resolved.columns) || 3,
		card: { density: resolved.cardDensity, iconSize: resolved.cardIconSize },
	}),
};

const splitMedia: SectionDefinition = {
	id: "splitMedia",
	version: 1,
	label: "Split media",
	description: "Text column beside a framed image with check-bullet points.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		image: localeMedia("Image"),
		points: fields.array(localeText("Point", { optionalInEnglish: true }), {
			label: "Check-bullet points",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
		}),
		imagePosition: fields.select({
			label: "Image side",
			options: [
				{ label: "Right", value: "right" },
				{ label: "Left", value: "left" },
			],
			defaultValue: "right",
		}),
		tone: fields.select({
			label: "Tone",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Surface", value: "surface" },
			],
			defaultValue: "default",
		}),
		mediaAspect: fields.select({
			label: "Media frame",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Square", value: "square" },
				{ label: "Wide", value: "wide" },
			],
			defaultValue: "default",
		}),
		mediaFit: fields.select({
			label: "Media fit",
			options: [
				{ label: "Cover", value: "cover" },
				{ label: "Contain", value: "contain" },
			],
			defaultValue: "cover",
		}),
		id: anchorField(),
		// Excluded from v1 (documented): the below-the-split card row
		// (`items`, `columns`, `align`, `card`, `fallbackIcons`,
		// `popupTrigger`) — no migrated caller uses it; additive v2
		// candidates alongside `className`.
	}),
	example: {
		tag: { en: "Who We Are", sw: "Sisi ni Nani" },
		headline: { en: "A Geospatial & Engineering Partner You Can Build On", sw: "Mshirika wa Kijiografia na Uhandisi Unaoweza Kutegemewa" },
		description: { en: "Precision land surveying, UAV mapping and GIS analysis.", sw: "" },
		image: { en: "/img/logo.svg", sw: "/media/surveying/AG8ng.jpeg" },
		points: [{ en: "Licensed professional surveyors", sw: "Wataalamu waliosajiliwa" }],
		imagePosition: "right",
		tone: "default",
		mediaAspect: "square",
		mediaFit: "cover",
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			image: resolved.image,
			points: Array.isArray(resolved.points) ? resolved.points : [],
		},
		imagePosition: resolved.imagePosition,
		tone: resolved.tone,
		mediaAspect:
			resolved.mediaAspect === "square" ? "aspect-square" : resolved.mediaAspect === "wide" ? "aspect-16/10" : undefined,
		mediaFit: resolved.mediaFit,
		id: resolved.id || undefined,
	}),
};

const legal: SectionDefinition = {
	id: "legal",
	version: 1,
	label: "Legal page",
	description: "Legal article page (privacy-policy, terms-of-use): header plus article list and contact row.",
	schema: fields.object({
		label: localeText("Label", { optionalInEnglish: true }),
		title: localeText("Title"),
		description: localeLongText("Description"),
		lastUpdated: localeText("Last-updated line", { optionalInEnglish: true }),
		articles: fields.array(
			fields.object({
				title: localeText("Title"),
				paragraphs: fields.array(localeLongText("Paragraph"), {
					label: "Paragraphs",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Paragraph"),
				}),
			}),
			{
				label: "Articles",
				itemLabel: previewTitledItem("Article"),
			},
		),
		contactHref: localeText("Contact link"),
		contactLabel: localeText("Contact label", { optionalInEnglish: true }),
		note: localeLongText("Note"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the gavel icon
		// (fixed presentation in LegalPageSection, not an editor contract).
	}),
	example: {
		label: { en: "Privacy", sw: "Faragha" },
		title: { en: "Privacy Policy", sw: "Sera ya Faragha" },
		description: { en: "How we handle information submitted through our website.", sw: "" },
		lastUpdated: { en: "Last Updated Aug, 2026", sw: "" },
		articles: [
			{
				title: { en: "Information We Collect", sw: "Taarifa Tunazokusanya" },
				paragraphs: [{ en: "We collect information you choose to provide.", sw: "" }],
			},
		],
		contactHref: {
			en: "/contact?reason=privacy#contact-form",
			sw: "/contact?reason=privacy#contact-form",
		},
		contactLabel: { en: "Contact Privacy Team", sw: "Wasiliana na Timu ya Faragha" },
		note: { en: "Questions about this policy can be sent to the team.", sw: "" },
		id: "",
	},
	normalize: (resolved) => ({
		label: resolved.label,
		title: resolved.title,
		description: resolved.description,
		lastUpdated: resolved.lastUpdated,
		sections: Array.isArray(resolved.articles)
			? resolved.articles.map((article: any) => ({
					title: article?.title ?? "",
					content: Array.isArray(article?.paragraphs) ? article.paragraphs : [],
				}))
			: [],
		contactHref:
			typeof resolved.contactHref === "string" && resolved.contactHref ? resolved.contactHref : "/contact",
		contactLabel: resolved.contactLabel,
		note: resolved.note,
	}),
};

const faq: SectionDefinition = {
	id: "faq",
	version: 1,
	label: "FAQ",
	description: "Frequently-asked-questions accordion with an optional still-curious side card.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				question: localeText("Question"),
				answer: localeLongText("Answer"),
				points: fields.array(localeText("Point", { optionalInEnglish: true }), {
					label: "Bullet points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix.",
				}),
			}),
			{
				label: "Questions",
				itemLabel: (item) => previewText(item, ["fields", "question", "fields", "en", "value"], "Question"),
			},
		),
		stillCuriousLabel: localeText("Still-curious label", { optionalInEnglish: true }),
		stillCuriousDescription: localeLongText("Still-curious description"),
		stillCuriousCta: linkObject("Still-curious action"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the aside `icon`
		// (fixed presentation in Faq, not an editor contract).
	}),
	example: {
		tag: { en: "Quick Answers", sw: "Majibu ya Haraka" },
		headline: { en: "Common contact questions", sw: "Maswali ya kawaida ya mawasiliano" },
		description: { en: "", sw: "" },
		items: [
			{
				question: { en: "How quickly will you respond?", sw: "Ni haraka kiasi gani mtajibu?" },
				answer: { en: "Within one business day.", sw: "" },
				points: [],
				icon: "",
			},
		],
		stillCuriousLabel: { en: "", sw: "" },
		stillCuriousDescription: { en: "", sw: "" },
		stillCuriousCta: { label: { en: "", sw: "" }, href: "", icon: "" },
		id: "faq",
	},
	normalize: (resolved) => {
		const cta = resolved.stillCuriousCta as { label?: string; href?: string; icon?: string } | undefined;
		return {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						question: item?.question ?? "",
						answer: item?.answer ?? "",
						points: Array.isArray(item?.points) ? item.points.filter((p: unknown) => typeof p === "string" && p) : [],
						icon: item?.icon || undefined,
					}))
				: [],
			stillCurious:
				cta && typeof cta.href === "string" && cta.href
					? { label: cta.label ?? "", description: resolved.stillCuriousDescription ?? "", cta }
					: null,
			id: resolved.id || undefined,
		};
	},
};

const process: SectionDefinition = {
	id: "process",
	version: 1,
	label: "Process steps",
	description: "Numbered step grid with an optional closing call-to-action.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				phase: localeText("Phase", { optionalInEnglish: true }),
				title: localeText("Title"),
				description: localeLongText("Description"),
				outcome: localeText("Outcome", { optionalInEnglish: true }),
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix; falls back to the step number.",
				}),
			}),
			{
				label: "Steps",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Step"),
			},
		),
		note: localeLongText("Note"),
		ctaNote: localeLongText("CTA note"),
		cta: linkObject("Closing action"),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, `columns`, `phaseStyles`
		// and the `timeline` variant (sectional-properties-only payload).
	}),
	example: {
		tag: { en: "Site Visits", sw: "Ziara za Tovuti" },
		headline: { en: "See the operation for yourself", sw: "Jionee uendeshaji mwenyewe" },
		description: { en: "", sw: "" },
		items: [
			{
				phase: { en: "01", sw: "" },
				title: { en: "Submit a request", sw: "Wasilisha ombi" },
				description: { en: "Use the contact form above.", sw: "" },
				outcome: { en: "", sw: "" },
				icon: "",
			},
		],
		note: { en: "", sw: "" },
		ctaNote: { en: "", sw: "" },
		cta: { label: { en: "Request a Site Visit", sw: "Omba Ziara ya Tovuti" }, href: "#contact-form", icon: "" },
		id: "",
	},
	normalize: (resolved) => ({
		tag: resolved.tag,
		headline: resolved.headline,
		description: resolved.description,
		items: Array.isArray(resolved.items)
			? resolved.items.map((item: any) => ({
					phase: item?.phase || undefined,
					title: item?.title ?? "",
					description: item?.description ?? "",
					outcome: item?.outcome || undefined,
					icon: item?.icon || undefined,
				}))
			: [],
		note: resolved.note,
		ctaNote: resolved.ctaNote,
		cta:
			resolved.cta && typeof resolved.cta.href === "string" && resolved.cta.href
				? { label: resolved.cta.label ?? "", href: resolved.cta.href, icon: resolved.cta.icon || undefined }
				: null,
		id: resolved.id || undefined,
	}),
};

const gallery: SectionDefinition = {
	id: "gallery",
	version: 1,
	label: "Gallery",
	description: "Image gallery: overlay cards, slider, masonry or grid, with optional captions.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline", { optionalInEnglish: true }),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				image: imagePath("Image"),
				// Overlay cards read `title ?? label`; slider/masonry read
				// `title`. Bare-path legacy items migrate with empty captions.
				title: localeText("Title", { optionalInEnglish: true }),
				label: localeText("Label", { optionalInEnglish: true }),
				description: localeLongText("Description"),
			}),
			{
				label: "Images",
				itemLabel: (item) =>
					previewText(item, ["fields", "title", "fields", "en", "value"], previewText(item, ["fields", "image", "value"], "Image")),
			},
		),
		layout: fields.select({
			label: "Layout",
			options: [
				{ label: "Overlay cards", value: "overlay" },
				{ label: "Slider", value: "slider" },
				{ label: "Masonry", value: "masonry" },
				{ label: "Grid", value: "grid" },
			],
			defaultValue: "grid",
		}),
		columns: fields.select({
			label: "Columns",
			options: [
				{ label: "2", value: "2" },
				{ label: "3", value: "3" },
				{ label: "4", value: "4" },
			],
			defaultValue: "3",
		}),
		tone: fields.select({
			label: "Tone",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Surface", value: "surface" },
			],
			defaultValue: "default",
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Drone Photography", sw: "Upigaji Picha wa Droni" },
		description: { en: "", sw: "" },
		items: [
			{
				image: "/media/about/15.jpeg",
				title: { en: "", sw: "" },
				label: { en: "", sw: "" },
				description: { en: "", sw: "" },
			},
		],
		layout: "slider",
		columns: "3",
		tone: "surface",
		id: "",
	},
	normalize: (resolved) => ({
		tag: resolved.tag,
		headline: resolved.headline,
		description: resolved.description,
		items: Array.isArray(resolved.items)
			? resolved.items.map((item: any) => ({
					// Empty captions stay `undefined` so the component's
					// `?? "Gallery"` / `?? label` / `Project N` fallbacks behave
					// exactly as they do for absent legacy keys.
					image: item?.image || undefined,
					title: item?.title || undefined,
					label: item?.label || undefined,
					description: item?.description || undefined,
				}))
			: [],
		layout: resolved.layout,
		columns: Number(resolved.columns) || 3,
		tone: resolved.tone,
		id: resolved.id || undefined,
	}),
};

const pricing: SectionDefinition = {
	id: "pricing",
	version: 1,
	label: "Pricing",
	description: "Cost guidance: checklist cards plus an optional centred price band.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		cards: fields.array(
			fields.object({
				title: localeText("Title", { optionalInEnglish: true }),
				items: fields.array(localeText("Bullet", { optionalInEnglish: true }), {
					label: "Bullets",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Bullet"),
				}),
			}),
			{
				label: "Cards",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Card"),
			},
		),
		price: fields.object(
			{
				label: localeText("Label", { optionalInEnglish: true }),
				value: localeText("Value", { optionalInEnglish: true }),
				note: localeLongText("Note"),
			},
			{ label: "Price band (leave the value empty to hide)" }
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "Pricing", sw: "Bei" },
		headline: { en: "What does it cost?", sw: "Inagharimu kiasi gani?" },
		description: { en: "", sw: "" },
		cards: [
			{
				title: { en: "Cost drivers", sw: "Vichocheo vya gharama" },
				items: [{ en: "Plot size and terrain", sw: "" }],
			},
		],
		price: {
			label: { en: "Typical range", sw: "Kiwango cha kawaida" },
			value: { en: "KES 50,000 – 300,000+", sw: "KES 50,000 – 300,000+" },
			note: { en: "", sw: "" },
		},
		id: "",
	},
	// The component drops empty cards and hides the band without a value, so
	// the normalizer passes content through untouched.
	normalize: (resolved) => ({ ...resolved, id: resolved.id || undefined }),
};

const trustees: SectionDefinition = {
	id: "trustees",
	version: 1,
	label: "Trustees",
	description: "Trusted-partner logo wall: tag, headline and logo cards.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				label: localeText("Label"),
				logoUrl: imagePath("Logo"),
			}),
			{
				label: "Logos",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Logo"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "OUR TRUSTEES", sw: "WADHAMINI WETU" },
		items: [
			{
				label: { en: "DJI", sw: "DJI" },
				logoUrl: "/media/trustees/dji.png",
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						label: item?.label ?? "",
						logoUrl: item?.logoUrl || undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

const certifications: SectionDefinition = {
	id: "certifications",
	version: 1,
	label: "Certifications",
	description: "Certification badge grid: tag, headline, description and name/label cards.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline", { optionalInEnglish: true }),
		description: localeLongText("Description", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = no icon.",
				}),
				name: fields.text({
					label: "Badge name (shared)",
					description: "Short code shown large on the card (e.g. ISK). Identical in en/sw.",
				}),
				label: localeText("Label"),
			}),
			{
				label: "Certifications",
				itemLabel: (item) => previewText(item, ["fields", "name", "value"], "Certification"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "Certified", sw: "Imethibitishwa" },
		headline: { en: "Our Certifications", sw: "Vyeti Vyetu" },
		description: { en: "We hold certifications from reputable organizations.", sw: "Tunashikilia vyeti kutoka kwa mashirika yenye sifa." },
		items: [
			{
				icon: "",
				name: "ISK",
				label: { en: "Surveyors of Kenya", sw: "Wapimaji wa Kenya" },
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || null,
						name: item?.name ?? "",
						label: item?.label ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

const keyFacts: SectionDefinition = {
	id: "keyFacts",
	version: 1,
	label: "Key facts",
	description: "Panel with watermark count: tag, headline, description and fact cards.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline", { optionalInEnglish: true }),
		description: localeLongText("Description", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default.",
				}),
				label: localeText("Label"),
				description: localeLongText("Description"),
			}),
			{
				label: "Facts",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Fact"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "Key Facts", sw: "Mambo Muhimu" },
		headline: { en: "EA Leaders in surveying", sw: "EA Leaders in surveying" },
		description: { en: "A leading surveying and engineering company.", sw: "Kampuni inayoongoza ya upimaji na uhandisi." },
		items: [
			{
				icon: "map-marker-radius",
				label: { en: "Regional Coverage", sw: "Ufikiaji wa Kikanda" },
				description: {
					en: "East Africa operations across Kenya, Uganda, Tanzania and Rwanda.",
					sw: "Shughuli za Afrika Mashariki katika Kenya, Uganda, Tanzania na Rwanda.",
				},
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || null,
						label: item?.label ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

const metrics: SectionDefinition = {
	id: "metrics",
	version: 1,
	label: "Metrics",
	description: "Operational scale band: tag, headline, description and animated count-up stats.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline", { optionalInEnglish: true }),
		description: localeLongText("Description", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default.",
				}),
				name: localeText("Name"),
				value: fields.integer({ label: "Value", defaultValue: 0, validation: { min: 0 } }),
			}),
			{
				label: "Metrics",
				itemLabel: (item) => previewText(item, ["fields", "name", "fields", "en", "value"], "Metric"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "Scale", sw: "Kiwango" },
		headline: { en: "Our Operational Scale", sw: "Kiwango Chetu cha Uendeshaji" },
		description: { en: "A strong operational scale across the region.", sw: "Kiwango kikubwa cha uendeshaji katika mkoa." },
		items: [
			{
				icon: "map-marker-multiple",
				name: { en: "Countries", sw: "Nchi" },
				value: 7,
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || null,
						name: item?.name ?? "",
						value: typeof item?.value === "number" ? item.value : 0,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

const whyChooseUs: SectionDefinition = {
	id: "whyChooseUs",
	version: 1,
	label: "Why choose us",
	description: "Sticky header plus numbered proof-point list with eyebrow, title and description.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline", { optionalInEnglish: true }),
		description: localeLongText("Description", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix. Informational only in this layout.",
				}),
				name: fields.text({
					label: "Eyebrow (shared)",
					description: "Short key shown above the title. Identical in en/sw.",
				}),
				label: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Proof points",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Point"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "Why Choose Us", sw: "Kwa Nini Utuchague" },
		headline: { en: "Exceptional surveying and engineering solutions.", sw: "Suluhisho bora za upimaji na uhandisi." },
		description: { en: "Cutting-edge technology with extensive experience.", sw: "Teknolojia ya kisasa yenye uzoefu mkubwa." },
		items: [
			{
				icon: "crosshairs",
				name: "engineeringAccuracy",
				label: { en: "Engineering Accuracy", sw: "Usahihi wa Kihandisi" },
				description: {
					en: "Centimeter-level precision with RTK GNSS and total stations.",
					sw: "Usahihi wa sentimita kwa RTK GNSS na total stations.",
				},
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || null,
						name: item?.name ?? "",
						label: item?.label ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

const about: SectionDefinition = {
	id: "about",
	version: 1,
	label: "About",
	description: "Narrative split: tag, headline, who-we-are/mission blocks, feature image and link cards.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description", { optionalInEnglish: true }),
		whoWeAre: fields.object(
			{
				title: localeText("Title", { optionalInEnglish: true }),
				description: localeLongText("Description", { optionalInEnglish: true }),
			},
			{ label: "Who we are" }
		),
		mission: fields.object(
			{
				title: localeText("Title", { optionalInEnglish: true }),
				description: localeLongText("Description", { optionalInEnglish: true }),
			},
			{ label: "Mission" }
		),
		featureImg: fields.object(
			{
				url: imagePath("Image"),
				alt: localeText("Alt text", { optionalInEnglish: true }),
				caption: localeText("Caption", { optionalInEnglish: true }),
				title: localeText("Title", { optionalInEnglish: true }),
				description: localeLongText("Description", { optionalInEnglish: true }),
			},
			{ label: "Feature image" }
		),
		cards: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix.",
				}),
				href: fields.text({ label: "Link", description: "Internal path or full URL." }),
				label: localeText("Label"),
				description: localeLongText("Description"),
			}),
			{
				label: "Cards",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Card"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "About Us", sw: "Kutuhusu" },
		headline: { en: "From field data to design and construction.", sw: "Kutoka data ya uwandani hadi usanifu na ujenzi." },
		description: { en: "Accurate data for smarter decisions.", sw: "Data sahihi kwa maamuzi bora." },
		whoWeAre: {
			title: { en: "WHO WE ARE", sw: "TULIYE NANI" },
			description: { en: "Advanced land surveying in East Africa.", sw: "Upimaji wa hali ya juu Afrika Mashariki." },
		},
		mission: {
			title: { en: "OUR MISSION", sw: "DHAMIRA YETU" },
			description: { en: "High-precision solutions for every project.", sw: "Suluhisho sahihi kwa kila mradi." },
		},
		featureImg: {
			url: "/media/home/field-doperators.jpg",
			alt: { en: "Surveying Field Data", sw: "Data ya Upimaji wa Uwanjani" },
			caption: { en: "Field Operations", sw: "Shughuli za Uwanjani" },
			title: { en: "Topographical and GPR surveys", sw: "Upimaji wa Topografia na GPR" },
			description: { en: "1cm accuracy for your project.", sw: "Usahihi wa 1cm kwa mradi wako." },
		},
		cards: [
			{
				icon: "shield-outline",
				href: "/about",
				label: { en: "Licensed Experts", sw: "Wataalamu Wenye Leseni" },
				description: { en: "Full Institution of Surveyors certification.", sw: "Uthibitisho kamili wa Taasisi ya Wapimaji." },
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			whoWeAre: resolved.whoWeAre,
			mission: resolved.mission,
			featureImg: resolved.featureImg,
			cards: Array.isArray(resolved.cards)
				? resolved.cards.map((card: any) => ({
						icon: card?.icon || null,
						href: card?.href ?? "",
						label: card?.label ?? "",
						description: card?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

const surveyingInstruments: SectionDefinition = {
	id: "surveyingInstruments",
	version: 1,
	label: "Surveying instruments",
	description: "Image-card grid of instruments with optional product links.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline", { optionalInEnglish: true }),
		description: localeLongText("Description", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				label: localeText("Label"),
				img: imagePath("Image"),
				href: fields.text({ label: "Link (optional)", description: "Empty = plain card, no link." }),
			}),
			{
				label: "Instruments",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Instrument"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "Precision", sw: "Usahihi" },
		headline: { en: "Our Surveying Instruments", sw: "Vifaa Vyetu vya Upimaji" },
		description: { en: "Calibrated, precise equipment.", sw: "Vifaa sahihi vilivyorekebishwa." },
		items: [
			{
				label: { en: "RTK GNSS FOIF A90", sw: "RTK GNSS FOIF A90" },
				img: "/media/instruments/RTK-GNSS-FOIF-A90.jpg",
				href: "/equipment-sale/foif-a90-rtk-gnss",
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						label: item?.label ?? "",
						img: item?.img || undefined,
						href: item?.href || undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

const coreExpertise: SectionDefinition = {
	id: "coreExpertise",
	version: 1,
	label: "Core expertise",
	description: "Indexed expertise grid with header row, hover arrows and watermarked numbering.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix.",
				}),
				label: localeText("Label"),
				description: localeLongText("Description"),
				href: fields.text({ label: "Link (optional)", description: "Internal path or full URL." }),
			}),
			{
				label: "Expertise",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Expertise"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract). Presentation (`headerRow`, `hoverArrow`,
		// `watermarkedIndexed`, 3 columns, positional numbering) is fixed by
		// the `CoreExpertise` adapter — that is why this is its own id rather
		// than a `cardGrid` v3.
	}),
	example: {
		tag: { en: "Experts", sw: "Wataalamu" },
		headline: { en: "Our Core Expertise", sw: "Utaalamu Wetu Mkuu" },
		description: { en: "High-quality surveying and engineering services.", sw: "Huduma bora za upimaji na uhandisi." },
		items: [
			{
				icon: "terrain",
				label: { en: "Topographical & Engineering Surveys", sw: "Upimaji wa Topografia na Uhandisi" },
				description: {
					en: "Accurate land surveys for construction and infrastructure.",
					sw: "Upimaji sahihi wa ardhi kwa ujenzi na miundombinu.",
				},
				href: "/surveying/topographical-surveys",
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || null,
						label: item?.label ?? "",
						description: item?.description ?? "",
						href: item?.href || undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

const planningInfographic: SectionDefinition = {
	id: "planningInfographic",
	version: 1,
	label: "Planning infographic",
	description: "Benefits grid with closing statement (statement text stays locale-owned, see field).",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description", { optionalInEnglish: true }),
		benefits: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon",
					description: "Icon slug without the `mdi-` prefix (watermark + check chip).",
				}),
				label: localeText("Label"),
				description: localeLongText("Description", { optionalInEnglish: true }),
			}),
			{
				label: "Benefits",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Benefit"),
			}
		),
		closingStatement: localeLongText("Closing statement (visibility gate)", {
			optionalInEnglish: true,
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract). NOTE: `closingStatement` only gates
		// visibility — the component renders the statement text via `<Trans
		// i18nKey="common:planningInfographic.closingStatement">`, so editing
		// this text does not change output until the component is refactored
		// props-driven. Clearing it hides the statement.
	}),
	example: {
		tag: { en: "Planning a Project?", sw: "Unapanga Mradi?" },
		headline: { en: "Start With Accurate Ground Data", sw: "Anza na Data Sahihi ya Ardhi" },
		description: { en: "You need reliable surveying data.", sw: "Unahitaji data ya upimaji inayoaminika." },
		benefits: [
			{
				icon: "cash-check",
				label: { en: "Eliminate costly design errors", sw: "Ondoa makosa ya kubuni yenye gharama" },
				description: { en: "", sw: "" },
			},
		],
		closingStatement: { en: "Our data ensures your project starts right.", sw: "Data yetu inahakikisha mradi wako unaanza vizuri." },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			benefits: Array.isArray(resolved.benefits)
				? resolved.benefits.map((benefit: any) => ({
						icon: benefit?.icon ?? "",
						label: benefit?.label ?? "",
						description: benefit?.description ?? "",
					}))
				: [],
			closingStatement: resolved.closingStatement,
		},
		id: resolved.id || undefined,
	}),
};

export const sectionRegistry: readonly SectionDefinition[] = [
	introText,
	ctaBand,
	stats,
	hero,
	cardGrid,
	splitMedia,
	legal,
	faq,
	process,
	gallery,
	pricing,
	trustees,
	certifications,
	keyFacts,
	metrics,
	whyChooseUs,
	about,
	surveyingInstruments,
	coreExpertise,
	planningInfographic,
];

export function getSectionDefinition(id: string): SectionDefinition {
	const found = sectionRegistry.find((section) => section.id === id);
	if (!found) throw new UnknownSectionError(id);
	return found;
}

const SECTION_LABELS: Record<SectionId, string> = {
	introText: introText.label,
	ctaBand: ctaBand.label,
	stats: stats.label,
	hero: hero.label,
	cardGrid: cardGrid.label,
	splitMedia: splitMedia.label,
	legal: legal.label,
	faq: faq.label,
	process: process.label,
	gallery: gallery.label,
	pricing: pricing.label,
	trustees: trustees.label,
	certifications: certifications.label,
	keyFacts: keyFacts.label,
	metrics: metrics.label,
	whyChooseUs: whyChooseUs.label,
	about: about.label,
	surveyingInstruments: surveyingInstruments.label,
	coreExpertise: coreExpertise.label,
	planningInfographic: planningInfographic.label,
};

/**
 * Editor `itemLabel` for the top-level sections array. Array-of-conditional
 * preview props are `{ discriminant, value }` unions — narrow from
 * `unknown` instead of touching `.fields` (which does not exist there).
 */
function sectionItemLabel(item: unknown): string {
	const discriminant =
		typeof item === "object" && item !== null
			? ((item as { discriminant?: unknown }).discriminant as SectionId | undefined)
			: undefined;
	if (discriminant && discriminant in SECTION_LABELS) return SECTION_LABELS[discriminant];
	return "Section";
}

/** The ordered `pageBuilder` array field, derived entirely from the registry. */
export function sectionBranchField() {
	const discriminant = fields.select({
		label: "Section type",
		options: SECTION_IDS.map((id) => ({ label: SECTION_LABELS[id], value: id })),
		defaultValue: SECTION_IDS[0],
	});
	const branches = Object.fromEntries(sectionRegistry.map((section) => [section.id, section.schema])) as Record<
		SectionId,
		SectionDefinition["schema"]
	>;
	return fields.array(fields.conditional(discriminant, branches), {
		label: "Sections",
		itemLabel: sectionItemLabel,
	});
}
