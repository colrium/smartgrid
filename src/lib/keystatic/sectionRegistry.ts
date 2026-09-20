import { fields } from "@keystatic/core";
import type { ComponentSchema, ObjectField } from "@keystatic/core";
import {
	anchorField,
	imagePath,
	linkObject,
	localeImageArray,
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
 *
 * M8 batch D (2026-09-17): `coverageArea` wraps the shared `CoverageArea`
 * region section (tag + headline + description + `hqPin?` + `stats`
 * `[{icon, value, suffix, label}]` + `groups` `[{icon, label, description,
 * items[]}]` + `note?`). `icon`/`value`/`suffix` are shared (numbers and
 * `+` literals identical in en/sw — divergence aborts); `label`,
 * `hqPin`, `note`, group `label`/`description` and the location chips are
 * localized (the last group's chips diverge: `Somalia & wider East Africa`
 * vs `Somalia na Afrika Mashariki pana`). SSR-safe: the WebGL globe loads
 * via `next/dynamic ssr:false` inside `DeferredMount` (static spinner
 * fallback renders on the server), `CountUp`/`FadeUp` are effect-only.
 * New id v1 — no overlap with `stats`/`cardGrid`.
 *
 * M8 batch D (2026-09-17): `surveyCost` wraps the shared `SurveyCost`
 * tabbed estimator (tag + headline + description + `factors` `{label?,
 * items[]}` + `ranges` `{label?, hint?, items[]}` + `disclaimer?` + `cta?`
 * + `secondaryCta?`). Factor/range `icon`s, `price` numbers and CTA
 * `href`s are shared; all labels, descriptions, `includes` bullets,
 * `pricePrefix`/`tagline` and CTA labels are localized. SSR-safe:
 * `useState` tab index only affects event handlers — first render is
 * static (`CountUp`/`motion` animate client-side).
 *
 * M9 follow-up (2026-09-17, per user request): `leadGenBar` wraps the
 * shared `LeadGenBar` trio (tag + headline + description + `items`
 * `[{icon, label, description, more?, action?}]`). The component was
 * refactored to an additive optional `data` prop (omitted = legacy `t()`
 * strings, so the bare `careers` caller is untouched); `description`
 * stays `<Trans>`-rendered from the locale store (`<bold>` pseudo-markup),
 * so the schema field is a VISIBILITY GATE ONLY (same precedent as
 * `planningInfographic.closingStatement` — field description warns
 * editors). `title`/`link`/`type` locale keys are unrendered — excluded.
 * SSR-safe: effect-only `FadeUp`, no browser APIs on first render.
 *
 * M9 follow-up batch F (2026-09-17): `services` wraps the shared
 * `ServicesSection` tabbed explorer (tag + headline + `items` `[{icon,
 * label, description, whatWeOffer, deliverables}]`). Same additive `data`
 * refactor (omitted = legacy strings; other pages' bare callers
 * untouched). LEGACY BUG FIX (visible, recorded): the component read
 * tag/headline from `home:services.*`, which no longer exists in locale
 * JSON (nodes moved to `common.json`) — the legacy header renders the raw
 * key strings. The Keystatic branch sources tag/headline from
 * `common:services` instead, so opting in visibly fixes the header.
 * Offer items migrate strings → `{label, href: ""}` objects (the component
 * renders both identically). SSR-safe: `useState` tabs + `motion` animate
 * client-side only (SurveyCost precedent).
 *
 * M11 (unique page sections, 2026-09-18): page-specific tails that can
 * never be shared branches become page-scoped UNIQUE ids (`homeHero`,
 * `homeDrones`, …) — never reused on another page, never renamed. Same
 * additive-`data` contract as the M9 follow-up (omitted = legacy `t()`).
 * Unlike the gate-only Trans precedents, unique sections render markup
 * from DATA (the wrapper is page-owned), so edits change output.
 */

export const SECTION_IDS = ["introText", "ctaBand", "stats", "hero", "cardGrid", "splitMedia", "legal", "faq", "process", "gallery", "pricing", "trustees", "certifications", "keyFacts", "metrics", "whyChooseUs", "about", "surveyingInstruments", "coreExpertise", "planningInfographic", "coverageArea", "surveyCost", "leadGenBar", "services", "homeHero", "homeDrones", "contactHero", "contactOffices", "contactForm", "careersOpenings", "careersProcess", "careersStatement", "companyProfileViewer", "aboutAerialSurveying", "aboutLandSurveying", "aboutImpact", "surveyingServices", "surveyingProcess", "civilHero", "civilProcess", "deliverables", "workflow", "finalCta", "topoWhenYouNeed", "topoWhatWeOffer", "topoDetailedSurveys", "topoSampleMap", "topoInstruments", "topoWhyConduct", "sectionalWhatIs", "sectionalServicesDetail", "sectionalWorkflow", "sectionalTimeline", "sectionalWhoNeeds", "bathyEquipment", "bathyLimitations", "bathyDamsLakes", "bathyApplications", "bathyBeforeAfter", "rmWhatIs", "rmTypes", "rmSector", "rmWorkflow", "rmWhoUses", "rmTechStack", "rmDataAccuracy", "bsHero", "bsSection2", "bsSiteEngineering", "bsProcess", "bsAccuracyMatters", "bsTechnology", "bsConsultation", "aerialIntro", "aerialWhyDrones", "aerialServices", "aerialSurveyingGrid", "aerialIndustries", "aerialIndustryCta", "aerialTechStack", "aerialCapabilityCta", "aerialProjects", "aerialAdditionalServices", "cadastralPostHeroCta", "cadastralWhenYouNeed", "cadastralProcessCta", "cadastralCost", "cadastralTimeline", "cadastralCompliance", "cadastralCaseStudy", "gprHero", "gprHighlights", "gprJumpNav", "gprOverview", "gprMethodology", "gprApplications", "gprDetect", "gprSue", "gprLimitations", "gprBeforeAfter", "gprTechnology", "gprFeaturedProjects", "gprSummary", "gisHero", "gisWhatIs", "gisImportance", "gisServices", "gisIndustries", "gisTechStack", "gisWhatsappCta", "gisComponents", "gisWhySmartgrid", "gisDataAccuracy", "gisBeforeAfter", "gisProjectImpact", "gisRelatedServices", "highwayServices", "asBuiltSolutions"] as const;
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

const coverageArea: SectionDefinition = {
	id: "coverageArea",
	version: 1,
	label: "Coverage area",
	description: "Region coverage: HQ pin, count-up stats, location-group cards and note.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description", { optionalInEnglish: true }),
		hqPin: localeText("HQ pin", { optionalInEnglish: true }),
		stats: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon",
					description: "Icon slug without the `mdi-` prefix.",
				}),
				value: fields.integer({ label: "Value", defaultValue: 0, validation: { min: 0 } }),
				suffix: fields.text({ label: "Suffix (shared)", description: "Identical in en/sw." }),
				label: localeText("Label"),
			}),
			{
				label: "Stats",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Stat"),
			}
		),
		groups: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon",
					description: "Icon slug without the `mdi-` prefix.",
				}),
				label: localeText("Label"),
				description: localeLongText("Description"),
				items: fields.array(localeText("Location", { optionalInEnglish: true }), {
					label: "Locations",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Location"),
				}),
			}),
			{
				label: "Groups",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Group"),
			}
		),
		note: localeLongText("Note", { optionalInEnglish: true }),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract). The globe image (`/img/earth/earth-light.jpg`)
		// is fixed presentation, not content.
	}),
	example: {
		tag: { en: "Coverage Area", sw: "Eneo la Huduma" },
		headline: { en: "From Nairobi to the wider East Africa", sw: "Kutoka Nairobi hadi Afrika Mashariki" },
		description: { en: "Strong operational scale across the region.", sw: "Uwepo mkubwa wa uendeshaji katika mkoa." },
		hqPin: { en: "HQ — Ruiru, Nairobi", sw: "Makao Makuu — Ruiru, Nairobi" },
		stats: [
			{
				icon: "map-marker-multiple",
				value: 7,
				suffix: "+",
				label: { en: "Countries covered", sw: "Nchi zilizofunikwa" },
			},
		],
		groups: [
			{
				icon: "home-city",
				label: { en: "Core Counties", sw: "Kaunti Kuu" },
				description: { en: "Where we are based and most active.", sw: "Tulikotoa na tunaofanya kazi zaidi." },
				items: [{ en: "Nairobi", sw: "Nairobi" }],
			},
		],
		note: { en: "Working off the grid? We deploy.", sw: "Unafanya kazi nje ya ramani? Tunawasili." },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			hqPin: resolved.hqPin,
			stats: Array.isArray(resolved.stats)
				? resolved.stats.map((stat: any) => ({
						icon: stat?.icon ?? "",
						value: typeof stat?.value === "number" ? stat.value : 0,
						suffix: stat?.suffix ?? "",
						label: stat?.label ?? "",
					}))
				: [],
			groups: Array.isArray(resolved.groups)
				? resolved.groups.map((group: any) => ({
						icon: group?.icon ?? "",
						label: group?.label ?? "",
						description: group?.description ?? "",
						items: Array.isArray(group?.items) ? group.items : [],
					}))
				: [],
			note: resolved.note,
		},
		id: resolved.id || undefined,
	}),
};

const surveyCost: SectionDefinition = {
	id: "surveyCost",
	version: 1,
	label: "Survey cost",
	description: "Tabbed cost estimator: cost factors, price ranges, disclaimer and CTAs.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description", { optionalInEnglish: true }),
		factors: fields.object(
			{
				label: localeText("Label", { optionalInEnglish: true }),
				items: fields.array(
					fields.object({
						icon: fields.text({
							label: "MDI icon",
							description: "Icon slug without the `mdi-` prefix.",
						}),
						label: localeText("Label"),
						description: localeLongText("Description"),
					}),
					{
						label: "Factors",
						itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Factor"),
					}
				),
			},
			{ label: "Cost factors" }
		),
		ranges: fields.object(
			{
				label: localeText("Label", { optionalInEnglish: true }),
				hint: localeText("Hint", { optionalInEnglish: true }),
				items: fields.array(
					fields.object({
						icon: fields.text({
							label: "MDI icon",
							description: "Icon slug without the `mdi-` prefix.",
						}),
						label: localeText("Label"),
						price: fields.integer({ label: "Price (KES)", defaultValue: 0, validation: { min: 0 } }),
						pricePrefix: localeText("Price prefix", { optionalInEnglish: true }),
						tagline: localeText("Tagline", { optionalInEnglish: true }),
						description: localeLongText("Description"),
						includes: fields.array(localeText("Included", { optionalInEnglish: true }), {
							label: "Includes",
							itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Included"),
						}),
					}),
					{
						label: "Ranges",
						itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Range"),
					}
				),
			},
			{ label: "Price ranges" }
		),
		disclaimer: localeLongText("Disclaimer", { optionalInEnglish: true }),
		cta: linkObject("Primary CTA"),
		secondaryCta: linkObject("Secondary CTA"),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "Budget Planning", sw: "Kupanga Bajeti" },
		headline: { en: "How Much Does a Survey Cost?", sw: "Upimaji Unagharimu Kiasi Gani?" },
		description: { en: "Site realities shape every quotation.", sw: "Hali ya tovuti huunda kila nukuu." },
		factors: {
			label: { en: "Survey costs depend on:", sw: "Gharama hutegemea:" },
			items: [
				{
					icon: "ruler-square-compass",
					label: { en: "Project size and terrain", sw: "Ukubwa wa mradi na mazingira" },
					description: { en: "Acres, slopes and vegetation.", sw: "Eka, miteremko na mimea." },
				},
			],
		},
		ranges: {
			label: { en: "Typical ranges", sw: "Masafa ya kawaida" },
			hint: { en: "Tap a survey type", sw: "Gusa aina ya upimaji" },
			items: [
				{
					icon: "vector-square",
					label: { en: "Boundary Surveys", sw: "Upimaji wa Mipaka" },
					price: 30000,
					pricePrefix: { en: "From KES", sw: "Kuanzia KES" },
					tagline: { en: "Know where your land ends", sw: "Jua ardhi yako inaishia wapi" },
					description: { en: "Property lines and beacons.", sw: "Mistari ya mali na nguzo." },
					includes: [{ en: "Boundary delineation", sw: "Kutambua mipaka" }],
				},
			],
		},
		disclaimer: { en: "Starting ranges only.", sw: "Masafa ya kuanzia tu." },
		cta: {
			label: { en: "Get a Custom Quotation", sw: "Pata Nukuu Maalum" },
			href: "/contact?reason=custom-quotation#contact-form",
			icon: "invoice-text",
		},
		secondaryCta: {
			label: { en: "Talk to a Surveyor", sw: "Ongea na Mpimaji" },
			href: "/contact?reason=talk-to-surveyor#contact-form",
			icon: "account-voice",
		},
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			factors: {
				label: resolved.factors?.label,
				items: Array.isArray(resolved.factors?.items)
					? resolved.factors.items.map((factor: any) => ({
							icon: factor?.icon ?? "",
							label: factor?.label ?? "",
							description: factor?.description ?? "",
						}))
					: [],
			},
			ranges: {
				label: resolved.ranges?.label,
				hint: resolved.ranges?.hint,
				items: Array.isArray(resolved.ranges?.items)
					? resolved.ranges.items.map((range: any) => ({
							icon: range?.icon ?? "",
							label: range?.label ?? "",
							price: typeof range?.price === "number" ? range.price : 0,
							pricePrefix: range?.pricePrefix ?? "",
							tagline: range?.tagline ?? "",
							description: range?.description ?? "",
							includes: Array.isArray(range?.includes) ? range.includes : [],
						}))
					: [],
			},
			disclaimer: resolved.disclaimer,
			cta: presentLink(resolved.cta),
			secondaryCta: presentLink(resolved.secondaryCta),
		},
		id: resolved.id || undefined,
	}),
};

const leadGenBar: SectionDefinition = {
	id: "leadGenBar",
	version: 1,
	label: "Lead generation bar",
	description: "Trio of enquiry cards with tag, headline and gated description.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description (visibility gate)", {
			optionalInEnglish: true,
		}),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon",
					description: "Icon slug without the `mdi-` prefix.",
				}),
				label: localeText("Label"),
				description: localeLongText("Description"),
				more: fields.object(
					{
						label: localeText("Label", { optionalInEnglish: true }),
						href: fields.text({ label: "Link (optional)", description: "Empty = no link." }),
					},
					{ label: "More link" }
				),
				action: fields.object(
					{
						label: localeText("Label", { optionalInEnglish: true }),
						href: fields.text({ label: "Link (optional)", description: "Empty = no button." }),
					},
					{ label: "Action button" }
				),
			}),
			{
				label: "Cards",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Card"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (route-level
		// positioning, not content) and the `title`/`link` locale keys
		// (unrendered). NOTE: `description` only gates visibility — the
		// component renders the text via `<Trans>` from locale JSON
		// (`<bold>` markup), so editing this text does not change output
		// until a props-driven refactor. Clearing it hides the paragraph.
	}),
	example: {
		tag: { en: "Get Started", sw: "Anza" },
		headline: { en: "Engineering-grade solutions", sw: "Suluhisho za kihandisi" },
		description: { en: "Accurate spatial data.", sw: "Data sahihi ya anga." },
		items: [
			{
				icon: "land-fields",
				label: { en: "LAND SURVEYING", sw: "UPIMAJI WA ARDHI" },
				description: { en: "Precise surveys.", sw: "Upimaji sahihi." },
				more: { label: { en: "Explore more", sw: "Gundua zaidi" }, href: "/surveying" },
				action: { label: { en: "Request Survey", sw: "Oda Upimaji" }, href: "/contact" },
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
						icon: item?.icon ?? "",
						label: item?.label ?? "",
						description: item?.description ?? "",
						more: item?.more,
						action: item?.action,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

const services: SectionDefinition = {
	id: "services",
	version: 1,
	label: "Services",
	description: "Tabbed services explorer with offers and deliverables per tab.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon",
					description: "Icon slug without the `mdi-` prefix.",
				}),
				label: localeText("Label"),
				description: localeLongText("Description"),
				whatWeOffer: fields.object(
					{
						label: localeText("Label"),
						description: localeLongText("Description", { optionalInEnglish: true }),
						items: fields.array(
							fields.object({
								label: localeText("Label"),
								href: fields.text({ label: "Link (optional)", description: "Empty = plain text." }),
							}),
							{
								label: "Offers",
								itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Offer"),
							}
						),
					},
					{ label: "What we offer" }
				),
				deliverables: fields.object(
					{
						label: localeText("Label", { optionalInEnglish: true }),
						liveLabel: localeText("Live label", { optionalInEnglish: true }),
						description: localeLongText("Description", { optionalInEnglish: true }),
						checks: fields.array(localeText("Check", { optionalInEnglish: true }), {
							label: "Checks",
							itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Check"),
						}),
						items: fields.array(
							fields.object({
								title: localeText("Title"),
								format: localeText("Format", { optionalInEnglish: true }),
								icon: fields.text({
									label: "MDI icon (optional)",
									description: "Icon slug without the `mdi-` prefix. Empty = positional default.",
								}),
								image: imagePath("Image (optional)"),
								description: localeLongText("Description"),
							}),
							{
								label: "Deliverables",
								itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Deliverable"),
							}
						),
					},
					{ label: "Deliverables" }
				),
			}),
			{
				label: "Services",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Service"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "Services", sw: "Huduma" },
		headline: { en: "Our Services", sw: "Huduma Zetu" },
		items: [
			{
				icon: "land-fields",
				label: { en: "Land Surveying", sw: "Upimaji wa Ardhi" },
				description: { en: "Topographical and boundary surveys.", sw: "Upimaji wa topografia na mipaka." },
				whatWeOffer: {
					label: { en: "What we offer", sw: "Tunachotoa" },
					description: { en: "", sw: "" },
					items: [{ label: { en: "Topographical surveys", sw: "Upimaji wa topografia" }, href: "/surveying/topographical-surveys" }],
				},
				deliverables: {
					label: { en: "Deliverables", sw: "Vile tunavyotoa" },
					liveLabel: { en: "Deliverable", sw: "Matokeo" },
					description: { en: "Professional outputs.", sw: "Matokeo ya kitaalamu." },
					checks: [{ en: "Submission-ready", sw: "Tayari kuwasilishwa" }],
					items: [
						{
							title: { en: "Boundary Survey Reports", sw: "Ripoti za Upimaji wa Mipaka" },
							format: { en: "PDF", sw: "PDF" },
							icon: "vector-square",
							image: "",
							description: { en: "Signed reports.", sw: "Ripoti zilizosainiwa." },
						},
					],
				},
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
						icon: item?.icon ?? "",
						label: item?.label ?? "",
						description: item?.description ?? "",
						whatWeOffer: {
							label: item?.whatWeOffer?.label ?? "",
							description: item?.whatWeOffer?.description ?? "",
							items: Array.isArray(item?.whatWeOffer?.items)
								? item.whatWeOffer.items.map((offer: any) => ({
										label: offer?.label ?? "",
										href: offer?.href || undefined,
									}))
								: [],
						},
						deliverables: {
							label: item?.deliverables?.label ?? "",
							liveLabel: item?.deliverables?.liveLabel ?? "",
							description: item?.deliverables?.description ?? "",
							checks: Array.isArray(item?.deliverables?.checks) ? item.deliverables.checks : [],
							items: Array.isArray(item?.deliverables?.items)
								? item.deliverables.items.map((deliverable: any) => ({
										title: deliverable?.title ?? "",
										format: deliverable?.format ?? "",
										icon: deliverable?.icon || null,
										image: deliverable?.image || undefined,
										description: deliverable?.description ?? "",
									}))
								: [],
						},
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 (unique page sections, 2026-09-18): `homeHero` wraps the home
 * `HeroSection` WebGL hero (badge, marked-up headline, description, pill
 * CTAs, location chips). Unique — only valid on `/`. The headline carries
 * inline `<primary>`/`<accent>` tags; the wrapper parses them from DATA
 * (see `renderHeroHeadline`), so Keystatic edits change output. SSR-safe:
 * the three.js scene loads via `next/dynamic ssr:false` after an idle
 * capability probe — first render is static (the page SSR-renders this
 * component in the legacy branch today).
 */
const homeHero: SectionDefinition = {
	id: "homeHero",
	version: 1,
	label: "Home hero (unique)",
	description: "Unique: the / WebGL hero — badge, headline, description, pill CTAs and location chips. Only valid on the home page.",
	schema: fields.object({
		badge: localeText("Badge", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		ctaPrimary: linkObject("Primary action"),
		ctaSecondary: linkObject("Secondary action"),
		location: fields.object(
			{
				label: localeText("Label", { optionalInEnglish: true }),
				items: fields.array(
					fields.object({
						label: localeText("Label"),
						code: fields.text({
							label: "Code (shared)",
							description: "Short location code shown in the chip (e.g. KE). Identical in en/sw.",
						}),
					}),
					{
						label: "Location chips",
						itemLabel: (item) => previewText(item, ["fields", "code", "value"], "Location"),
					}
				),
			},
			{ label: "Location row" }
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the fixed
		// instrument artwork / scroll indicator (presentation, not content).
	}),
	example: {
		badge: { en: "Engineering Precision", sw: "Usahihi wa Uhandisi" },
		headline: {
			en: "Survey <primary>Smarter</primary>, Build <accent>Stronger</accent>.",
			sw: "Pima <primary>Kwa Akili</primary>, Jenga <accent>Kwa Nguvu</accent>.",
		},
		description: {
			en: "Leading Africa's Land and Aerial Surveying with Advanced equipment Technology",
			sw: "Kuongoza Upimaji wa Ardhi na Angani wa Afrika kwa Teknolojia ya Juu ya Vifaa",
		},
		ctaPrimary: { label: { en: "Request a Survey", sw: "Omba Upimaji" }, href: "/contact?reason=request-survey#contact-form", icon: "send" },
		ctaSecondary: { label: { en: "", sw: "" }, href: "", icon: "" },
		location: {
			label: { en: "Active across East Africa & beyond", sw: "Tunafanya kazi katika Afrika Mashariki na kwingineko" },
			items: [{ label: { en: "Kenya", sw: "Kenya" }, code: "KE" }],
		},
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			badge: resolved.badge,
			headline: resolved.headline,
			description: resolved.description,
			ctaPrimary: presentLink(resolved.ctaPrimary),
			ctaSecondary: presentLink(resolved.ctaSecondary),
			location: {
				label: resolved.location?.label ?? "",
				items: Array.isArray(resolved.location?.items)
					? resolved.location.items.map((item: any) => ({
							label: item?.label ?? "",
							code: item?.code ?? "",
						}))
					: [],
			},
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 (unique page sections, 2026-09-18): `homeDrones` wraps the home
 * `DronesSection` fleet grid (tag + headline + description + drone cards).
 * Unique — only valid on `/`. `label` is the card eyebrow fallback: legacy
 * has no `common:drones.label` key, so an empty label keeps the
 * `t(..., { defaultValue: "Aerial capability" })` lookup. SSR-safe:
 * effect-only `FadeUp`, pure-span `Blob`, framer-motion `Parallax`
 * (static first render).
 */
const homeDrones: SectionDefinition = {
	id: "homeDrones",
	version: 1,
	label: "Home drones (unique)",
	description: "Unique: the / drone fleet grid — tag, headline, description and drone cards. Only valid on the home page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline", { optionalInEnglish: true }),
		description: localeLongText("Description"),
		label: localeText("Card eyebrow fallback", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (optional)",
					description: "Icon slug without the `mdi-` prefix.",
				}),
				img: imagePath("Image"),
				href: fields.text({ label: "Link (optional)", description: "Card links to this URL when set." }),
				label: localeText("Label"),
				description: localeLongText("Description"),
			}),
			{
				label: "Drones",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Drone"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`/`className` (visual tuning,
		// not an editor contract).
	}),
	example: {
		tag: { en: "Drone Fleet", sw: "Mel ya Ndege zisizo na Rubani" },
		headline: { en: "Our Drones", sw: "Ndege Zetu Zisizo na Rubani" },
		description: { en: "We deploy advanced drones to capture high-resolution aerial imagery.", sw: "" },
		label: { en: "", sw: "" },
		items: [
			{
				icon: "quadcopter",
				img: "/media/equipment-sale/dji-matrice-350-rtk/images/02-01.png",
				href: "/equipment-sale/dji-matrice-350-rtk",
				label: { en: "DJI Matrice 300 RTK", sw: "DJI Matrice 300 RTK" },
				description: { en: "A versatile drone for surveying, mapping and inspection.", sw: "" },
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			label: resolved.label || undefined,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						img: item?.img || undefined,
						href: item?.href && item.href.trim() ? item.href : undefined,
						label: item?.label ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 1 — contact page (2026-09-18): `contactHero` wraps the bespoke
 * `ContactHeroSection` (tag + headline + description + availability badge
 * card). Unique — only valid on `/contact`. The badge `status` is shared
 * text: exactly `active` renders the green availability pulse, anything
 * else renders amber. SSR-safe: effect-only `FadeUp`, pure-span `Blob`.
 */
const contactHero: SectionDefinition = {
	id: "contactHero",
	version: 1,
	label: "Contact hero (unique)",
	description: "Unique: the /contact hero — tag, headline, description and availability badge card. Only valid on the contact page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		badge: fields.object(
			{
				text: localeText("Text"),
				status: fields.text({
					label: "Status (shared)",
					description: "`active` shows the green availability pulse; any other value renders amber. Identical in en/sw.",
				}),
			},
			{ label: "Availability badge" }
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the fixed headset
		// icon + company line in the badge card (presentation, not content).
	}),
	example: {
		tag: { en: "Get In Touch", sw: "Wasiliana Nasi" },
		headline: { en: "Let's talk about your surveying or engineering project", sw: "Hebu tuzungumze kuhusu mradi wako wa upimaji au uhandisi" },
		description: { en: "Our team is ready to help.", sw: "" },
		badge: {
			text: { en: "Response within 24 hours", sw: "Majibu ndani ya saa 24" },
			status: "active",
		},
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			badge: resolved.badge
				? {
						text: resolved.badge.text ?? "",
						status: resolved.badge.status ?? "",
					}
				: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 1 — contact page (2026-09-18): `contactOffices` wraps the
 * `OfficesSection` office cards + map (tag + headline + description +
 * office items + closing CTA). Unique — only valid on `/contact`. Proper
 * nouns and contact details are shared (identical in en/sw — the
 * migration aborts on divergence); address lines and notes are localized.
 * Coordinates are shared decimal degrees; a zeroed coordinate renders no
 * marker. The Google Map stays client-only (`dynamic ssr:false` in
 * `DeferredMount`, static fallback on the server).
 */
const contactOffices: SectionDefinition = {
	id: "contactOffices",
	version: 1,
	label: "Contact offices (unique)",
	description: "Unique: the /contact office cards, map and closing CTA. Only valid on the contact page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				id: fields.text({
					label: "Office id (shared)",
					description: "Stable identifier (e.g. hq-nairobi). Identical in en/sw.",
				}),
				label: fields.text({
					label: "Office name (shared)",
					description: "Display name. Identical in en/sw.",
				}),
				city: fields.text({
					label: "City (shared)",
					description: "Identical in en/sw.",
				}),
				country: fields.text({
					label: "Country (shared)",
					description: "Identical in en/sw.",
				}),
				flag: fields.text({
					label: "Flag emoji (shared)",
					description: "Identical in en/sw.",
				}),
				address_lines: fields.array(localeText("Address line", { optionalInEnglish: true }), {
					label: "Address lines",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Address line"),
				}),
				phone: fields.text({
					label: "Phone (shared)",
					description: "Identical in en/sw.",
				}),
				email: fields.text({
					label: "Email (shared)",
					description: "Identical in en/sw.",
				}),
				hours: fields.text({
					label: "Hours (shared)",
					description: "Identical in en/sw.",
				}),
				type: fields.text({
					label: "Type (shared)",
					description: "Office type key (`hq`, `field`, `regional`). Identical in en/sw.",
				}),
				note: localeLongText("Note"),
				lat: fields.number({ label: "Latitude (shared, decimal degrees)" }),
				lng: fields.number({ label: "Longitude (shared, decimal degrees)" }),
			}),
			{
				label: "Offices",
				itemLabel: (item) => previewText(item, ["fields", "label", "value"], "Office"),
			}
		),
		cta: linkObject("Closing action"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "Our Offices", sw: "Ofisi Zetu" },
		headline: { en: "Reach Our Offices", sw: "Fikia Ofisi Zetu" },
		description: { en: "Visit our head office for professional consultation.", sw: "" },
		items: [
			{
				id: "hq-nairobi",
				label: "SmartGrid Surveying HQ",
				city: "Ruiru",
				country: "Kenya",
				flag: "🇰🇪",
				address_lines: [{ en: "SmartGrid Surveying HQ, Nord Mall, Ruiru, Kenya", sw: "" }],
				phone: "+254 10 7393023",
				email: "smartgridsurveying@gmail.com",
				hours: "Mon–Fri 08:00–17:00 EAT",
				type: "hq",
				note: { en: "", sw: "" },
				lat: -1.1466,
				lng: 36.9609,
			},
		],
		cta: { label: { en: "Book a consultation", sw: "Panga mashauriano" }, href: "/contact?reason=book-consultation#contact-form", icon: "arrow-right" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						id: item?.id ?? "",
						label: item?.label ?? "",
						city: item?.city ?? "",
						country: item?.country ?? "",
						flag: item?.flag ?? "",
						address_lines: Array.isArray(item?.address_lines)
							? item.address_lines.filter((line: unknown) => typeof line === "string" && line)
							: [],
						phone: item?.phone ?? "",
						email: item?.email ?? "",
						hours: item?.hours ?? "",
						type: item?.type ?? "",
						note: item?.note ?? "",
						// A zeroed coordinate carries no marker (Keystatic
						// number fields default to 0 when cleared).
						lat: typeof item?.lat === "number" && item.lat !== 0 ? item.lat : undefined,
						lng: typeof item?.lng === "number" && item.lng !== 0 ? item.lng : undefined,
					}))
				: [],
			cta: presentLink(resolved.cta),
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 1 — contact page (2026-09-18): `contactForm` wraps the
 * `ContactFormSection` form section (tag + headline + description + submit
 * and success strings). Unique — only valid on `/contact`. The interactive
 * form widget (field structure, reason options, validation, Formspree
 * posting) keeps reading locale JSON: field keys double as payload keys
 * and query-param values, so the form structure is behavior, not copy
 * (documented boundary, same class as the Trans gates).
 */
const contactForm: SectionDefinition = {
	id: "contactForm",
	version: 1,
	label: "Contact form (unique)",
	description: "Unique: the /contact form section — header copy plus submit and success strings. The form fields themselves stay locale-owned. Only valid on the contact page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		submitLabel: localeText("Submit label"),
		successHeading: localeText("Success heading"),
		successBody: localeLongText("Success message"),
		id: anchorField(),
		// Excluded from v1 (documented): the form widget's field labels,
		// placeholders, reason options, validation and error strings
		// (form structure is behavior — see the definition note).
	}),
	example: {
		tag: { en: "Send a Message", sw: "Tuma Ujumbe" },
		headline: { en: "Start the conversation", sw: "Anza mazungumzo" },
		description: { en: "Tell us about your project.", sw: "" },
		submitLabel: { en: "Send Message", sw: "Tuma Ujumbe" },
		successHeading: { en: "Message received", sw: "Ujumbe umepokelewa" },
		successBody: { en: "Thank you for reaching out.", sw: "" },
		id: "contact-form",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			submitLabel: resolved.submitLabel,
			successHeading: resolved.successHeading,
			successBody: resolved.successBody,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 2 — careers page (2026-09-18): `careersOpenings` wraps the
 * `CurrentOpeningsSection` openings board (tag + headline + description +
 * TOR modal labels + featured/regular openings with deadlines, actions and
 * TOR details). Unique — only valid on `/careers`. Deadline values are
 * shared date strings (deadline math stays in the renderer); titles,
 * descriptions, TOR copy and action labels are localized; action hrefs and
 * icons are shared. SSR-safe: `useSyncExternalStore` mounted flag renders
 * stable markup on the server; the TOR modal only mounts on click.
 */
const careersOpeningItem = fields.object({
	icon: fields.text({
		label: "MDI icon (optional)",
		description: "Icon slug without the `mdi-` prefix.",
	}),
	title: localeText("Title"),
	applicationDeadline: fields.object(
		{
			label: localeText("Label", { optionalInEnglish: true }),
			value: fields.text({
				label: "Deadline (shared)",
				description: "Deadline date string (e.g. 8 March 2027). Identical in en/sw — drives the closed-state math.",
			}),
		},
		{ label: "Application deadline (leave the value empty to hide)" }
	),
	description: localeLongText("Description"),
	actions: fields.array(
		fields.object({
			icon: fields.text({
				label: "MDI icon (optional)",
				description: "Icon slug without the `mdi-` prefix.",
			}),
			label: localeText("Label"),
			href: fields.text({ label: "Link", description: "Internal path or full URL." }),
		}),
		{
			label: "Actions",
			itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Action"),
		}
	),
	tor: fields.object(
		{
			positionSummary: localeLongText("Position summary"),
			duties: fields.array(localeText("Duty", { optionalInEnglish: true }), {
				label: "Duties",
				itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Duty"),
			}),
			qualifications: fields.array(localeText("Qualification", { optionalInEnglish: true }), {
				label: "Qualifications",
				itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Qualification"),
			}),
			engagement: localeLongText("Engagement"),
		},
		{ label: "Terms of reference (leave the summary empty to hide)" }
	),
});

const careersOpenings: SectionDefinition = {
	id: "careersOpenings",
	version: 1,
	label: "Careers openings (unique)",
	description: "Unique: the /careers openings board — deadlines, actions and terms-of-reference modal. Only valid on the careers page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		torLabels: fields.object(
			{
				button: localeText("TOR button", { optionalInEnglish: true }),
				modalTitle: localeText("Modal title", { optionalInEnglish: true }),
				summaryTitle: localeText("Summary title", { optionalInEnglish: true }),
				dutiesTitle: localeText("Duties title", { optionalInEnglish: true }),
				qualificationsTitle: localeText("Qualifications title", { optionalInEnglish: true }),
				engagementTitle: localeText("Engagement title", { optionalInEnglish: true }),
			},
			{ label: "TOR modal labels" }
		),
		featuredOpenings: fields.array(careersOpeningItem, {
			label: "Featured openings",
			itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Opening"),
		}),
		items: fields.array(careersOpeningItem, {
			label: "Openings",
			itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Opening"),
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract). The hardcoded "Closed" pill renders in
		// English in both locales (legacy quirk, preserved).
	}),
	example: {
		tag: { en: "Careers", sw: "Kazi" },
		headline: { en: "Current openings", sw: "Nafasi zilizopo" },
		description: { en: "", sw: "" },
		torLabels: {
			button: { en: "View TOR", sw: "Angalia TOR" },
			modalTitle: { en: "Terms of Reference", sw: "Masharti ya Kazi" },
			summaryTitle: { en: "Position summary", sw: "Muhtasari wa nafasi" },
			dutiesTitle: { en: "Duties", sw: "Majukumu" },
			qualificationsTitle: { en: "Qualifications", sw: "Sifa" },
			engagementTitle: { en: "Engagement", sw: "Ushirikiano" },
		},
		featuredOpenings: [],
		items: [
			{
				icon: "briefcase",
				title: { en: "Project Manager", sw: "Project Manager" },
				applicationDeadline: {
					label: { en: "Application Deadline", sw: "Mwisho wa Maombi" },
					value: "8 March 2027",
				},
				description: { en: "Lead surveying projects end to end.", sw: "" },
				actions: [{ icon: "", label: { en: "Apply now", sw: "Omba sasa" }, href: "/contact?reason=job-application#contact-form" }],
				tor: {
					positionSummary: { en: "Summary.", sw: "" },
					duties: [{ en: "Lead the crew.", sw: "" }],
					qualifications: [{ en: "BSc Surveying.", sw: "" }],
					engagement: { en: "", sw: "" },
				},
			},
		],
		id: "openings",
	},
	normalize: (resolved) => {
		const opening = (item: any) => ({
			icon: item?.icon || undefined,
			title: item?.title ?? "",
			applicationDeadline:
				item?.applicationDeadline && typeof item.applicationDeadline.value === "string" && item.applicationDeadline.value
					? { label: item.applicationDeadline.label ?? "", value: item.applicationDeadline.value }
					: null,
			description: item?.description ?? "",
			actions: Array.isArray(item?.actions)
				? item.actions.map((action: any) => ({
						icon: action?.icon || undefined,
						label: action?.label ?? "",
						href: typeof action?.href === "string" && action.href ? action.href : "#",
					}))
				: [],
			tor:
				item?.tor && typeof item.tor.positionSummary === "string" && item.tor.positionSummary
					? {
							positionSummary: item.tor.positionSummary,
							duties: Array.isArray(item.tor.duties) ? item.tor.duties.filter((d: unknown) => typeof d === "string" && d) : [],
							qualifications: Array.isArray(item.tor.qualifications)
								? item.tor.qualifications.filter((q: unknown) => typeof q === "string" && q)
								: [],
							engagement: item.tor.engagement || undefined,
						}
					: null,
		});
		return {
			data: {
				tag: resolved.tag,
				headline: resolved.headline,
				description: resolved.description,
				torLabels: resolved.torLabels,
				featuredOpenings: Array.isArray(resolved.featuredOpenings) ? resolved.featuredOpenings.map(opening) : [],
				items: Array.isArray(resolved.items) ? resolved.items.map(opening) : [],
			},
			id: resolved.id || undefined,
		};
	},
};

/**
 * M11 batch 2 — careers page (2026-09-18): `careersProcess` wraps the
 * `ApplicationProcessSection` panel (subtitle + description). Unique —
 * only valid on `/careers`. The `<bold>` pseudo-markup is parsed from DATA
 * by the wrapper itself, so edits change output. Renders nothing when both
 * fields are empty (legacy guard, preserved).
 */
const careersProcess: SectionDefinition = {
	id: "careersProcess",
	version: 1,
	label: "Careers process (unique)",
	description: "Unique: the /careers application-process panel — subtitle plus description with <bold> markup. Only valid on the careers page.",
	schema: fields.object({
		subtitle: localeText("Subtitle", { optionalInEnglish: true }),
		description: localeLongText("Description"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		subtitle: { en: "Application Process", sw: "Mchakato wa Maombi" },
		description: { en: "Submit your CV to <bold>info@smartgridsurveying.com</bold>.", sw: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			subtitle: resolved.subtitle,
			description: resolved.description,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 2 — careers page (2026-09-18): `careersStatement` wraps the
 * `EqualOpportunityStatementSection` card (subtitle + description).
 * Unique — only valid on `/careers`. Renders nothing when both fields are
 * empty (legacy guard, preserved).
 */
const careersStatement: SectionDefinition = {
	id: "careersStatement",
	version: 1,
	label: "Careers statement (unique)",
	description: "Unique: the /careers equal-opportunity statement card. Only valid on the careers page.",
	schema: fields.object({
		subtitle: localeText("Subtitle", { optionalInEnglish: true }),
		description: localeLongText("Description"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the fixed
		// scale-balance icon (presentation, not content).
	}),
	example: {
		subtitle: { en: "Equal Opportunity", sw: "Fursa Sawa" },
		description: { en: "We are an equal opportunity employer.", sw: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			subtitle: resolved.subtitle,
			description: resolved.description,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 3 — company-profile page (2026-09-18): `companyProfileViewer`
 * wraps the `CompanyProfileViewerSection` PDF viewer (tag + headline +
 * description + PDF link + download label + viewer title). Unique — only
 * valid on `/company-profile`. The PDF URL is shared; all other strings
 * are localized. Renders nothing without a PDF link (legacy guard,
 * preserved). The iframe stays lazy inside `DeferredMount` (static
 * fallback on the server).
 */
const companyProfileViewer: SectionDefinition = {
	id: "companyProfileViewer",
	version: 1,
	label: "Company profile viewer (unique)",
	description: "Unique: the /company-profile PDF viewer — header copy, document link and download label. Only valid on the company-profile page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		pdfLink: fields.text({
			label: "PDF link (shared)",
			description: "Embed URL of the document (iframe src). Identical in en/sw.",
		}),
		downloadLabel: localeText("Download label", { optionalInEnglish: true }),
		viewerTitle: localeText("Viewer title", { optionalInEnglish: true }),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the fixed
		// download icons (presentation, not content).
	}),
	example: {
		tag: { en: "Company Profile Document", sw: "Nyaraka za Wasifu wa Kampuni" },
		headline: { en: "Read the Full Profile", sw: "Soma Wasifu Kamili" },
		description: { en: "Browse our complete company profile below.", sw: "" },
		pdfLink: "https://drive.google.com/file/d/1LuUk8Hl_J84tMHb-NKqBvs1QFdJGVTpH/preview",
		downloadLabel: { en: "Open / Download PDF", sw: "Fungua / Pakua PDF" },
		viewerTitle: { en: "SmartGrid Surveying & Civil Works — Company Profile", sw: "" },
		id: "profile-viewer",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			pdfLink: resolved.pdfLink,
			downloadLabel: resolved.downloadLabel,
			viewerTitle: resolved.viewerTitle,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 4 — about page (2026-09-18): `aboutAerialSurveying` wraps the
 * `AerialSurveyingSection` popup card grid (tag + headline + description +
 * popup items). Unique — only valid on `/about`. Presentation
 * (columns/align/tone, positional fallback icons, the hardcoded "Learn
 * more" trigger) stays in the wrapper — only strings are data. Renders
 * nothing without items (legacy guard, preserved).
 */
const aboutAerialSurveying: SectionDefinition = {
	id: "aboutAerialSurveying",
	version: 1,
	label: "About aerial surveying (unique)",
	description: "Unique: the /about aerial capabilities popup grid. Only valid on the about page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				description: localeLongText("Description"),
				popupContent: localeLongText("Popup content"),
			}),
			{
				label: "Capabilities",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Capability"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, `columns`, `align`,
		// `tone`, positional `fallbackIcons` and the "Learn more" trigger
		// (wrapper presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Aerial Surveying Capabilities", sw: "Uwezo wa Upimaji wa Angani" },
		description: { en: "", sw: "" },
		items: [
			{
				title: { en: "Aerial Mapping", sw: "Uchoraji Ramani wa Angani" },
				description: { en: "Accurate drone-based imagery.", sw: "" },
				popupContent: { en: "Ultra-precise aerial mapping using UAVs.", sw: "" },
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
						title: item?.title ?? "",
						description: item?.description ?? "",
						popupContent: item?.popupContent ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 4 — about page (2026-09-18): `aboutLandSurveying` wraps the
 * `LandSurveyingSection` check-bullet grid (tag + headline + description +
 * items). Unique — only valid on `/about`. The `<primary>` pseudo-markup
 * is parsed from DATA by the wrapper itself. NOTE: the legacy `itemsTitle`
 * key is unrendered — intentionally not migrated. Renders nothing without
 * items (legacy guard, preserved).
 */
const aboutLandSurveying: SectionDefinition = {
	id: "aboutLandSurveying",
	version: 1,
	label: "About land surveying (unique)",
	description: "Unique: the /about land surveying check-bullet grid — description supports <primary> markup. Only valid on the about page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Services",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Service"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, `columns`, the fixed
		// `check` header icons and the unrendered legacy `itemsTitle` key.
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Land Surveying Services", sw: "Huduma za Upimaji wa Ardhi" },
		description: { en: "Accurate surveys for <primary>planning</primary>.", sw: "" },
		items: [
			{
				title: { en: "Topographical Surveys", sw: "Uchunguzi wa Topografia" },
				description: { en: "Accurate surveys for planning.", sw: "" },
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
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 4 — about page (2026-09-18): `aboutImpact` wraps the
 * `ImpactAcrossAfricaSection` globe panel (tag + headline + image +
 * description + why-choose-us card). Unique — only valid on `/about`. The
 * image path is shared; all other strings are localized. The WebGL globe
 * stays client-only (`dynamic ssr:false`, spinner fallback on the server).
 */
const aboutImpact: SectionDefinition = {
	id: "aboutImpact",
	version: 1,
	label: "About impact (unique)",
	description: "Unique: the /about globe panel with the why-choose-us card. Only valid on the about page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		image: imagePath("Image (shared)"),
		description: localeLongText("Description"),
		whyChooseUs: fields.object(
			{
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				items: fields.array(localeText("Point", { optionalInEnglish: true }), {
					label: "Points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
			},
			{ label: "Why-choose-us card (leave the title empty to hide)" }
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Impact Across Africa", sw: "Athari Barani Afrika" },
		image: "/media/about/28.jpeg",
		description: { en: "", sw: "" },
		whyChooseUs: {
			icon: "lightbulb-on",
			title: { en: "Why Choose SmartGrid for Drone Services?", sw: "Kwa Nini Uchague SmartGrid kwa Huduma za Droni?" },
			items: [{ en: "Certified Drone Pilots", sw: "Mapiloti wa Droni Walioidhinishwa" }],
		},
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			image: resolved.image || undefined,
			description: resolved.description,
			whyChooseUs:
				resolved.whyChooseUs && typeof resolved.whyChooseUs.title === "string" && resolved.whyChooseUs.title
					? {
							icon: resolved.whyChooseUs.icon || undefined,
							title: resolved.whyChooseUs.title,
							items: Array.isArray(resolved.whyChooseUs.items)
								? resolved.whyChooseUs.items.filter((point: unknown) => typeof point === "string" && point)
								: [],
						}
					: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 5 — hubs (2026-09-18): `surveyingServices` wraps the
 * `SurveyingServicesSection` service grid with the framed map image below
 * it (tag + headline + description + image + link cards). Unique — only
 * valid on `/surveying`. Card icons/hrefs are shared; titles and
 * descriptions are localized. Renders nothing without items (legacy
 * guard, preserved).
 */
const surveyingServices: SectionDefinition = {
	id: "surveyingServices",
	version: 1,
	label: "Surveying services (unique)",
	description: "Unique: the /surveying service grid with the framed map image below it. Only valid on the surveying hub.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		image: imagePath("Map image (shared)"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
				href: fields.text({
					label: "Link (shared, optional)",
					description: "Card links to this URL when set. Identical in en/sw.",
				}),
			}),
			{
				label: "Services",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Service"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "Services", sw: "Huduma" },
		headline: { en: "Our Surveying Services", sw: "Huduma Zetu za Upimaji" },
		description: { en: "", sw: "" },
		image: "/media/surveying/05.png",
		items: [
			{
				icon: "map",
				title: { en: "Topographical Surveys", sw: "Upimaji wa Topografia" },
				description: { en: "Accurate surveys for planning.", sw: "" },
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
			image: resolved.image || undefined,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
						href: item?.href && item.href.trim() ? item.href : undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 5 — hubs (2026-09-18): `surveyingProcess` wraps the
 * `SurveyingProcessSection` indexed/watermarked step cards (tag + headline
 * + description + items). Unique — only valid on `/surveying`. Titles and
 * descriptions are localized (legacy items carry no icons). Renders
 * nothing without items (legacy guard, preserved).
 */
const surveyingProcess: SectionDefinition = {
	id: "surveyingProcess",
	version: 1,
	label: "Surveying process (unique)",
	description: "Unique: the /surveying indexed process cards. Only valid on the surveying hub.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Steps",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Step"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the fixed index
		// badge styling (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Our Process", sw: "Mchakato Wetu" },
		description: { en: "", sw: "" },
		items: [
			{
				title: { en: "Pre-Survey Planning", sw: "Mipango ya Kabla ya Upimaji" },
				description: { en: "Site evaluation first.", sw: "" },
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
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 5 — hubs (2026-09-18): `civilHero` wraps the bespoke diagonal
 * `CivilHeroSection` (headline eyebrow + title + description + image +
 * pill CTAs). Unique — only valid on `/civil`. The image and CTA hrefs are
 * shared; all other strings are localized.
 */
const civilHero: SectionDefinition = {
	id: "civilHero",
	version: 1,
	label: "Civil hero (unique)",
	description: "Unique: the /civil diagonal hero — eyebrow, title, description, image and pill CTAs. Only valid on the civil hub.",
	schema: fields.object({
		headline: localeText("Eyebrow"),
		title: localeText("Title"),
		description: localeLongText("Description"),
		image: imagePath("Background image (shared)"),
		ctaPrimary: linkObject("Primary action"),
		ctaSecondary: linkObject("Secondary action"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		headline: { en: "Precision Construction", sw: "Ujenzi Sahihi" },
		title: { en: "Civil Engineering", sw: "Uhandisi wa Kiraia" },
		description: { en: "Faster, safer site mapping.", sw: "" },
		image: "/media/civil/01.jpeg",
		ctaPrimary: { label: { en: "Get a quote", sw: "Omba nukuu" }, href: "/contact", icon: "" },
		ctaSecondary: { label: { en: "", sw: "" }, href: "", icon: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			headline: resolved.headline,
			title: resolved.title,
			description: resolved.description,
			image: resolved.image || undefined,
			ctaPrimary: presentLink(resolved.ctaPrimary),
			ctaSecondary: presentLink(resolved.ctaSecondary),
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 5 — hubs (2026-09-18): `civilProcess` wraps the
 * `CivilProcessSection` image stepper with the step rail (tag + headline +
 * description + image + steps). Unique — only valid on `/civil`. The image
 * and step icons are shared; titles and descriptions are localized.
 * Renders nothing without items (legacy guard, preserved).
 */
const civilProcess: SectionDefinition = {
	id: "civilProcess",
	version: 1,
	label: "Civil process (unique)",
	description: "Unique: the /civil image stepper with the step rail. Only valid on the civil hub.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		image: imagePath("Stepper image (shared)"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Steps",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Step"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Our Process", sw: "Mchakato Wetu" },
		description: { en: "", sw: "" },
		image: "/media/civil/03.jpeg",
		items: [
			{
				icon: "map-search",
				title: { en: "Reconnaissance & Planning", sw: "Uchunguzi na Mipango" },
				description: { en: "Initial site assessment.", sw: "" },
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			image: resolved.image || undefined,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 5 — hubs (2026-09-18): `deliverables` wraps the SHARED
 * interactive `Deliverables` explorer (tag + headline + description +
 * live label + checks + deliverable items). SHARED (not unique): the node
 * shape is identical on every page that renders `<Deliverables ns=…>`
 * (verified across surveying/civil children + hubs), so one contract
 * serves them all instead of a dozen duplicate unique ids. Item icons are
 * shared; titles, formats and descriptions are localized; item images are
 * per-locale (civil items prove paths can diverge). The `tone` select
 * reproduces the wrapper `className` variance (`surface` = `bg-surface`).
 * Renders nothing without items (legacy guard, preserved).
 */
const deliverables: SectionDefinition = {
	id: "deliverables",
	version: 1,
	label: "Deliverables explorer",
	description: "Interactive deliverables explorer: header, live-preview panel and selectable deliverable list. Works on any page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		liveLabel: localeText("Live label", { optionalInEnglish: true }),
		checks: fields.array(localeText("Check", { optionalInEnglish: true }), {
			label: "Checks",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Check"),
		}),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				format: localeText("Format", { optionalInEnglish: true }),
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				image: localeMedia("Image"),
				description: localeLongText("Description"),
			}),
			{
				label: "Deliverables",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Deliverable"),
			}
		),
		tone: fields.select({
			label: "Tone",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Surface", value: "surface" },
			],
			defaultValue: "default",
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `className` beyond the tone
		// (visual tuning, not an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "What You Get", sw: "Unachopata" },
		description: { en: "", sw: "" },
		liveLabel: { en: "Deliverable package", sw: "Kifurushi cha matokeo" },
		checks: [{ en: "Submission-ready", sw: "Tayari kuwasilishwa" }],
		items: [
			{
				title: { en: "Boundary Survey Reports & Plans", sw: "Ripoti na Mipango ya Upimaji wa Mipaka" },
				format: { en: "PDF / Printed plans", sw: "" },
				icon: "vector-square",
				image: { en: "/media/deliverables/boundary-survey-reports-and-plans.jpg", sw: "" },
				description: { en: "Signed reports and plans.", sw: "" },
			},
		],
		tone: "surface",
		id: "",
	},
	normalize: (resolved) => ({
		content: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			liveLabel: resolved.liveLabel,
			checks: Array.isArray(resolved.checks) ? resolved.checks.filter((check: unknown) => typeof check === "string" && check) : [],
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						title: item?.title ?? "",
						format: item?.format ?? "",
						icon: item?.icon || undefined,
						image: item?.image || undefined,
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
		className: resolved.tone === "surface" ? "bg-surface" : "",
	}),
};

/**
 * M13 batch 1 — shared `workflow` (2026-09-20): the `WorkflowSection`
 * timeline (tag + headline + description + steps + outcome pill + closing
 * CTA) as a reusable branch. Collapses the M11 `aerialWorkflow` unique
 * (single-shared-child forward, `outcomeLabel` → `outcome` rename folded
 * into the contract); later batches collapse the remaining workflow
 * uniques onto this id. Icons/hrefs shared; labels and descriptions
 * localized. `phaseStyles` stays renderer-owned for now (only the
 * cadastral override needs it — decided at batch 2). Renders nothing
 * without steps (shared-component guard, preserved).
 */
const workflow: SectionDefinition = {
	id: "workflow",
	version: 2,
	label: "Workflow",
	description: "Process timeline with an outcome pill and closing action. Works on any page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		outcome: localeText("Outcome label", { optionalInEnglish: true }),
		steps: fields.array(
			fields.object({
				phase: fields.text({
					label: "Phase key (shared, optional)",
					description: "Phase bucket key (e.g. ACQUISITION) for the timeline chips. Identical in en/sw.",
				}),
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				label: localeText("Label"),
				description: localeLongText("Description"),
			}),
			{
				label: "Steps",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Step"),
			}
		),
		ctaNote: localeLongText("CTA note"),
		cta: linkObject("Closing action"),
		acquisition: fields.select({
			label: "Acquisition phase style",
			description:
				"Chip style for ACQUISITION steps. Satellite suits land-based acquisition (cadastral); the hydrographic default suits bathymetric-style pages. Copied from the legacy wrapper.",
			options: [
				{ label: "Default (hydrographic)", value: "default" },
				{ label: "Purple satellite", value: "satellite" },
			],
			defaultValue: "default",
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`, `className`
		// (visual tuning, not editor contracts).
	}),
	example: {
		tag: { en: "Pipeline", sw: "Mchakato" },
		headline: { en: "Our Drone Survey Workflow", sw: "Mtiririko Wetu wa Upimaji wa Droni" },
		description: { en: "", sw: "" },
		outcome: { en: "Engineering-ready data", sw: "" },
		steps: [
			{
				phase: "",
				icon: "clipboard-list-outline",
				label: { en: "Site Assessment", sw: "Tathmini ya Tovuti" },
				description: { en: "Define the survey area.", sw: "" },
			},
		],
		ctaNote: { en: "", sw: "" },
		cta: { label: { en: "Request samples", sw: "Omba sampuli" }, href: "mailto:smartgridsurveying@gmail.com", icon: "" },
		acquisition: "default",
		id: "",
	},
	normalize: (resolved) => ({
		tag: resolved.tag,
		headline: resolved.headline,
		description: resolved.description,
		outcome: resolved.outcome,
		steps: Array.isArray(resolved.steps)
			? resolved.steps.map((step: any) => ({
					phase: step?.phase || undefined,
					icon: step?.icon || undefined,
					label: step?.label ?? "",
					description: step?.description ?? "",
				}))
			: [],
		ctaNote: resolved.ctaNote,
		cta:
			resolved.cta && typeof resolved.cta.href === "string" && resolved.cta.href
				? { label: resolved.cta.label ?? "", href: resolved.cta.href, icon: resolved.cta.icon || undefined }
				: null,
		phaseStyles:
			resolved.acquisition === "satellite"
				? { ACQUISITION: { chip: "border-purple-300/60 bg-purple-50 text-purple-700", icon: "satellite-variant" } }
				: undefined,
		id: resolved.id || undefined,
	}),
};

/**
 * M13 batch 1 — shared `finalCta` (2026-09-20): the `FinalCta` closing
 * action cards as a reusable branch. Collapses the M11 `aerialFinalCta`
 * unique (single-shared-child forward); later batches collapse the
 * remaining final-CTA uniques onto this id. `watermark`/`columns`/`align`
 * were hardcoded per-page in the wrappers, so they travel as shared
 * (non-localized) fields here — the migration fills the legacy literals.
 * Icons/hrefs shared; labels and descriptions localized. The legacy
 * render-nothing-without-headline guard stays page-side; the schema
 * requires a headline.
 */
const finalCta: SectionDefinition = {
	id: "finalCta",
	version: 2,
	label: "Final CTA",
	description: "Closing action cards with a watermark icon. Works on any page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		descriptionTone: fields.select({
			label: "Lede tone",
			description: "Muted standard lede or the emphasised accent line, copied from the legacy wrapper.",
			options: [
				{ label: "Muted", value: "muted" },
				{ label: "Accent", value: "accent" },
			],
			defaultValue: "muted",
		}),
		note: localeLongText("Note"),
		actionsLabel: localeText("Actions label", { optionalInEnglish: true }),
		actions: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				label: localeText("Label"),
				description: localeLongText("Description"),
				href: fields.text({
					label: "Link (shared)",
					description: "Internal path or full URL. Identical in en/sw.",
				}),
			}),
			{
				label: "Actions",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Action"),
			}
		),
		actionIconFallback: fields.text({
			label: "Fallback action icon (shared)",
			description:
				"MDI icon slug without the `mdi-` prefix for actions without their own icon, copied from the legacy wrapper. Empty = component default.",
		}),
		watermark: fields.text({
			label: "Watermark icon (shared)",
			description: "MDI icon slug without the `mdi-` prefix, copied from the legacy wrapper. Identical in en/sw.",
		}),
		columns: fields.select({
			label: "Columns",
			description: "Card grid columns on sm+ screens, copied from the legacy wrapper.",
			options: [
				{ label: "3 columns", value: "3" },
				{ label: "4 columns", value: "4" },
			],
			defaultValue: "4",
		}),
		align: fields.select({
			label: "Alignment",
			description: "Card text alignment, copied from the legacy wrapper.",
			options: [
				{ label: "Center", value: "center" },
				{ label: "Left", value: "left" },
			],
			defaultValue: "center",
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `classes`, `className`
		// (visual tuning, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Start Your Aerial Survey", sw: "Anza Upimaji Wako wa Angani" },
		description: { en: "", sw: "" },
		descriptionTone: "muted",
		note: { en: "", sw: "" },
		actionsLabel: { en: "", sw: "" },
		actions: [
			{
				icon: "cash-multiple",
				label: { en: "Get Instant Quote", sw: "Pata Nukuu" },
				description: { en: "24-hour response.", sw: "" },
				href: "mailto:smartgridsurveying@gmail.com",
			},
		],
		actionIconFallback: "",
		watermark: "drone",
		columns: "4",
		align: "center",
		id: "",
	},
	normalize: (resolved) => ({
		tag: resolved.tag,
		headline: resolved.headline,
		description: resolved.description,
		descriptionTone: resolved.descriptionTone === "accent" ? "accent" : "muted",
		note: resolved.note,
		actionsLabel: resolved.actionsLabel,
		actions: Array.isArray(resolved.actions)
			? resolved.actions.map((action: any) => ({
					icon: action?.icon || undefined,
					label: action?.label ?? "",
					description: action?.description ?? "",
					href: typeof action?.href === "string" ? action.href : "",
				}))
			: [],
		actionIconFallback: resolved.actionIconFallback || undefined,
		watermark: resolved.watermark || undefined,
		columns: resolved.columns === "3" ? 3 : 4,
		align: resolved.align === "left" ? "left" : "center",
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 6 — topographical-surveys page (2026-09-18): `topoWhenYouNeed`
 * wraps the `WhenYouNeedSection` 2-col grid whose items with `children`
 * render as wide cards with an inset sub-item checklist. Unique — only
 * valid on `/surveying/topographical-surveys`. Icons are shared; titles,
 * descriptions and children are localized. Renders nothing without items
 * (legacy guard, preserved).
 */
const topoWhenYouNeed: SectionDefinition = {
	id: "topoWhenYouNeed",
	version: 1,
	label: "Topo when-you-need (unique)",
	description: "Unique: the topographical-surveys use-case grid with wide sub-item cards. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
				children: fields.array(
					fields.object({
						title: localeText("Title"),
						description: localeLongText("Description"),
					}),
					{
						label: "Sub-items (renders the card wide with a checklist)",
						itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Sub-item"),
					}
				),
			}),
			{
				label: "Use cases",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Use case"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the `lg` icon size
		// (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "When You Need It", sw: "Unapohitaji" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "map",
				title: { en: "Buying Land", sw: "Kununua Ardhi" },
				description: { en: "Verify boundaries first.", sw: "" },
				children: [],
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
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
						children: Array.isArray(item?.children)
							? item.children.map((child: any) => ({
									title: child?.title ?? "",
									description: child?.description ?? "",
								}))
							: [],
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 6 — topographical-surveys page (2026-09-18): `topoWhatWeOffer`
 * wraps the `WhatWeOfferSection` indexed grid with positional fallback
 * icons. Unique — only valid on `/surveying/topographical-surveys`.
 * Titles and descriptions are localized. Renders nothing without items
 * (legacy guard, preserved).
 */
const topoWhatWeOffer: SectionDefinition = {
	id: "topoWhatWeOffer",
	version: 1,
	label: "Topo what-we-offer (unique)",
	description: "Unique: the topographical-surveys indexed services grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Services",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Service"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, indexed
		// numbering, positional fallback icons and card density (wrapper
		// presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "What We Offer", sw: "Tunachotoa" },
		description: { en: "", sw: "" },
		items: [
			{
				title: { en: "Design Topos", sw: "Topografia za Kubuni" },
				description: { en: "Contours for design.", sw: "" },
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
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 6 — topographical-surveys page (2026-09-18):
 * `topoDetailedSurveys` wraps the `DetailedSurveysSection` media-badge
 * grid. Unique — only valid on `/surveying/topographical-surveys`. Item
 * images are shared; titles and descriptions are localized. Renders
 * nothing without items (legacy guard, preserved).
 */
const topoDetailedSurveys: SectionDefinition = {
	id: "topoDetailedSurveys",
	version: 1,
	label: "Topo detailed surveys (unique)",
	description: "Unique: the topographical-surveys media-badge capability grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				image: imagePath("Image (shared)"),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Capabilities",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Capability"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, media
		// badges and the paper card variant (presentation, not editor
		// contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Detailed Surveys", sw: "Upimaji wa Kina" },
		description: { en: "", sw: "" },
		items: [
			{
				image: "/media/surveying/topographical/detail-1.jpg",
				title: { en: "Settlement Mapping", sw: "Ramani za Makazi" },
				description: { en: "Dense detail capture.", sw: "" },
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
						image: item?.image || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 6 — topographical-surveys page (2026-09-18): `topoSampleMap`
 * wraps the `SampleMapSection` info card + framed map image. Unique — only
 * valid on `/surveying/topographical-surveys`. The map image is shared;
 * all other strings are localized.
 */
const topoSampleMap: SectionDefinition = {
	id: "topoSampleMap",
	version: 1,
	label: "Topo sample map (unique)",
	description: "Unique: the topographical-surveys sample-map split (info card + framed image). Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		map: fields.object(
			{
				title: localeText("Title"),
				description: localeLongText("Description"),
				image: imagePath("Map image (shared)"),
				items: fields.array(localeText("Highlight", { optionalInEnglish: true }), {
					label: "Highlights",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Highlight"),
				}),
			},
			{ label: "Map card" }
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Sample Map", sw: "Ramani Mfano" },
		description: { en: "", sw: "" },
		map: {
			title: { en: "MAP HIGHLIGHTS", sw: "MUHIMU ZA RAMANI" },
			description: { en: "Every element included.", sw: "" },
			image: "/media/surveying/topographical/sample-topographical-map.png",
			items: [{ en: "Contours", sw: "Kontua" }],
		},
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			map: resolved.map
				? {
						title: resolved.map.title ?? "",
						description: resolved.map.description ?? "",
						image: resolved.map.image || undefined,
						items: Array.isArray(resolved.map.items)
							? resolved.map.items.filter((highlight: unknown) => typeof highlight === "string" && highlight)
							: [],
					}
				: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 6 — topographical-surveys page (2026-09-18): `topoInstruments`
 * wraps the `InstrumentsSection` background-media instrument cards (label
 * + image items). Unique — only valid on
 * `/surveying/topographical-surveys`. Labels are localized, images are
 * shared. Renders nothing without items (legacy guard, preserved).
 */
const topoInstruments: SectionDefinition = {
	id: "topoInstruments",
	version: 1,
	label: "Topo instruments (unique)",
	description: "Unique: the topographical-surveys instrument media cards. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				label: localeText("Label"),
				image: imagePath("Image (shared)"),
			}),
			{
				label: "Instruments",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Instrument"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, tone and
		// background media presentation (wrapper presentation, not editor
		// contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Instruments", sw: "Vifaa" },
		description: { en: "", sw: "" },
		items: [
			{
				label: { en: "RTK GNSS FOIF A90", sw: "RTK GNSS FOIF A90" },
				image: "/media/instruments/RTK-GNSS-FOIF-A90.jpg",
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
						image: item?.image || undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 6 — topographical-surveys page (2026-09-18): `topoWhyConduct`
 * wraps the `WhyConductSection` indexed grid with the crosshairs header
 * glyph. Unique — only valid on `/surveying/topographical-surveys`.
 * Titles and descriptions are localized. Renders nothing without items
 * (legacy guard, preserved).
 */
const topoWhyConduct: SectionDefinition = {
	id: "topoWhyConduct",
	version: 1,
	label: "Topo why-conduct (unique)",
	description: "Unique: the topographical-surveys indexed why-conduct grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Reasons",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Reason"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, indexed
		// numbering and the crosshairs header glyph (presentation, not
		// editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Why Conduct a Survey", sw: "Kwa Nini Ufanye Upimaji" },
		description: { en: "", sw: "" },
		items: [
			{
				title: { en: "Avoid Disputes", sw: "Epuka Migogoro" },
				description: { en: "Know your boundaries.", sw: "" },
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
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};


/**
 * M11 batch 7 — sectional-properties page (2026-09-18): `sectionalWhatIs`
 * wraps the bespoke `WhatIsSection` ownership cards (tag + headline +
 * description + items with point lists and impact chips). Unique — only
 * valid on `/surveying/sectional-properties`. Icons are shared; titles,
 * points and impacts are localized. NOTE: the legacy `diagramLabel` key is
 * unrendered (figure commented out) — not migrated. Renders nothing without
 * a headline and items (legacy guard, preserved).
 */
const sectionalWhatIs: SectionDefinition = {
	id: "sectionalWhatIs",
	version: 1,
	label: "Sectional what-is (unique)",
	description: "Unique: the sectional-properties ownership cards with impact chips. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline", { optionalInEnglish: true }),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
				points: fields.array(localeText("Point", { optionalInEnglish: true }), {
					label: "Points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
				impactsLabel: localeText("Impacts label", { optionalInEnglish: true }),
				impacts: fields.array(localeText("Impact", { optionalInEnglish: true }), {
					label: "Impacts",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Impact"),
				}),
			}),
			{
				label: "Ownership cards",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Card"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, positional card
		// icons/numbers and the unrendered legacy `diagramLabel` key.
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "What Are Sectional Properties", sw: "Mali za Sehemu ni Nini" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "door-open",
				title: { en: "Private Unit Ownership", sw: "Umiliki wa Vitengo Binafsi" },
				points: [{ en: "Each unit is individually owned.", sw: "" }],
				impactsLabel: { en: "", sw: "" },
				impacts: [],
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
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						points: Array.isArray(item?.points) ? item.points.filter((point: unknown) => typeof point === "string" && point) : [],
						impactsLabel: item?.impactsLabel ?? "",
						impacts: Array.isArray(item?.impacts) ? item.impacts.filter((impact: unknown) => typeof impact === "string" && impact) : [],
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 7 — sectional-properties page (2026-09-18):
 * `sectionalServicesDetail` wraps the `ServicesDetailSection` indexed grid
 * with positional fallback icons. Unique — only valid on
 * `/surveying/sectional-properties`. Titles and descriptions are localized.
 * Renders nothing without items (legacy guard, preserved).
 */
const sectionalServicesDetail: SectionDefinition = {
	id: "sectionalServicesDetail",
	version: 1,
	label: "Sectional services detail (unique)",
	description: "Unique: the sectional-properties indexed services grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Services",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Service"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, tone,
		// indexed numbering and positional fallback icons (presentation,
		// not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Services in Detail", sw: "Huduma kwa Kina" },
		description: { en: "", sw: "" },
		items: [
			{
				title: { en: "Mutation Surveys", sw: "Upimaji wa Mabadiliko" },
				description: { en: "Subdivision support.", sw: "" },
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
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 7 — sectional-properties page (2026-09-18): `sectionalWorkflow`
 * wraps the `ProcessSection` WorkflowSection passthrough (tag + headline +
 * description + phased steps + outcome). Unique — only valid on
 * `/surveying/sectional-properties`. Phase keys are shared literals;
 * labels and descriptions are localized. NOTE: the locale
 * `ctaPrimary`/`ctaSecondary` keys are unrendered (`WorkflowSection` only
 * reads `cta`) — not migrated. The domain PHASE_STYLES stay hardcoded in
 * the wrapper. Renders nothing without steps (legacy guard, preserved).
 */
const sectionalWorkflow: SectionDefinition = {
	id: "sectionalWorkflow",
	version: 1,
	label: "Sectional workflow (unique)",
	description: "Unique: the sectional-properties phased workflow. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		steps: fields.array(
			fields.object({
				phase: fields.text({
					label: "Phase key (shared)",
					description: "Phase bucket key (e.g. FIELD, OFFICE, REGISTRY). Identical in en/sw.",
				}),
				label: localeText("Label"),
				description: localeLongText("Description"),
			}),
			{
				label: "Steps",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Step"),
			}
		),
		outcome: localeText("Outcome", { optionalInEnglish: true }),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, domain `phaseStyles`
		// and the unrendered `ctaPrimary`/`ctaSecondary` keys.
	}),
	example: {
		tag: { en: "Process", sw: "Mchakato" },
		headline: { en: "Sectional Property Survey Process", sw: "Mchakato wa Upimaji wa Mali za Sehemu" },
		description: { en: "", sw: "" },
		steps: [
			{
				phase: "FIELD",
				label: { en: "Site Data Collection", sw: "Ukusanyaji wa Data za Tovuti" },
				description: { en: "We visit the site.", sw: "" },
			},
		],
		outcome: { en: "", sw: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			steps: Array.isArray(resolved.steps)
				? resolved.steps.map((step: any) => ({
						phase: step?.phase ?? "",
						label: step?.label ?? "",
						description: step?.description ?? "",
					}))
				: [],
			outcome: resolved.outcome,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 7 — sectional-properties page (2026-09-18): `sectionalTimeline`
 * wraps the `TimelineSection` stage-bar timeline (tag + headline +
 * description + rail labels + stages + email CTA). Unique — only valid on
 * `/surveying/sectional-properties`. Stage day counts and the CTA href are
 * shared; all other strings are localized. The timeline computation stays
 * in the wrapper. Renders nothing without a headline and stages (legacy
 * guard, preserved).
 */
const sectionalTimeline: SectionDefinition = {
	id: "sectionalTimeline",
	version: 1,
	label: "Sectional timeline (unique)",
	description: "Unique: the sectional-properties stage-bar timeline. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline", { optionalInEnglish: true }),
		description: localeLongText("Description"),
		barLabel: localeText("Bar label", { optionalInEnglish: true }),
		startLabel: localeText("Start label", { optionalInEnglish: true }),
		endLabel: localeText("End label", { optionalInEnglish: true }),
		costNote: localeText("Cost note", { optionalInEnglish: true }),
		stages: fields.array(
			fields.object({
				label: localeText("Label"),
				range: localeText("Range", { optionalInEnglish: true }),
				days: fields.integer({ label: "Days (shared)", defaultValue: 1, validation: { min: 0 } }),
			}),
			{
				label: "Stages",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Stage"),
			}
		),
		ctaEmail: linkObject("Email action"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "How Long It Takes", sw: "Inachukua Muda Gani" },
		description: { en: "", sw: "" },
		barLabel: { en: "", sw: "" },
		startLabel: { en: "", sw: "" },
		endLabel: { en: "", sw: "" },
		costNote: { en: "", sw: "" },
		stages: [
			{
				label: { en: "Data Collection", sw: "Ukusanyaji wa Data" },
				range: { en: "Days 1–2", sw: "Siku 1–2" },
				days: 2,
			},
		],
		ctaEmail: { label: { en: "Request Exact Timeline", sw: "Omba Ratiba Halisi" }, href: "mailto:info@smartgridsurveying.com", icon: "" },
		id: "timeline",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			barLabel: resolved.barLabel,
			startLabel: resolved.startLabel,
			endLabel: resolved.endLabel,
			costNote: resolved.costNote,
			stages: Array.isArray(resolved.stages)
				? resolved.stages.map((stage: any) => ({
						label: stage?.label ?? "",
						range: stage?.range ?? "",
						days: typeof stage?.days === "number" ? stage.days : undefined,
					}))
				: [],
			ctaEmail: presentLink(resolved.ctaEmail),
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 7 — sectional-properties page (2026-09-18): `sectionalWhoNeeds`
 * wraps the `WhoNeedsSection` linkable card grid (tag + headline +
 * description + shared footer-link label + items). Unique — only valid on
 * `/surveying/sectional-properties`. Icons/hrefs are shared; titles and
 * descriptions are localized. The per-card footer-link computation stays in
 * the wrapper. Renders nothing without items (legacy guard, preserved).
 */
const sectionalWhoNeeds: SectionDefinition = {
	id: "sectionalWhoNeeds",
	version: 1,
	label: "Sectional who-needs (unique)",
	description: "Unique: the sectional-properties linkable audience grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		linkLabel: localeText("Card link label", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
				href: fields.text({
					label: "Link (shared, optional)",
					description: "Card links to this URL when set. Identical in en/sw.",
				}),
			}),
			{
				label: "Audiences",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Audience"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the positional
		// fallback icon (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Who Needs It", sw: "Nani Anaihitaji" },
		description: { en: "", sw: "" },
		linkLabel: { en: "Start here", sw: "Anzia hapa" },
		items: [
			{
				icon: "city",
				title: { en: "Real Estate Developers", sw: "Wasanidi wa Mali" },
				description: { en: "Register developments.", sw: "" },
				href: "/contact?reason=request-survey#contact-form",
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			linkLabel: resolved.linkLabel,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
						href: item?.href && item.href.trim() ? item.href : undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};


/**
 * M11 batch 8 — bathymetric-surveys page (2026-09-18): `bathyEquipment`
 * wraps the `EquipmentTechnologySection` split (header + staggered image
 * collage). Unique — only valid on `/surveying/bathymetric-surveys`. The
 * image paths are shared; header strings are localized.
 */
const bathyEquipment: SectionDefinition = {
	id: "bathyEquipment",
	version: 1,
	label: "Bathy equipment (unique)",
	description: "Unique: the bathymetric-surveys equipment split with image collage. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		images: fields.array(imagePath("Image (shared)"), {
			label: "Images",
			itemLabel: (item) => previewText(item, ["value"], "Image"),
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Equipment & Technology", sw: "Vifaa na Teknolojia" },
		description: { en: "", sw: "" },
		images: ["/media/surveying/bathymetric-surveys/03-01.jpeg"],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			images: Array.isArray(resolved.images) ? resolved.images.filter((src: unknown) => typeof src === "string" && src) : [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 8 — bathymetric-surveys page (2026-09-18): `bathyLimitations`
 * wraps the `TechnicalLimitationsSection` two-card panel (accuracy factors
 * + typical outputs). Unique — only valid on
 * `/surveying/bathymetric-surveys`. All strings are localized. NOTE: the
 * card headings are hardcoded in JSX (legacy quirk, both locales) — not
 * migrated. Renders nothing without factors and outputs (legacy guard,
 * preserved).
 */
const bathyLimitations: SectionDefinition = {
	id: "bathyLimitations",
	version: 1,
	label: "Bathy limitations (unique)",
	description: "Unique: the bathymetric-surveys accuracy-factors/outputs panel. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		factors: fields.array(localeText("Factor", { optionalInEnglish: true }), {
			label: "Accuracy factors",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Factor"),
		}),
		outputs: fields.array(localeText("Output", { optionalInEnglish: true }), {
			label: "Typical outputs",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Output"),
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the hardcoded
		// card headings (legacy quirk).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Technical Limitations", sw: "Mapungufu ya Kiufundi" },
		description: { en: "", sw: "" },
		factors: [{ en: "Water turbidity", sw: "Uto wa maji" }],
		outputs: [{ en: "Depth charts", sw: "Chati za kina" }],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			factors: Array.isArray(resolved.factors) ? resolved.factors.filter((factor: unknown) => typeof factor === "string" && factor) : [],
			outputs: Array.isArray(resolved.outputs) ? resolved.outputs.filter((output: unknown) => typeof output === "string" && output) : [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 8 — bathymetric-surveys page (2026-09-18): `bathyDamsLakes`
 * wraps the `DamsLakesSection` card grid with the lead image strip above
 * it. Unique — only valid on `/surveying/bathymetric-surveys`. Image paths
 * and icons are shared; titles and descriptions are localized. Renders
 * nothing without items and images (legacy guard, preserved).
 */
const bathyDamsLakes: SectionDefinition = {
	id: "bathyDamsLakes",
	version: 1,
	label: "Bathy dams & lakes (unique)",
	description: "Unique: the bathymetric-surveys coverage grid with lead images. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		images: fields.array(imagePath("Image (shared)"), {
			label: "Lead images (first two render)",
			itemLabel: (item) => previewText(item, ["value"], "Image"),
		}),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Water bodies",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Water body"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Dams, Lakes & Oceans", sw: "Mabwawa, Maziwa na Bahari" },
		description: { en: "", sw: "" },
		images: ["/media/surveying/bathymetric-surveys/bathymetric-surveys-10.jpg"],
		items: [
			{
				icon: "chart-bubble",
				title: { en: "Monitor Siltation", sw: "Fuatilia Mchanga" },
				description: { en: "Track sediment build-up.", sw: "" },
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			images: Array.isArray(resolved.images) ? resolved.images.filter((src: unknown) => typeof src === "string" && src) : [],
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 8 — bathymetric-surveys page (2026-09-18): `bathyApplications`
 * wraps the `ApplicationsSection` media-badge grid. Unique — only valid on
 * `/surveying/bathymetric-surveys`. Icons and images are shared; titles
 * and descriptions are localized. Renders nothing without items (legacy
 * guard, preserved).
 */
const bathyApplications: SectionDefinition = {
	id: "bathyApplications",
	version: 1,
	label: "Bathy applications (unique)",
	description: "Unique: the bathymetric-surveys media-badge applications grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				image: imagePath("Image (shared, optional)"),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Applications",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Application"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, tone and
		// media badges (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Applications", sw: "Matumizi" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "water-well",
				image: "/media/surveying/bathymetric-surveys/bathymetric-surveys-13.jpg",
				title: { en: "Depth Analysis", sw: "Uchambuzi wa Kina" },
				description: { en: "Precise depth measurement.", sw: "" },
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
						icon: item?.icon || undefined,
						image: item?.image || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 8 — bathymetric-surveys page (2026-09-18): `bathyBeforeAfter`
 * wraps the `BathymetricBeforeAfterSection` flip card (tag + headline +
 * flip hint + before/after sides). Unique — only valid on
 * `/surveying/bathymetric-surveys`. All strings are localized.
 * Presentation (ferry icon, watermark, layout id) stays in the wrapper.
 * Renders nothing without a headline (legacy guard, preserved).
 */
const bathyBeforeAfter: SectionDefinition = {
	id: "bathyBeforeAfter",
	version: 1,
	label: "Bathy before/after (unique)",
	description: "Unique: the bathymetric-surveys before/after flip card. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		flipHint: localeText("Flip hint", { optionalInEnglish: true }),
		before: fields.object(
			{
				label: localeText("Label"),
				tagline: localeText("Tagline", { optionalInEnglish: true }),
				items: fields.array(localeText("Point", { optionalInEnglish: true }), {
					label: "Points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
			},
			{ label: "Before" }
		),
		after: fields.object(
			{
				label: localeText("Label"),
				tagline: localeText("Tagline", { optionalInEnglish: true }),
				items: fields.array(localeText("Point", { optionalInEnglish: true }), {
					label: "Points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
			},
			{ label: "After" }
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the fixed ferry
		// icon, watermark and layout id (presentation, not content).
	}),
	example: {
		tag: { en: "Value Demonstration", sw: "Udhihirisho wa Thamani" },
		headline: { en: "BEFORE vs AFTER SURVEY VALUE", sw: "THAMANI KABLA NA BAADA YA UPIMAJI" },
		flipHint: { en: "Click or tap to flip", sw: "Bofya kugeuza" },
		before: {
			label: { en: "Before", sw: "Kabla" },
			tagline: { en: "", sw: "" },
			items: [{ en: "Guesswork dredging.", sw: "" }],
		},
		after: {
			label: { en: "After", sw: "Baada" },
			tagline: { en: "", sw: "" },
			items: [{ en: "Engineered volumes.", sw: "" }],
		},
		id: "before-after",
	},
	normalize: (resolved) => {
		const side = (node: any) => ({
			label: node?.label ?? "",
			tagline: node?.tagline ?? "",
			items: Array.isArray(node?.items) ? node.items.filter((point: unknown) => typeof point === "string" && point) : [],
		});
		return {
			data: {
				tag: resolved.tag,
				headline: resolved.headline,
				flipHint: resolved.flipHint,
				before: side(resolved.before),
				after: side(resolved.after),
			},
			id: resolved.id || undefined,
		};
	},
};


/**
 * M11 batch 9 — resource-mapping page (2026-09-18): `rmWhatIs` wraps the
 * bespoke `WhatIsResourceMappingSection` cards + closing statement.
 * Unique — only valid on `/surveying/resource-mapping`. Icons are shared;
 * titles, descriptions and the closing statement are localized. Renders
 * nothing without items (legacy guard, preserved).
 */
const rmWhatIs: SectionDefinition = {
	id: "rmWhatIs",
	version: 1,
	label: "RM what-is (unique)",
	description: "Unique: the resource-mapping intro cards with closing statement. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Cards",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Card"),
			}
		),
		closingStatement: localeLongText("Closing statement"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "What Is Resource Mapping", sw: "Ramani ya Rasilimali ni Nini" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "map",
				title: { en: "Inventory", sw: "Orodha" },
				description: { en: "Know what you hold.", sw: "" },
			},
		],
		closingStatement: { en: "", sw: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
			closingStatement: resolved.closingStatement,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — resource-mapping page (2026-09-18): `rmTypes` wraps the
 * `TypesOfResourceMappingSection` grid whose categories render as inset
 * checklists. Unique — only valid on `/surveying/resource-mapping`. Icons
 * are shared; titles and list entries are localized. The
 * category→subItems computation stays in the wrapper. Renders nothing
 * without categories (legacy guard, preserved).
 */
const rmTypes: SectionDefinition = {
	id: "rmTypes",
	version: 1,
	label: "RM types (unique)",
	description: "Unique: the resource-mapping types grid with inset checklists. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		categories: fields.array(
			fields.object({
				title: localeText("Title"),
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				items: fields.array(localeText("Entry", { optionalInEnglish: true }), {
					label: "Entries",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Entry"),
				}),
			}),
			{
				label: "Categories",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Category"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns and
		// positional fallback icons (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Types of Mapping", sw: "Aina za Ramani" },
		description: { en: "", sw: "" },
		categories: [
			{
				title: { en: "Agriculture", sw: "Kilimo" },
				icon: "tractor-variant",
				items: [{ en: "Crop health", sw: "Afya ya mazao" }],
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			categories: Array.isArray(resolved.categories)
				? resolved.categories.map((category: any) => ({
						title: category?.title ?? "",
						icon: category?.icon || undefined,
						items: Array.isArray(category?.items)
							? category.items.filter((entry: unknown) => typeof entry === "string" && entry)
							: [],
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — resource-mapping page (2026-09-18): `rmSector` drives the
 * parameterized `SectorSection` (one branch per sector in the entry: tag +
 * headline + description + lead images + cards + tone). Unique — only valid
 * on `/surveying/resource-mapping`. Image paths and icons are shared;
 * titles and descriptions are localized. The `tone` select reproduces the
 * per-sector wrapper variance (surface sectors vs default). Renders
 * nothing without items and images (legacy guard, preserved).
 */
const rmSector: SectionDefinition = {
	id: "rmSector",
	version: 1,
	label: "RM sector (unique)",
	description: "Unique: one resource-mapping sector grid (used once per sector). Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		images: localeImageArray("Lead images (first two render)"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Cards",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Card"),
			}
		),
		tone: fields.select({
			label: "Tone",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Surface", value: "surface" },
			],
			defaultValue: "default",
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Agriculture", sw: "Kilimo" },
		description: { en: "", sw: "" },
		images: { en: ["/media/surveying/resource-mapping/agriculture-1.jpg"], sw: ["/media/surveying/resource-mapping/agriculture-1.jpg"] },
		items: [
			{
				icon: "sprout",
				title: { en: "Crop Mapping", sw: "Ramani za Mazao" },
				description: { en: "Health and yield maps.", sw: "" },
			},
		],
		tone: "default",
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			images: Array.isArray(resolved.images?.en) ? resolved.images.en.filter((src: unknown) => typeof src === "string" && src) : [],
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		tone: resolved.tone,
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — resource-mapping page (2026-09-18): `rmWorkflow` wraps the
 * `ResourceMappingWorkflowSection` WorkflowSection passthrough. Unique —
 * only valid on `/surveying/resource-mapping`. Phase keys are shared
 * literals; labels and descriptions are localized. The domain
 * PHASE_STYLE_OVERRIDES stay hardcoded in the wrapper.
 */
const rmWorkflow: SectionDefinition = {
	id: "rmWorkflow",
	version: 1,
	label: "RM workflow (unique)",
	description: "Unique: the resource-mapping phased workflow. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		steps: fields.array(
			fields.object({
				phase: fields.text({
					label: "Phase key (shared)",
					description: "Phase bucket key (e.g. ACQUISITION). Identical in en/sw.",
				}),
				label: localeText("Label"),
				description: localeLongText("Description"),
			}),
			{
				label: "Steps",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Step"),
			}
		),
		outcome: localeText("Outcome", { optionalInEnglish: true }),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and domain
		// `phaseStyles` (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "Workflow", sw: "Mtiririko" },
		headline: { en: "How It Works", sw: "Jinsi Inavyofanya Kazi" },
		description: { en: "", sw: "" },
		steps: [
			{
				phase: "ACQUISITION",
				label: { en: "Capture", sw: "Upigaji" },
				description: { en: "Fly the site.", sw: "" },
			},
		],
		outcome: { en: "", sw: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			steps: Array.isArray(resolved.steps)
				? resolved.steps.map((step: any) => ({
						phase: step?.phase ?? "",
						label: step?.label ?? "",
						description: step?.description ?? "",
					}))
				: [],
			outcome: resolved.outcome,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — resource-mapping page (2026-09-18): `rmWhoUses` wraps the
 * bespoke `WhoUsesResourceMappingSection` category cards (linked list
 * items). Unique — only valid on `/surveying/resource-mapping`. Icons and
 * hrefs are shared; titles and descriptions are localized.
 */
const rmWhoUses: SectionDefinition = {
	id: "rmWhoUses",
	version: 1,
	label: "RM who-uses (unique)",
	description: "Unique: the resource-mapping audience category cards. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		categories: fields.array(
			fields.object({
				title: localeText("Title"),
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				items: fields.array(
					fields.object({
						icon: fields.text({
							label: "MDI icon (shared, optional)",
							description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
						}),
						title: localeText("Title"),
						description: localeLongText("Description"),
						href: fields.text({
							label: "Link (shared, optional)",
							description: "Item links to this URL when set. Identical in en/sw.",
						}),
					}),
					{
						label: "Items",
						itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Item"),
					}
				),
			}),
			{
				label: "Categories",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Category"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and positional
		// category icons (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Who Uses It", sw: "Nani Anaitumia" },
		description: { en: "", sw: "" },
		categories: [
			{
				title: { en: "Farmers", sw: "Wakulima" },
				icon: "tractor-variant",
				items: [
					{
						icon: "",
						title: { en: "Crop Planning", sw: "Mipango ya Mazao" },
						description: { en: "", sw: "" },
						href: "",
					},
				],
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			categories: Array.isArray(resolved.categories)
				? resolved.categories.map((category: any) => ({
						title: category?.title ?? "",
						icon: category?.icon || undefined,
						items: Array.isArray(category?.items)
							? category.items.map((item: any) => ({
									icon: item?.icon || undefined,
									title: item?.title ?? "",
									description: item?.description ?? "",
									href: item?.href && item.href.trim() ? item.href : undefined,
								}))
							: [],
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — resource-mapping page (2026-09-18): `rmTechStack` wraps the
 * `ResourceMappingTechStackSection` linkable grid (note→description
 * mapping). Unique — only valid on `/surveying/resource-mapping`. Icons
 * and hrefs are shared; titles and notes are localized. Renders nothing
 * without items (legacy guard, preserved).
 */
const rmTechStack: SectionDefinition = {
	id: "rmTechStack",
	version: 1,
	label: "RM tech stack (unique)",
	description: "Unique: the resource-mapping linkable tech grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
				note: localeLongText("Note"),
				href: fields.text({
					label: "Link (shared, optional)",
					description: "Card links to this URL when set. Identical in en/sw.",
				}),
			}),
			{
				label: "Technologies",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Technology"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, tone, hover arrows
		// and positional fallback icons (presentation, not contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Tech Stack", sw: "Teknolojia" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "drone",
				title: { en: "Drones", sw: "Droni" },
				note: { en: "RTK fleets.", sw: "" },
				href: "",
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
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						note: item?.note ?? "",
						href: item?.href && item.href.trim() ? item.href : undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — resource-mapping page (2026-09-18): `rmDataAccuracy`
 * wraps the `DataAccuracySection` factors/levels panel. Unique — only valid
 * on `/surveying/resource-mapping`. All strings are localized. NOTE: the
 * card headings are hardcoded in JSX (legacy quirk, both locales) — not
 * migrated. Renders nothing without factors and levels (legacy guard,
 * preserved).
 */
const rmDataAccuracy: SectionDefinition = {
	id: "rmDataAccuracy",
	version: 1,
	label: "RM data accuracy (unique)",
	description: "Unique: the resource-mapping accuracy factors/levels panel. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		factors: fields.array(localeText("Factor", { optionalInEnglish: true }), {
			label: "Factors",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Factor"),
		}),
		levels: fields.array(
			fields.object({
				label: localeText("Label"),
				accuracy: localeText("Accuracy"),
			}),
			{
				label: "Levels",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Level"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the hardcoded
		// card headings (legacy quirk).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Data Accuracy", sw: "Usahihi wa Data" },
		description: { en: "", sw: "" },
		factors: [{ en: "Ground control", sw: "Udhibiti wa ardhi" }],
		levels: [
			{
				label: { en: "Mapping grade", sw: "Kiwango cha ramani" },
				accuracy: { en: "±5 cm", sw: "±5 cm" },
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			factors: Array.isArray(resolved.factors) ? resolved.factors.filter((factor: unknown) => typeof factor === "string" && factor) : [],
			levels: Array.isArray(resolved.levels)
				? resolved.levels
						.filter((level: any) => typeof level?.label === "string" && level.label)
						.map((level: any) => ({ label: level.label, accuracy: level.accuracy ?? "" }))
				: [],
		},
		id: resolved.id || undefined,
	}),
};


/**
 * M11 batch 9 — building-site-surveys page (2026-09-18): `bsHero` wraps the
 * bespoke `BuildingSiteHeroSection`. Unique — only valid on
 * `/surveying/building-site-surveys`. Footnote chips travel as localized
 * strings; CTA href/icon shared.
 */
const bsHero: SectionDefinition = {
	id: "bsHero",
	version: 1,
	label: "BS hero (unique)",
	description: "Unique: the building-site-surveys hero with footnote chips. Only valid on that page.",
	schema: fields.object({
		headline: localeText("Headline"),
		title: localeText("Title", { optionalInEnglish: true }),
		description: localeLongText("Description"),
		image: imagePath("Background image (optional)"),
		ctaPrimary: fields.object({
			label: localeText("Label"),
			href: fields.text({ label: "Link", description: "Internal path or full URL." }),
			icon: fields.text({ label: "MDI icon (shared, optional)", description: "Icon slug without the `mdi-` prefix. Identical in en/sw." }),
		}, { label: "Primary action" }),
		footnoteItems: fields.array(
			fields.object({
				en: localeText("English text"),
				sw: localeText("Swahili text"),
			}),
			{
				label: "Footnote chips",
				itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Footnote"),
			}
		),
		id: anchorField(),
	}),
	example: {
		headline: { en: "BUILDING & ENGINEERING SURVEYS", sw: "UCHUNGUZI WA UJENZI NA UHANDISI" },
		title: { en: "Survey Smarter, Build Stronger", sw: "Pima Kwa Umaalimu, Jenga kwa Nguvu" },
		description: { en: "Centimeter-accurate surveys.", sw: "Uchunguzi wenye usahihi wa sentimita." },
		image: "/media/surveying/building-site-surveys/hero.jpg",
		ctaPrimary: {
			label: { en: "Get Consultation", sw: "Pata Ushauri" },
			href: "mailto:smartgridsurveying@gmail.com",
			icon: "",
		},
		footnoteItems: [
			{ en: "RTK GNSS", sw: "RTK GNSS" },
			{ en: "Licensed Survey Workflow", sw: "Mfumo wa Uchunguzi Ulioidhinishwa" },
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			headline: resolved.headline,
			title: resolved.title,
			description: resolved.description,
			image: resolved.image,
			ctaPrimary: {
				label: resolved.ctaPrimary?.label ?? { en: "", sw: "" },
				href: typeof resolved.ctaPrimary?.href === "string" && resolved.ctaPrimary.href ? resolved.ctaPrimary.href : "",
				icon: resolved.ctaPrimary?.icon || undefined,
			},
			footnoteItems: Array.isArray(resolved.footnoteItems)
				? resolved.footnoteItems.map((item: any) => ({
						en: item?.en ?? "",
						sw: item?.sw ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — building-site-surveys page (2026-09-18): `bsSection2` wraps
 * the bespoke `BuildSmarterSection`. Unique — only valid on
 * `/surveying/building-site-surveys`. Subtitle travels as localized text.
 */
const bsSection2: SectionDefinition = {
	id: "bsSection2",
	version: 1,
	label: "BS section 2 (unique)",
	description: "Unique: the building-site-surveys Build Smarter section. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		subtitle: localeText("Subtitle", { optionalInEnglish: true }),
		description: localeLongText("Description"),
		ctaPrimary: fields.object({
			label: localeText("Label"),
			href: fields.text({ label: "Link", description: "Internal path or full URL." }),
			icon: fields.text({ label: "MDI icon (shared, optional)", description: "Icon slug without the `mdi-` prefix. Identical in en/sw." }),
		}, { label: "Primary action" }),
		id: anchorField(),
	}),
	example: {
		tag: { en: "Build Smarter", sw: "Jenga kwa Umaalimu" },
		headline: { en: "Reliable. Accurate. Fast. Powerful.", sw: "Ya Kuaminika. Sahihi. Haraka. Yenye Nguvu." },
		subtitle: { en: "Smartgrid Surveying is your trusted surveying partner!", sw: "Smartgrid Surveying ni mshirika wako wa upimaji anayeaminika!" },
		description: { en: "Drone-enabled site engineering surveys...", sw: "Uchunguzi wa kiwanja unaowezeshwa na dronzi..." },
		ctaPrimary: {
			label: { en: "Email Us Today!", sw: "Tutumie Barua Pepe Leo!" },
			href: "mailto:smartgridsurveying@gmail.com",
			icon: "",
		},
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			subtitle: resolved.subtitle,
			description: resolved.description,
			ctaPrimary: {
				label: resolved.ctaPrimary?.label ?? { en: "", sw: "" },
				href: typeof resolved.ctaPrimary?.href === "string" && resolved.ctaPrimary.href ? resolved.ctaPrimary.href : "",
				icon: resolved.ctaPrimary?.icon || undefined,
			},
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — building-site-surveys page (2026-09-18): `bsSiteEngineering`
 * wraps the bespoke `SiteEngineeringSection`. Unique — only valid on
 * `/surveying/building-site-surveys`. Indexed numbering and fallback icons
 * stay in the wrapper; here items are plain cards.
 */
const bsSiteEngineering: SectionDefinition = {
	id: "bsSiteEngineering",
	version: 1,
	label: "BS site engineering (unique)",
	description: "Unique: the building-site-surveys site engineering card grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Services",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Service"),
			}
		),
		id: anchorField(),
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Precision Site Engineering Surveys", sw: "Uchunguzi wa Usahihi wa Uhandisi wa Kiwanja" },
		description: { en: "Explore our services...", sw: "Chunguza huduma zetu..." },
		items: [
			{
				icon: "map-marker-radius",
				title: { en: "Topographic Surveys", sw: "Uchunguzi wa Topografia" },
				description: { en: "Natural and built features.", sw: "Vipengele vya asili na vilivyojengwa." },
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
						icon: item?.icon || undefined,
						title: item?.title ?? { en: "", sw: "" },
						description: item?.description ?? { en: "", sw: "" },
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — building-site-surveys page (2026-09-18): `bsProcess` wraps
 * the bespoke `ProcessSection`. Unique — only valid on
 * `/surveying/building-site-surveys`. Image shared; step icons shared.
 */
const bsProcess: SectionDefinition = {
	id: "bsProcess",
	version: 1,
	label: "BS process (unique)",
	description: "Unique: the building-site-surveys land surveying process. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		image: imagePath("Background image (optional)"),
		steps: fields.array(
			fields.object({
				label: localeText("Label"),
				description: localeLongText("Description"),
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
			}),
			{
				label: "Steps",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Step"),
			}
		),
		id: anchorField(),
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Land Surveying Process", sw: "Mchakato wa Upimaji wa Ardhi" },
		image: "",
		steps: [
			{
				label: { en: "Pre-Survey Planning", sw: "Upangaji wa Awali wa Uchunguzi" },
				description: { en: "Site evaluation.", sw: "Tathmini ya kiwanja." },
				icon: "",
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			image: resolved.image,
			steps: Array.isArray(resolved.steps)
				? resolved.steps.map((step: any) => ({
						title: step?.label ?? { en: "", sw: "" },
						description: step?.description ?? { en: "", sw: "" },
						icon: step?.icon || undefined,
					}))
				: [],
			layout: "grid",
			columns: 3,
			tone: "surface",
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — building-site-surveys page (2026-09-18): `bsAccuracyMatters`
 * wraps the bespoke `AccuracyMattersSection`. Unique — only valid on
 * `/surveying/building-site-surveys`. Stats + keywords travel as data.
 */
const bsAccuracyMatters: SectionDefinition = {
	id: "bsAccuracyMatters",
	version: 1,
	label: "BS accuracy matters (unique)",
	description: "Unique: the building-site-surveys accuracy matters section. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		solution: localeLongText("Solution"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
				stat: localeText("Stat", { optionalInEnglish: true }),
			}),
			{
				label: "Items",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Item"),
			}
		),
		keywords: fields.object({
			en: fields.array(fields.text({ label: "English keyword" }), { label: "English keywords" }),
			sw: fields.array(fields.text({ label: "Swahili keyword" }), { label: "Swahili keywords" }),
		}, { label: "SEO keywords" }),
		id: anchorField(),
	}),
	example: {
		tag: { en: "Survey Accuracy Kenya", sw: "Usahihi wa Upimaji Kenya" },
		headline: { en: "Why Accuracy Matters", sw: "Kwa Nini Usahihi Ni Muhimu" },
		description: { en: "A 5-10 cm error causes disputes.", sw: "Kosa la 5-10 cm husababisha migogoro." },
		solution: { en: "We combine GNSS RTK...", sw: "Tunachanganya GNSS RTK..." },
		items: [
			{
				icon: "vector-polyline",
				title: { en: "Boundary Disputes", sw: "Migogoro ya Mipaka" },
				description: { en: "Millimeter drift triggers disputes.", sw: "Mwendo wa milimita husababisha migogoro." },
				stat: { en: "5-10 cm", sw: "5-10 cm" },
			},
		],
		keywords: {
			en: ["Boundary Dispute Survey Kenya", "Cadastral Survey Nairobi"],
			sw: ["Uchunguzi wa Migogoro ya Mipaka Kenya", "Uchunguzi wa Kadastral Nairobi"],
		},
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			solution: resolved.solution,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? { en: "", sw: "" },
						description: item?.description ?? { en: "", sw: "" },
						stat: item?.stat ?? { en: "", sw: "" },
					}))
				: [],
			keywords: {
				en: Array.isArray(resolved.keywords?.en) ? resolved.keywords.en : [],
				sw: Array.isArray(resolved.keywords?.sw) ? resolved.keywords.sw : [],
			},
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — building-site-surveys page (2026-09-18): `bsTechnology` wraps
 * the bespoke `TechnologyStackSection`. Unique — only valid on
 * `/surveying/building-site-surveys`. LearnMore + per-card hrefs travel as data.
 */
const bsTechnology: SectionDefinition = {
	id: "bsTechnology",
	version: 1,
	label: "BS technology (unique)",
	description: "Unique: the building-site-surveys technology stack section. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		learnMore: localeText("Learn more label", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
				href: fields.text({ label: "Link (optional)", description: "Internal path or full URL." }),
			}),
			{
				label: "Technologies",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Technology"),
			}
		),
		id: anchorField(),
	}),
	example: {
		tag: { en: "Technology Stack", sw: "Mfumo wa Teknolojia" },
		headline: { en: "Surveying Technology We Use", sw: "Teknolojia ya Upimaji Tunayotumia" },
		description: { en: "Integrated GNSS, drone, LiDAR...", sw: "Zana jumuishi za GNSS, droni, LiDAR..." },
		learnMore: { en: "Learn more", sw: "Jifunze zaidi" },
		items: [
			{
				icon: "satellite-variant",
				title: { en: "FOIF A90 RTK GNSS System", sw: "Mfumo wa FOIF A90 RTK GNSS" },
				description: { en: "Centimeter-level GNSS RTK.", sw: "GNSS RTK ya usahihi wa sentimita." },
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
			learnMore: resolved.learnMore,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? { en: "", sw: "" },
						description: item?.description ?? { en: "", sw: "" },
						href: typeof item?.href === "string" && item.href ? item.href : undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 9 — building-site-surveys page (2026-09-18): `bsConsultation`
 * wraps the bespoke `ConsultationSection`. Unique — only valid on
 * `/surveying/building-site-surveys`. Steps + dual CTA travel as data.
 */
const bsConsultation: SectionDefinition = {
	id: "bsConsultation",
	version: 1,
	label: "BS consultation (unique)",
	description: "Unique: the building-site-surveys consultation section. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		stepsLabel: localeText("Steps label", { optionalInEnglish: true }),
		steps: fields.array(
			fields.object({
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Steps",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Step"),
			}
		),
		ctaPrimary: fields.object({
			label: localeText("Label"),
			href: fields.text({ label: "Link", description: "Internal path or full URL." }),
			icon: fields.text({ label: "MDI icon (shared, optional)", description: "Icon slug without the `mdi-` prefix. Identical in en/sw." }),
		}, { label: "Primary action" }),
		ctaSecondary: fields.object({
			label: localeText("Label"),
			href: fields.text({ label: "Link", description: "Internal path or full URL." }),
			icon: fields.text({ label: "MDI icon (shared, optional)", description: "Icon slug without the `mdi-` prefix. Identical in en/sw." }),
		}, { label: "Secondary action" }),
		id: anchorField(),
	}),
	example: {
		tag: { en: "Technology-Assisted Consultation", sw: "Ushauri Unaosaidiwa na Teknolojia" },
		headline: { en: "Request a Technology-Assisted Survey Consultation", sw: "Omba Ushauri wa Upimaji Unaosaidiwa na Teknolojia" },
		description: { en: "Tell us about your project.", sw: "Tuambie kuhusu mradi wako." },
		stepsLabel: { en: "What happens next", sw: "Kinachofuata baadaye" },
		steps: [
			{
				title: { en: "Share Your Site Details", sw: "Shiriki Maelezo ya Kiwanja Chako" },
				description: { en: "Location, size, terrain.", sw: "Eneo, ukubwa, ardhi." },
			},
		],
		ctaPrimary: {
			label: { en: "Request My Consultation", sw: "Omba Ushauri Wangu" },
			href: "/contact?reason=engage-engineer#contact-form",
			icon: "calendar-check",
		},
		ctaSecondary: {
			label: { en: "Email the Survey Team", sw: "Tumia Barua Pepe kwa Timu ya Upimaji" },
			href: "mailto:smartgridsurveying@gmail.com",
			icon: "email-outline",
		},
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			stepsLabel: resolved.stepsLabel,
			steps: Array.isArray(resolved.steps)
				? resolved.steps.map((step: any) => ({
						title: step?.title ?? { en: "", sw: "" },
						description: step?.description ?? { en: "", sw: "" },
					}))
				: [],
			ctaPrimary: {
				label: resolved.ctaPrimary?.label ?? { en: "", sw: "" },
				href: typeof resolved.ctaPrimary?.href === "string" && resolved.ctaPrimary.href ? resolved.ctaPrimary.href : "",
				icon: resolved.ctaPrimary?.icon || undefined,
			},
			ctaSecondary: {
				label: resolved.ctaSecondary?.label ?? { en: "", sw: "" },
				href: typeof resolved.ctaSecondary?.href === "string" && resolved.ctaSecondary.href ? resolved.ctaSecondary.href : "",
				icon: resolved.ctaSecondary?.icon || undefined,
			},
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 11 — aerial-surveys page (2026-09-19): `aerialIntro` wraps the
 * `IntroSection` manifesto + briefing card (headline split on "." into
 * per-sentence blocks stays in the renderer). Unique — only valid on
 * `/surveying/aerial-surveys`. The CTA href is shared; all strings are
 * localized. Renders the CTA only with an href (legacy gate, preserved).
 */
const aerialIntro: SectionDefinition = {
	id: "aerialIntro",
	version: 1,
	label: "Aerial intro (unique)",
	description: "Unique: the aerial-surveys manifesto intro with briefing card. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		ctaPrimary: linkObject("Primary action"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "Intro", sw: "Utangulizi" },
		headline: { en: "Reliable. Scalable. Fast.", sw: "Ya kuaminika. Inayoweza kupanuka. Haraka." },
		description: { en: "Drone surveys for planning and analysis.", sw: "" },
		ctaPrimary: { label: { en: "Start your survey", sw: "Anza upimaji" }, href: "/aerial-drones/drone-imagery-surveys", icon: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			ctaPrimary:
				resolved.ctaPrimary && typeof resolved.ctaPrimary.href === "string" && resolved.ctaPrimary.href
					? { label: resolved.ctaPrimary.label ?? "", href: resolved.ctaPrimary.href }
					: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 11 — aerial-surveys page (2026-09-19): `aerialWhyDrones` wraps
 * the `WhyDroneSurveysSection` bento grid (first card featured, `index>=3`
 * wide row, positional fallback icons). Unique — only valid on
 * `/surveying/aerial-surveys`. Icons/stats shared-or-localized per field;
 * titles and descriptions localized. Renders nothing without items (legacy
 * guard, preserved).
 */
const aerialWhyDrones: SectionDefinition = {
	id: "aerialWhyDrones",
	version: 1,
	label: "Aerial why-drones (unique)",
	description: "Unique: the aerial-surveys bento benefits grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				stat: localeText("Stat", { optionalInEnglish: true }),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Benefits",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Benefit"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, featured/wide
		// positioning and positional fallback icons (presentation, not
		// editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Why Drone Surveys", sw: "Kwa Nini Upimaji wa Droni" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "speedometer",
				stat: { en: "10x", sw: "" },
				title: { en: "10x Faster", sw: "Haraka Mara 10" },
				description: { en: "Cover hectares per day.", sw: "" },
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
						icon: item?.icon || undefined,
						stat: item?.stat || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 11 — aerial-surveys page (2026-09-19): `aerialServices` wraps
 * the `AerialServicesSection` popup-card grid (featured first card,
 * "Learn more" modal with Escape/backdrop close, positional fallback
 * icons). Unique — only valid on `/surveying/aerial-surveys`. All strings
 * localized. Modal behavior stays in the renderer.
 */
const aerialServices: SectionDefinition = {
	id: "aerialServices",
	version: 1,
	label: "Aerial services (unique)",
	description: "Unique: the aerial-surveys popup service grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				description: localeLongText("Description"),
				popupContent: localeLongText("Popup detail"),
			}),
			{
				label: "Services",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Service"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, featured-card span,
		// positional fallback icons and the hardcoded "Learn more"/"Close"
		// labels (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "Services", sw: "Huduma" },
		headline: { en: "Our Aerial Surveying Services", sw: "Huduma Zetu za Upimaji wa Angani" },
		items: [
			{
				title: { en: "Aerial Mapping", sw: "Uchoraji Ramani wa Angani" },
				description: { en: "Accurate drone imagery.", sw: "" },
				popupContent: { en: "Georeferenced orthomosaics.", sw: "" },
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
						title: item?.title ?? "",
						description: item?.description ?? "",
						popupContent: item?.popupContent ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 11 — aerial-surveys page (2026-09-19): `aerialSurveyingGrid`
 * wraps the `AerialSurveyingSection` image cards (gradient overlay, hover
 * arrow, label alt text). Unique — only valid on
 * `/surveying/aerial-surveys`. Image paths are shared; labels and copy are
 * localized.
 */
const aerialSurveyingGrid: SectionDefinition = {
	id: "aerialSurveyingGrid",
	version: 1,
	label: "Aerial surveying grid (unique)",
	description: "Unique: the aerial-surveys image-card grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				label: localeText("Label"),
				image: imagePath("Image (shared)"),
			}),
			{
				label: "Cards",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Card"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Aerial Surveying", sw: "Upimaji wa Angani" },
		description: { en: "", sw: "" },
		items: [
			{
				label: { en: "Aerial Mapping", sw: "Uchoraji Ramani wa Angani" },
				image: "/media/surveying/aerial-surveys/aerial-mapping.jpeg",
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
						image: item?.image || undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 11 — aerial-surveys page (2026-09-19): `aerialIndustries`
 * wraps the `AerialIndustriesSection` link-card grid (wide last card on a
 * single remainder, positional fallback icons). Unique — only valid on
 * `/surveying/aerial-surveys` (wide-last + fallbackIcons are outside the
 * shared `cardGrid` contract). Icons/hrefs shared; titles and descriptions
 * localized. Renders nothing without items (legacy guard, preserved).
 */
const aerialIndustries: SectionDefinition = {
	id: "aerialIndustries",
	version: 1,
	label: "Aerial industries (unique)",
	description: "Unique: the aerial-surveys industry link-card grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
				href: fields.text({
					label: "Link (shared, optional)",
					description: "Internal path. Empty = no link. Identical in en/sw.",
				}),
			}),
			{
				label: "Industries",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Industry"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, headerRow
		// and positional fallback icons (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "Use Cases", sw: "Matumizi" },
		headline: { en: "Aerial Surveys for Key Industries", sw: "Upimaji wa Angani kwa Viwanda" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "road-variant",
				title: { en: "Roads & Infrastructure", sw: "Barabara na Miundombinu" },
				description: { en: "Corridor mapping.", sw: "" },
				href: "/civil/highway-surveys",
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
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
						href: item?.href || undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 11 — aerial-surveys page (2026-09-19): `aerialIndustryCta`
 * wraps the `IndustryCtaSection` split/shimmer CtaBand (primary start-icon
 * + trailing arrow). Unique — only valid on `/surveying/aerial-surveys`
 * (fixed split presentation). Watermark/hrefs/icons shared; tag, headline,
 * description and link labels localized. Renders nothing without a headline
 * (legacy guard, preserved).
 */
const aerialIndustryCta: SectionDefinition = {
	id: "aerialIndustryCta",
	version: 1,
	label: "Aerial industry CTA (unique)",
	description: "Unique: the aerial-surveys industry split CTA band. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		watermark: fields.text({
			label: "Watermark icon (shared, optional)",
			description: "MDI slug without the `mdi-` prefix. Identical in en/sw.",
		}),
		primary: linkObject("Primary action"),
		secondary: linkObject("Secondary action"),
		id: anchorField(),
		// Excluded from v1 (documented): split layout, size, decor,
		// shimmer, hairline, primary iconPosition/trailingArrow (fixed
		// presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Need an Industry Survey", sw: "Unahitaji Upimaji wa Kiwanda" },
		description: { en: "", sw: "" },
		watermark: "map-marker-path",
		primary: { label: { en: "Request proposal", sw: "Omba pendekezo" }, href: "mailto:smartgridsurveying@gmail.com", icon: "" },
		secondary: { label: { en: "WhatsApp us", sw: "WhatsApp" }, href: "https://wa.me/254107393023", icon: "whatsapp" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			watermark: resolved.watermark || undefined,
			primary:
				resolved.primary && typeof resolved.primary.href === "string" && resolved.primary.href
					? { label: resolved.primary.label ?? "", href: resolved.primary.href, icon: resolved.primary.icon || undefined }
					: null,
			secondary:
				resolved.secondary && typeof resolved.secondary.href === "string" && resolved.secondary.href
					? { label: resolved.secondary.label ?? "", href: resolved.secondary.href, icon: resolved.secondary.icon || undefined }
					: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 11 — aerial-surveys page (2026-09-19): `aerialTechStack`
 * wraps the `TechStackSection` paper card grid (note → description mapping,
 * positional fallback icons, surface tone). Unique — only valid on
 * `/surveying/aerial-surveys` (fallbackIcons are outside the shared
 * `cardGrid` contract). Icons/hrefs shared; titles and notes localized.
 * Renders nothing without items (legacy guard, preserved).
 */
const aerialTechStack: SectionDefinition = {
	id: "aerialTechStack",
	version: 1,
	label: "Aerial tech stack (unique)",
	description: "Unique: the aerial-surveys technology card grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
				note: localeLongText("Note"),
				href: fields.text({
					label: "Link (shared, optional)",
					description: "Internal path. Empty = no link. Identical in en/sw.",
				}),
			}),
			{
				label: "Platforms",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Platform"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, tone,
		// headerRow, paper card variant and positional fallback icons
		// (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "Stack", sw: "Teknolojia" },
		headline: { en: "Survey Technology We Use", sw: "Teknolojia Tunayotumia" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "quadcopter",
				title: { en: "DJI Matrice 350 RTK", sw: "DJI Matrice 350 RTK" },
				note: { en: "Flagship RTK platform.", sw: "" },
				href: "/equipment-sale/dji-matrice-350-rtk",
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
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						note: item?.note ?? "",
						href: item?.href || undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 11 — aerial-surveys page (2026-09-19): `aerialCapabilityCta`
 * wraps the `CapabilityCtaSection` centered/shimmer CtaBand (primary
 * start-icon + trailing arrow). Unique — only valid on
 * `/surveying/aerial-surveys` (fixed centered presentation). Same data
 * contract as `aerialIndustryCta` minus the split layout.
 */
const aerialCapabilityCta: SectionDefinition = {
	id: "aerialCapabilityCta",
	version: 1,
	label: "Aerial capability CTA (unique)",
	description: "Unique: the aerial-surveys capability centered CTA band. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		watermark: fields.text({
			label: "Watermark icon (shared, optional)",
			description: "MDI slug without the `mdi-` prefix. Identical in en/sw.",
		}),
		primary: linkObject("Primary action"),
		secondary: linkObject("Secondary action"),
		id: anchorField(),
		// Excluded from v1 (documented): centered layout, size, decor,
		// shimmer, hairline, primary iconPosition/trailingArrow (fixed
		// presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "See What We Can Capture", sw: "Ona Tunachoweza Kunasa" },
		description: { en: "", sw: "" },
		watermark: "file-pdf-box",
		primary: { label: { en: "Request samples", sw: "Omba sampuli" }, href: "mailto:smartgridsurveying@gmail.com", icon: "" },
		secondary: { label: { en: "", sw: "" }, href: "", icon: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			watermark: resolved.watermark || undefined,
			primary:
				resolved.primary && typeof resolved.primary.href === "string" && resolved.primary.href
					? { label: resolved.primary.label ?? "", href: resolved.primary.href, icon: resolved.primary.icon || undefined }
					: null,
			secondary:
				resolved.secondary && typeof resolved.secondary.href === "string" && resolved.secondary.href
					? { label: resolved.secondary.label ?? "", href: resolved.secondary.href, icon: resolved.secondary.icon || undefined }
					: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 11 — aerial-surveys page (2026-09-19): `aerialProjects` wraps
 * the `ProjectsSection` mosaic (first image featured 2x2, highlight chips
 * with hardcoded marker icons). Unique — only valid on
 * `/surveying/aerial-surveys`. Image paths are shared; tag, headline,
 * description and highlight strings localized.
 */
const aerialProjects: SectionDefinition = {
	id: "aerialProjects",
	version: 1,
	label: "Aerial projects (unique)",
	description: "Unique: the aerial-surveys project mosaic with highlights. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		images: fields.array(imagePath("Image (shared)"), {
			label: "Images",
			itemLabel: (item) => previewText(item, ["value"], "Image"),
		}),
		description: localeLongText("Description"),
		items: fields.array(localeText("Highlight"), {
			label: "Highlights",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Highlight"),
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, mosaic spans and the
		// hardcoded marker icons (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Featured Projects", sw: "Miradi Mashuhuri" },
		images: ["/media/surveying/aerial-surveys/project-1.jpeg"],
		description: { en: "", sw: "" },
		items: [{ en: "Corridor mapping for highways.", sw: "" }],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			images: Array.isArray(resolved.images) ? resolved.images.filter((src: unknown) => typeof src === "string" && src) : [],
			description: resolved.description,
			items: Array.isArray(resolved.items) ? resolved.items.filter((entry: unknown) => typeof entry === "string" && entry) : [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 11 — aerial-surveys page (2026-09-19): `aerialAdditionalServices`
 * wraps the `AdditionalServicesSection` pill row with closing statement
 * (hardcoded camera icons stay in the renderer). Unique — only valid on
 * `/surveying/aerial-surveys`. All strings localized.
 */
const aerialAdditionalServices: SectionDefinition = {
	id: "aerialAdditionalServices",
	version: 1,
	label: "Aerial additional services (unique)",
	description: "Unique: the aerial-surveys service pill row. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		items: fields.array(localeText("Service"), {
			label: "Services",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Service"),
		}),
		description: localeLongText("Description"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the hardcoded pill
		// icons (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Additional Services", sw: "Huduma za Ziada" },
		items: [{ en: "Drone Photography", sw: "Upigaji Picha wa Droni" }],
		description: { en: "", sw: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			items: Array.isArray(resolved.items) ? resolved.items.filter((entry: unknown) => typeof entry === "string" && entry) : [],
			description: resolved.description,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 12 — cadastral-surveys page (2026-09-19): `cadastralPostHeroCta`
 * wraps the `PostHeroCtaSection` light shimmer band (dual pill CTAs with
 * per-slot icon fallbacks). Unique — only valid on
 * `/surveying/cadastral-surveys`. Hrefs/icons shared; tag, headline,
 * description and labels localized. Renders nothing without a headline
 * (legacy guard, preserved).
 */
const cadastralPostHeroCta: SectionDefinition = {
	id: "cadastralPostHeroCta",
	version: 1,
	label: "Cadastral post-hero CTA (unique)",
	description: "Unique: the cadastral-surveys light dual-CTA band. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		ctaPrimary: linkObject("Primary action"),
		ctaSecondary: linkObject("Secondary action"),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, shimmer and the
		// per-slot icon fallbacks (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "Cadastral Surveys in Kenya", sw: "Upimaji wa Ardhi nchini Kenya" },
		headline: { en: "Title Deeds, Subdivision & Boundary Verification", sw: "Hatimiliki, Ugawaji na Uthibitishaji wa Mipaka" },
		description: { en: "", sw: "" },
		ctaPrimary: { label: { en: "Talk to a Surveyor", sw: "Ongea na Mchunguzi" }, href: "https://wa.me/254107393023", icon: "whatsapp" },
		ctaSecondary: { label: { en: "Email Us", sw: "Tutumie Barua Pepe" }, href: "mailto:smartgridsurveying@gmail.com", icon: "email-fast-outline" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			ctaPrimary:
				resolved.ctaPrimary && typeof resolved.ctaPrimary.href === "string" && resolved.ctaPrimary.href
					? { label: resolved.ctaPrimary.label ?? "", href: resolved.ctaPrimary.href, icon: resolved.ctaPrimary.icon || undefined }
					: null,
			ctaSecondary:
				resolved.ctaSecondary && typeof resolved.ctaSecondary.href === "string" && resolved.ctaSecondary.href
					? { label: resolved.ctaSecondary.label ?? "", href: resolved.ctaSecondary.href, icon: resolved.ctaSecondary.icon || undefined }
					: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 12 — cadastral-surveys page (2026-09-19): `cadastralWhenYouNeed`
 * wraps the `WhenYouNeedSection` sticky-image + numbered-card grid
 * (wide-last odd card, linked cards, positional fallback icons). Unique —
 * only valid on `/surveying/cadastral-surveys`. Image/hrefs shared; tag,
 * headline, badge, titles and descriptions localized. Renders nothing
 * without items (legacy guard, preserved).
 */
const cadastralWhenYouNeed: SectionDefinition = {
	id: "cadastralWhenYouNeed",
	version: 1,
	label: "Cadastral when-you-need (unique)",
	description: "Unique: the cadastral-surveys sticky-image use-case grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		image: imagePath("Image (shared, optional)"),
		imageBadge: localeText("Image badge", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
				href: fields.text({
					label: "Link (shared, optional)",
					description: "Internal path. Empty = no link. Identical in en/sw.",
				}),
			}),
			{
				label: "Use cases",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Use case"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, sticky/wide-last
		// positioning and positional fallback icons (presentation, not
		// editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "When You Need a Cadastral Survey", sw: "Unapohitaji Upimaji wa Ardhi" },
		description: { en: "", sw: "" },
		image: "/media/surveying/cadastral-surveys/01-02.jpg",
		imageBadge: { en: "Ardhisasa-ready", sw: "" },
		items: [
			{
				icon: "file-certificate-outline",
				title: { en: "Buying Land", sw: "Kununua Ardhi" },
				description: { en: "Verify the title deed.", sw: "" },
				href: "",
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			image: resolved.image || undefined,
			imageBadge: resolved.imageBadge,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
						href: item?.href || undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 12 — cadastral-surveys page (2026-09-19): `cadastralProcessCta`
 * wraps the `ProcessCtaSection` dark ink-panel band (watermark + blur,
 * dual CTAs, check-decagram chips). Unique — only valid on
 * `/surveying/cadastral-surveys` (chips are outside the shared `ctaBand`
 * contract). Hrefs/icons shared; tag, headline, description, labels and
 * chips localized. Renders nothing without a headline (legacy guard,
 * preserved).
 */
const cadastralProcessCta: SectionDefinition = {
	id: "cadastralProcessCta",
	version: 1,
	label: "Cadastral process CTA (unique)",
	description: "Unique: the cadastral-surveys dark CTA band with chips. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		ctaPrimary: linkObject("Primary action"),
		ctaSecondary: linkObject("Secondary action"),
		chips: fields.array(localeText("Chip"), {
			label: "Chips",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Chip"),
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, watermark, blur and
		// per-slot icon fallbacks (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Start Your Cadastral Survey", sw: "Anza Upimaji Wako" },
		description: { en: "", sw: "" },
		ctaPrimary: { label: { en: "Email Us", sw: "Tutumie Barua Pepe" }, href: "mailto:smartgridsurveying@gmail.com", icon: "email-fast-outline" },
		ctaSecondary: { label: { en: "WhatsApp", sw: "WhatsApp" }, href: "https://wa.me/254107393023", icon: "whatsapp" },
		chips: [{ en: "Licensed surveyors", sw: "Wachunguzi walioidhinishwa" }],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			ctaPrimary:
				resolved.ctaPrimary && typeof resolved.ctaPrimary.href === "string" && resolved.ctaPrimary.href
					? { label: resolved.ctaPrimary.label ?? "", href: resolved.ctaPrimary.href, icon: resolved.ctaPrimary.icon || undefined }
					: null,
			ctaSecondary:
				resolved.ctaSecondary && typeof resolved.ctaSecondary.href === "string" && resolved.ctaSecondary.href
					? { label: resolved.ctaSecondary.label ?? "", href: resolved.ctaSecondary.href, icon: resolved.ctaSecondary.icon || undefined }
					: null,
			chips: Array.isArray(resolved.chips) ? resolved.chips.filter((entry: unknown) => typeof entry === "string" && entry) : [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 12 — cadastral-surveys page (2026-09-19): `cadastralCost`
 * wraps the `CostSection` tier cards (display-string prices with accent
 * units, featured lift + pill, check-bullet features, bottom CTA). Unique —
 * only valid on `/surveying/cadastral-surveys` (range/project price
 * strings + priceUnit + featured flag are outside the shared `pricing`
 * contract). Icons/hrefs shared; titles, prices, notes and features
 * localized. Renders nothing without tiers (legacy guard, preserved).
 */
const cadastralCost: SectionDefinition = {
	id: "cadastralCost",
	version: 1,
	label: "Cadastral cost (unique)",
	description: "Unique: the cadastral-surveys pricing tiers. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		featuredLabel: localeText("Featured label", { optionalInEnglish: true }),
		tiers: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				price: localeText("Price"),
				priceUnit: localeText("Price unit", { optionalInEnglish: true }),
				note: localeLongText("Note"),
				features: fields.array(localeText("Feature", { optionalInEnglish: true }), {
					label: "Features",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Feature"),
				}),
				featured: fields.checkbox({ label: "Featured tier", defaultValue: false }),
			}),
			{
				label: "Tiers",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Tier"),
			}
		),
		cta: linkObject("Closing action"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the featured lift
		// (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Cadastral Survey Costs", sw: "Gharama za Upimaji" },
		description: { en: "", sw: "" },
		featuredLabel: { en: "Most Requested", sw: "" },
		tiers: [
			{
				icon: "home-outline",
				title: { en: "Small Residential Plot", sw: "Kiwanja Kidogo" },
				price: { en: "KES 15,000 – 80,000", sw: "KES 15,000 – 80,000" },
				priceUnit: { en: "", sw: "" },
				note: { en: "", sw: "" },
				features: [{ en: "Registry search", sw: "Utafutaji wa rejesta" }],
				featured: false,
			},
		],
		cta: { label: { en: "Get Accurate Pricing", sw: "Pata Bei Sahihi" }, href: "mailto:smartgridsurveying@gmail.com", icon: "cash-multiple" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			featuredLabel: resolved.featuredLabel,
			tiers: Array.isArray(resolved.tiers)
				? resolved.tiers.map((tier: any) => ({
						icon: tier?.icon || undefined,
						title: tier?.title ?? "",
						price: tier?.price ?? "",
						priceUnit: tier?.priceUnit || undefined,
						note: tier?.note ?? "",
						features: Array.isArray(tier?.features)
							? tier.features.filter((entry: unknown) => typeof entry === "string" && entry)
							: [],
						featured: tier?.featured === true,
					}))
				: [],
			cta:
				resolved.cta && typeof resolved.cta.href === "string" && resolved.cta.href
					? { label: resolved.cta.label ?? "", href: resolved.cta.href, icon: resolved.cta.icon || undefined }
					: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 12 — cadastral-surveys page (2026-09-19): `cadastralTimeline`
 * wraps the `TimelineSection` computed range bars (42-day scale, min-day
 * dot, full-width pulse when open-ended, WhatsApp-green CTA). Unique —
 * only valid on `/surveying/cadastral-surveys`. Day counts/hrefs/icons
 * shared; titles, ranges, notes and labels localized. Renders nothing
 * without items (legacy guard, preserved).
 */
const cadastralTimeline: SectionDefinition = {
	id: "cadastralTimeline",
	version: 1,
	label: "Cadastral timeline (unique)",
	description: "Unique: the cadastral-surveys duration bars. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		scaleNote: localeText("Scale note", { optionalInEnglish: true }),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				range: localeText("Range", { optionalInEnglish: true }),
				minDays: fields.integer({ label: "Minimum days (shared, 0 = open-ended)", defaultValue: 0, validation: { min: 0 } }),
				maxDays: fields.integer({ label: "Maximum days (shared, 0 = open-ended)", defaultValue: 0, validation: { min: 0 } }),
				description: localeLongText("Description"),
			}),
			{
				label: "Stages",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Stage"),
			}
		),
		note: localeLongText("Note"),
		cta: linkObject("Closing action"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the 42-day bar
		// scale (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "How Long It Takes", sw: "Inachukua Muda Gani" },
		description: { en: "", sw: "" },
		scaleNote: { en: "", sw: "" },
		items: [
			{
				icon: "calendar-clock",
				title: { en: "Standard Survey", sw: "Upimaji wa Kawaida" },
				range: { en: "7–21 days", sw: "Siku 7–21" },
				minDays: 7,
				maxDays: 21,
				description: { en: "", sw: "" },
			},
		],
		note: { en: "", sw: "" },
		cta: { label: { en: "Check Timeline", sw: "Angalia Ratiba" }, href: "https://wa.me/254107393023", icon: "whatsapp" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			scaleNote: resolved.scaleNote,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						range: item?.range || undefined,
						minDays: typeof item?.minDays === "number" && item.minDays > 0 ? item.minDays : null,
						maxDays: typeof item?.maxDays === "number" && item.maxDays > 0 ? item.maxDays : null,
						description: item?.description ?? "",
					}))
				: [],
			note: resolved.note,
			cta:
				resolved.cta && typeof resolved.cta.href === "string" && resolved.cta.href
					? { label: resolved.cta.label ?? "", href: resolved.cta.href, icon: resolved.cta.icon || undefined }
					: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 12 — cadastral-surveys page (2026-09-19): `cadastralCompliance`
 * wraps the `ComplianceSection` sticky-split checklist (related-link pills,
 * numbered cards, gavel watermark). Unique — only valid on
 * `/surveying/cadastral-surveys`. Icons/hrefs shared; tag, headline,
 * checklist and link labels localized. Renders nothing without a headline
 * and checklist (legacy guard, preserved).
 */
const cadastralCompliance: SectionDefinition = {
	id: "cadastralCompliance",
	version: 1,
	label: "Cadastral compliance (unique)",
	description: "Unique: the cadastral-surveys compliance checklist. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		checklistTitle: localeText("Checklist title", { optionalInEnglish: true }),
		checklist: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Checklist",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Entry"),
			}
		),
		relatedLabel: localeText("Related label", { optionalInEnglish: true }),
		related: fields.array(
			fields.object({
				label: localeText("Label"),
				href: fields.text({
					label: "Link (shared)",
					description: "Internal path. Identical in en/sw.",
				}),
			}),
			{
				label: "Related links",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Link"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, sticky positioning
		// and watermark (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Survey Act Compliance", sw: "Uzingatiaji wa Sheria" },
		description: { en: "", sw: "" },
		checklistTitle: { en: "", sw: "" },
		checklist: [
			{
				icon: "shield-check",
				title: { en: "Licensed Surveyors", sw: "Wachunguzi Walioidhinishwa" },
				description: { en: "", sw: "" },
			},
		],
		relatedLabel: { en: "", sw: "" },
		related: [
			{
				label: { en: "Sectional Properties Act, 2020", sw: "Sheria ya Majengo, 2020" },
				href: "/surveying/sectional-properties",
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			checklistTitle: resolved.checklistTitle,
			checklist: Array.isArray(resolved.checklist)
				? resolved.checklist.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
			relatedLabel: resolved.relatedLabel,
			related: Array.isArray(resolved.related)
				? resolved.related.map((link: any) => ({
						label: link?.label ?? "",
						href: typeof link?.href === "string" ? link.href : "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 12 — cadastral-surveys page (2026-09-19): `cadastralCaseStudy`
 * wraps the `CaseStudySection` project story (overview, challenge,
 * methodology, outcome, impact, tech table, engineering note). Unique —
 * only valid on `/surveying/cadastral-surveys`. Image paths shared; alts
 * and all copy localized. Every block is optional in the renderer except
 * the headline gate. Renders nothing without a headline (legacy guard,
 * preserved).
 */
const cadastralCaseStudy: SectionDefinition = {
	id: "cadastralCaseStudy",
	version: 1,
	label: "Cadastral case study (unique)",
	description: "Unique: the cadastral-surveys project story. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		subtitle: localeText("Subtitle", { optionalInEnglish: true }),
		overview: fields.object(
			{
				label: localeText("Label"),
				paragraphs: fields.array(localeLongText("Paragraph"), {
					label: "Paragraphs",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Paragraph"),
				}),
				criticalTitle: localeText("Critical title", { optionalInEnglish: true }),
				critical: fields.array(localeText("Critical point"), {
					label: "Critical points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
				deployNote: localeLongText("Deploy note"),
				deployIcon: fields.text({
					label: "Deploy icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
			},
			{ label: "Overview" }
		),
		challenge: fields.object(
			{
				label: localeText("Label"),
				intro: localeLongText("Intro"),
				items: fields.array(localeText("Challenge"), {
					label: "Challenges",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Challenge"),
				}),
				images: fields.array(
					fields.object({
						src: imagePath("Image (shared)"),
						alt: localeText("Alt text", { optionalInEnglish: true }),
					}),
					{
						label: "Images",
						itemLabel: (item) => previewText(item, ["fields", "alt", "fields", "en", "value"], "Image"),
					}
				),
			},
			{ label: "Challenge" }
		),
		methodology: fields.object(
			{
				label: localeText("Label"),
				intro: localeLongText("Intro"),
				steps: fields.array(
					fields.object({
						title: localeText("Title"),
						points: fields.array(localeText("Point", { optionalInEnglish: true }), {
							label: "Points",
							itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
						}),
					}),
					{
						label: "Steps",
						itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Step"),
					}
				),
				images: fields.array(
					fields.object({
						src: imagePath("Image (shared)"),
						alt: localeText("Alt text", { optionalInEnglish: true }),
					}),
					{
						label: "Images",
						itemLabel: (item) => previewText(item, ["fields", "alt", "fields", "en", "value"], "Image"),
					}
				),
			},
			{ label: "Methodology" }
		),
		outcome: fields.object(
			{
				label: localeText("Label"),
				intro: localeLongText("Intro"),
				deliverablesTitle: localeText("Deliverables title", { optionalInEnglish: true }),
				deliverables: fields.array(localeText("Deliverable"), {
					label: "Deliverables",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Deliverable"),
				}),
			},
			{ label: "Outcome" }
		),
		impact: fields.object(
			{
				label: localeText("Label"),
				items: fields.array(
					fields.object({
						icon: fields.text({
							label: "MDI icon (shared, optional)",
							description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
						}),
						text: localeText("Text"),
					}),
					{
						label: "Impacts",
						itemLabel: (item) => previewText(item, ["fields", "text", "fields", "en", "value"], "Impact"),
					}
				),
			},
			{ label: "Impact" }
		),
		techSummary: fields.object(
			{
				label: localeText("Label"),
				componentHeader: localeText("Component header", { optionalInEnglish: true }),
				specHeader: localeText("Spec header", { optionalInEnglish: true }),
				rows: fields.array(
					fields.object({
						component: localeText("Component"),
						specification: localeText("Specification"),
					}),
					{
						label: "Rows",
						itemLabel: (item) => previewText(item, ["fields", "component", "fields", "en", "value"], "Row"),
					}
				),
			},
			{ label: "Tech summary" }
		),
		engineeringNote: fields.object(
			{
				label: localeText("Label", { optionalInEnglish: true }),
				text: localeLongText("Text"),
			},
			{ label: "Engineering note" }
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and positional spans
		// (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Kiambu Parcel Case Study", sw: "Uchunguzi wa Kiwanja cha Kiambu" },
		subtitle: { en: "", sw: "" },
		overview: {
			label: { en: "Overview", sw: "Muhtasari" },
			paragraphs: [{ en: "A disputed parcel in Kiambu.", sw: "" }],
			criticalTitle: { en: "", sw: "" },
			critical: [{ en: "Overlapping claims", sw: "" }],
			deployNote: { en: "", sw: "" },
			deployIcon: "satellite-variant",
		},
		challenge: {
			label: { en: "Challenge", sw: "Changamoto" },
			intro: { en: "", sw: "" },
			items: [{ en: "Unmarked boundary line.", sw: "" }],
			images: [{ src: "/media/surveying/cadastral-surveys/02-02.jpg", alt: { en: "", sw: "" } }],
		},
		methodology: {
			label: { en: "Methodology", sw: "Mbinu" },
			intro: { en: "", sw: "" },
			steps: [{ title: { en: "Desk study", sw: "Utafiti" }, points: [{ en: "Registry retrieval.", sw: "" }] }],
			images: [],
		},
		outcome: {
			label: { en: "Outcome", sw: "Matokeo" },
			intro: { en: "", sw: "" },
			deliverablesTitle: { en: "", sw: "" },
			deliverables: [{ en: "Registered deed plan.", sw: "" }],
		},
		impact: {
			label: { en: "Impact", sw: "Athari" },
			items: [{ icon: "handshake-outline", text: { en: "Dispute resolved.", sw: "" } }],
		},
		techSummary: {
			label: { en: "Tech", sw: "Teknolojia" },
			componentHeader: { en: "", sw: "" },
			specHeader: { en: "", sw: "" },
			rows: [{ component: { en: "Survey System", sw: "Mfumo" }, specification: { en: "RTK GNSS", sw: "RTK GNSS" } }],
		},
		engineeringNote: {
			label: { en: "", sw: "" },
			text: { en: "Registered, titled and dispute-free.", sw: "" },
		},
		id: "",
	},
	normalize: (resolved) => {
		const strings = (list: unknown) =>
			Array.isArray(list) ? list.filter((entry: unknown) => typeof entry === "string" && entry) : [];
		const caseImages = (list: unknown) =>
			Array.isArray(list)
				? list.map((image: any) => ({ src: typeof image?.src === "string" ? image.src : "", alt: image?.alt ?? "" }))
				: [];
		return {
			data: {
				tag: resolved.tag,
				headline: resolved.headline,
				subtitle: resolved.subtitle,
				overview: resolved.overview
					? {
							label: resolved.overview.label ?? "",
							paragraphs: strings(resolved.overview.paragraphs),
							criticalTitle: resolved.overview.criticalTitle,
							critical: strings(resolved.overview.critical),
							deployNote: resolved.overview.deployNote,
							deployIcon: resolved.overview.deployIcon || undefined,
						}
					: null,
				challenge: resolved.challenge
					? {
							label: resolved.challenge.label ?? "",
							intro: resolved.challenge.intro,
							items: strings(resolved.challenge.items),
							images: caseImages(resolved.challenge.images),
						}
					: null,
				methodology: resolved.methodology
					? {
							label: resolved.methodology.label ?? "",
							intro: resolved.methodology.intro,
							steps: Array.isArray(resolved.methodology.steps)
								? resolved.methodology.steps.map((step: any) => ({ title: step?.title ?? "", points: strings(step?.points) }))
								: [],
							images: caseImages(resolved.methodology.images),
						}
					: null,
				outcome: resolved.outcome
					? {
							label: resolved.outcome.label ?? "",
							intro: resolved.outcome.intro,
							deliverablesTitle: resolved.outcome.deliverablesTitle,
							deliverables: strings(resolved.outcome.deliverables),
						}
					: null,
				impact: resolved.impact
					? {
							label: resolved.impact.label ?? "",
							items: Array.isArray(resolved.impact.items)
								? resolved.impact.items.map((item: any) => ({ icon: item?.icon || undefined, text: item?.text ?? "" }))
								: [],
						}
					: null,
				techSummary: resolved.techSummary
					? {
							label: resolved.techSummary.label ?? "",
							componentHeader: resolved.techSummary.componentHeader,
							specHeader: resolved.techSummary.specHeader,
							rows: Array.isArray(resolved.techSummary.rows)
								? resolved.techSummary.rows.map((row: any) => ({ component: row?.component ?? "", specification: row?.specification ?? "" }))
								: [],
						}
					: null,
				engineeringNote: resolved.engineeringNote
					? { label: resolved.engineeringNote.label, text: resolved.engineeringNote.text ?? "" }
					: null,
			},
			id: resolved.id || undefined,
		};
	},
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19): `gprHero` wraps
 * the `GprServiceHero` slider hero (`<bold>` description parsing + image
 * slider stay in the renderer). Unique — only valid on
 * `/surveying/ground-penetrating-radar`. Image urls/hrefs shared; labels,
 * titles and descriptions localized. The dead `headline`/`image` locale keys
 * (never rendered) are dropped from the migrated contract — documented here.
 */
const gprHero: SectionDefinition = {
	id: "gprHero",
	version: 1,
	label: "GPR hero (unique)",
	description: "Unique: the GPR slider hero with bold-lede description. Only valid on that page.",
	schema: fields.object({
		title: localeText("Title"),
		images: fields.array(
			fields.object({
				url: imagePath("Image (shared)"),
				label: localeText("Label", { optionalInEnglish: true }),
				description: localeLongText("Description"),
			}),
			{
				label: "Slides",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Slide"),
			}
		),
		browseAll: fields.object(
			{
				label: localeText("Label"),
				href: fields.text({
					label: "Link (shared)",
					description: "Internal path. Identical in en/sw.",
				}),
			},
			{ label: "Browse-all link" }
		),
		description: localeLongText("Description"),
		ctaPrimary: linkObject("Primary action"),
		ctaSecondary: linkObject("Secondary action"),
		id: anchorField(),
		// Excluded from v1 (documented): dead `headline`/`image` keys,
		// slider props and `className` (presentation, not editor contracts).
	}),
	example: {
		title: { en: "Ground Penetrating Radar", sw: "Radar ya Kupenya Ardhi" },
		images: [
			{
				url: "/media/surveying/ground-penetrating-radar/gpr-20.jpeg",
				label: { en: "LMX200", sw: "" },
				description: { en: "", sw: "" },
			},
		],
		browseAll: { label: { en: "Browse All Services", sw: "Vinjari Huduma Zote" }, href: "/surveying" },
		description: { en: "See what lies beneath.", sw: "" },
		ctaPrimary: { label: { en: "Request a Quote", sw: "Omba Nukuu" }, href: "mailto:smartgridsurveying@gmail.com", icon: "" },
		ctaSecondary: { label: { en: "Book a Scan", sw: "Weka Uchunguzi" }, href: "mailto:smartgridsurveying@gmail.com", icon: "calendar-check" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			title: resolved.title,
			images: Array.isArray(resolved.images)
				? resolved.images.map((image: any) => ({
						url: typeof image?.url === "string" ? image.url : "",
						label: image?.label ?? "",
						description: image?.description ?? "",
					}))
				: [],
			browseAll:
				resolved.browseAll && typeof resolved.browseAll.href === "string" && resolved.browseAll.href
					? { label: resolved.browseAll.label ?? "", href: resolved.browseAll.href }
					: null,
			description: resolved.description,
			ctaPrimary:
				resolved.ctaPrimary && typeof resolved.ctaPrimary.href === "string" && resolved.ctaPrimary.href
					? { label: resolved.ctaPrimary.label ?? "", href: resolved.ctaPrimary.href }
					: null,
			ctaSecondary:
				resolved.ctaSecondary && typeof resolved.ctaSecondary.href === "string" && resolved.ctaSecondary.href
					? { label: resolved.ctaSecondary.label ?? "", href: resolved.ctaSecondary.href, icon: resolved.ctaSecondary.icon || undefined }
					: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19): `gprHighlights`
 * wraps the `GprHighlightsBar` 3-up strip. Unique — only valid on
 * `/surveying/ground-penetrating-radar`. The locale node is a root array —
 * the migration wraps it as `{ items }`. Icons shared; labels localized.
 * Renders nothing without items (legacy guard, preserved).
 */
const gprHighlights: SectionDefinition = {
	id: "gprHighlights",
	version: 1,
	label: "GPR highlights (unique)",
	description: "Unique: the GPR highlight strip. Only valid on that page.",
	schema: fields.object({
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				label: localeText("Label"),
			}),
			{
				label: "Highlights",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Highlight"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		items: [
			{
				icon: "shield-check-outline",
				label: { en: "Non-Destructive", sw: "Isiyo Haribu" },
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({ icon: item?.icon || undefined, label: item?.label ?? "" }))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19): `gprJumpNav`
 * wraps the `GprJumpNav` sticky scroll-spy nav. Unique — only valid on
 * `/surveying/ground-penetrating-radar`. Hrefs (anchors) shared; labels
 * localized. Scroll-spy/lenis behavior stays in the renderer. NOTE: renders
 * a `<nav>` root (not `<section>`) so sticky positioning survives — the
 * check-script pins a documented nav-root exemption for this id.
 */
const gprJumpNav: SectionDefinition = {
	id: "gprJumpNav",
	version: 1,
	label: "GPR jump nav (unique)",
	description: "Unique: the GPR sticky section nav (nav root). Only valid on that page.",
	schema: fields.object({
		items: fields.array(
			fields.object({
				label: localeText("Label"),
				href: fields.text({
					label: "Anchor (shared)",
					description: "Section anchor, e.g. #overview. Identical in en/sw.",
				}),
			}),
			{
				label: "Links",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Link"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): sticky offsets, scroll-spy
		// config (behavior, not editor contracts).
	}),
	example: {
		items: [
			{
				label: { en: "Overview", sw: "Muhtasari" },
				href: "#overview",
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({ label: item?.label ?? "", href: typeof item?.href === "string" ? item.href : "" }))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19): `gprOverview`
 * wraps the `GprOverviewSection` centered copy with optional top image.
 * Unique — only valid on `/surveying/ground-penetrating-radar`. The sw
 * locale has no `image` key, so the schema carries it per-locale and sw
 * renders imageless exactly like legacy. Renders nothing without paragraphs
 * (legacy guard, preserved).
 */
const gprOverview: SectionDefinition = {
	id: "gprOverview",
	version: 1,
	label: "GPR overview (unique)",
	description: "Unique: the GPR overview copy with optional image. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		paragraphs: fields.array(localeLongText("Paragraph"), {
			label: "Paragraphs",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Paragraph"),
		}),
		image: localeMedia("Image (optional)"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "What Is GPR", sw: "GPR ni Nini" },
		paragraphs: [{ en: "GPR maps the subsurface.", sw: "" }],
		image: { en: "/media/surveying/ground-penetrating-radar/gpr-lmx-200.gif", sw: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			paragraphs: Array.isArray(resolved.paragraphs)
				? resolved.paragraphs.filter((entry: unknown) => typeof entry === "string" && entry)
				: [],
			image: resolved.image || undefined,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19): `gprMethodology`
 * wraps the `GprMethodologySection` timeline rail (positional method icons
 * + hardcoded `Step N` labels stay in the renderer). Unique — only valid on
 * `/surveying/ground-penetrating-radar`. Titles and points localized.
 * Renders nothing without items (legacy guard, preserved).
 */
const gprMethodology: SectionDefinition = {
	id: "gprMethodology",
	version: 1,
	label: "GPR methodology (unique)",
	description: "Unique: the GPR method timeline. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				points: fields.array(localeText("Point", { optionalInEnglish: true }), {
					label: "Points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
			}),
			{
				label: "Steps",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Step"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, positional icons and
		// hardcoded `Step N` labels (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Our Methodology", sw: "Mbinu Zetu" },
		description: { en: "", sw: "" },
		items: [
			{
				title: { en: "Site Preparation", sw: "Maandalizi ya Tovuti" },
				points: [{ en: "Review drawings.", sw: "" }],
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
						title: item?.title ?? "",
						points: Array.isArray(item?.points)
							? item.points.filter((entry: unknown) => typeof entry === "string" && entry)
							: [],
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19):
 * `gprApplications` wraps the `GprApplicationsSection` indexed card grid
 * (header-row number badges + inset point checklists — outside the shared
 * `cardGrid` contract). Unique — only valid on
 * `/surveying/ground-penetrating-radar`. Icons shared; titles and points
 * localized. Renders nothing without items (legacy guard, preserved).
 */
const gprApplications: SectionDefinition = {
	id: "gprApplications",
	version: 1,
	label: "GPR applications (unique)",
	description: "Unique: the GPR indexed application grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				points: fields.array(localeText("Point", { optionalInEnglish: true }), {
					label: "Points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
			}),
			{
				label: "Applications",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Application"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, header
		// alignment, indexed badges (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "GPR Applications", sw: "Matumizi ya GPR" },
		items: [
			{
				icon: "road-variant",
				title: { en: "Infrastructure", sw: "Miundombinu" },
				points: [{ en: "Road corridors.", sw: "" }],
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
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						points: Array.isArray(item?.points)
							? item.points.filter((entry: unknown) => typeof entry === "string" && entry)
							: [],
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19): `gprDetect`
 * wraps the `GprDetectSection` capability grid (note → description mapping,
 * positional fallback icons, surface tone). Unique — only valid on
 * `/surveying/ground-penetrating-radar` (`fallbackIcons` is outside the
 * shared `cardGrid` contract). Icons shared; titles and notes localized.
 * Renders nothing without items (legacy guard, preserved).
 */
const gprDetect: SectionDefinition = {
	id: "gprDetect",
	version: 1,
	label: "GPR detect (unique)",
	description: "Unique: the GPR detection capability grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
				note: localeLongText("Note"),
			}),
			{
				label: "Capabilities",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Capability"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, tone and
		// positional fallback icons (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "What GPR Detects", sw: "GPR Hugundua Nini" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "pipe",
				title: { en: "Metallic Pipes", sw: "Mabomba ya Chuma" },
				note: { en: "GI & asbestos.", sw: "" },
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
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						note: item?.note ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19): `gprSue` wraps
 * the `GprSueComplianceSection` SUE level cards (positional A–D letter
 * watermark stays in the renderer). Unique — only valid on
 * `/surveying/ground-penetrating-radar`. Icons shared; levels, titles,
 * descriptions and note localized. Renders nothing without levels (legacy
 * guard, preserved).
 */
const gprSue: SectionDefinition = {
	id: "gprSue",
	version: 1,
	label: "GPR SUE (unique)",
	description: "Unique: the GPR SUE quality-level cards. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		levels: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				level: localeText("Level"),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Levels",
				itemLabel: (item) => previewText(item, ["fields", "level", "fields", "en", "value"], "Level"),
			}
		),
		note: localeLongText("Note"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and the positional
		// letter watermark (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "SUE Quality Levels", sw: "Viwango vya Ubora" },
		description: { en: "", sw: "" },
		levels: [
			{
				icon: "file-search-outline",
				level: { en: "SUE Level D", sw: "SUE Level D" },
				title: { en: "Records & Desk Studies", sw: "Rekodi" },
				description: { en: "", sw: "" },
			},
		],
		note: { en: "", sw: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			levels: Array.isArray(resolved.levels)
				? resolved.levels.map((level: any) => ({
						icon: level?.icon || undefined,
						level: level?.level ?? "",
						title: level?.title ?? "",
						description: level?.description ?? "",
					}))
				: [],
			note: resolved.note,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19): `gprLimitations`
 * wraps the `GprLimitationsSection` factor cards + note pill (positional
 * fallback icons stay in the renderer). Unique — only valid on
 * `/surveying/ground-penetrating-radar`. Icons shared; titles,
 * descriptions and note localized. Renders nothing without a headline and
 * items (legacy guard, preserved).
 */
const gprLimitations: SectionDefinition = {
	id: "gprLimitations",
	version: 1,
	label: "GPR limitations (unique)",
	description: "Unique: the GPR limitation cards with note. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Limitations",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Limitation"),
			}
		),
		note: localeLongText("Note"),
		noteIcon: fields.text({
			label: "Note icon (shared, optional)",
			description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `className` and positional
		// fallback icons (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "GPR Limitations", sw: "Mapungufu ya GPR" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "earth",
				title: { en: "Soil Conditions", sw: "Hali ya Udongo" },
				description: { en: "", sw: "" },
			},
		],
		note: { en: "", sw: "" },
		noteIcon: "check-decagram",
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
			note: resolved.note,
			noteIcon: resolved.noteIcon || undefined,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19): `gprBeforeAfter`
 * wraps the `GprBeforeAfterSection` flip card (flip behavior, layoutId and
 * after-side icon/watermark stay in the renderer). Unique — only valid on
 * `/surveying/ground-penetrating-radar`. All strings localized. Renders
 * nothing without a headline (legacy guard, preserved).
 */
const gprBeforeAfter: SectionDefinition = {
	id: "gprBeforeAfter",
	version: 1,
	label: "GPR before/after (unique)",
	description: "Unique: the GPR flip comparison card. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		flipHint: localeText("Flip hint", { optionalInEnglish: true }),
		before: fields.object(
			{
				label: localeText("Label"),
				tagline: localeText("Tagline", { optionalInEnglish: true }),
				items: fields.array(localeText("Point"), {
					label: "Points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
			},
			{ label: "Before" }
		),
		after: fields.object(
			{
				label: localeText("Label"),
				tagline: localeText("Tagline", { optionalInEnglish: true }),
				items: fields.array(localeText("Point"), {
					label: "Points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
			},
			{ label: "After" }
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, layoutId and
		// after-side icon/watermark (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Before vs After GPR", sw: "Kabla na Baada ya GPR" },
		flipHint: { en: "Tap the card to flip", sw: "" },
		before: {
			label: { en: "BEFORE", sw: "KABLA" },
			tagline: { en: "", sw: "" },
			items: [{ en: "Unknown utilities.", sw: "" }],
		},
		after: {
			label: { en: "AFTER", sw: "BAADA" },
			tagline: { en: "", sw: "" },
			items: [{ en: "Verified map.", sw: "" }],
		},
		id: "",
	},
	normalize: (resolved) => {
		const side = (node: any) =>
			node
				? {
						label: node.label ?? "",
						tagline: node.tagline,
						items: Array.isArray(node.items) ? node.items.filter((entry: unknown) => typeof entry === "string" && entry) : [],
					}
				: undefined;
		return {
			data: {
				tag: resolved.tag,
				headline: resolved.headline,
				flipHint: resolved.flipHint,
				before: side(resolved.before),
				after: side(resolved.after),
			},
			id: resolved.id || undefined,
		};
	},
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19): `gprTechnology`
 * wraps the `GprTechnologySection` horizontal cards (image-vs-icon branch
 * stays in the renderer). Unique — only valid on
 * `/surveying/ground-penetrating-radar`. Icons/images shared; titles and
 * descriptions localized. Renders nothing without items (legacy guard,
 * preserved).
 */
const gprTechnology: SectionDefinition = {
	id: "gprTechnology",
	version: 1,
	label: "GPR technology (unique)",
	description: "Unique: the GPR equipment cards. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				image: imagePath("Image (shared, optional)"),
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Systems",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "System"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "GPR Technology", sw: "Teknolojia ya GPR" },
		items: [
			{
				icon: "radar",
				image: "/media/surveying/ground-penetrating-radar/gpr-lmx-200.jpeg",
				title: { en: "LMX200 GPR System", sw: "Mfumo wa LMX200" },
				description: { en: "", sw: "" },
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
						icon: item?.icon || undefined,
						image: item?.image || undefined,
						title: item?.title ?? "",
						description: item?.description ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19):
 * `gprFeaturedProjects` wraps the `FeaturedProjectsSection` project cards
 * (positional `Project N` eyebrows + hardcoded Used/Objective/Result row
 * labels stay in the renderer, documented exclusion). Unique — only valid
 * on `/surveying/ground-penetrating-radar`. All strings localized. Renders
 * nothing without items (legacy guard, preserved).
 */
const gprFeaturedProjects: SectionDefinition = {
	id: "gprFeaturedProjects",
	version: 1,
	label: "GPR featured projects (unique)",
	description: "Unique: the GPR project cards. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				used: localeLongText("Used"),
				objective: localeLongText("Objective"),
				result: localeLongText("Result"),
			}),
			{
				label: "Projects",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Project"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, positional eyebrows
		// and hardcoded row labels (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Featured Projects", sw: "Miradi Mashuhuri" },
		description: { en: "", sw: "" },
		items: [
			{
				title: { en: "Utility Mapping", sw: "Uchoraji wa Huduma" },
				used: { en: "LMX200 with RTK-GNSS.", sw: "" },
				objective: { en: "Map utilities.", sw: "" },
				result: { en: "Identified all lines.", sw: "" },
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
						title: item?.title ?? "",
						used: item?.used ?? "",
						objective: item?.objective ?? "",
						result: item?.result ?? "",
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 13 — ground-penetrating-radar page (2026-09-19): `gprSummary`
 * wraps the `GprSummarySection` centered panel with chips. Unique — only
 * valid on `/surveying/ground-penetrating-radar`. All strings localized.
 * Renders nothing without a headline (legacy guard, preserved).
 */
const gprSummary: SectionDefinition = {
	id: "gprSummary",
	version: 1,
	label: "GPR summary (unique)",
	description: "Unique: the GPR closing summary panel. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		chips: fields.array(localeText("Chip"), {
			label: "Chips",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Chip"),
		}),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Why GPR With Us", sw: "Kwa Nini GPR Nasi" },
		description: { en: "", sw: "" },
		chips: [{ en: "LMX200 + RTK-GNSS", sw: "" }],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			chips: Array.isArray(resolved.chips) ? resolved.chips.filter((entry: unknown) => typeof entry === "string" && entry) : [],
		},
		id: resolved.id || undefined,
	}),
};


/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisHero` wraps the
 * `GisHeroSection` full-bleed image hero (`<bold>` description parsing +
 * footnote chips stay in the renderer). Unique — only valid on
 * `/surveying/gis-mapping` (bespoke layout the shared Hero cannot render).
 * Image/href shared; headline, title, description, footnotes and CTA label
 * localized.
 */
const gisHero: SectionDefinition = {
	id: "gisHero",
	version: 1,
	label: "GIS hero (unique)",
	description: "Unique: the gis-mapping full-bleed hero. Only valid on that page.",
	schema: fields.object({
		headline: localeText("Headline"),
		title: localeText("Title"),
		description: localeLongText("Description"),
		footnoteItems: fields.array(localeText("Footnote"), {
			label: "Footnotes",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Footnote"),
		}),
		image: imagePath("Image (shared, optional)"),
		ctaPrimary: fields.object(
			{
				label: localeText("Label"),
				href: fields.text({
					label: "Link (shared)",
					description: "Internal path or full URL. Identical in en/sw.",
				}),
			},
			{ label: "Primary action" }
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, gradients and
		// overlays (presentation, not editor contracts).
	}),
	example: {
		headline: { en: "GIS, Mapping & Remote Sensing", sw: "GIS, Ramani na Hisia za Mbali" },
		title: { en: "GIS Mapping & Spatial Intelligence", sw: "Ramani za GIS" },
		description: { en: "Turn location data into action.", sw: "" },
		footnoteItems: [{ en: "Nairobi", sw: "Nairobi" }],
		image: "/media/surveying/gis-mapping/gis-mapping-01.jpg",
		ctaPrimary: { label: { en: "Talk to Us", sw: "Ongea Nasi" }, href: "/contact" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			headline: resolved.headline,
			title: resolved.title,
			description: resolved.description,
			footnoteItems: Array.isArray(resolved.footnoteItems)
				? resolved.footnoteItems.filter((entry: unknown) => typeof entry === "string" && entry)
				: [],
			image: resolved.image || undefined,
			ctaPrimary:
				resolved.ctaPrimary && typeof resolved.ctaPrimary.href === "string" && resolved.ctaPrimary.href
					? { label: resolved.ctaPrimary.label ?? "", href: resolved.ctaPrimary.href }
					: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisWhatIs` wraps the
 * `WhatIsGisSection` intro cards + `<bold>` closing panel. Unique — only
 * valid on `/surveying/gis-mapping`. Icons shared; tag, headline,
 * description, titles and closing localized.
 */
const gisWhatIs: SectionDefinition = {
	id: "gisWhatIs",
	version: 1,
	label: "GIS what-is (unique)",
	description: "Unique: the gis-mapping intro cards with closing panel. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
			}),
			{
				label: "Cards",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Card"),
			}
		),
		closingStatement: localeLongText("Closing statement"),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "What Is GIS", sw: "GIS ni Nini" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "map-marker",
				title: { en: "Capture", sw: "Kukamata" },
			},
		],
		closingStatement: { en: "", sw: "" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({ icon: item?.icon || undefined, title: item?.title ?? "" }))
				: [],
			closingStatement: resolved.closingStatement,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisImportance` wraps the
 * `GisImportanceSection` checklist grid (4 columns, surface tone,
 * fallbackIcons, leadGrid override — outside the shared `cardGrid`
 * contract). Unique — only valid on `/surveying/gis-mapping`. Icons
 * shared; titles and features localized. Renders nothing without items
 * (legacy guard, preserved).
 */
const gisImportance: SectionDefinition = {
	id: "gisImportance",
	version: 1,
	label: "GIS importance (unique)",
	description: "Unique: the gis-mapping why-critical checklist grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
				features: fields.array(localeText("Feature", { optionalInEnglish: true }), {
					label: "Features",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Feature"),
				}),
			}),
			{
				label: "Capabilities",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Capability"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, tone,
		// fallbackIcons, leadGrid (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Why GIS Is Critical", sw: "Kwa Nini GIS ni Muhimu" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "road-variant",
				title: { en: "Infrastructure", sw: "Miundombinu" },
				features: [{ en: "Road planning.", sw: "" }],
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
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						features: Array.isArray(item?.features)
							? item.features.filter((entry: unknown) => typeof entry === "string" && entry)
							: [],
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisServices` wraps the
 * `GisServicesSection` indexed grid (header-row number badges — outside the
 * shared `cardGrid` contract). Unique — only valid on
 * `/surveying/gis-mapping`. Icons shared; titles and features localized.
 * Renders nothing without items (legacy guard, preserved).
 */
const gisServices: SectionDefinition = {
	id: "gisServices",
	version: 1,
	label: "GIS services (unique)",
	description: "Unique: the gis-mapping indexed service grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				features: fields.array(localeText("Feature", { optionalInEnglish: true }), {
					label: "Features",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Feature"),
				}),
			}),
			{
				label: "Services",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Service"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, header
		// alignment, indexed badges, fallbackIcons (presentation, not editor
		// contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "GIS Services", sw: "Huduma za GIS" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "vector-polygon",
				title: { en: "Land GIS", sw: "GIS ya Ardhi" },
				features: [{ en: "Parcel mapping.", sw: "" }],
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
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						features: Array.isArray(item?.features)
							? item.features.filter((entry: unknown) => typeof entry === "string" && entry)
							: [],
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisIndustries` wraps the
 * `GisIndustriesSection` 2-col checklist grid (`fallbackIcons` outside the
 * shared `cardGrid` contract). Unique — only valid on
 * `/surveying/gis-mapping`. Icons shared; titles and features localized.
 * Renders nothing without items (legacy guard, preserved).
 */
const gisIndustries: SectionDefinition = {
	id: "gisIndustries",
	version: 1,
	label: "GIS industries (unique)",
	description: "Unique: the gis-mapping industry checklist grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
				features: fields.array(localeText("Feature", { optionalInEnglish: true }), {
					label: "Features",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Feature"),
				}),
			}),
			{
				label: "Industries",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Industry"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns,
		// fallbackIcons (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "GIS for Industries", sw: "GIS kwa Viwanda" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "account-group",
				title: { en: "Government", sw: "Serikali" },
				features: [{ en: "County governments.", sw: "" }],
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
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						features: Array.isArray(item?.features)
							? item.features.filter((entry: unknown) => typeof entry === "string" && entry)
							: [],
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisTechStack` wraps the
 * `GisTechStackSection` tool pills + logo bento (positional tool icons +
 * feature/wide spans stay in the renderer). Unique — only valid on
 * `/surveying/gis-mapping`. Logo paths shared; tools and labels localized.
 * Renders nothing without tools and logos (legacy guard, preserved).
 */
const gisTechStack: SectionDefinition = {
	id: "gisTechStack",
	version: 1,
	label: "GIS tech stack (unique)",
	description: "Unique: the gis-mapping tool pills and logo bento. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		tools: fields.array(localeText("Tool"), {
			label: "Tools",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Tool"),
		}),
		logos: fields.array(
			fields.object({
				image: imagePath("Logo (shared, optional)"),
				label: localeText("Label", { optionalInEnglish: true }),
			}),
			{
				label: "Logos",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Logo"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, positional tool
		// icons, feature/wide spans (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "GIS Technology Stack", sw: "Teknolojia ya GIS" },
		description: { en: "", sw: "" },
		tools: [{ en: "ArcGIS Pro", sw: "ArcGIS Pro" }],
		logos: [
			{
				image: "/media/surveying/gis-mapping/03-05.png",
				label: { en: "ArcGIS", sw: "" },
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			tools: Array.isArray(resolved.tools) ? resolved.tools.filter((entry: unknown) => typeof entry === "string" && entry) : [],
			logos: Array.isArray(resolved.logos)
				? resolved.logos.map((logo: any) => ({ image: logo?.image || undefined, label: logo?.label ?? "" }))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisWhatsappCta` wraps the
 * `GisWhatsappCtaSection` WhatsApp band. Unique — only valid on
 * `/surveying/gis-mapping`. Href/icon shared; tag, headline, description,
 * note and CTA label localized. Renders nothing without a headline (legacy
 * guard, preserved).
 */
const gisWhatsappCta: SectionDefinition = {
	id: "gisWhatsappCta",
	version: 1,
	label: "GIS WhatsApp CTA (unique)",
	description: "Unique: the gis-mapping WhatsApp band. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		note: localeLongText("Note"),
		cta: fields.object(
			{
				label: localeText("Label", { optionalInEnglish: true }),
				href: fields.text({
					label: "Link (shared, optional)",
					description: "Full URL. Empty = no button. Identical in en/sw.",
				}),
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
			},
			{ label: "Action" }
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, hardcoded WhatsApp
		// glyphs (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "Instant Support", sw: "Msaada wa Papo Hapo" },
		headline: { en: "WhatsApp a GIS Specialist", sw: "WhatsApp Mtaalamu" },
		description: { en: "", sw: "" },
		note: { en: "", sw: "" },
		cta: { label: { en: "WhatsApp Us", sw: "WhatsApp" }, href: "https://wa.me/254107393023", icon: "whatsapp" },
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			note: resolved.note,
			cta:
				resolved.cta && typeof resolved.cta.href === "string" && resolved.cta.href
					? { label: resolved.cta.label ?? "", href: resolved.cta.href, icon: resolved.cta.icon || undefined }
					: null,
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisComponents` wraps the
 * `GisComponentsSection` lifecycle ring + component list (ring geometry +
 * hardcoded "GIS"/"Lifecycle" fallbacks stay in the renderer). Unique —
 * only valid on `/surveying/gis-mapping`. All strings localized.
 */
const gisComponents: SectionDefinition = {
	id: "gisComponents",
	version: 1,
	label: "GIS components (unique)",
	description: "Unique: the gis-mapping lifecycle ring. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		lifecycle: fields.object(
			{
				title: localeText("Title", { optionalInEnglish: true }),
				subtitle: localeText("Subtitle", { optionalInEnglish: true }),
			},
			{ label: "Lifecycle hub" }
		),
		list: fields.array(
			fields.object({
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Components",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Component"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, ring geometry and
		// hub fallbacks (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "GIS Components", sw: "Vipengele vya GIS" },
		description: { en: "", sw: "" },
		lifecycle: { title: { en: "GIS", sw: "GIS" }, subtitle: { en: "Lifecycle", sw: "" } },
		list: [
			{
				title: { en: "Capture", sw: "Ukamatiaji" },
				description: { en: "Collect spatial data.", sw: "" },
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			description: resolved.description,
			lifecycle: resolved.lifecycle ? { title: resolved.lifecycle.title, subtitle: resolved.lifecycle.subtitle } : null,
			list: Array.isArray(resolved.list)
				? resolved.list.map((item: any) => ({ title: item?.title ?? "", description: item?.description ?? "" }))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisWhySmartgrid` wraps the
 * `GisWhySmartgridSection` icon grid (surface tone + `fallbackIcons`
 * outside the shared `cardGrid` contract). Unique — only valid on
 * `/surveying/gis-mapping`. Icons shared; titles localized. Renders nothing
 * without items (legacy guard, preserved).
 */
const gisWhySmartgrid: SectionDefinition = {
	id: "gisWhySmartgrid",
	version: 1,
	label: "GIS why-SmartGrid (unique)",
	description: "Unique: the gis-mapping differentiator grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
			}),
			{
				label: "Differentiators",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Differentiator"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, tone,
		// fallbackIcons (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Why SmartGrid GIS", sw: "Kwa Nini GIS Yetu" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "routes",
				title: { en: "Integrated Workflow", sw: "Mtiririko" },
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
				? resolved.items.map((item: any) => ({ icon: item?.icon || undefined, title: item?.title ?? "" }))
				: [],
		},
		id: resolved.id || undefined,
	}),
};


/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisDataAccuracy` wraps the
 * `GisDataAccuracySection` QC + accuracy-level panels. Unique — only valid
 * on `/surveying/gis-mapping`. Icons shared; titles, factors and accuracies
 * localized. Renders nothing without factors and levels (legacy guard,
 * preserved).
 */
const gisDataAccuracy: SectionDefinition = {
	id: "gisDataAccuracy",
	version: 1,
	label: "GIS data accuracy (unique)",
	description: "Unique: the gis-mapping accuracy panels. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		ensureTitle: localeText("Ensure title", { optionalInEnglish: true }),
		factors: fields.array(localeText("Factor"), {
			label: "Factors",
			itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Factor"),
		}),
		levelsTitle: localeText("Levels title", { optionalInEnglish: true }),
		levels: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				label: localeText("Label"),
				accuracy: localeText("Accuracy"),
			}),
			{
				label: "Levels",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Level"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className` (visual tuning, not
		// an editor contract).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Data Accuracy", sw: "Usahihi wa Data" },
		ensureTitle: { en: "", sw: "" },
		factors: [{ en: "Ground control points.", sw: "" }],
		levelsTitle: { en: "", sw: "" },
		levels: [
			{
				icon: "quadcopter",
				label: { en: "Drone mapping", sw: "Ramani za Droni" },
				accuracy: { en: "2–5 cm", sw: "2–5 cm" },
			},
		],
		id: "",
	},
	normalize: (resolved) => ({
		data: {
			tag: resolved.tag,
			headline: resolved.headline,
			ensureTitle: resolved.ensureTitle,
			factors: Array.isArray(resolved.factors) ? resolved.factors.filter((entry: unknown) => typeof entry === "string" && entry) : [],
			levelsTitle: resolved.levelsTitle,
			levels: Array.isArray(resolved.levels)
				? resolved.levels.map((level: any) => ({ icon: level?.icon || undefined, label: level?.label ?? "", accuracy: level?.accuracy ?? "" }))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisBeforeAfter` wraps the
 * `GisBeforeAfterSection` flip card (flip behavior, layoutId and icons stay
 * in the renderer). Unique — only valid on `/surveying/gis-mapping`. All
 * strings localized. Renders nothing without a headline (legacy guard,
 * preserved).
 */
const gisBeforeAfter: SectionDefinition = {
	id: "gisBeforeAfter",
	version: 1,
	label: "GIS before/after (unique)",
	description: "Unique: the gis-mapping flip comparison card. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		flipHint: localeText("Flip hint", { optionalInEnglish: true }),
		before: fields.object(
			{
				label: localeText("Label"),
				tagline: localeText("Tagline", { optionalInEnglish: true }),
				items: fields.array(localeText("Point"), {
					label: "Points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
			},
			{ label: "Before" }
		),
		after: fields.object(
			{
				label: localeText("Label"),
				tagline: localeText("Tagline", { optionalInEnglish: true }),
				items: fields.array(localeText("Point"), {
					label: "Points",
					itemLabel: (item) => previewText(item, ["fields", "en", "value"], "Point"),
				}),
			},
			{ label: "After" }
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, layoutId and icons
		// (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Before vs After GIS", sw: "Kabla na Baada ya GIS" },
		flipHint: { en: "Tap to compare", sw: "" },
		before: {
			label: { en: "BEFORE", sw: "KABLA" },
			tagline: { en: "", sw: "" },
			items: [{ en: "Scattered data.", sw: "" }],
		},
		after: {
			label: { en: "AFTER", sw: "BAADA" },
			tagline: { en: "", sw: "" },
			items: [{ en: "Central system.", sw: "" }],
		},
		id: "",
	},
	normalize: (resolved) => {
		const side = (node: any) =>
			node
				? {
						label: node.label ?? "",
						tagline: node.tagline,
						items: Array.isArray(node.items) ? node.items.filter((entry: unknown) => typeof entry === "string" && entry) : [],
					}
				: undefined;
		return {
			data: {
				tag: resolved.tag,
				headline: resolved.headline,
				flipHint: resolved.flipHint,
				before: side(resolved.before),
				after: side(resolved.after),
			},
			id: resolved.id || undefined,
		};
	},
};

/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisProjectImpact` wraps the
 * `GisProjectImpactSection` numbered grid (5 columns + `indexed` +
 * `fallbackIcons` outside the shared `cardGrid` contract). Unique — only
 * valid on `/surveying/gis-mapping`. Icons shared; titles localized.
 * Renders nothing without items (legacy guard, preserved).
 */
const gisProjectImpact: SectionDefinition = {
	id: "gisProjectImpact",
	version: 1,
	label: "GIS project impact (unique)",
	description: "Unique: the gis-mapping impact number grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Empty = positional default. Identical in en/sw.",
				}),
				title: localeText("Title"),
			}),
			{
				label: "Impacts",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Impact"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, tone,
		// indexed, fallbackIcons (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Project Impact", sw: "Athari za Mradi" },
		description: { en: "", sw: "" },
		items: [
			{
				icon: "",
				title: { en: "Faster Approvals", sw: "Idhini za Haraka" },
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
				? resolved.items.map((item: any) => ({ icon: item?.icon || undefined, title: item?.title ?? "" }))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 14 — gis-mapping page (2026-09-19): `gisRelatedServices` wraps
 * the `GisRelatedServicesSection` link grid (internal-href filter +
 * hardcoded bottom-note CTA stay in the renderer). Unique — only valid on
 * `/surveying/gis-mapping`. Icons/hrefs shared; titles and bottom note
 * localized. Renders nothing when no internal-href items remain (legacy
 * guard, preserved).
 */
const gisRelatedServices: SectionDefinition = {
	id: "gisRelatedServices",
	version: 1,
	label: "GIS related services (unique)",
	description: "Unique: the gis-mapping related-service links. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		bottomNote: localeLongText("Bottom note"),
		items: fields.array(
			fields.object({
				icon: fields.text({
					label: "MDI icon (shared, optional)",
					description: "Icon slug without the `mdi-` prefix. Identical in en/sw.",
				}),
				title: localeText("Title"),
				href: fields.text({
					label: "Link (shared, optional)",
					description: "Internal path — external hrefs are filtered out at render. Identical in en/sw.",
				}),
			}),
			{
				label: "Services",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Service"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, href filter and the
		// hardcoded bottom-note CTA (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Related Services", sw: "Huduma Zinazohusiana" },
		description: { en: "", sw: "" },
		bottomNote: { en: "", sw: "" },
		items: [
			{
				icon: "",
				title: { en: "Topographical Surveys", sw: "Upimaji wa Topografia" },
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
			bottomNote: resolved.bottomNote,
			items: Array.isArray(resolved.items)
				? resolved.items.map((item: any) => ({
						icon: item?.icon || undefined,
						title: item?.title ?? "",
						href: item?.href || undefined,
					}))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 15 — civil highway-surveys page (2026-09-19): `highwayServices`
 * wraps the `ServicesSection` indexed grid (`indexed` numbering is outside
 * the shared `cardGrid` contract). Unique — only valid on
 * `/civil/highway-surveys`. Titles and descriptions localized. Renders
 * nothing without items (legacy guard, preserved).
 */
const highwayServices: SectionDefinition = {
	id: "highwayServices",
	version: 1,
	label: "Highway services (unique)",
	description: "Unique: the highway-surveys indexed service grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Services",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Service"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, indexed
		// numbering (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "Highway Survey Services", sw: "Huduma za Upimaji wa Barabara" },
		description: { en: "", sw: "" },
		items: [
			{
				title: { en: "Route Analysis", sw: "Uchambuzi wa Njia" },
				description: { en: "Optimal corridor mapping.", sw: "" },
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
				? resolved.items.map((item: any) => ({ title: item?.title ?? "", description: item?.description ?? "" }))
				: [],
		},
		id: resolved.id || undefined,
	}),
};

/**
 * M11 batch 15 — civil as-built-surveys page (2026-09-19): `asBuiltSolutions`
 * wraps the `AsBuiltSolutionsSection` indexed surface grid (same shape as
 * `highwayServices` plus surface tone — separate id, page-scoped).
 * Unique — only valid on `/civil/as-built-surveys`. Titles and descriptions
 * localized. Renders nothing without items (legacy guard, preserved).
 */
const asBuiltSolutions: SectionDefinition = {
	id: "asBuiltSolutions",
	version: 1,
	label: "As-built solutions (unique)",
	description: "Unique: the as-built-surveys indexed solution grid. Only valid on that page.",
	schema: fields.object({
		tag: localeText("Tag", { optionalInEnglish: true }),
		headline: localeText("Headline"),
		description: localeLongText("Description"),
		items: fields.array(
			fields.object({
				title: localeText("Title"),
				description: localeLongText("Description"),
			}),
			{
				label: "Solutions",
				itemLabel: (item) => previewText(item, ["fields", "title", "fields", "en", "value"], "Solution"),
			}
		),
		id: anchorField(),
		// Excluded from v1 (documented): `className`, columns, tone,
		// indexed numbering (presentation, not editor contracts).
	}),
	example: {
		tag: { en: "", sw: "" },
		headline: { en: "As-Built Solutions", sw: "Suluhisho za Kujengwa" },
		description: { en: "", sw: "" },
		items: [
			{
				title: { en: "Drone Accuracy", sw: "Usahihi wa Droni" },
				description: { en: "LiDAR capture.", sw: "" },
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
				? resolved.items.map((item: any) => ({ title: item?.title ?? "", description: item?.description ?? "" }))
				: [],
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
	coverageArea,
	surveyCost,
	leadGenBar,
	services,
	homeHero,
	homeDrones,
	contactHero,
	contactOffices,
	contactForm,
	careersOpenings,
	careersProcess,
	careersStatement,
	companyProfileViewer,
	aboutAerialSurveying,
	aboutLandSurveying,
	aboutImpact,
	surveyingServices,
	surveyingProcess,
	civilHero,
	civilProcess,
	deliverables,
	workflow,
	finalCta,
	topoWhenYouNeed,
	topoWhatWeOffer,
	topoDetailedSurveys,
	topoSampleMap,
	topoInstruments,
	topoWhyConduct,
	sectionalWhatIs,
	sectionalServicesDetail,
	sectionalWorkflow,
	sectionalTimeline,
	sectionalWhoNeeds,
	bathyEquipment,
	bathyLimitations,
	bathyDamsLakes,
	bathyApplications,
	bathyBeforeAfter,
	rmWhatIs,
	rmTypes,
	rmSector,
	rmWorkflow,
	rmWhoUses,
	rmTechStack,
	rmDataAccuracy,
	bsHero,
	bsSection2,
	bsSiteEngineering,
	bsProcess,
	bsAccuracyMatters,
	bsTechnology,
	bsConsultation,
	aerialIntro,
	aerialWhyDrones,
	aerialServices,
	aerialSurveyingGrid,
	aerialIndustries,
	aerialIndustryCta,
	aerialTechStack,
	aerialCapabilityCta,
	aerialProjects,
	aerialAdditionalServices,
	cadastralPostHeroCta,
	cadastralWhenYouNeed,
	cadastralProcessCta,
	cadastralCost,
	cadastralTimeline,
	cadastralCompliance,
	cadastralCaseStudy,
	gprHero,
	gprHighlights,
	gprJumpNav,
	gprOverview,
	gprMethodology,
	gprApplications,
	gprDetect,
	gprSue,
	gprLimitations,
	gprBeforeAfter,
	gprTechnology,
	gprFeaturedProjects,
	gprSummary,
	gisHero,
	gisWhatIs,
	gisImportance,
	gisServices,
	gisIndustries,
	gisTechStack,
	gisWhatsappCta,
	gisComponents,
	gisWhySmartgrid,
	gisDataAccuracy,
	gisBeforeAfter,
	gisProjectImpact,
	gisRelatedServices,
	highwayServices,
	asBuiltSolutions,
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
	coverageArea: coverageArea.label,
	surveyCost: surveyCost.label,
	leadGenBar: leadGenBar.label,
	services: services.label,
	homeHero: homeHero.label,
	homeDrones: homeDrones.label,
	contactHero: contactHero.label,
	contactOffices: contactOffices.label,
	contactForm: contactForm.label,
	careersOpenings: careersOpenings.label,
	careersProcess: careersProcess.label,
	careersStatement: careersStatement.label,
	companyProfileViewer: companyProfileViewer.label,
	aboutAerialSurveying: aboutAerialSurveying.label,
	aboutLandSurveying: aboutLandSurveying.label,
	aboutImpact: aboutImpact.label,
	surveyingServices: surveyingServices.label,
	surveyingProcess: surveyingProcess.label,
	civilHero: civilHero.label,
	civilProcess: civilProcess.label,
	deliverables: deliverables.label,
	workflow: workflow.label,
	finalCta: finalCta.label,
	topoWhenYouNeed: topoWhenYouNeed.label,
	topoWhatWeOffer: topoWhatWeOffer.label,
	topoDetailedSurveys: topoDetailedSurveys.label,
	topoSampleMap: topoSampleMap.label,
	topoInstruments: topoInstruments.label,
	topoWhyConduct: topoWhyConduct.label,
	sectionalWhatIs: sectionalWhatIs.label,
	sectionalServicesDetail: sectionalServicesDetail.label,
	sectionalWorkflow: sectionalWorkflow.label,
	sectionalTimeline: sectionalTimeline.label,
	sectionalWhoNeeds: sectionalWhoNeeds.label,
	bathyEquipment: bathyEquipment.label,
	bathyLimitations: bathyLimitations.label,
	bathyDamsLakes: bathyDamsLakes.label,
	bathyApplications: bathyApplications.label,
	bathyBeforeAfter: bathyBeforeAfter.label,
	rmWhatIs: rmWhatIs.label,
	rmTypes: rmTypes.label,
	rmSector: rmSector.label,
	rmWorkflow: rmWorkflow.label,
	rmWhoUses: rmWhoUses.label,
	rmTechStack: rmTechStack.label,
	rmDataAccuracy: rmDataAccuracy.label,
	bsHero: bsHero.label,
	bsSection2: bsSection2.label,
	bsSiteEngineering: bsSiteEngineering.label,
	bsProcess: bsProcess.label,
	bsAccuracyMatters: bsAccuracyMatters.label,
	bsTechnology: bsTechnology.label,
	bsConsultation: bsConsultation.label,
	aerialIntro: aerialIntro.label,
	aerialWhyDrones: aerialWhyDrones.label,
	aerialServices: aerialServices.label,
	aerialSurveyingGrid: aerialSurveyingGrid.label,
	aerialIndustries: aerialIndustries.label,
	aerialIndustryCta: aerialIndustryCta.label,
	aerialTechStack: aerialTechStack.label,
	aerialCapabilityCta: aerialCapabilityCta.label,
	aerialProjects: aerialProjects.label,
	aerialAdditionalServices: aerialAdditionalServices.label,
	cadastralPostHeroCta: cadastralPostHeroCta.label,
	cadastralWhenYouNeed: cadastralWhenYouNeed.label,
	cadastralProcessCta: cadastralProcessCta.label,
	cadastralCost: cadastralCost.label,
	cadastralTimeline: cadastralTimeline.label,
	cadastralCompliance: cadastralCompliance.label,
	cadastralCaseStudy: cadastralCaseStudy.label,
	gprHero: gprHero.label,
	gprHighlights: gprHighlights.label,
	gprJumpNav: gprJumpNav.label,
	gprOverview: gprOverview.label,
	gprMethodology: gprMethodology.label,
	gprApplications: gprApplications.label,
	gprDetect: gprDetect.label,
	gprSue: gprSue.label,
	gprLimitations: gprLimitations.label,
	gprBeforeAfter: gprBeforeAfter.label,
	gprTechnology: gprTechnology.label,
	gprFeaturedProjects: gprFeaturedProjects.label,
	gprSummary: gprSummary.label,
	gisHero: gisHero.label,
	gisWhatIs: gisWhatIs.label,
	gisImportance: gisImportance.label,
	gisServices: gisServices.label,
	gisIndustries: gisIndustries.label,
	gisTechStack: gisTechStack.label,
	gisWhatsappCta: gisWhatsappCta.label,
	gisComponents: gisComponents.label,
	gisWhySmartgrid: gisWhySmartgrid.label,
	gisDataAccuracy: gisDataAccuracy.label,
	gisBeforeAfter: gisBeforeAfter.label,
	gisProjectImpact: gisProjectImpact.label,
	gisRelatedServices: gisRelatedServices.label,
	highwayServices: highwayServices.label,
	asBuiltSolutions: asBuiltSolutions.label,
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
