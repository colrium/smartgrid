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
 * - `CardList` (grid+modal behavior, no `<section>`), `Faq`, `Pricing`,
 *   `Process`, `Gallery`, `FinalCta`, `WorkflowSection`,
 *   `BeforeAfterFlipCard`, `CtaPill`, `ProductListing` — valid future
 *   candidates, deferred until migration needs them; each needs its own
 *   schema + renderer + example.
 * - Page-specific bespoke sections (`CurrentOpeningsSection`,
 *   `CompanyProfileViewerSection`, …) are never registered: the registry
 *   stays shared-only so branch options make sense for every page. Their
 *   pages remain on locale JSON until a shared-section or hybrid strategy
 *   is decided (M4 log).
 */

export const SECTION_IDS = ["introText", "ctaBand", "stats", "hero", "cardGrid", "splitMedia"] as const;
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
	version: 1,
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
		ctaPrimary: linkObject("Primary action"),
		ctaSecondary: linkObject("Secondary action"),
		id: anchorField(),
		// Excluded from v1 (documented): `ctaPrimary.iconPosition` and
		// `ctaPrimary.trailingArrow` overrides (legacy entries leave them
		// unset, preserving layout defaults exactly) and `className`.
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
			ctaPrimary: presentLink(resolved.ctaPrimary),
			ctaSecondary: presentLink(resolved.ctaSecondary),
		},
		id: resolved.id || undefined,
	}),
};

const cardGrid: SectionDefinition = {
	id: "cardGrid",
	version: 1,
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

export const sectionRegistry: readonly SectionDefinition[] = [introText, ctaBand, stats, hero, cardGrid, splitMedia];

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
