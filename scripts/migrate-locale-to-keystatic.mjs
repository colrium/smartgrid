// Repeatable locale-JSON → Keystatic migration (M4).
//
// For each migrated page a mapping below declares, per section, the locale
// namespace key, the registry discriminant, and the wrapper presentation
// hardcodes the legacy implementation carries (e.g. `Stats layout="panel"`).
// The generator copies every content scalar verbatim — URLs, image paths,
// icons, labels and numbers — and pairs `en`/`sw` strings into locale
// nodes. Only the `type` discriminator keys of the legacy namespaces are
// dropped (they route wrappers, not content).
//
// Completeness gate (no silent fallback): every required locale string must
// exist and be non-empty in BOTH locales; every shared non-text value
// (href, icon, layout) must be identical across locales unless the schema
// models it per-locale (media). Any gap aborts with a diagnostic list.
//
// Usage:
//   node scripts/migrate-locale-to-keystatic.mjs --page company-profile --write
//   node scripts/migrate-locale-to-keystatic.mjs --page company-profile --verify
// `--verify` regenerates from locale JSON and byte-compares the checked-in
// entry: the committed file must always equal repeatable output.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const gaps = [];
const gap = (where, message) => gaps.push(`${where}: ${message}`);

/**
 * Required localized string: legacy locale JSON holds plain strings per
 * file, so the value is passed directly with its provenance in `where`.
 */
function reqText(value, where) {
	if (typeof value !== "string" || value.length === 0) {
		gap(where, "must be a non-empty string");
		return "";
	}
	return value;
}

/** Optional localized string: missing/non-string becomes "" (never undefined). */
function optText(value) {
	return typeof value === "string" ? value : "";
}

const emptyPair = () => ({ en: "", sw: "" });

/** Shared non-text value: must be identical across locales, copied exactly. */
function sharedValue(enNode, swNode, key, where) {
	const en = enNode?.[key];
	const sw = swNode?.[key];
	if (JSON.stringify(en) !== JSON.stringify(sw)) {
		gap(where, `"${key}" diverged across locales (en=${JSON.stringify(en)} sw=${JSON.stringify(sw)})`);
	}
	return en;
}

// --- Page mappings -----------------------------------------------------------
// Each entry mirrors one legacy wrapper: content keys from the locale
// namespace plus the presentation props the wrapper hardcodes (with source).

function cardGridBuild(presentation) {
	return (en, sw, where) => {
		const enItems = en.items ?? [];
		const swItems = sw.items ?? [];
		if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
			gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
		}
		return {
			tag: { en: optText(en.tag), sw: optText(sw.tag) },
			headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
			subheading: emptyPair(),
			description: { en: optText(en.description), sw: optText(sw.description) },
			items: enItems.map((item, i) => {
				const swItem = swItems[i];
				if (item.href !== undefined || swItem?.href !== undefined) {
					sharedValue(item, swItem, "href", `${where}.items[${i}]`);
				}
				return {
					icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
					title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem?.title, `${where}.items[${i}].title.sw`) },
					description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem?.description, `${where}.items[${i}].description.sw`) },
					image: "",
					href: typeof item.href === "string" ? item.href : "",
				};
			}),
			...presentation,
			id: "",
		};
	};
}

function interpolateSiteTitle(value, siteTitle, where) {
	if (typeof value !== "string") return "";
	if (!value.includes("{{site_title}}")) return value;
	if (!siteTitle) {
		gap(where, "needs {{site_title}} but meta.json has no site title");
		return value;
	}
	return value.split("{{site_title}}").join(siteTitle);
}

function legalBuild(pageTitle) {
	return (en, sw, where, siteTitle) => {
		const enArticles = en.articles ?? [];
		const swArticles = sw.articles ?? [];
		if (!Array.isArray(swArticles) || swArticles.length !== enArticles.length) {
			gap(where, `article count diverged (en=${enArticles.length} sw=${swArticles?.length})`);
		}
		// Legacy contactLink is per-locale editorial content (terms sw adds
		// `#contact-form`); copy verbatim per locale, never sharedValue.
		return {
			label: { en: reqText(en.misc?.label, `${where}.misc.label.en`), sw: reqText(sw.misc?.label, `${where}.misc.label.sw`) },
			title: { en: reqText(en.misc?.title, `${where}.misc.title.en`), sw: reqText(sw.misc?.title, `${where}.misc.title.sw`) },
			description: {
				en: reqText(interpolateSiteTitle(en.misc?.description, siteTitle?.en, `${where}.misc.description.en`), `${where}.misc.description.en`),
				sw: reqText(interpolateSiteTitle(sw.misc?.description, siteTitle?.sw, `${where}.misc.description.sw`), `${where}.misc.description.sw`),
			},
			lastUpdated: {
				en: `${optText(en.misc?.lastUpdatedLabel)} ${optText(en.misc?.lastUpdated)}`.trim(),
				sw: `${optText(sw.misc?.lastUpdatedLabel)} ${optText(sw.misc?.lastUpdated)}`.trim(),
			},
			articles: enArticles.map((article, i) => {
				const swArticle = swArticles[i] ?? {};
				const enContent = Array.isArray(article.content) ? article.content : [article.content];
				const swContent = Array.isArray(swArticle.content) ? swArticle.content : [swArticle.content];
				if (enContent.length !== swContent.length) {
					gap(where, `article[${i}] paragraph count diverged (en=${enContent.length} sw=${swContent.length})`);
				}
				return {
					title: { en: reqText(article.title, `${where}.articles[${i}].title.en`), sw: reqText(swArticle.title, `${where}.articles[${i}].title.sw`) },
					paragraphs: enContent.map((paragraph, j) => ({
						en: reqText(
							interpolateSiteTitle(paragraph, siteTitle?.en, `${where}.articles[${i}].content[${j}].en`),
							`${where}.articles[${i}].content[${j}].en`,
						),
						sw: reqText(
							interpolateSiteTitle(swContent[j], siteTitle?.sw, `${where}.articles[${i}].content[${j}].sw`),
							`${where}.articles[${i}].content[${j}].sw`,
						),
					})),
				};
			}),
			contactHref: {
				en: reqText(en.misc?.contactLink, `${where}.misc.contactLink.en`),
				sw: reqText(sw.misc?.contactLink, `${where}.misc.contactLink.sw`),
			},
			contactLabel: { en: reqText(en.misc?.contactLabel, `${where}.misc.contactLabel.en`), sw: reqText(sw.misc?.contactLabel, `${where}.misc.contactLabel.sw`) },
			note: {
				en: reqText(interpolateSiteTitle(en.misc?.note ?? en.contact?.description, siteTitle?.en, `${where}.note.en`), `${where}.note.en`),
				sw: reqText(interpolateSiteTitle(sw.misc?.note ?? sw.contact?.description, siteTitle?.sw, `${where}.note.sw`), `${where}.note.sw`),
			},
			id: "",
			_pageTitle: pageTitle,
		};
	};
}

// M7 batch 2: `contact:talkToUs` → `cardGrid`. The legacy wrapper maps
// `contacts[]` (`label`/`note`/`href`/`icon`/`color`) onto CardGrid items
// (`title`/`description`/`href`/`icon`/`accent`); `color` is a shared token
// so any cross-locale divergence aborts via `sharedValue`.
function talkToUsBuild(presentation) {
	return (en, sw, where) => {
		const enContacts = en.contacts ?? [];
		const swContacts = sw.contacts ?? [];
		if (!Array.isArray(swContacts) || swContacts.length !== enContacts.length) {
			gap(where, `contact count diverged (en=${enContacts.length} sw=${swContacts?.length})`);
		}
		return {
			tag: { en: optText(en.tag), sw: optText(sw.tag) },
			headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
			subheading: emptyPair(),
			description: { en: optText(en.description), sw: optText(sw.description) },
			items: enContacts.map((contact, i) => {
				const swContact = swContacts[i];
				if (contact.href !== undefined || swContact?.href !== undefined) {
					sharedValue(contact, swContact, "href", `${where}.contacts[${i}]`);
				}
				return {
					icon: sharedValue(contact, swContact, "icon", `${where}.contacts[${i}]`) ?? "",
					title: { en: reqText(contact.label, `${where}.contacts[${i}].label.en`), sw: reqText(swContact?.label, `${where}.contacts[${i}].label.sw`) },
					description: { en: reqText(contact.note, `${where}.contacts[${i}].note.en`), sw: reqText(swContact?.note, `${where}.contacts[${i}].note.sw`) },
					image: "",
					href: typeof contact.href === "string" ? contact.href : "",
					accent: sharedValue(contact, swContact, "color", `${where}.contacts[${i}]`) ?? "",
				};
			}),
			...presentation,
			id: "",
		};
	};
}

// M7 batch 3: `about:*` gallery sections → `gallery`. Legacy items are
// either bare image paths (slider/masonry) or `{image,title?,label?}`
// objects (overlay grids); both normalize to captioned items. Image paths
// are shared references — any cross-locale divergence aborts via
// `sharedValue` instead of silently dropping one locale's media.
function galleryBuild(presentation) {
	return (en, sw, where) => {
		const enItems = en.items ?? [];
		const swItems = sw.items ?? [];
		if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
			gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
		}
		return {
			tag: { en: optText(en.tag), sw: optText(sw.tag) },
			headline: { en: optText(en.headline), sw: optText(sw.headline) },
			description: { en: optText(en.description), sw: optText(sw.description) },
			items: enItems.map((item, i) => {
				const swItem = swItems[i];
				if (typeof item === "string" || typeof swItem === "string") {
					if (item !== swItem) {
						gap(where, `items[${i}] diverged (en=${JSON.stringify(item)} sw=${JSON.stringify(swItem)})`);
					}
					return {
						image: typeof item === "string" ? item : "",
						title: emptyPair(),
						label: emptyPair(),
						description: emptyPair(),
					};
				}
				if (item.image !== undefined || swItem?.image !== undefined) {
					sharedValue(item, swItem, "image", `${where}.items[${i}]`);
				}
				return {
					image: typeof item.image === "string" ? item.image : "",
					title: { en: optText(item.title), sw: optText(swItem?.title) },
					label: { en: optText(item.label), sw: optText(swItem?.label) },
					description: { en: optText(item.description), sw: optText(swItem?.description) },
				};
			}),
			...presentation,
			id: "",
		};
	};
}

// M7 batch 5: generic `introText` builder. Presentation props (tone, align,
// split) are wrapper hardcodes — passed in, never read from content.
// `ctaKey` names an optional `{label, href, icon?}` action object merged by
// wrappers like sectional IntroSection (absent → hidden CTA).
function introTextBuild(presentation, ctaKey = null) {
	return (en, sw, where) => ({
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		...presentation,
		cta:
			ctaKey && (en[ctaKey] || sw[ctaKey])
				? {
						label: { en: reqText(en[ctaKey]?.label, `${where}.${ctaKey}.label.en`), sw: reqText(sw[ctaKey]?.label, `${where}.${ctaKey}.label.sw`) },
						href: sharedValue(en[ctaKey], sw[ctaKey], "href", `${where}.${ctaKey}`) ?? "",
						icon: sharedValue(en[ctaKey], sw[ctaKey], "icon", `${where}.${ctaKey}`) ?? "",
					}
				: { label: emptyPair(), href: "", icon: "" },
		id: "",
	});
}

// M7 batch 5: `cost`-shaped namespaces (factors + influences cards and a
// price band) → `pricing`. Bullet counts must match across locales; card
// titles fall back to "" (the component tolerates untitled cards).
function pricingBuild(en, sw, where) {
	const enFactors = en.factors ?? [];
	const swFactors = sw.factors ?? [];
	const enInfluences = en.influences ?? [];
	const swInfluences = sw.influences ?? [];
	if (!Array.isArray(swFactors) || swFactors.length !== enFactors.length) {
		gap(where, `factor count diverged (en=${enFactors.length} sw=${swFactors?.length})`);
	}
	if (!Array.isArray(swInfluences) || swInfluences.length !== enInfluences.length) {
		gap(where, `influence count diverged (en=${enInfluences.length} sw=${swInfluences?.length})`);
	}
	const bullets = (enList, swList, key) =>
		enList.map((bullet, i) => ({
			en: reqText(bullet, `${where}.${key}[${i}].en`),
			sw: reqText(swList[i], `${where}.${key}[${i}].sw`),
		}));
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		cards: [
			{
				title: { en: optText(en.factorsTitle), sw: optText(sw.factorsTitle) },
				items: bullets(enFactors, swFactors, "factors"),
			},
			{
				title: { en: optText(en.influencesTitle), sw: optText(sw.influencesTitle) },
				items: bullets(enInfluences, swInfluences, "influences"),
			},
		],
		price: {
			label: { en: optText(en.priceRangeTitle), sw: optText(sw.priceRangeTitle) },
			value: { en: reqText(en.priceRange, `${where}.priceRange.en`), sw: reqText(sw.priceRange, `${where}.priceRange.sw`) },
			note: { en: optText(en.priceRangeNote), sw: optText(sw.priceRangeNote) },
		},
		id: "",
	};
}

const PAGES = {
	"company-profile": {
		namespace: "company-profile",
		title: "Company Profile",
		// companyProfileView (bespoke PDF viewer: DeferredMount + iframe, no
		// shared equivalent) is intentionally NOT migrated — see M4 log.
		skipped: ["companyProfileView"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: CompanyProfileHero → <Hero data={t(ns:hero)} />
				build(en, sw, where) {
					return {
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: "",
						layout: sharedValue(en, sw, "layout", where),
						frame: false,
						scrollCue: false,
						cueLabel: emptyPair(),
						footnoteItems: [],
						ctaPrimary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
						},
						ctaSecondary: { label: emptyPair(), href: "", icon: "" },
						id: "",
					};
				},
			},
			{
				discriminant: "stats",
				from: "stats",
				// Legacy: CompanyStatsStrip → <Stats items layout="panel" />
				build(en, sw, where) {
					const items = en.items ?? [];
					if (!Array.isArray(sw.items) || sw.items.length !== items.length) {
						gap(where, `item count diverged (en=${items.length} sw=${sw.items?.length})`);
					}
					return {
						tag: emptyPair(),
						headline: emptyPair(),
						description: emptyPair(),
						items: items.map((item, i) => ({
							value: { en: reqText(item.value, `${where}.items[${i}].value.en`), sw: reqText(sw.items?.[i]?.value, `${where}.items[${i}].value.sw`) },
							label: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(sw.items?.[i]?.label, `${where}.items[${i}].label.sw`) },
							description: emptyPair(),
							icon: sharedValue(item, sw.items?.[i], "icon", `${where}.items[${i}]`) ?? "",
						})),
						layout: "panel",
						tone: "default",
						columns: 3,
						id: "",
					};
				},
			},
			{
				discriminant: "splitMedia",
				from: "about",
				// Legacy: CompanyAboutSection → <SplitMedia data imagePosition="right" mediaAspect="aspect-square" />
				build(en, sw, where) {
					const enPoints = en.points ?? [];
					const swPoints = sw.points ?? [];
					if (enPoints.length !== swPoints.length) {
						gap(where, `point count diverged (en=${enPoints.length} sw=${swPoints.length})`);
					}
					return {
						tag: { en: reqText(en.tag, `${where}.tag.en`), sw: reqText(sw.tag, `${where}.tag.sw`) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						// Media diverges per locale by editorial intent — kept per-locale.
						image: { en: optText(en.image), sw: optText(sw.image) },
						points: enPoints.map((point, i) => ({
							en: reqText(point, `${where}.points[${i}].en`),
							sw: reqText(swPoints[i], `${where}.points[${i}].sw`),
						})),
						imagePosition: "right",
						tone: "default",
						mediaAspect: "square",
						mediaFit: "cover",
						id: "",
					};
				},
			},
			{
				discriminant: "cardGrid",
				from: "missionVision",
				// Legacy: MissionVision → <CardGrid columns={3} align="center" tone="surface" card={{density:"roomy",iconSize:"lg"}} />
				build: cardGridBuild({ columns: "3", align: "center", tone: "surface", headerRow: false, cardDensity: "roomy", cardIconSize: "lg" }),
			},
			{
				discriminant: "cardGrid",
				from: "services",
				// Legacy: Services → <CardGrid columns={3} headerRow card={{iconSize:"lg"}} /> (align/tone/density unset)
				build: cardGridBuild({ columns: "3", align: "left", tone: "default", headerRow: true, cardDensity: "comfortable", cardIconSize: "lg" }),
			},
			{
				discriminant: "cardGrid",
				from: "whyUs",
				// Legacy: WhyUs → <CardGrid columns={3} tone="surface" card={{iconSize:"lg"}} />
				build: cardGridBuild({ columns: "3", align: "left", tone: "surface", headerRow: false, cardDensity: "comfortable", cardIconSize: "lg" }),
			},
		],
	},
	// M7 batch 1: legal pages. The whole namespace migrates as one `legal`
	// section (from: null = whole-file mapping); the legacy route passes
	// `t(ns:misc.*)` header props + `t(ns:articles)` into LegalPageSection.
	"privacy-policy": {
		namespace: "privacy",
		title: "Privacy Policy",
		wholeFile: true,
		sections: [{ discriminant: "legal", from: null, build: legalBuild("privacy_policy") }],
	},
	"terms-of-use": {
		namespace: "terms",
		title: "Terms of Use",
		wholeFile: true,
		sections: [{ discriminant: "legal", from: null, build: legalBuild("terms_of_use") }],
	},
	// M7 batch 2: contact. Only `talkToUs` renders through a shared section
	// (TalkToUsSection → <CardGrid columns={3} headerRow /> with align/tone/
	// card unset, i.e. component defaults). The bespoke hero, offices map,
	// and Formspree form stay legacy (hybrid tails). `opportunities`,
	// `direct_contacts`, `site_visit` and `faq` are unrendered in `src` and
	// `social` is footer-owned → OUT OF SCOPE, never migrated.
	"contact": {
		namespace: "contact",
		title: "Contact",
		skipped: ["hero", "offices", "contact_reasons", "form", "opportunities", "direct_contacts", "site_visit", "faq", "social"],
		sections: [
			{
				discriminant: "cardGrid",
				from: "talkToUs",
				// Legacy: TalkToUsSection → <CardGrid columns={3} headerRow />
				build: talkToUsBuild({ columns: "3", align: "left", tone: "default", headerRow: true, cardDensity: "comfortable", cardIconSize: "md" }),
			},
		],
	},
	// M7 batch 2: careers. Only `hero` migrates (CareersHeroSection → shared
	// <Hero>, `banner` layout; the scroll-cue label is merged from
	// `common:misc.openRoles` at render time, so the mapping reads it from
	// the `extra.common` namespaces). LeadGenBar (`home` ns) and
	// ServicesSection (`common` ns) are global components; CurrentOpenings
	// (TOR modal + deadline logic), ApplicationProcess (`<bold>`
	// pseudo-markup the shared IntroTextSection would render literally) and
	// the equal-opportunity statement stay legacy bespoke tails.
	"careers": {
		namespace: "careers",
		title: "Careers",
		skipped: ["currentOpenings", "applicationProcess", "statement"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: CareersHeroSection → <Hero data={{ ...t(hero), cueLabel: t("common:misc.openRoles") }} />
				build(en, sw, where, siteTitle, extra) {
					return {
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: "",
						layout: sharedValue(en, sw, "layout", where),
						frame: false,
						scrollCue: false,
						cueLabel: {
							en: reqText(extra?.common?.en?.misc?.openRoles, `${where}.cueLabel.en (common:misc.openRoles)`),
							sw: reqText(extra?.common?.sw?.misc?.openRoles, `${where}.cueLabel.sw (common:misc.openRoles)`),
						},
						footnoteItems: [],
						ctaPrimary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
						},
						ctaSecondary: { label: emptyPair(), href: "", icon: "" },
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 3: about. Seven sections migrate in page order — `hero`,
	// `ourStory` (splitMedia), four `gallery` sections, `whyChooseSmartGrid`
	// (cardGrid) — interleaved with three legacy tails (see route wiring):
	// AerialSurveyingSection (popup modal + fallback icons: cardGrid v2
	// models neither), LandSurveyingSection (`<primary>` inline markup +
	// `itemsTitle`: no cardGrid equivalent), ImpactAcrossAfricaSection
	// (client-only ProjectsGlobe, never a registry branch).
	"about": {
		namespace: "about",
		title: "About",
		skipped: ["aerialSurveying", "landSurveying", "impactAcrossAfrica"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: HeroSection → <Hero data={t(about:hero)} /> (default
				// bottom layout; no layout key, cueLabel, footnotes or frame).
				build(en, sw, where) {
					return {
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: sharedValue(en, sw, "image", where) ?? "",
						layout: sharedValue(en, sw, "layout", where) ?? "bottom",
						frame: false,
						scrollCue: false,
						cueLabel: emptyPair(),
						footnoteItems: [],
						ctaPrimary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
						},
						ctaSecondary: { label: emptyPair(), href: "", icon: "" },
						id: "",
					};
				},
			},
			{
				discriminant: "splitMedia",
				from: "ourStory",
				// Legacy: OurStorySection → <SplitMedia data imagePosition="left" mediaAspect="aspect-square" mediaFit="contain" /> (no points).
				build(en, sw, where) {
					return {
						tag: { en: reqText(en.tag, `${where}.tag.en`), sw: reqText(sw.tag, `${where}.tag.sw`) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						// Media is per-locale by contract (no divergence in
						// this namespace today, but never coerced to shared).
						image: { en: optText(en.image), sw: optText(sw.image) },
						points: [],
						imagePosition: "left",
						tone: "default",
						mediaAspect: "square",
						mediaFit: "contain",
						id: "",
					};
				},
			},
			{
				discriminant: "gallery",
				from: "servicesByImages",
				// Legacy: ServicesByImagesSection → <Gallery layout="overlay" columns={4} />
				build: galleryBuild({ layout: "overlay", columns: "4", tone: "default" }),
			},
			{
				discriminant: "gallery",
				from: "dronePhotographyimageSlider",
				// Legacy: DronePhotographyImageSliderSection → <Gallery layout="slider" tone="surface" /> (columns unset = 3)
				build: galleryBuild({ layout: "slider", columns: "3", tone: "surface" }),
			},
			{
				discriminant: "gallery",
				from: "landSurveyingImages",
				// Legacy: LandSurveyingImagesSection → <Gallery layout="overlay" columns={4} />
				build: galleryBuild({ layout: "overlay", columns: "4", tone: "default" }),
			},
			{
				discriminant: "cardGrid",
				from: "whyChooseSmartGrid",
				// Legacy: WhyChooseSmartGridSection → <CardGrid columns={5} align="center" /> (tone/card unset = defaults)
				build: cardGridBuild({ columns: "5", align: "center", tone: "default", headerRow: false, cardDensity: "comfortable", cardIconSize: "md" }),
			},
			{
				discriminant: "gallery",
				from: "projectsCompletedImagesMasonry",
				// Legacy: ProjectsCompletedImagesMasonrySection → <Gallery layout="masonry" columns={3} tone="surface" />
				build: galleryBuild({ layout: "masonry", columns: "3", tone: "surface" }),
			},
		],
	},
	// M7 batch 4: hubs. `surveying` migrates its hero (shared Hero, centered
	// framed variant — layout/frame/scrollCue travel in content); its services
	// (lead map image BELOW the grid), process (indexed/watermarked cards) and
	// deliverables (ns-driven explorer) stay legacy. `civil` migrates its
	// services cardGrid; its bespoke diagonal hero, image stepper process and
	// deliverables explorer stay legacy. `aerial-drones/landing` has NO shared
	// section usage (bespoke hero, popup cards, fleet, tiles, globe, photo
	// section) — deferred until new sections are registered.
	"surveying": {
		namespace: "surveying/landing",
		title: "Surveying",
		skipped: ["services", "process", "deliverables"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: SurveyingHeroSection → <Hero data={t(hero)} />
				build(en, sw, where) {
					return {
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: sharedValue(en, sw, "image", where) ?? "",
						layout: sharedValue(en, sw, "layout", where) ?? "bottom",
						frame: sharedValue(en, sw, "frame", where) ?? false,
						scrollCue: sharedValue(en, sw, "scrollCue", where) ?? false,
						cueLabel: emptyPair(),
						footnoteItems: [],
						ctaPrimary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
						},
						ctaSecondary: { label: emptyPair(), href: "", icon: "" },
						id: "",
					};
				},
			},
		],
	},
	"civil": {
		namespace: "civil/landing",
		title: "Civil",
		skipped: ["hero", "process", "deliverables"],
		sections: [
			{
				discriminant: "cardGrid",
				from: "services",
				// Legacy: CivilServicesSection → <CardGrid columns={3} tone="surface" /> (align/card unset = defaults)
				build: cardGridBuild({ columns: "3", align: "left", tone: "surface", headerRow: false, cardDensity: "comfortable", cardIconSize: "md" }),
			},
		],
	},
	// M7 batch 5: topographical-surveys pilot (first child page). Four sections
	// migrate in page order — `hero` (v2 pill overrides), `whatIs` + `section1`
	// (introText, split hardcoded per wrapper), `cost` (pricing) — interleaved
	// with seven legacy tails (see route wiring): five cardGrids using
	// non-contract props (`subItems`/`wide`, `indexed` numbering,
	// `mediaBadged`/`variant`/`mediaPosition` media cards, `fallbackIcons`, JSX
	// `headerEnd`), the deliverables explorer, and the bespoke sample-map split.
	"topographical-surveys": {
		namespace: "surveying/topographical-surveys",
		title: "Topographical Surveys",
		skipped: ["whenYouNeed", "whatYouGet", "whatWeOffer", "detailedTopographicalSurveys", "sampleTopographicalMap", "surveyingInstruments", "whyConductSurvey"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: TopographicalHeroSection → <Hero data={t(hero)} />
				// (default bottom layout; `subTitle` is unrendered by Hero and
				// not migrated). Pill overrides travel as shared values.
				build(en, sw, where) {
					return {
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: sharedValue(en, sw, "image", where) ?? "",
						layout: sharedValue(en, sw, "layout", where) ?? "bottom",
						frame: sharedValue(en, sw, "frame", where) ?? false,
						scrollCue: sharedValue(en, sw, "scrollCue", where) ?? false,
						cueLabel: emptyPair(),
						footnoteItems: [],
						ctaPrimary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
							iconPosition: sharedValue(en.ctaPrimary, sw.ctaPrimary, "iconPosition", where) ?? "end",
							trailingArrow: (() => {
								const arrow = sharedValue(en.ctaPrimary, sw.ctaPrimary, "trailingArrow", where);
								return arrow === true ? "show" : arrow === false ? "hide" : "auto";
							})(),
						},
						ctaSecondary: { label: emptyPair(), href: "", icon: "" },
						id: "",
					};
				},
			},
			{
				discriminant: "introText",
				from: "whatIs",
				// Legacy: WhatIsTopographicalSection → <IntroTextSection ... /> (all defaults)
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "pricing",
				from: "cost",
				// Legacy: TopographicalCostSection → <Pricing cards price /> (see pricingBuild)
				build: pricingBuild,
			},
			{
				discriminant: "introText",
				from: "section1",
				// Legacy: IntroSection → <IntroTextSection ... split /> (split hardcoded; the content `split` key is not read)
				build: introTextBuild({ tone: "default", align: "left", split: true }),
			},
		],
	},
	// M7 batch 6: sectional-properties. Five sections migrate in page order —
	// `hero`, `section1` (introText with CTA), `sectionalServices` (gallery),
	// `faq` (q/a/b keys), `registrationCta` (first ctaBand migration) —
	// interleaved with six legacy tails (see route wiring): WhatIs (bespoke),
	// sectionalPropertyServices + whoNeeds (non-contract cardGrid props:
	// `indexed`, `fallbackIcons`, `hoverArrow`, `headerAlign`, per-card footer
	// links), ProcessSection + TimelineSection (WorkflowSection / timeline
	// variant: neither registered), SectionalDeliverablesSection (explorer).
	// `socials` is commented out of the route — dead, never migrated.
	"sectional-properties": {
		namespace: "surveying/sectional-properties",
		title: "Sectional Properties",
		skipped: ["whatIs", "sectionalPropertyServices", "process", "deliverables", "whoNeeds", "timeline", "socials"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: SectionalHeroSection → <Hero data={t(hero)} />
				// (default bottom layout; no title key — the h1 falls back to
				// description exactly as in legacy).
				build(en, sw, where) {
					return {
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						title: { en: optText(en.title), sw: optText(sw.title) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: sharedValue(en, sw, "image", where) ?? "",
						layout: sharedValue(en, sw, "layout", where) ?? "bottom",
						frame: sharedValue(en, sw, "frame", where) ?? false,
						scrollCue: sharedValue(en, sw, "scrollCue", where) ?? false,
						cueLabel: emptyPair(),
						footnoteItems: [],
						ctaPrimary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
							iconPosition: sharedValue(en.ctaPrimary, sw.ctaPrimary, "iconPosition", where) ?? "end",
							trailingArrow: (() => {
								const arrow = sharedValue(en.ctaPrimary, sw.ctaPrimary, "trailingArrow", where);
								return arrow === true ? "show" : arrow === false ? "hide" : "auto";
							})(),
						},
						ctaSecondary: {
							label: { en: reqText(en.ctaSecondary?.label, `${where}.ctaSecondary.label.en`), sw: reqText(sw.ctaSecondary?.label, `${where}.ctaSecondary.label.sw`) },
							href: sharedValue(en.ctaSecondary, sw.ctaSecondary, "href", where) ?? "",
							icon: sharedValue(en.ctaSecondary, sw.ctaSecondary, "icon", where) ?? "",
						},
						id: "",
					};
				},
			},
			{
				discriminant: "introText",
				from: "section1",
				// Legacy: IntroSection → <IntroTextSection ... cta={ctaPrimary} /> (all defaults + pill CTA)
				build: introTextBuild({ tone: "default", align: "left", split: false }, "ctaPrimary"),
			},
			{
				discriminant: "gallery",
				from: "sectionalServices",
				// Legacy: ServicesImageSection → <Gallery columns={4} /> (layout/tone unset = grid/default)
				build: galleryBuild({ layout: "grid", columns: "4", tone: "default" }),
			},
			{
				discriminant: "faq",
				from: "faq",
				// Legacy: SectionalFaqSection → <SharedFaq tag headline items />
				// with q/a/b keys mapped to question/answer/points (no icons,
				// no still-curious card).
				build(en, sw, where) {
					const enItems = en.items ?? [];
					const swItems = sw.items ?? [];
					if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
						gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
					}
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: emptyPair(),
						items: enItems.map((item, i) => {
							const swItem = swItems[i] ?? {};
							const enPoints = item.b ?? [];
							const swPoints = swItem.b ?? [];
							if (!Array.isArray(swPoints) || swPoints.length !== enPoints.length) {
								gap(where, `items[${i}] point count diverged (en=${enPoints.length} sw=${swPoints?.length})`);
							}
							return {
								question: { en: reqText(item.q, `${where}.items[${i}].q.en`), sw: reqText(swItem.q, `${where}.items[${i}].q.sw`) },
								answer: { en: reqText(item.a, `${where}.items[${i}].a.en`), sw: reqText(swItem.a, `${where}.items[${i}].a.sw`) },
								points: enPoints.map((point, j) => ({
									en: reqText(point, `${where}.items[${i}].b[${j}].en`),
									sw: reqText(swPoints[j], `${where}.items[${i}].b[${j}].sw`),
								})),
								icon: "",
							};
						}),
						stillCuriousLabel: emptyPair(),
						stillCuriousDescription: emptyPair(),
						stillCuriousCta: { label: emptyPair(), href: "", icon: "" },
						id: "",
					};
				},
			},
			{
				discriminant: "ctaBand",
				from: "registrationCta",
				// Legacy: RegistrationCtaSection → <CtaBand ... /> (layout /
				// variant / decor unset = centered / panel / glow). First
				// ctaBand migration; watermark travels as a shared token.
				build(en, sw, where) {
					const action = (node, swNode, key) => ({
						label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
						href: sharedValue(node, swNode, "href", `${where}.${key}`) ?? "",
						icon: sharedValue(node, swNode, "icon", `${where}.${key}`) ?? "",
					});
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						primary: action(en.primary, sw.primary, "primary"),
						secondary: action(en.secondary, sw.secondary, "secondary"),
						layout: "centered",
						variant: "panel",
						decor: "glow",
						watermark: sharedValue(en, sw, "watermark", where) ?? "",
						images: [],
						shimmer: false,
						hairline: false,
						id: "",
					};
				},
			},
		],
	},
};

function loadNamespace(locale, namespace) {
	return JSON.parse(readFileSync(join(ROOT, "public", "locales", locale, `${namespace}.json`), "utf8"));
}

function loadCommon(locale) {
	try {
		return JSON.parse(readFileSync(join(ROOT, "public", "locales", locale, "common.json"), "utf8"));
	} catch {
		return {};
	}
}

function loadSiteTitle(locale) {
	try {
		const meta = JSON.parse(readFileSync(join(ROOT, "public", "locales", locale, "meta.json"), "utf8"));
		const title = meta?.site?.title;
		return typeof title === "string" && title ? title : "";
	} catch {
		return "";
	}
}

function stripInternalKeys(value) {
	if (Array.isArray(value)) return value.map(stripInternalKeys);
	if (value !== null && typeof value === "object") {
		const out = {};
		for (const [key, entry] of Object.entries(value)) {
			if (key === "_pageTitle") continue;
			out[key] = stripInternalKeys(entry);
		}
		return out;
	}
	return value;
}

function generate(pageSlug) {
	const mapping = PAGES[pageSlug];
	if (!mapping) throw new Error(`No migration mapping for page ${JSON.stringify(pageSlug)}.`);
	gaps.length = 0;
	const en = loadNamespace("en", mapping.namespace);
	const sw = loadNamespace("sw", mapping.namespace);
	const siteTitle = { en: loadSiteTitle("en"), sw: loadSiteTitle("sw") };
	// Cross-namespace content merged at render time (e.g. careers:hero
	// cueLabel from common:misc.openRoles). Passed as the 5th build arg;
	// existing 4-arg builds ignore it.
	const extra = { common: { en: loadCommon("en"), sw: loadCommon("sw") } };
	const pageBuilder = mapping.sections.map(({ discriminant, from, build }) => {
		if (from === null) {
			// Whole-file mapping (legal pages): the namespace root IS the section.
			return { discriminant, value: stripInternalKeys(build(en, sw, mapping.namespace, siteTitle, extra)) };
		}
		if (!(from in en) || !(from in sw)) {
			gap(from, "section key missing in one locale");
			return { discriminant, value: {} };
		}
		return { discriminant, value: stripInternalKeys(build(en[from], sw[from], from, siteTitle, extra)) };
	});
	return {
		entry: {
			slug: mapping.title,
			title: `${mapping.title} (migrated)`,
			status: "draft",
			pageBuilder,
		},
	};
}

function serialize(entry) {
	return JSON.stringify(entry, null, "\t") + "\n";
}

function main() {
	const pageIndex = process.argv.indexOf("--page");
	const page = pageIndex === -1 ? undefined : process.argv[pageIndex + 1];
	const mode = process.argv.includes("--write") ? "write" : process.argv.includes("--verify") ? "verify" : undefined;
	if (!page || !mode) {
		console.error("Usage: node scripts/migrate-locale-to-keystatic.mjs --page <slug> (--write|--verify)");
		process.exit(2);
	}
	let generated;
	try {
		generated = generate(page).entry;
	} catch (err) {
		console.error(`FAIL ${err.message}`);
		process.exit(1);
	}
	if (gaps.length > 0) {
		for (const message of gaps) console.error(`FAIL ${message}`);
		console.error(`\n${gaps.length} completeness gap(s) — migration aborted, no silent fallback.`);
		process.exit(1);
	}
	const dest = join(ROOT, "content", "pages", `${page}.json`);
	if (mode === "write") {
		writeFileSync(dest, serialize(generated));
		console.log(`Wrote ${dest} (${generated.pageBuilder.length} sections).`);
		return;
	}
	let onDisk;
	try {
		onDisk = readFileSync(dest, "utf8").replace(/\r\n/g, "\n");
	} catch {
		console.error(`FAIL ${dest} does not exist — run with --write first.`);
		process.exit(1);
	}
	// The committed pilot entry was published by hand after generation (M4
	// status log); the generator always emits `draft`. Compare with the status
	// normalized so `--verify` pins content equality, not the publish flip.
	const generatedJson = serialize(generated);
	try {
		const onDiskEntry = JSON.parse(onDisk);
		const generatedEntry = JSON.parse(generatedJson);
		if (
			JSON.stringify({ ...onDiskEntry, status: "draft" }) ===
			JSON.stringify({ ...generatedEntry, status: "draft" })
		) {
			console.log(`OK ${page}: checked-in entry equals repeatable migration output (${generated.pageBuilder.length} sections, no gaps).`);
			return;
		}
	} catch {
		// Fall through to the byte-compare diagnostic below.
	}
	if (onDisk !== generatedJson) {
		console.error(`FAIL ${dest} differs from repeatable output — re-run with --write and inspect the diff.`);
		process.exit(1);
	}
	console.log(`OK ${page}: checked-in entry equals repeatable migration output (${generated.pageBuilder.length} sections, no gaps).`);
}

main();
