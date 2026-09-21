import { fields } from "@keystatic/core";
import { imagePath, localeLongText, localeText, previewText } from "./fields";

/**
 * Site-wide layout content contract (M9).
 *
 * Single source for the Keystatic `site` singleton schema
 * (`keystatic.config.ts`), the layout resolver (`resolveLayout.ts`) and the
 * layout migration (`scripts/migrate-layout-to-keystatic.mjs`).
 *
 * Scope (decided 2026-09-17, Stage 1 inventory): only keys actually rendered
 * by the layout shell — Navbar (`common:nav.links/logo/logo_light/logo_alt`,
 * `common:contacts`), both Footers (`common:footer.*`,
 * `contact:talkToUs.contacts`, `contact:social.channels`) and CookieConsent
 * (`common:cookies.*`). PageTransitionLoader reads `nav.logo` too and
 * inherits the override.
 *
 * Deliberately NOT modelled (documented Stage 1 exclusions):
 * - `common:socials` — unrendered dead content (no reader in `src`).
 * - `nav.ctaPrimary/ctaSecondary/ctaSearch`, `nav.logo_dark` — unrendered.
 * - `common:locales`, `common:misc` — language routing, not content.
 * - `meta:site` — brand/SEO title, legacy-owned.
 * - `industriesWeServe`-style page sections — owned by page entries.
 *
 * Node-safety: like `fields.ts`/`sectionRegistry.ts`, this module imports
 * only `@keystatic/core`, so the Keystatic config keeps loading in Node.
 *
 * Conventions (same as the section registry): localized text via
 * `localeText`/`localeLongText`; route paths, icon slugs, media references
 * and brand literals via shared (non-localized) fields gated by
 * `sharedValue` in the migration; `normalizeSiteLayout` drops editor-empty
 * optionals (`""`, `false`, `"standard"`) so the merged store keeps the
 * exact legacy shape (`undefined` key vs `""` would otherwise leak into
 * the i18n store and break `--verify` parity).
 */

const sharedHref = (label: string, description = "Internal path or full URL.") =>
	fields.text({ label, description });

const iconSlug = (label = "MDI icon (optional)") =>
	fields.text({ label, description: "Icon slug without the `mdi-` prefix." });

const navSubLink = (label: string) =>
	fields.object(
		{
			label: localeText("Label"),
			href: sharedHref("Link"),
		},
		{ label }
	);

const footerLink = (label: string) =>
	fields.object(
		{
			label: localeText("Label"),
			href: sharedHref("Link"),
		},
		{ label }
	);

const contactItem = (label: string) =>
	fields.object(
		{
			icon: iconSlug(),
			label: localeText("Label"),
			value: localeText("Value", { optionalInEnglish: true }),
			href: fields.text({
				label: "Link (optional)",
				description: "tel:/mailto:/https: link. Empty = plain text, no link.",
			}),
		},
		{ label }
	);

const footerColumn = (label: string) =>
	fields.object(
		{
			heading: localeText("Heading"),
			links: fields.array(footerLink("Link"), {
				label: "Links",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Link"),
			}),
		},
		{ label }
	);

export const siteLayoutSchema = {
	status: fields.select({
		label: "Status",
		description: "Only a published layout may be served to visitors.",
		options: [
			{ label: "Draft", value: "draft" },
			{ label: "Published", value: "published" },
		],
		defaultValue: "draft",
	}),
	nav: fields.object(
		{
			logo: imagePath("Logo"),
			logoLight: imagePath("Logo (dark backgrounds)"),
			logoAlt: localeText("Logo alt text"),
			links: fields.array(
				fields.object({
					label: localeText("Label"),
					href: sharedHref("Link"),
					type: fields.select({
						label: "Style",
						options: [
							{ label: "Standard", value: "standard" },
							{ label: "Pill", value: "pill" },
						],
						defaultValue: "standard",
					}),
					excludeOnMainNav: fields.checkbox({
						label: "Hide from main nav",
						defaultValue: false,
					}),
					links: fields.array(navSubLink("Sublink"), {
						label: "Sublinks",
						itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Sublink"),
					}),
				}),
				{
					label: "Nav links",
					itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Nav link"),
				}
			),
		},
		{ label: "Navbar" }
	),
	footer: fields.object(
		{
			description: localeLongText("Description", { optionalInEnglish: true }),
			columns: fields.object(
				{
					company: footerColumn("Company"),
					surveying: footerColumn("Surveying"),
					drones: footerColumn("Drones"),
					civil: footerColumn("Civil"),
				},
				{ label: "Link columns" }
			),
			copyright: localeLongText("Copyright", { optionalInEnglish: true }),
			legal: fields.object(
				{
					privacy: localeText("Privacy", { optionalInEnglish: true }),
					terms: localeText("Terms", { optionalInEnglish: true }),
					cookies: localeText("Cookies", { optionalInEnglish: true }),
				},
				{ label: "Legal links" }
			),
		},
		{ label: "Footer" }
	),
	contacts: fields.object(
		{
			address: fields.array(contactItem("Address"), {
				label: "Address",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Address"),
			}),
			phone: fields.array(contactItem("Phone"), {
				label: "Phone",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Phone"),
			}),
			mail: fields.array(contactItem("Mail"), {
				label: "Mail",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Mail"),
			}),
			whatsapp: fields.array(contactItem("Whatsapp"), {
				label: "Whatsapp",
				itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Whatsapp"),
			}),
		},
		{ label: "Contacts" }
	),
	cookies: fields.object(
		{
			title: localeText("Title"),
			description: localeLongText("Description"),
			privacyLink: localeText("Privacy link", { optionalInEnglish: true }),
			acceptAll: localeText("Accept all", { optionalInEnglish: true }),
			rejectAll: localeText("Reject all", { optionalInEnglish: true }),
			customize: localeText("Customize", { optionalInEnglish: true }),
			savePreferences: localeText("Save preferences", { optionalInEnglish: true }),
			back: localeText("Back", { optionalInEnglish: true }),
			preferencesDescription: localeLongText("Preferences description", { optionalInEnglish: true }),
			categories: fields.object(
				{
					necessary: fields.object(
						{
							label: localeText("Label"),
							description: localeLongText("Description"),
							alwaysActive: localeText("Always-active badge"),
						},
						{ label: "Necessary" }
					),
					functional: fields.object(
						{
							label: localeText("Label"),
							description: localeLongText("Description"),
						},
						{ label: "Functional" }
					),
					analytics: fields.object(
						{
							label: localeText("Label"),
							description: localeLongText("Description"),
						},
						{ label: "Analytics" }
					),
				},
				{ label: "Categories" }
			),
		},
		{ label: "Cookie consent" }
	),
	footerContacts: fields.array(
		fields.object({
			icon: iconSlug(),
			label: localeText("Label"),
			href: sharedHref("Link"),
			note: localeText("Note", { optionalInEnglish: true }),
			color: fields.text({
				label: "Brand color (shared)",
				description: "Chip color token (`primary`, `whatsapp`, `calendly`, …). Identical in en/sw.",
			}),
		}),
		{
			label: "Footer contact strip",
			description: "From `contact:talkToUs.contacts`. Also feeds the legacy `/contact` tail — the `/contact` page entry copy wins there when opted in.",
			itemLabel: (item) => previewText(item, ["fields", "label", "fields", "en", "value"], "Contact"),
		}
	),
	socialChannels: fields.array(
		fields.object({
			platform: fields.text({
				label: "Platform (shared)",
				description: "Platform name, used as the link label. Identical in en/sw.",
			}),
			handle: fields.text({
				label: "Handle (shared)",
				description: "Public handle. Identical in en/sw.",
			}),
			url: sharedHref("URL"),
			icon: iconSlug("MDI icon"),
		}),
		{
			label: "Social channels",
			description: "From `contact:social.channels`. Brand literals — identical in en/sw.",
			itemLabel: (item) => previewText(item, ["fields", "platform", "value"], "Channel"),
		}
	),
};

/** Merge-ready layout data: plain locale-resolved values (no `{en,sw}` nodes). */
export interface NormalizedSiteLayout {
	nav: any;
	footer: any;
	contacts: any;
	cookies: any;
	footerContacts: any[];
	socialChannels: any[];
}

/**
 * Normalize stored singleton data to the exact legacy store shape:
 * editor-empty optionals collapse to the legacy representation (`type:
 * "standard"` and `excludeOnMainNav: false` are omitted like the absent
 * legacy keys; empty contact `href` becomes `null` like the legacy address
 * entry).
 */
export function normalizeSiteLayout(resolved: any): NormalizedSiteLayout {
	const links = Array.isArray(resolved?.nav?.links)
		? resolved.nav.links.map((link: any) => {
				const subs = Array.isArray(link?.links)
					? link.links.map((sub: any) => ({ label: sub?.label ?? "", href: sub?.href ?? "" }))
					: [];
				return {
					label: link?.label ?? "",
					href: link?.href ?? "",
					...(link?.type && link.type !== "standard" ? { type: link.type } : {}),
					...(link?.excludeOnMainNav ? { excludeOnMainNav: true } : {}),
					// Legacy omits `links` when a link has no sublinks (e.g.
					// the Contact pill) — omit too so the merged store keeps
					// the exact legacy shape.
					...(subs.length > 0 ? { links: subs } : {}),
				};
			})
		: [];
	const contactGroup = (items: any) =>
		Array.isArray(items)
			? items.map((item: any) => ({
					icon: item?.icon || undefined,
					label: item?.label ?? "",
					value: item?.value ?? "",
					href: item?.href || null,
				}))
			: [];
	return {
		// Store keys stay snake_case (`logo_light`, `logo_alt`) — the
		// components read exactly those paths. Unrendered legacy keys
		// (`logo_dark`, `ctaPrimary`, …) are NOT dropped here: the merge
		// spreads the legacy nav underneath, so dead keys survive the
		// override untouched.
		nav: {
			logo: resolved?.nav?.logo || undefined,
			logo_light: resolved?.nav?.logoLight || undefined,
			logo_alt: resolved?.nav?.logoAlt ?? "",
			links,
		},
		footer: resolved?.footer,
		contacts: {
			address: contactGroup(resolved?.contacts?.address),
			phone: contactGroup(resolved?.contacts?.phone),
			mail: contactGroup(resolved?.contacts?.mail),
			whatsapp: contactGroup(resolved?.contacts?.whatsapp),
		},
		cookies: resolved?.cookies,
		footerContacts: Array.isArray(resolved?.footerContacts)
			? resolved.footerContacts.map((item: any) => ({
					icon: item?.icon || undefined,
					label: item?.label ?? "",
					href: item?.href ?? "",
					note: item?.note ?? "",
					color: item?.color ?? "",
				}))
			: [],
		socialChannels: Array.isArray(resolved?.socialChannels)
			? resolved.socialChannels.map((item: any) => ({
					platform: item?.platform ?? "",
					handle: item?.handle ?? "",
					url: item?.url ?? "",
					icon: item?.icon ?? "",
				}))
			: [],
	};
}

/** Minimal valid example payload (schema-declared keys only). */
export const siteLayoutExample = {
	status: "draft",
	nav: {
		logo: "/img/logo.svg",
		logoLight: "/img/logo-light.svg",
		logoAlt: { en: "SmartGrid", sw: "SmartGrid" },
		links: [
			{
				label: { en: "Surveying", sw: "Upimaji" },
				href: "/surveying",
				type: "standard",
				excludeOnMainNav: false,
				links: [{ label: { en: "Topographical surveys", sw: "Upimaji wa topografia" }, href: "/surveying/topographical-surveys" }],
			},
		],
	},
	footer: {
		description: { en: "Surveying and engineering.", sw: "Upimaji na uhandisi." },
		columns: {
			company: {
				heading: { en: "Company", sw: "Kampuni" },
				links: [{ label: { en: "About", sw: "Kutuhusu" }, href: "/about" }],
			},
			surveying: {
				heading: { en: "Surveying", sw: "Upimaji" },
				links: [{ label: { en: "Topographical", sw: "Topografia" }, href: "/surveying/topographical-surveys" }],
			},
			drones: {
				heading: { en: "Drones", sw: "Droni" },
				links: [{ label: { en: "LiDAR", sw: "LiDAR" }, href: "/aerial-drones/lidar-mapping" }],
			},
			civil: {
				heading: { en: "Civil", sw: "Uhandisi" },
				links: [{ label: { en: "BIM", sw: "BIM" }, href: "/civil/bim" }],
			},
		},
		copyright: { en: "© {{year}} {{organization}} All rights reserved.", sw: "© {{year}} {{organization}} Haki zote zimehifadhiwa." },
		legal: {
			privacy: { en: "Privacy Policy", sw: "Sera ya Faragha" },
			terms: { en: "Terms of Use", sw: "Masharti ya Matumizi" },
			cookies: { en: "Cookie Settings", sw: "Mipangilio ya Kuki" },
		},
	},
	contacts: {
		address: [
			{
				icon: "map-marker",
				label: { en: "Nairobi, Kenya", sw: "Nairobi, Kenya" },
				value: { en: "Nairobi, Kenya", sw: "Nairobi, Kenya" },
				href: "",
			},
		],
		phone: [
			{
				icon: "phone",
				label: { en: "+254 10 7393023", sw: "+254 10 7393023" },
				value: { en: "+254107393023", sw: "+254107393023" },
				href: "tel:+254107393023",
			},
		],
		mail: [
			{
				icon: "gmail",
				label: { en: "smartgridsurveying@gmail.com", sw: "smartgridsurveying@gmail.com" },
				value: { en: "smartgridsurveying@gmail.com", sw: "smartgridsurveying@gmail.com" },
				href: "mailto:smartgridsurveying@gmail.com",
			},
		],
		whatsapp: [
			{
				icon: "whatsapp",
				label: { en: "Chat On Whatsapp", sw: "Chat On Whatsapp" },
				value: { en: "254107393023", sw: "254107393023" },
				href: "https://wa.me/254107393023",
			},
		],
	},
	cookies: {
		title: { en: "Cookies", sw: "Kuki" },
		description: { en: "We use cookies.", sw: "Tunatumia kuki." },
		privacyLink: { en: "Privacy policy", sw: "Sera ya faragha" },
		acceptAll: { en: "Accept all", sw: "Kubali zote" },
		rejectAll: { en: "Reject all", sw: "Kataa zote" },
		customize: { en: "Customize", sw: "Binafsisha" },
		savePreferences: { en: "Save", sw: "Hifadhi" },
		back: { en: "Back", sw: "Rudi" },
		preferencesDescription: { en: "Choose categories.", sw: "Chagua kategoria." },
		categories: {
			necessary: {
				label: { en: "Strictly necessary", sw: "Muhimu kabisa" },
				description: { en: "Required.", sw: "Inahitajika." },
				alwaysActive: { en: "Always active", sw: "Inafanya kazi kila wakati" },
			},
			functional: {
				label: { en: "Functional", sw: "Kazi" },
				description: { en: "Enhanced features.", sw: "Vipengele bora." },
			},
			analytics: {
				label: { en: "Analytics", sw: "Takwimu" },
				description: { en: "Usage stats.", sw: "Takwimu za matumizi." },
			},
		},
	},
	footerContacts: [
		{
			icon: "phone",
			label: { en: "+254 107 393 023", sw: "+254 107 393 023" },
			href: "tel:+254107393023",
			note: { en: "HQ (Ruiru)", sw: "HQ (Ruiru)" },
			color: "primary",
		},
	],
	socialChannels: [
		{
			platform: "LinkedIn",
			handle: "Smartgrid Surveying",
			url: "https://www.linkedin.com/company/smartgrid-surveying/",
			icon: "linkedin",
		},
	],
};
