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

// M8 (home shared sections, 2026-09-16): `trustees` logo wall. Legacy
// `common:trustees` holds `{tag?, headline?, items: [{label, logoUrl}]}`.
// Labels are localized free text; `logoUrl` is a shared `/public` reference
// (identical in en/sw — any divergence aborts via `sharedValue`).
function trusteesBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: optText(en.headline), sw: optText(sw.headline) },
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				label: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(swItem.label, `${where}.items[${i}].label.sw`) },
				logoUrl: sharedValue(item, swItem, "logoUrl", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

// M8 continued (2026-09-17): `certifications` badge grid. Legacy
// `common:certifications` holds `{tag?, headline?, description?, items:
// [{icon?, name, label}]}`. `name` (ISK/NEMA/…) is a shared literal
// identical in en/sw — any divergence aborts via `sharedValue`; `label`
// is localized free text; `icon` is an optional shared MDI slug (null in
// legacy content → stored as "").
function certificationsBuild(en, sw, where) {
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
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				name: sharedValue(item, swItem, "name", `${where}.items[${i}]`) ?? "",
				label: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(swItem.label, `${where}.items[${i}].label.sw`) },
			};
		}),
		id: "",
	};
}

// M8 continued (2026-09-17): `keyFacts` panel. Legacy `common:keyFacts`
// holds `{tag?, headline?, description?, items: [{icon?, label,
// description}]}`. `icon` is a shared MDI slug (identical in en/sw — any
// divergence aborts via `sharedValue`; the component falls back to a
// positional icon when empty); `label`/`description` are localized.
function keyFactsBuild(en, sw, where) {
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
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				label: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(swItem.label, `${where}.items[${i}].label.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
			};
		}),
		id: "",
	};
}

// M8 batch A (2026-09-17): `whyChooseUs` sticky list. Legacy
// `common:whyChooseUs` holds `{tag?, headline?, description?, items:
// [{icon?, name, label, description}]}`. `icon` is shared; `name` is a
// shared literal (identical camelCase eyebrow keys in en/sw — any
// divergence aborts via `sharedValue`); `label`/`description` are
// localized.
function whyChooseUsBuild(en, sw, where) {
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
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				name: sharedValue(item, swItem, "name", `${where}.items[${i}]`) ?? "",
				label: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(swItem.label, `${where}.items[${i}].label.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
			};
		}),
		id: "",
	};
}

// M8 batch B (2026-09-17): `about` narrative split. Legacy `common:about`
// holds `{tag?, headline, description?, whoWeAre{title,description},
// mission{title,description}, featureImg{url,alt,caption,title,description},
// cards[{icon?,href,label,description}]}`. `url`, `icon` and `href` are
// shared (`sharedValue` gate); every other string is localized.
function aboutBuild(en, sw, where) {
	const enCards = en.cards ?? [];
	const swCards = sw.cards ?? [];
	if (!Array.isArray(swCards) || swCards.length !== enCards.length) {
		gap(where, `card count diverged (en=${enCards.length} sw=${swCards?.length})`);
	}
	const block = (node, swNode) => ({
		title: { en: optText(node?.title), sw: optText(swNode?.title) },
		description: { en: optText(node?.description), sw: optText(swNode?.description) },
	});
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		whoWeAre: block(en.whoWeAre, sw.whoWeAre),
		mission: block(en.mission, sw.mission),
		featureImg: {
			url: sharedValue(en.featureImg, sw.featureImg, "url", `${where}.featureImg`) ?? "",
			alt: { en: optText(en.featureImg?.alt), sw: optText(sw.featureImg?.alt) },
			caption: { en: optText(en.featureImg?.caption), sw: optText(sw.featureImg?.caption) },
			title: { en: optText(en.featureImg?.title), sw: optText(sw.featureImg?.title) },
			description: { en: optText(en.featureImg?.description), sw: optText(sw.featureImg?.description) },
		},
		cards: enCards.map((card, i) => {
			const swCard = swCards[i] ?? {};
			return {
				icon: sharedValue(card, swCard, "icon", `${where}.cards[${i}]`) ?? "",
				href: sharedValue(card, swCard, "href", `${where}.cards[${i}]`) ?? "",
				label: { en: reqText(card.label, `${where}.cards[${i}].label.en`), sw: reqText(swCard.label, `${where}.cards[${i}].label.sw`) },
				description: { en: reqText(card.description, `${where}.cards[${i}].description.en`), sw: reqText(swCard.description, `${where}.cards[${i}].description.sw`) },
			};
		}),
		id: "",
	};
}

// M8 batch B (2026-09-17): `surveyingInstruments` image grid. Legacy
// `common:surveyingInstruments` holds `{tag?, headline?, description?,
// items[{label, img, href?}]}`. `img`/`href` are shared (`sharedValue`
// gate); `label` is localized.
function surveyingInstrumentsBuild(en, sw, where) {
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
			const swItem = swItems[i] ?? {};
			return {
				label: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(swItem.label, `${where}.items[${i}].label.sw`) },
				img: sharedValue(item, swItem, "img", `${where}.items[${i}]`) ?? "",
				href: sharedValue(item, swItem, "href", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

// M9 follow-up batch F (2026-09-17): `services` tabbed explorer. Legacy
// content is `common:services` (`{tag?, headline, items: [{icon, label,
// description, whatWeOffer{label, description?, items[(string |
// {label,href})]}, deliverables{label?, liveLabel?, description?,
// checks[], items[{title, format?, icon?, image?, description}]}]}`).
// `icon`s, offer `href`s and deliverable `image`s are shared; everything
// else is localized. String offers migrate to `{label, href: ""}` objects
// (the component renders both identically). NOTE: tag/headline come from
// `common:services` — the component's legacy `home:services.*` lookup
// addresses keys that no longer exist, so the Keystatic branch visibly
// fixes the header (recorded in the plan).
function servicesBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			const scope = `${where}.items[${i}]`;
			const enOffers = item.whatWeOffer?.items ?? [];
			const swOffers = swItem.whatWeOffer?.items ?? [];
			if (!Array.isArray(swOffers) || swOffers.length !== enOffers.length) {
				gap(scope, `offer count diverged (en=${enOffers.length} sw=${swOffers?.length})`);
			}
			const enDels = item.deliverables?.items ?? [];
			const swDels = swItem.deliverables?.items ?? [];
			if (!Array.isArray(swDels) || swDels.length !== enDels.length) {
				gap(scope, `deliverable count diverged (en=${enDels.length} sw=${swDels?.length})`);
			}
			const enChecks = item.deliverables?.checks ?? [];
			const swChecks = swItem.deliverables?.checks ?? [];
			if (!Array.isArray(swChecks) || swChecks.length !== enChecks.length) {
				gap(scope, `check count diverged (en=${enChecks.length} sw=${swChecks?.length})`);
			}
			return {
				icon: sharedValue(item, swItem, "icon", scope) ?? "",
				label: { en: reqText(item.label, `${scope}.label.en`), sw: reqText(swItem.label, `${scope}.label.sw`) },
				description: { en: reqText(item.description, `${scope}.description.en`), sw: reqText(swItem.description, `${scope}.description.sw`) },
				whatWeOffer: {
					label: { en: reqText(item.whatWeOffer?.label, `${scope}.whatWeOffer.label.en`), sw: reqText(swItem.whatWeOffer?.label, `${scope}.whatWeOffer.label.sw`) },
					description: { en: optText(item.whatWeOffer?.description), sw: optText(swItem.whatWeOffer?.description) },
					items: enOffers.map((offer, j) => {
						const swOffer = swOffers[j] ?? {};
						const enObj = typeof offer === "string" ? { label: offer } : offer;
						const swObj = typeof swOffer === "string" ? { label: swOffer } : swOffer;
						return {
							label: { en: reqText(enObj.label, `${scope}.whatWeOffer.items[${j}].label.en`), sw: reqText(swObj.label, `${scope}.whatWeOffer.items[${j}].label.sw`) },
							href: sharedValue(enObj, swObj, "href", `${scope}.whatWeOffer.items[${j}]`) ?? "",
						};
					}),
				},
				deliverables: {
					label: { en: optText(item.deliverables?.label), sw: optText(swItem.deliverables?.label) },
					liveLabel: { en: optText(item.deliverables?.liveLabel), sw: optText(swItem.deliverables?.liveLabel) },
					description: { en: optText(item.deliverables?.description), sw: optText(swItem.deliverables?.description) },
					checks: enChecks.map((check, j) => ({
						en: reqText(check, `${scope}.deliverables.checks[${j}].en`),
						sw: reqText(swChecks[j], `${scope}.deliverables.checks[${j}].sw`),
					})),
					items: enDels.map((del, j) => {
						const swDel = swDels[j] ?? {};
						const dscope = `${scope}.deliverables.items[${j}]`;
						return {
							title: { en: reqText(del.title, `${dscope}.title.en`), sw: reqText(swDel.title, `${dscope}.title.sw`) },
							format: { en: optText(del.format), sw: optText(swDel.format) },
							icon: sharedValue(del, swDel, "icon", dscope) ?? "",
							image: sharedValue(del, swDel, "image", dscope) ?? "",
							description: { en: reqText(del.description, `${dscope}.description.en`), sw: reqText(swDel.description, `${dscope}.description.sw`) },
						};
					}),
				},
			};
		}),
		id: "",
	};
}

// M8 batch C (2026-09-17): `coreExpertise` indexed grid. Legacy
// `common:coreExpertise` holds `{tag?, headline, description?, items:
// [{icon?, label, description, href?}]}`. `icon`/`href` are shared
// (`sharedValue` gate — hrefs are locale-identical route paths);
// `label`/`description` are localized.
function coreExpertiseBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				label: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(swItem.label, `${where}.items[${i}].label.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
				href: sharedValue(item, swItem, "href", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

// M8 batch C (2026-09-17): `planningInfographic` benefits grid. Legacy
// `common:planningInfographic` holds `{tag?, headline, description?,
// benefits[{icon, label, description?}], closingStatement?}`. `icon` is
// shared; `label`/`description`/`closingStatement` are localized.
// `closingStatement` migrates verbatim as a VISIBILITY GATE — the component
// renders the statement text via `<Trans>` from locale JSON, so the stored
// value keeps the block visible without claiming editable text.
function planningInfographicBuild(en, sw, where) {
	const enBenefits = en.benefits ?? [];
	const swBenefits = sw.benefits ?? [];
	if (!Array.isArray(swBenefits) || swBenefits.length !== enBenefits.length) {
		gap(where, `benefit count diverged (en=${enBenefits.length} sw=${swBenefits?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		benefits: enBenefits.map((benefit, i) => {
			const swBenefit = swBenefits[i] ?? {};
			return {
				icon: sharedValue(benefit, swBenefit, "icon", `${where}.benefits[${i}]`) ?? "",
				label: { en: reqText(benefit.label, `${where}.benefits[${i}].label.en`), sw: reqText(swBenefit.label, `${where}.benefits[${i}].label.sw`) },
				description: { en: optText(benefit.description), sw: optText(swBenefit.description) },
			};
		}),
		closingStatement: { en: optText(en.closingStatement), sw: optText(sw.closingStatement) },
		id: "",
	};
}

// M8 batch D (2026-09-17): `coverageArea` region section. Legacy
// `common:coverageArea` holds `{tag?, headline, description?, hqPin?,
// stats[{icon, value, suffix, label}], groups[{icon, label, description,
// items[]}], note?}`. `icon`/`value`/`suffix` are shared (numbers and `+`
// literals identical in en/sw — any divergence aborts); `label`, `hqPin`,
// `note`, group `label`/`description` and location chips are localized.
function coverageAreaBuild(en, sw, where) {
	const enStats = en.stats ?? [];
	const swStats = sw.stats ?? [];
	const enGroups = en.groups ?? [];
	const swGroups = sw.groups ?? [];
	if (!Array.isArray(swStats) || swStats.length !== enStats.length) {
		gap(where, `stat count diverged (en=${enStats.length} sw=${swStats?.length})`);
	}
	if (!Array.isArray(swGroups) || swGroups.length !== enGroups.length) {
		gap(where, `group count diverged (en=${enGroups.length} sw=${swGroups?.length})`);
	}
	const sharedNumber = (enNode, swNode, key, scope) => {
		if (enNode?.[key] !== swNode?.[key]) {
			gap(scope, `"${key}" diverged across locales (en=${JSON.stringify(enNode?.[key])} sw=${JSON.stringify(swNode?.[key])})`);
		}
		const value = enNode?.[key];
		if (typeof value !== "number") gap(scope, `"${key}" must be a number`);
		return typeof value === "number" ? value : 0;
	};
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		hqPin: { en: optText(en.hqPin), sw: optText(sw.hqPin) },
		stats: enStats.map((stat, i) => {
			const swStat = swStats[i] ?? {};
			return {
				icon: sharedValue(stat, swStat, "icon", `${where}.stats[${i}]`) ?? "",
				value: sharedNumber(stat, swStat, "value", `${where}.stats[${i}]`),
				suffix: sharedValue(stat, swStat, "suffix", `${where}.stats[${i}]`) ?? "",
				label: { en: reqText(stat.label, `${where}.stats[${i}].label.en`), sw: reqText(swStat.label, `${where}.stats[${i}].label.sw`) },
			};
		}),
		groups: enGroups.map((group, i) => {
			const swGroup = swGroups[i] ?? {};
			const enLocations = group.items ?? [];
			const swLocations = swGroup.items ?? [];
			if (!Array.isArray(swLocations) || swLocations.length !== enLocations.length) {
				gap(where, `location count diverged (en=${enLocations.length} sw=${swLocations?.length})`);
			}
			return {
				icon: sharedValue(group, swGroup, "icon", `${where}.groups[${i}]`) ?? "",
				label: { en: reqText(group.label, `${where}.groups[${i}].label.en`), sw: reqText(swGroup.label, `${where}.groups[${i}].label.sw`) },
				description: { en: reqText(group.description, `${where}.groups[${i}].description.en`), sw: reqText(swGroup.description, `${where}.groups[${i}].description.sw`) },
				items: enLocations.map((location, j) => ({
					en: reqText(location, `${where}.groups[${i}].items[${j}].en`),
					sw: reqText(swLocations[j], `${where}.groups[${i}].items[${j}].sw`),
				})),
			};
		}),
		note: { en: optText(en.note), sw: optText(sw.note) },
		id: "",
	};
}

// M8 batch D (2026-09-17): `surveyCost` tabbed estimator. Legacy
// `common:surveyCostInKenya` holds `{tag?, headline, description?,
// factors{label?, items[{icon, label, description}]},
// ranges{label?, hint?, items[{icon, label, price, pricePrefix, tagline,
// description, includes[]}]}, disclaimer?, cta?, secondaryCta?}`.
// `icon`s, `price` numbers and CTA `href`s are shared; everything else is
// localized.
function surveyCostBuild(en, sw, where) {
	const enFactors = en.factors?.items ?? [];
	const swFactors = sw.factors?.items ?? [];
	const enRanges = en.ranges?.items ?? [];
	const swRanges = sw.ranges?.items ?? [];
	if (!Array.isArray(swFactors) || swFactors.length !== enFactors.length) {
		gap(where, `factor count diverged (en=${enFactors.length} sw=${swFactors?.length})`);
	}
	if (!Array.isArray(swRanges) || swRanges.length !== enRanges.length) {
		gap(where, `range count diverged (en=${enRanges.length} sw=${swRanges?.length})`);
	}
	const sharedNumber = (enNode, swNode, key, scope) => {
		if (enNode?.[key] !== swNode?.[key]) {
			gap(scope, `"${key}" diverged across locales (en=${JSON.stringify(enNode?.[key])} sw=${JSON.stringify(swNode?.[key])})`);
		}
		const value = enNode?.[key];
		if (typeof value !== "number") gap(scope, `"${key}" must be a number`);
		return typeof value === "number" ? value : 0;
	};
	const action = (node, swNode, key) =>
		node || swNode
			? {
					label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
					href: sharedValue(node, swNode, "href", `${where}.${key}`) ?? "",
					icon: sharedValue(node, swNode, "icon", `${where}.${key}`) ?? "",
				}
			: { label: emptyPair(), href: "", icon: "" };
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		factors: {
			label: { en: optText(en.factors?.label), sw: optText(sw.factors?.label) },
			items: enFactors.map((factor, i) => {
				const swFactor = swFactors[i] ?? {};
				return {
					icon: sharedValue(factor, swFactor, "icon", `${where}.factors[${i}]`) ?? "",
					label: { en: reqText(factor.label, `${where}.factors[${i}].label.en`), sw: reqText(swFactor.label, `${where}.factors[${i}].label.sw`) },
					description: { en: reqText(factor.description, `${where}.factors[${i}].description.en`), sw: reqText(swFactor.description, `${where}.factors[${i}].description.sw`) },
				};
			}),
		},
		ranges: {
			label: { en: optText(en.ranges?.label), sw: optText(sw.ranges?.label) },
			hint: { en: optText(en.ranges?.hint), sw: optText(sw.ranges?.hint) },
			items: enRanges.map((range, i) => {
				const swRange = swRanges[i] ?? {};
				const enIncludes = range.includes ?? [];
				const swIncludes = swRange.includes ?? [];
				if (!Array.isArray(swIncludes) || swIncludes.length !== enIncludes.length) {
					gap(where, `includes count diverged (en=${enIncludes.length} sw=${swIncludes?.length})`);
				}
				return {
					icon: sharedValue(range, swRange, "icon", `${where}.ranges[${i}]`) ?? "",
					label: { en: reqText(range.label, `${where}.ranges[${i}].label.en`), sw: reqText(swRange.label, `${where}.ranges[${i}].label.sw`) },
					price: sharedNumber(range, swRange, "price", `${where}.ranges[${i}]`),
					pricePrefix: { en: optText(range.pricePrefix), sw: optText(swRange.pricePrefix) },
					tagline: { en: optText(range.tagline), sw: optText(swRange.tagline) },
					description: { en: reqText(range.description, `${where}.ranges[${i}].description.en`), sw: reqText(swRange.description, `${where}.ranges[${i}].description.sw`) },
					includes: enIncludes.map((bullet, j) => ({
						en: reqText(bullet, `${where}.ranges[${i}].includes[${j}].en`),
						sw: reqText(swIncludes[j], `${where}.ranges[${i}].includes[${j}].sw`),
					})),
				};
			}),
		},
		disclaimer: { en: optText(en.disclaimer), sw: optText(sw.disclaimer) },
		cta: action(en.cta, sw.cta, "cta"),
		secondaryCta: action(en.secondaryCta, sw.secondaryCta, "secondaryCta"),
		id: "",
	};
}

// M9 follow-up (2026-09-17): `leadGenBar` trio. Legacy `common:leadGenBar`
// holds `{tag?, headline, description?, items: [{icon, label, description,
// more?, action?}]}`. `icon` and link `href`s are shared; `label`s,
// `description`s and link labels are localized. `description` migrates
// verbatim as a VISIBILITY GATE (component keeps the `<Trans>` lookup);
// `title`/`link` keys are unrendered and never migrated.
function leadGenBarBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	const link = (node, swNode, key) => ({
		label: { en: optText(node?.label), sw: optText(swNode?.label) },
		href: sharedValue(node, swNode, "href", `${where}.${key}`) ?? "",
	});
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				label: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(swItem.label, `${where}.items[${i}].label.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
				more: link(item.more, swItem.more, `items[${i}].more`),
				action: link(item.action, swItem.action, `items[${i}].action`),
			};
		}),
		id: "",
	};
}

// NOTE (M8 batch A): `metrics` is registered but intentionally NOT migrated
// here — `<MetricsSection/>` is commented out of `[locale]/index.tsx`, so
// `common:metrics` is unrendered on `/` and `metrics` stays in `skipped`
// below. The id exists so editors can add it to any page.

// M11 home pilot (2026-09-18): `home:hero` → `homeHero`. The hero is the
// only home node still in the `home` namespace file (everything else moved
// to `common.json`); the mapping entry carries `ns: "home"` so `generate()`
// loads it from there. CTA hrefs/icons and location codes are shared
// (divergence aborts); badge/headline/description/labels are localized.
// The headline keeps its inline `<primary>`/`<accent>` tags verbatim — the
// wrapper parses them from data at render.
function homeHeroBuild(en, sw, where) {
	const action = (node, swNode, key) => ({
		label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
		href: sharedValue(node, swNode, "href", `${where}.${key}`) ?? "",
		icon: sharedValue(node, swNode, "icon", `${where}.${key}`) ?? "",
	});
	const locEn = en.location ?? {};
	const locSw = sw.location ?? {};
	const enChips = locEn.items ?? [];
	const swChips = locSw.items ?? [];
	if (!Array.isArray(swChips) || swChips.length !== enChips.length) {
		gap(where, `location chip count diverged (en=${enChips.length} sw=${swChips?.length})`);
	}
	return {
		badge: { en: optText(en.badge), sw: optText(sw.badge) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		ctaPrimary: action(en.ctaPrimary, sw.ctaPrimary, "ctaPrimary"),
		ctaSecondary: action(en.ctaSecondary, sw.ctaSecondary, "ctaSecondary"),
		location: {
			label: { en: optText(locEn.label), sw: optText(locSw.label) },
			items: enChips.map((chip, i) => {
				const swChip = swChips[i] ?? {};
				return {
					label: { en: reqText(chip.label, `${where}.location.items[${i}].label.en`), sw: reqText(swChip.label, `${where}.location.items[${i}].label.sw`) },
					code: sharedValue(chip, swChip, "code", `${where}.location.items[${i}]`) ?? "",
				};
			}),
		},
		id: "",
	};
}

// M11 home pilot (2026-09-18): `common:drones` → `homeDrones`. Icon, image,
// href and drone-name labels are identical across locales (shared gate);
// descriptions are localized. Legacy has no `common:drones.label` key, so
// `label` migrates empty and the component keeps its
// `t(..., { defaultValue: "Aerial capability" })` fallback.
function homeDronesBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		label: emptyPair(),
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				img: sharedValue(item, swItem, "img", `${where}.items[${i}]`) ?? "",
				href: sharedValue(item, swItem, "href", `${where}.items[${i}]`) ?? "",
				label: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(swItem.label, `${where}.items[${i}].label.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
			};
		}),
		id: "",
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
	// M7 batch 7: bathymetric-surveys. Four sections migrate in page order —
	// `hero` (shared Hero, default bottom layout; no layout/frame keys in
	// content), `whatIsBathymetricSurveys` (splitMedia, right/surface, no
	// points), `whyBathymetricCritical` + `whySmartGridBathymetric` (cardGrid
	// check-card grids built from string arrays) — interleaved with eight
	// legacy tails (see route wiring): WorkflowSection workflow, bespoke
	// equipment/deliverables/limitations/beforeAfter/finalCta, dams leadImages
	// grid, applications mediaBadged grid.
	"bathymetric-surveys": {
		namespace: "surveying/bathymetric-surveys",
		title: "Bathymetric Surveys",
		skipped: ["bathymetricWorkflow", "equipmentTechnology", "deliverables", "technicalLimitations", "beforeAfter", "finalCta", "damsLakesSeaOcean", "applications"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: BathymetricHeroSection → <Hero data={t(hero)} />
				// (default bottom layout; no layout/frame/scrollCue keys).
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
				discriminant: "splitMedia",
				from: "whatIsBathymetricSurveys",
				// Legacy: WhatIsBathymetricSection → <SplitMedia data
				// imagePosition="right" tone="surface" /> (no points, no
				// mediaAspect/mediaFit overrides).
				build(en, sw, where) {
					return {
						tag: { en: reqText(en.tag, `${where}.tag.en`), sw: reqText(sw.tag, `${where}.tag.sw`) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: { en: optText(en.image), sw: optText(sw.image) },
						points: [],
						imagePosition: "right",
						tone: "surface",
						mediaAspect: "default",
						mediaFit: "cover",
						id: "",
					};
				},
			},
			{
				discriminant: "cardGrid",
				from: "whyBathymetricCritical",
				// Legacy: WhyBathymetricCriticalSection → <CardGrid columns={3}
				// tone="surface" /> with `applications: string[]` mapped to
				// check-icon cards (title = application, no description).
				build(en, sw, where) {
					const enApps = en.applications ?? [];
					const swApps = sw.applications ?? [];
					if (!Array.isArray(swApps) || swApps.length !== enApps.length) {
						gap(where, `application count diverged (en=${enApps.length} sw=${swApps?.length})`);
					}
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						subheading: emptyPair(),
						description: { en: optText(en.description), sw: optText(sw.description) },
						items: enApps.map((app, i) => ({
							icon: "check",
							title: { en: reqText(app, `${where}.applications[${i}].en`), sw: reqText(swApps[i], `${where}.applications[${i}].sw`) },
							description: emptyPair(),
							image: "",
							href: "",
							accent: "",
						})),
						columns: "3",
						align: "left",
						tone: "surface",
						headerRow: false,
						cardDensity: "comfortable",
						cardIconSize: "md",
						id: "",
					};
				},
			},
			{
				discriminant: "cardGrid",
				from: "whySmartGridBathymetric",
				// Legacy: WhySmartGridBathymetricSection → <CardGrid
				// columns={3} tone="surface" /> with `items: string[]` mapped
				// to check-bold cards.
				build(en, sw, where) {
					const enRows = en.items ?? [];
					const swRows = sw.items ?? [];
					if (!Array.isArray(swRows) || swRows.length !== enRows.length) {
						gap(where, `item count diverged (en=${enRows.length} sw=${swRows?.length})`);
					}
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						subheading: emptyPair(),
						description: emptyPair(),
						items: enRows.map((row, i) => ({
							icon: "check-bold",
							title: { en: reqText(row, `${where}.items[${i}].en`), sw: reqText(swRows[i], `${where}.items[${i}].sw`) },
							description: emptyPair(),
							image: "",
							href: "",
							accent: "",
						})),
						columns: "3",
						align: "left",
						tone: "surface",
						headerRow: false,
						cardDensity: "comfortable",
						cardIconSize: "md",
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 8a: resource-mapping. Two sections migrate in page order —
	// `hero` (shared Hero, default bottom layout, dual pills) +
	// `whySmartGridStandsOut` (cardGrid, columns 4, centred, surface).
	// Tails stay legacy: WhatIs (bespoke items + closingStatement),
	// TypesOfResourceMapping + TechStack (fallbackIcons), SectorSection
	// grids (leadImages), WorkflowSection workflow, deliverables explorer,
	// FinalCta (cta-closing), DataAccuracy/consultation bespoke.
	"resource-mapping": {
		namespace: "surveying/resource-mapping",
		title: "Resource Mapping",
		skipped: ["whatIsResourceMapping", "typesOfResourceMapping", "workflow", "deliverables", "whoUses", "technologyStack", "dataAccuracy", "consultationCta", "agriculture", "utilitiesEnergySmartInfrastructure", "quarryMining", "constructionCivilEngineering", "environmentalConservation", "disasterRiskReduction", "finalCta"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: ResourceMappingHeroSection → <Hero data={t(hero)} />
				// (default bottom layout; dual pills, no pill overrides).
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
				discriminant: "cardGrid",
				from: "whySmartGridStandsOut",
				// Legacy: WhyStandOutSection → <CardGrid columns={4}
				// tone="surface" align="center" /> (card/density unset).
				build: cardGridBuild({ columns: "4", align: "center", tone: "surface", headerRow: false, cardDensity: "comfortable", cardIconSize: "md" }),
			},
		],
	},
	// M7 batch 8b: building-site-surveys. Four sections migrate in page order —
	// `section1` (introText split), `actionCtaEngineer` (ctaBand split/shimmer),
	// `exploreMore` (gallery grid), `cta` (ctaBand centred/hairline).
	// Tails stay legacy: bespoke hero, SiteEngineering (indexed +
	// fallbackIcons + headerRow cards), BuildSmarter/Accuracy/Consultation
	// bespoke, Process (layout/columns not in registry contract), deliverables
	// explorer, TechnologyStack (fallbackIcons + hoverArrow + per-card links).
	"building-site-surveys": {
		namespace: "surveying/building-site-surveys",
		title: "Building Site Surveys",
		skipped: ["hero", "section2", "siteEngineeringSurveys", "process", "accuracyMatters", "deliverables", "technology", "consultation"],
		sections: [
			{
				discriminant: "introText",
				from: "section1",
				// Legacy: IntroSection → <IntroTextSection ... split /> (split
				// hardcoded; no CTA).
				build: introTextBuild({ tone: "default", align: "left", split: true }),
			},
			{
				discriminant: "ctaBand",
				from: "actionCtaEngineer",
				// Legacy: ActionCtaBand → <CtaBand layout="split" shimmer
				// watermark /> (variant/decor unset = panel/glow).
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
						layout: "split",
						variant: "panel",
						decor: "glow",
						watermark: sharedValue(en, sw, "watermark", where) ?? "",
						images: [],
						shimmer: true,
						hairline: false,
						id: "",
					};
				},
			},
			{
				discriminant: "gallery",
				from: "exploreMore",
				// Legacy: ExploreMoreSection → <Gallery columns={3} />
				// (layout/tone unset = grid/default).
				build: galleryBuild({ layout: "grid", columns: "3", tone: "default" }),
			},
			{
				discriminant: "ctaBand",
				from: "cta",
				// Legacy: SiteCtaSection → <CtaBand glyph hairline primary />
				// (layout/variant/decor unset = centered/panel/glow; glyph is
				// fixed presentation, not an editor contract).
				build(en, sw, where) {
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						primary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
						},
						secondary: { label: emptyPair(), href: "", icon: "" },
						layout: "centered",
						variant: "panel",
						decor: "glow",
						watermark: "",
						images: [],
						shimmer: false,
						hairline: true,
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 9a: aerial-surveys. Two sections migrate in page order —
	// `hero` (shared Hero with trust-marker footnote chips) + `precision`
	// (splitMedia right/surface). Tails stay legacy: bespoke Intro (manifesto +
	// briefing card), WhyDroneServices popup cards, WorkflowSection workflow,
	// deliverables explorer, Industries + TechStack (fallbackIcons), IndustryCta
	// + CapabilityCta (CtaBand `size` + pill iconPosition/trailingArrow
	// overrides outside the v1 contract), Projects/AdditionalServices bespoke,
	// final CTA.
	"aerial-surveys": {
		namespace: "surveying/aerial-surveys",
		title: "Aerial Surveys",
		skipped: ["section1", "whatWeOffer", "aerialSurveying", "deliverables", "whyDroneSurveys", "workflow", "industries", "industryCta", "techStack", "capabilityCta", "finalCta", "projects", "additionalServices"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: AerialHeroSection → <Hero data={t(hero)} /> (default
				// bottom layout; footnote chips travel as shared icons +
				// localized text — first hero migration with footnotes).
				build(en, sw, where) {
					const enChips = en.footnoteItems ?? [];
					const swChips = sw.footnoteItems ?? [];
					if (!Array.isArray(swChips) || swChips.length !== enChips.length) {
						gap(where, `footnote count diverged (en=${enChips.length} sw=${swChips?.length})`);
					}
					return {
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: sharedValue(en, sw, "image", where) ?? "",
						layout: sharedValue(en, sw, "layout", where) ?? "bottom",
						frame: sharedValue(en, sw, "frame", where) ?? false,
						scrollCue: sharedValue(en, sw, "scrollCue", where) ?? false,
						cueLabel: emptyPair(),
						footnoteItems: enChips.map((chip, i) => {
							const swChip = swChips[i] ?? {};
							return {
								icon: sharedValue(chip, swChip, "icon", `${where}.footnoteItems[${i}]`) ?? "",
								text: { en: reqText(chip.text, `${where}.footnoteItems[${i}].text.en`), sw: reqText(swChip.text, `${where}.footnoteItems[${i}].text.sw`) },
							};
						}),
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
				discriminant: "splitMedia",
				from: "precision",
				// Legacy: PrecisionSection → <SplitMedia data
				// imagePosition="right" tone="surface" /> (no points).
				build(en, sw, where) {
					return {
						tag: { en: reqText(en.tag, `${where}.tag.en`), sw: reqText(sw.tag, `${where}.tag.sw`) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: { en: optText(en.image), sw: optText(sw.image) },
						points: [],
						imagePosition: "right",
						tone: "surface",
						mediaAspect: "default",
						mediaFit: "cover",
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 9b: cadastral-surveys. Hero only (1 section) — the smallest
	// surface of any child so far. `whatsABoundarySurvey` stays DORMANT: its
	// IntroSection is commented out of the route, so migrating it would
	// re-enable content the editors switched off; document here and revisit if
	// the route re-enables it. `postHeroCta` is a bespoke band (Blob +
	// shimmer, not CtaBand); process/cost/timeline/compliance/caseStudy/
	// finalCta are bespoke case-work sections. Hero description is empty in
	// both locales (optText, not reqText).
	"cadastral-surveys": {
		namespace: "surveying/cadastral-surveys",
		title: "Cadastral Surveys",
		skipped: ["whatsABoundarySurvey", "postHeroCta", "whenYouNeed", "process", "processCta", "cost", "timeline", "compliance", "caseStudy", "finalCta"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: CadastralHeroSection → <Hero data={t(hero)} />
				// (default bottom layout; empty description in both locales).
				build(en, sw, where) {
					return {
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
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
		],
	},
	// M7 batch 10a: ground-penetrating-radar. Two sections migrate in page
	// order — `technicalCta` (ctaBand split/shimmer/hairline) + `faqs` (faq
	// with still-curious card). The bespoke service hero (Link + Slider, not
	// shared Hero) stays legacy; both cardGrids use non-contract props
	// (`indexed` numbering, `fallbackIcons`); deliverables/sue/limitations/
	// beforeAfter/technology/summary/highlights/jumpNav/overview/methodology/
	// featuredProjects/finalCta are bespoke. FAQ items carry question/answer
	// only (no points/icons); the still-curious card maps from the `cta`
	// object (headline→label, description, label+href).
	"ground-penetrating-radar": {
		namespace: "surveying/ground-penetrating-radar",
		title: "Ground Penetrating Radar",
		skipped: ["hero", "highlights", "jumpNav", "overview", "methodology", "applications", "deliverables", "detectCaps", "sue", "limitations", "beforeAfter", "summary", "finalCta", "technology", "featuredProjects"],
		sections: [
			{
				discriminant: "ctaBand",
				from: "technicalCta",
				// Legacy: GprTechnicalProposalCta → <CtaBand layout="split"
				// shimmer hairline watermark /> (variant/decor unset =
				// panel/glow).
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
						layout: "split",
						variant: "panel",
						decor: "glow",
						watermark: sharedValue(en, sw, "watermark", where) ?? "",
						images: [],
						shimmer: true,
						hairline: true,
						id: "",
					};
				},
			},
			{
				discriminant: "faq",
				from: "faqs",
				// Legacy: GprFaqSection → <SharedFaq id="faqs" tag headline
				// items stillCurious /> with question/answer items (no icons,
				// no points) and the still-curious card from `cta`.
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
							return {
								question: { en: reqText(item.question, `${where}.items[${i}].question.en`), sw: reqText(swItem.question, `${where}.items[${i}].question.sw`) },
								answer: { en: reqText(item.answer, `${where}.items[${i}].answer.en`), sw: reqText(swItem.answer, `${where}.items[${i}].answer.sw`) },
								points: [],
								icon: "",
							};
						}),
						stillCuriousLabel: { en: reqText(en.cta?.headline, `${where}.cta.headline.en`), sw: reqText(sw.cta?.headline, `${where}.cta.headline.sw`) },
						stillCuriousDescription: { en: reqText(en.cta?.description, `${where}.cta.description.en`), sw: reqText(sw.cta?.description, `${where}.cta.description.sw`) },
						stillCuriousCta: {
							label: { en: reqText(en.cta?.label, `${where}.cta.label.en`), sw: reqText(sw.cta?.label, `${where}.cta.label.sw`) },
							href: sharedValue(en.cta, sw.cta, "href", `${where}.cta`) ?? "",
							icon: sharedValue(en.cta, sw.cta, "icon", `${where}.cta`) ?? "",
						},
						id: "faqs",
					};
				},
			},
		],
	},
	// M7 batch 10b: gis-mapping. One section migrates — `consultationCta`
	// (ctaBand split/shimmer/hairline, same contract shape as GPR technicalCta).
	// The bespoke hero (`<bold>` pseudo-markup the shared Hero would render
	// literally, string footnote chips) stays legacy; every cardGrid uses
	// non-contract props (`fallbackIcons`, `indexed`, `mediaBadged`); the rest
	// (whatIs, workflow, deliverables, techStack, whatsappCta, components,
	// dataAccuracy, beforeAfter, projectImpact, relatedServices, analystCta)
	// are bespoke.
	"gis-mapping": {
		namespace: "surveying/gis-mapping",
		title: "GIS Mapping",
		skipped: ["hero", "whatIsGis", "whyGisCritical", "services", "remoteSensingSolutions", "mappingServices", "industries", "techStack", "whatsappCta", "components", "whySmartgrid", "dataAccuracy", "beforeAfter", "projectImpact", "relatedServices", "analystCta"],
		sections: [
			{
				discriminant: "ctaBand",
				from: "consultationCta",
				// Legacy: GisConsultationCtaSection → <CtaBand layout="split"
				// shimmer hairline watermark /> (variant/decor unset =
				// panel/glow).
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
						layout: "split",
						variant: "panel",
						decor: "glow",
						watermark: sharedValue(en, sw, "watermark", where) ?? "",
						images: [],
						shimmer: true,
						hairline: true,
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 11a: highway-surveys. Three sections migrate in page order —
	// `hero` (shared Hero, default bottom) + `overview` (introText surface) +
	// `benefitsOfHighwaySurveys` (cardGrid cols 3 surface). Tails stay legacy:
	// ServicesSection (`indexed` numbering) + bespoke deliverables explorer.
	"highway-surveys": {
		namespace: "civil/highway-surveys",
		title: "Highway Surveys",
		skipped: ["services", "highwaySurveyDeliverables"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: HeroSection → <Hero data={t(hero)} /> (default
				// bottom layout).
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
				from: "overview",
				// Legacy: OverviewSection → <IntroTextSection tone="surface" />
				// (align/split unset = left/false).
				build: introTextBuild({ tone: "surface", align: "left", split: false }),
			},
			{
				discriminant: "cardGrid",
				from: "benefitsOfHighwaySurveys",
				// Legacy: BenefitsSection → <CardGrid columns={3}
				// tone="surface" /> (align/card unset = defaults).
				build: cardGridBuild({ columns: "3", align: "left", tone: "surface", headerRow: false, cardDensity: "comfortable", cardIconSize: "md" }),
			},
		],
	},
	// M7 batch 11b: as-built-surveys. Six sections migrate in page order —
	// `hero` + `whatAreAsBuiltSurveys`/`maxProductivityMinGuesswork`/
	// `actionableInsights` (introText via shared TextSection) +
	// `keyIndustries`/`applications` (cardGrids). Tails stay legacy:
	// AsBuiltSolutionsSection (`indexed` numbering) + bespoke Deliverables
	// explorer.
	"as-built-surveys": {
		namespace: "civil/as-built-surveys",
		title: "As-Built Surveys",
		skipped: ["asBuiltSolutions", "deliverables"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: HeroSection → <Hero data={t(hero)} /> (default
				// bottom layout).
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
				from: "whatAreAsBuiltSurveys",
				// Legacy: WhatAreAsBuiltSurveysSection → <TextSection /> (tone
				// default, align/split unset).
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "cardGrid",
				from: "keyIndustries",
				// Legacy: KeyIndustriesSection → <CardGrid columns={3}
				// align="center" /> (tone/card unset = defaults).
				build: cardGridBuild({ columns: "3", align: "center", tone: "default", headerRow: false, cardDensity: "comfortable", cardIconSize: "md" }),
			},
			{
				discriminant: "introText",
				from: "maxProductivityMinGuesswork",
				// Legacy: MaxProductivityMinGuessworkSection → <TextSection
				// tone="surface" />.
				build: introTextBuild({ tone: "surface", align: "left", split: false }),
			},
			{
				discriminant: "cardGrid",
				from: "applications",
				// Legacy: ApplicationsSection → <CardGrid columns={3}
				// tone="surface" align="center" />.
				build: cardGridBuild({ columns: "3", align: "center", tone: "surface", headerRow: false, cardDensity: "comfortable", cardIconSize: "md" }),
			},
			{
				discriminant: "introText",
				from: "actionableInsights",
				// Legacy: ActionableInsightsSection → <TextSection /> (tone
				// default, align/split unset).
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
		],
	},
	// M7 batch 12a: bim. Two sections migrate in page order — `hero`
	// (shared Hero with secondary-only pill: no `ctaPrimary` key in content)
	// + `cta` (ctaBand centred; wrapper `iconPosition: "end"` collapses to the
	// solid-pill default per CtaPill `iconAtEnd`). Tails stay legacy:
	// BimServicesSection (`indexed` numbering) + bespoke Deliverables explorer.
	"bim": {
		namespace: "civil/bim",
		title: "BIM",
		skipped: ["bimServices", "deliverables"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: HeroSection → <Hero data={t(hero)} /> (default
				// bottom layout; secondary-only pill).
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
						ctaPrimary: { label: emptyPair(), href: "", icon: "", iconPosition: "end", trailingArrow: "auto" },
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
				discriminant: "ctaBand",
				from: "cta",
				// Legacy: CtaSection → <CtaBand tag headline description
				// primary /> (layout/variant/decor unset =
				// centered/panel/glow; wrapper `iconPosition: "end"` is the
				// solid-pill default).
				build(en, sw, where) {
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						primary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
						},
						secondary: { label: emptyPair(), href: "", icon: "" },
						layout: "centered",
						variant: "panel",
						decor: "glow",
						watermark: "",
						images: [],
						shimmer: false,
						hairline: false,
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 12b: site-engineering. One section migrates — `cta` (ctaBand
	// centred, plain pill, no wrapper overrides). The bespoke hero (`<bold>`
	// pseudo-markup) and `Split`-primitive overview stay legacy;
	// WhatWeDoSection is `indexed`; ExploreMoreSection uses media-background
	// cards (`mediaPosition`/`headerAlign` outside the contract); deliverables
	// explorer stays legacy.
	"site-engineering": {
		namespace: "civil/site-engineering",
		title: "Site Engineering",
		skipped: ["hero", "overview", "WhatWeDo", "exploreMore", "deliverables"],
		sections: [
			{
				discriminant: "ctaBand",
				from: "cta",
				// Legacy: CtaSection → <CtaBand tag headline description
				// primary /> (all presentation unset = defaults).
				build(en, sw, where) {
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						primary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
						},
						secondary: { label: emptyPair(), href: "", icon: "" },
						layout: "centered",
						variant: "panel",
						decor: "glow",
						watermark: "",
						images: [],
						shimmer: false,
						hairline: false,
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 12c: site-setting-out. Two sections migrate in page order —
	// `hero` (shared Hero, dual pills without icons) + `faq` (icon/title/
	// description items, no points, no still-curious card). Tails stay legacy:
	// OurServicesSection (`indexed`), OurInstrumentsSection (`mediaBadged`),
	// bespoke Deliverables explorer.
	"site-setting-out": {
		namespace: "civil/site-setting-out",
		title: "Site Setting Out",
		skipped: ["ourServices", "ourInstruments", "deliverables"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: HeroSection → <Hero data={t(hero)} /> (default
				// bottom layout; dual pills, neither with an icon key).
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
				discriminant: "faq",
				from: "faq",
				// Legacy: FaqSection → <SharedFaq tag headline description
				// items /> with icon/title/description items mapped to
				// question/answer/icon (no points, no still-curious card).
				build(en, sw, where) {
					const enItems = en.items ?? [];
					const swItems = sw.items ?? [];
					if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
						gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
					}
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						items: enItems.map((item, i) => {
							const swItem = swItems[i] ?? {};
							return {
								question: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
								answer: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
								points: [],
								icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
							};
						}),
						stillCuriousLabel: emptyPair(),
						stillCuriousDescription: emptyPair(),
						stillCuriousCta: { label: emptyPair(), href: "", icon: "" },
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 12d: volumetric-surveys. Five sections migrate in page order —
	// `hero` (dual pills with icons) + `maxProductivityMinGuesswork`/
	// `clarityAndControl` (introTexts default/surface) +
	// `precisionVolumetricAnalysis` (splitMedia right/default) + `cta`
	// (ctaBand centred; wrapper `iconPosition: "end"` is the solid-pill
	// default; content `icon: "email"` shared so the `?? "arrow-right"`
	// fallback never fires). Tails stay legacy: ServicesSection
	// (`headerAlign="left"`, non-default — plain cardGrid would centre it) +
	// bespoke Deliverables explorer.
	"volumetric-surveys": {
		namespace: "civil/volumetric-surveys",
		title: "Volumetric Surveys",
		skipped: ["services", "deliverables"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: HeroSection → <Hero data={t(hero)} /> (default
				// bottom layout; dual pills with icons).
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
				from: "maxProductivityMinGuesswork",
				// Legacy: MaxProductivityMinGuessworkSection → <TextSection />
				// (tone default, align/split unset).
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "splitMedia",
				from: "precisionVolumetricAnalysis",
				// Legacy: PrecisionVolumetricAnalysisSection → <SplitMedia
				// data imagePosition="right" /> (tone/mediaAspect/mediaFit
				// unset = defaults).
				build(en, sw, where) {
					return {
						tag: { en: reqText(en.tag, `${where}.tag.en`), sw: reqText(sw.tag, `${where}.tag.sw`) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: { en: optText(en.image), sw: optText(sw.image) },
						points: [],
						imagePosition: "right",
						tone: "default",
						mediaAspect: "default",
						mediaFit: "cover",
						id: "",
					};
				},
			},
			{
				discriminant: "introText",
				from: "clarityAndControl",
				// Legacy: ClarityAndControlSection → <TextSection
				// tone="surface" />.
				build: introTextBuild({ tone: "surface", align: "left", split: false }),
			},
			{
				discriminant: "ctaBand",
				from: "cta",
				// Legacy: CtaSection → <CtaBand tag headline description
				// primary /> (layout/variant/decor unset =
				// centered/panel/glow; wrapper `iconPosition: "end"` is the
				// solid-pill default).
				build(en, sw, where) {
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						primary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
						},
						secondary: { label: emptyPair(), href: "", icon: "" },
						layout: "centered",
						variant: "panel",
						decor: "glow",
						watermark: "",
						images: [],
						shimmer: false,
						hairline: false,
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 13a: solar-panel-drone-surveys. Two sections migrate in page
	// order — `hero` (shared Hero, single pill) + `cta` (ctaBand centred;
	// wrapper hardcodes primary `icon: "arrow-right"` + `iconPosition: "end"`,
	// stored as shared literals — content carries label/href only — with
	// `iconPosition` collapsing to the solid-pill default). Tails stay legacy:
	// WhatWeDoSection (`card.iconShape: "xl"`, outside the contract),
	// DroneIntegrationProcessSection (`indexed` numbering).
	"solar-panel-drone-surveys": {
		namespace: "aerial-drones/solar-panel-drone-surveys",
		title: "Solar Panel Drone Surveys",
		skipped: ["whatWeDo", "droneIntegrationProcess"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: HeroSection → <Hero data={t(hero)} /> (default
				// bottom layout).
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
				discriminant: "ctaBand",
				from: "cta",
				// Legacy: CtaSection → <CtaBand tag headline description
				// primary /> (layout/variant/decor unset =
				// centered/panel/glow; `className` excluded). Primary icon +
				// iconPosition are wrapper hardcodes, stored as shared
				// literals (content carries label/href only).
				build(en, sw, where) {
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						primary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: "arrow-right",
						},
						secondary: { label: emptyPair(), href: "", icon: "" },
						layout: "centered",
						variant: "panel",
						decor: "glow",
						watermark: "",
						images: [],
						shimmer: false,
						hairline: false,
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 13b: landfill-quarry-drone-surveys. Three sections migrate in
	// page order — `hero` (shared Hero, single pill) + `quarryServices`/
	// `maximizeProductivity` (introTexts default/surface). Tails stay legacy:
	// QuarryServicesItemsSection (`card.iconShape: "xl"` + roomy density —
	// iconShape outside the contract), WhatWeOfferSection (`fallbackIcons`).
	"landfill-quarry-drone-surveys": {
		namespace: "aerial-drones/landfill-quarry-drone-surveys",
		title: "Landfill Quarry Drone Surveys",
		skipped: ["quarryServicesItems", "whatWeOffer"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: HeroSection → <Hero data={t(hero)} /> (default
				// bottom layout).
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
				from: "quarryServices",
				// Legacy: QuarryServicesSection → <TextSection /> (tone
				// default, align/split unset).
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "introText",
				from: "maximizeProductivity",
				// Legacy: MaximizeProductivitySection → <TextSection
				// tone="surface" />.
				build: introTextBuild({ tone: "surface", align: "left", split: false }),
			},
		],
	},
	// M7 batch 14a: monitoring-and-evaluation. Five sections migrate in page
	// order — `hero` (shared Hero, single pill) + `drivingSustainability`/
	// `techWeUse`/`whyPartnerWithUs` (introTexts default/surface/default) +
	// `cta` (ctaBand centred; wrapper `iconPosition: "end"` collapses to the
	// solid-pill default). Tails stay legacy: OurCapabilitiesSection +
	// ImpactSection (`fallbackIcons`), SmartMonitoringSection
	// (`card.iconShape` + `actions`, both outside the contract),
	// WhatWeOfferSection (`leadImages` + media cards).
	"monitoring-and-evaluation": {
		namespace: "aerial-drones/monitoring-and-evaluation",
		title: "Monitoring and Evaluation",
		skipped: ["ourCapabilities", "impact", "smartMonitoringAndEval", "whatWeOffer"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: HeroSection → <Hero data={t(hero)} /> (default
				// bottom layout).
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
				from: "drivingSustainability",
				// Legacy: DrivingSustainabilitySection → <TextSection />
				// (tone default, align/split unset).
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "introText",
				from: "techWeUse",
				// Legacy: TechWeUseSection → <TextSection tone="surface" />.
				build: introTextBuild({ tone: "surface", align: "left", split: false }),
			},
			{
				discriminant: "introText",
				from: "whyPartnerWithUs",
				// Legacy: WhyPartnerWithUsSection → <TextSection /> (tone
				// default, align/split unset).
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "ctaBand",
				from: "cta",
				// Legacy: CtaSection → <CtaBand tag headline description
				// primary /> (layout/variant/decor unset =
				// centered/panel/glow; `className` excluded; wrapper
				// `iconPosition: "end"` is the solid-pill default).
				build(en, sw, where) {
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						primary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
						},
						secondary: { label: emptyPair(), href: "", icon: "" },
						layout: "centered",
						variant: "panel",
						decor: "glow",
						watermark: "",
						images: [],
						shimmer: false,
						hairline: false,
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 14b: aerial-drones as-built-surveys. Three sections migrate in
	// page order — `hero` + `metrics` (stats band, value/description items) +
	// `ctaSection` (ctaBand bleed variant with lead images; first bleed + first
	// images migration; wrapper-hardcoded primary arrow stored as a shared
	// literal). Tails stay legacy: WhyUseDronesSection (`fallbackIcons` +
	// `card.iconShape`), ProcessSection (layout/columns outside the registry
	// `process` contract). Slug is hub-prefixed
	// (`aerial-drones-as-built-surveys`) — the bare `as-built-surveys` slug is
	// taken by the civil child.
	"aerial-drones-as-built-surveys": {
		namespace: "aerial-drones/aerial-drones-as-built-surveys",
		title: "Aerial As-Built Surveys",
		skipped: ["whyUseDrones", "process"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: AsBuiltHeroSection → <Hero data={t(hero)} />
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
						ctaSecondary: { label: emptyPair(), href: "", icon: "" },
						id: "",
					};
				},
			},
			{
				discriminant: "stats",
				from: "metrics",
				// Legacy: MetricsSection → <Stats items columns={3} />
				// (layout/tone unset = band/default). Items carry
				// value/description only — labels/icons stay empty.
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
							label: emptyPair(),
							description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(sw.items?.[i]?.description, `${where}.items[${i}].description.sw`) },
							icon: "",
						})),
						layout: "band",
						tone: "default",
						columns: 3,
						id: "",
					};
				},
			},
			{
				discriminant: "ctaBand",
				from: "ctaSection",
				// Legacy: CtaSection → <CtaBand variant images tag headline
				// description primary /> (layout/decor unset =
				// centered/glow; `className` excluded). Variant + images
				// travel as shared values; primary arrow is a wrapper
				// hardcode stored as a shared literal.
				build(en, sw, where) {
					const variant = sharedValue(en, sw, "variant", where) ?? "panel";
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						primary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: "arrow-right",
						},
						secondary: { label: emptyPair(), href: "", icon: "" },
						layout: "centered",
						variant: variant === "bleed" ? "bleed" : "panel",
						decor: "glow",
						watermark: "",
						images: sharedValue(en, sw, "images", where) ?? [],
						shimmer: false,
						hairline: false,
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 15a: agricultural-ndvi-mapping. Hero only (1 section) — the
	// smallest surface alongside cadastral. WhyUseDronesSection wraps
	// SplitMedia with card items (`columns`/`card.iconShape`, outside the
	// splitMedia text+image+points contract); ProcessSection passes
	// layout/columns outside the registry `process` contract.
	"agricultural-ndvi-mapping": {
		namespace: "aerial-drones/agricultural-ndvi-mapping",
		title: "Agricultural NDVI Mapping",
		skipped: ["whyUseDronesInAgriculture", "process"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: AgriculturalNdviHeroSection → <Hero data={t(hero)} />
				// (default bottom layout).
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
		],
	},
	// M7 batch 15b: lidar-mapping. Three sections migrate in page order —
	// `hero` + `forestry` (splitMedia left/surface/wide) + `construction`
	// (splitMedia right/default/wide). Tails stay legacy:
	// IndustriesWeServeSection (`indexed` LidarCardGrid), WhyChoose/Powerline/
	// Split bespoke, HowItWorksSection (layout/columns outside the registry
	// `process` contract), LidarCtaSection (wrapper `normalizeHref` transform —
	// migrating the bare-email href verbatim would break the link).
	"lidar-mapping": {
		namespace: "aerial-drones/lidar-mapping",
		title: "LiDAR Mapping",
		skipped: ["industriesWeServe", "whyChooseLidar", "lidarPowerlineInspection", "howItWorks", "ctaSection"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: LidarHeroSection → <Hero data={t(hero)} /> (default
				// bottom layout).
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
				discriminant: "splitMedia",
				from: "forestry",
				// Legacy: ForestrySection → <SplitMedia data
				// imagePosition="left" tone="surface" mediaAspect="aspect-16/10" />
				// (registry "wide" maps to aspect-16/10).
				build(en, sw, where) {
					return {
						tag: { en: reqText(en.tag, `${where}.tag.en`), sw: reqText(sw.tag, `${where}.tag.sw`) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: { en: optText(en.image), sw: optText(sw.image) },
						points: [],
						imagePosition: "left",
						tone: "surface",
						mediaAspect: "wide",
						mediaFit: "cover",
						id: "",
					};
				},
			},
			{
				discriminant: "splitMedia",
				from: "construction",
				// Legacy: ConstructionSection → <SplitMedia data
				// imagePosition="right" tone="default" mediaAspect="aspect-16/10" />.
				build(en, sw, where) {
					return {
						tag: { en: reqText(en.tag, `${where}.tag.en`), sw: reqText(sw.tag, `${where}.tag.sw`) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: { en: optText(en.image), sw: optText(sw.image) },
						points: [],
						imagePosition: "right",
						tone: "default",
						mediaAspect: "wide",
						mediaFit: "cover",
						id: "",
					};
				},
			},
		],
	},
	// M7 batch 17: home (largest page, done last per plan). M12
	// (2026-09-18): mapping order IS legacy page order — `homeHero`,
	// `leadGenBar`, `about`, `planningInfographic`,
	// `surveyingInstruments`, `homeDrones`, `actionCtaSurveyor`,
	// `services`, `industriesWeServe`, `whyChooseUs`, `coreExpertise`,
	// `surveyCostInKenya`, `coverageArea`, `faq`, `actionCtaEngineer`,
	// `keyFacts`, `certifications`, `trustees`, `defaultCta`.
	// NOTE (2026-09-16, HEAD `9b3f8d0` moved the home content nodes from the
	// `home` namespace to `common`): the page entry stays `home.json`, but
	// the migrated content keys (`actionCtaSurveyor`, `industriesWeServe`,
	// `faq`, `actionCtaEngineer`, `cta`) now live in `common.json`, so every
	// build in this mapping reads from `extra.common`, exactly like the
	// cross-namespace `trustees` build below.
	// Tails stay legacy: bespoke WebGL hero,
	// global LeadGenBar (`home` ns, never a page-builder branch),
	// CoreExpertiseSection (`headerRow` + `hoverArrow` + `watermarkedIndexed`),
	// client-only CoverageAreaSection (ProjectsGlobe), About/
	// Tails stay legacy: bespoke WebGL hero, Drones bespoke (every other home
	// section migrates in M7/M8 plus the M9 follow-up; `metrics` stays in
	// `skipped` — unrendered, commented out of the route).
	// M11 home pilot (2026-09-18): the hero + drones tails migrate too, as
	// unique sections (`homeHero` from the `home` namespace via `ns`,
	// `homeDrones` from `common:drones`); only `metrics` stays skipped.
	// NOTE: overwrites the
	// M1 `home.json` starter fixture (placeholder since M1) with the real
	// migrated home; entry stays `draft`.
	"home": {
		namespace: "home",
		title: "Home",
		// M8 (2026-09-16): HEAD `9b3f8d0` moved the home content nodes from
		// the `home` namespace to `common` — `generate()` loads content from
		// `contentNamespace` (`common.json`) while the page entry stays
		// `home.json`.
		contentNamespace: "common",
		skipped: ["metrics"],
		sections: [
			{
				discriminant: "homeHero",
				from: "hero",
				// M11 home pilot (2026-09-18): the bespoke WebGL
				// <HeroSection /> over `home:hero` — the only home node
				// still in the `home` namespace file, hence `ns: "home"`.
				// M12 (2026-09-18): mapping order IS page order now.
				ns: "home",
				build(en, sw, where) {
					return homeHeroBuild(en, sw, where);
				},
			},
			{
				discriminant: "leadGenBar",
				from: "leadGenBar",
				// Legacy: home route renders the global shared
				// <LeadGenBar /> over `common:leadGenBar` (same
				// `common.json` content namespace as every other section in
				// this mapping since HEAD `9b3f8d0`).
				build(en, sw, where) {
					return leadGenBarBuild(en, sw, where);
				},
			},
			{
				discriminant: "about",
				from: "about",
				// Legacy: AboutSection → <About id="about" /> over
				// `common:about` (same `common.json` content namespace as
				// every other section in this mapping since HEAD `9b3f8d0`).
				build(en, sw, where) {
					return aboutBuild(en, sw, where);
				},
			},
			{
				discriminant: "planningInfographic",
				from: "planningInfographic",
				// Legacy: PlanningInfographicSection → <PlanningInfographic
				// /> over `common:planningInfographic` (same `common.json`
				// content namespace as every other section in this mapping
				// since HEAD `9b3f8d0`).
				build(en, sw, where) {
					return planningInfographicBuild(en, sw, where);
				},
			},
			{
				discriminant: "surveyingInstruments",
				from: "surveyingInstruments",
				// Legacy: SurveyingInstrumentsSection →
				// <SurveyingInstruments id="surveying-instruments" /> over
				// `common:surveyingInstruments` (same `common.json` content
				// namespace as every other section in this mapping since
				// HEAD `9b3f8d0`).
				build(en, sw, where) {
					return surveyingInstrumentsBuild(en, sw, where);
				},
			},
			{
				discriminant: "homeDrones",
				from: "drones",
				// M11 home pilot (2026-09-18): the bespoke
				// <DronesSection /> fleet grid over `common:drones`.
				// M12 (2026-09-18): mapping order IS page order now.
				build(en, sw, where) {
					return homeDronesBuild(en, sw, where);
				},
			},
			{
				discriminant: "ctaBand",
				from: "actionCtaSurveyor",
				// Legacy: ActionCtaSection contentKey="actionCtaSurveyor" →
				// <CtaBand layout="split" shimmer watermark /> (variant/decor
				// unset = panel/glow; wrapper primary `iconPosition: "end"`
				// is the solid-pill default).
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
						layout: "split",
						variant: "panel",
						decor: "glow",
						watermark: sharedValue(en, sw, "watermark", where) ?? "",
						images: [],
						shimmer: true,
						hairline: false,
						id: "",
					};
				},
			},
			{
				discriminant: "services",
				from: "services",
				// Legacy: home route renders the shared <ServicesSection />
				// over `common:services` (same `common.json` content
				// namespace as every other section in this mapping since
				// HEAD `9b3f8d0`). NOTE: tag/headline migrate from
				// `common:services` — the component's legacy
				// `home:services.*` lookup addresses missing keys.
				build(en, sw, where) {
					return servicesBuild(en, sw, where);
				},
			},
			{
				discriminant: "cardGrid",
				from: "industriesWeServe",
				// Legacy: IndustriesWeServeSection → <CardGrid columns={3} />
				// (tone/align/card unset = defaults). Items carry
				// icon/label/description — `label` maps to `title` (CardList
				// renders `title ?? label`, so the stored title renders
				// identically).
				build(en, sw, where) {
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
							const swItem = swItems[i] ?? {};
							return {
								icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
								title: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(swItem.label, `${where}.items[${i}].label.sw`) },
								description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
								image: "",
								href: "",
								accent: "",
							};
						}),
						columns: "3",
						align: "left",
						tone: "default",
						headerRow: false,
						cardDensity: "comfortable",
						cardIconSize: "md",
						id: "",
					};
				},
			},
			{
				discriminant: "whyChooseUs",
				from: "whyChooseUs",
				// Legacy: WhyChooseUsSection → <WhyChooseUs
				// id="why-choose-us" /> over `common:whyChooseUs` (same
				// `common.json` content namespace as every other section in
				// this mapping since HEAD `9b3f8d0`).
				build(en, sw, where) {
					return whyChooseUsBuild(en, sw, where);
				},
			},
			{
				discriminant: "coreExpertise",
				from: "coreExpertise",
				// Legacy: CoreExpertiseSection → <CoreExpertise
				// id="core-expertise" /> over `common:coreExpertise` (same
				// `common.json` content namespace as every other section in
				// this mapping since HEAD `9b3f8d0`).
				build(en, sw, where) {
					return coreExpertiseBuild(en, sw, where);
				},
			},
			{
				discriminant: "surveyCost",
				from: "surveyCostInKenya",
				// Legacy: SurveyCostSection → <SurveyCost id="survey-cost" />
				// over `common:surveyCostInKenya` (same `common.json` content
				// namespace as every other section in this mapping since
				// HEAD `9b3f8d0`; note the key differs from the section id).
				build(en, sw, where) {
					return surveyCostBuild(en, sw, where);
				},
			},
			{
				discriminant: "coverageArea",
				from: "coverageArea",
				// Legacy: CoverageAreaSection → <CoverageArea
				// id="coverage-area" /> over `common:coverageArea` (same
				// `common.json` content namespace as every other section in
				// this mapping since HEAD `9b3f8d0`).
				build(en, sw, where) {
					return coverageAreaBuild(en, sw, where);
				},
			},
			{
				discriminant: "faq",
				from: "faq",
				// Legacy: FaqSection → <SharedFaq tag headline description
				// items stillCurious /> with question/answer items (no icons,
				// no points) and a direct still-curious object.
				build(en, sw, where) {
					const enItems = en.items ?? [];
					const swItems = sw.items ?? [];
					if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
						gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
					}
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						items: enItems.map((item, i) => {
							const swItem = swItems[i] ?? {};
							return {
								question: { en: reqText(item.question, `${where}.items[${i}].question.en`), sw: reqText(swItem.question, `${where}.items[${i}].question.sw`) },
								answer: { en: reqText(item.answer, `${where}.items[${i}].answer.en`), sw: reqText(swItem.answer, `${where}.items[${i}].answer.sw`) },
								points: [],
								icon: "",
							};
						}),
						stillCuriousLabel: { en: reqText(en.stillCurious?.label, `${where}.stillCurious.label.en`), sw: reqText(sw.stillCurious?.label, `${where}.stillCurious.label.sw`) },
						stillCuriousDescription: { en: reqText(en.stillCurious?.description, `${where}.stillCurious.description.en`), sw: reqText(sw.stillCurious?.description, `${where}.stillCurious.description.sw`) },
						stillCuriousCta: {
							label: { en: reqText(en.stillCurious?.cta?.label, `${where}.stillCurious.cta.label.en`), sw: reqText(sw.stillCurious?.cta?.label, `${where}.stillCurious.cta.label.sw`) },
							href: sharedValue(en.stillCurious?.cta, sw.stillCurious?.cta, "href", `${where}.stillCurious.cta`) ?? "",
							icon: sharedValue(en.stillCurious?.cta, sw.stillCurious?.cta, "icon", `${where}.stillCurious.cta`) ?? "",
						},
						id: "",
					};
				},
			},
			{
				discriminant: "ctaBand",
				from: "actionCtaEngineer",
				// Legacy: ActionCtaSection contentKey="actionCtaEngineer" →
				// same split/shimmer contract as actionCtaSurveyor.
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
						layout: "split",
						variant: "panel",
						decor: "glow",
						watermark: sharedValue(en, sw, "watermark", where) ?? "",
						images: [],
						shimmer: true,
						hairline: false,
						id: "",
					};
				},
			},
			{
				discriminant: "keyFacts",
				from: "keyFacts",
				// Legacy: KeyFactsSection → <KeyFacts id="key-facts" /> over
				// `common:keyFacts` (same `common.json` content namespace as
				// every other section in this mapping since HEAD `9b3f8d0`).
				build(en, sw, where) {
					return keyFactsBuild(en, sw, where);
				},
			},
			{
				discriminant: "certifications",
				from: "certifications",
				// Legacy: CertificationsSection → <Certifications
				// id="certifications" /> over `common:certifications` (same
				// `common.json` content namespace as every other section in
				// this mapping since HEAD `9b3f8d0`).
				build(en, sw, where) {
					return certificationsBuild(en, sw, where);
				},
			},
			{
				discriminant: "trustees",
				from: "trustees",
				// Legacy: TrusteesSection → <Trustees id="trustees" /> over
				// `common:trustees` (same `common.json` content namespace as
				// every other section in this mapping since HEAD `9b3f8d0`).
				build(en, sw, where) {
					return trusteesBuild(en, sw, where);
				},
			},
			{
				discriminant: "ctaBand",
				from: "defaultCta",
				// Legacy: CtaSection reads `common:defaultCta` (NOT `home:cta` —
				// the `cta` key exists nowhere since the HEAD `9b3f8d0`
				// pre-migration; verified against both locale files).
				// Renders as <CtaBand id="cta" decor="masked" glyph ... />.
				// (`glyph` is fixed presentation, not an editor contract;
				// wrapper primary `iconPosition: "end"` is the solid-pill
				// default). Flat content keys under `common:defaultCta.*`.
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
						decor: "masked",
						watermark: "",
						images: [],
						shimmer: false,
						hairline: false,
						id: "cta",
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
	// M8 (2026-09-16): `contentNamespace` lets a mapping read content from a
	// different locale file than the page entry name — home's entry stays
	// `home.json` but its content nodes moved to `common.json` (HEAD `9b3f8d0`).
	const contentNamespace = mapping.contentNamespace ?? mapping.namespace;
	const en = loadNamespace("en", contentNamespace);
	const sw = loadNamespace("sw", contentNamespace);
	const siteTitle = { en: loadSiteTitle("en"), sw: loadSiteTitle("sw") };
	// Cross-namespace content merged at render time (e.g. careers:hero
	// cueLabel from common:misc.openRoles). Passed as the 5th build arg;
	// existing 4-arg builds ignore it.
	const extra = { common: { en: loadCommon("en"), sw: loadCommon("sw") } };
	// M11 (2026-09-18): per-section `ns` override — a section whose content
	// lives in a different locale file than `contentNamespace` (home's hero
	// is the only node left in `home.json`). Cached per locale+namespace.
	const nsCache = new Map();
	const loadCached = (locale, ns) => {
		const key = `${locale}:${ns}`;
		if (!nsCache.has(key)) nsCache.set(key, loadNamespace(locale, ns));
		return nsCache.get(key);
	};
	const pageBuilder = mapping.sections.map(({ discriminant, from, ns, build }) => {
		const srcEn = ns ? loadCached("en", ns) : en;
		const srcSw = ns ? loadCached("sw", ns) : sw;
		if (from === null) {
			// Whole-file mapping (legal pages): the namespace root IS the section.
			return { discriminant, value: stripInternalKeys(build(srcEn, srcSw, ns ?? mapping.namespace, siteTitle, extra)) };
		}
		if (!(from in srcEn) || !(from in srcSw)) {
			gap(from, "section key missing in one locale");
			return { discriminant, value: {} };
		}
		return { discriminant, value: stripInternalKeys(build(srcEn[from], srcSw[from], from, siteTitle, extra)) };
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
