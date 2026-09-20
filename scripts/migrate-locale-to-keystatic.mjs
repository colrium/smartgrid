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

	// M11 batch 8 — bathymetric-surveys page (2026-09-18): the seven bespoke
// tails → unique sections. Phase keys, icons, image paths and hrefs
// shared; titles, descriptions, points, factors, outputs localized. The
// hardcoded limitations card headings are not migrated (legacy quirk).
function bathyEquipmentBuild(en, sw, where) {
	const enImages = en.images ?? [];
	const swImages = sw.images ?? [];
	if (!Array.isArray(swImages) || swImages.length !== enImages.length) {
		gap(where, `image count diverged (en=${enImages.length} sw=${swImages?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		images: enImages.map((src, i) => sharedValue({ v: src }, { v: swImages[i] }, "v", `${where}.images[${i}]`) ?? ""),
		id: "",
	};
}

function bathyLimitationsBuild(en, sw, where) {
	const bullets = (list, swList, key) => {
		const enList = list ?? [];
		const swL = swList ?? [];
		if (!Array.isArray(swL) || swL.length !== enList.length) {
			gap(where, `${key} count diverged (en=${enList.length} sw=${swL?.length})`);
		}
		return enList.map((bullet, i) => ({
			en: reqText(bullet, `${where}.${key}[${i}].en`),
			sw: reqText(swL[i], `${where}.${key}[${i}].sw`),
		}));
	};
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		factors: bullets(en.factors, sw.factors, "factors"),
		outputs: bullets(en.outputs, sw.outputs, "outputs"),
		id: "",
	};
}

function bathyDamsLakesBuild(en, sw, where) {
	const enImages = en.images ?? [];
	const swImages = sw.images ?? [];
	if (!Array.isArray(swImages) || swImages.length !== enImages.length) {
		gap(where, `image count diverged (en=${enImages.length} sw=${swImages?.length})`);
	}
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		images: enImages.map((src, i) => sharedValue({ v: src }, { v: swImages[i] }, "v", `${where}.images[${i}]`) ?? ""),
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
			};
		}),
		id: "",
	};
}

function bathyApplicationsBuild(en, sw, where) {
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
				image: sharedValue(item, swItem, "image", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
			};
		}),
		id: "",
	};
}

function bathyBeforeAfterBuild(en, sw, where) {
	const side = (node, swNode, key) => {
		const enItems = node?.items ?? [];
		const swItems = swNode?.items ?? [];
		if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
			gap(where, `${key}.items count diverged (en=${enItems.length} sw=${swItems?.length})`);
		}
		return {
			label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
			tagline: { en: optText(node?.tagline), sw: optText(swNode?.tagline) },
			items: enItems.map((point, i) => ({
				en: reqText(point, `${where}.${key}.items[${i}].en`),
				sw: reqText(swItems[i], `${where}.${key}.items[${i}].sw`),
			})),
		};
	};
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		flipHint: { en: optText(en.flipHint), sw: optText(sw.flipHint) },
		before: side(en.before, sw.before, "before"),
		after: side(en.after, sw.after, "after"),
		id: "before-after",
	};
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

// M11 batch 1 — contact page (2026-09-18): `contact:hero` → `contactHero`.
// Badge text is localized; `status` is shared (`active` = green pulse).
function contactHeroBuild(en, sw, where) {
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		badge: {
			text: { en: reqText(en.badge?.text, `${where}.badge.text.en`), sw: reqText(sw.badge?.text, `${where}.badge.text.sw`) },
			status: sharedValue(en.badge, sw.badge, "status", `${where}.badge`) ?? "",
		},
		id: "",
	};
}

// M11 batch 1 — contact page (2026-09-18): `contact:offices` →
// `contactOffices`. Proper nouns and contact details are shared
// (divergence aborts); address lines and notes are localized;
// coordinates are shared numbers.
function contactOfficesBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `office count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	const lines = (item, swItem, i) => {
		const enLines = item?.address_lines ?? [];
		const swLines = swItem?.address_lines ?? [];
		if (!Array.isArray(swLines) || swLines.length !== enLines.length) {
			gap(where, `items[${i}].address_lines count diverged (en=${enLines.length} sw=${swLines?.length})`);
		}
		return enLines.map((line, j) => ({
			en: reqText(line, `${where}.items[${i}].address_lines[${j}].en`),
			sw: reqText(swLines[j], `${where}.items[${i}].address_lines[${j}].sw`),
		}));
	};
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			const num = (node, key) => {
				const value = sharedValue(node, swItem, key, `${where}.items[${i}]`);
				if (typeof value !== "number") gap(`${where}.items[${i}]`, `"${key}" must be a number`);
				return typeof value === "number" ? value : 0;
			};
			return {
				id: sharedValue(item, swItem, "id", `${where}.items[${i}]`) ?? "",
				label: sharedValue(item, swItem, "label", `${where}.items[${i}]`) ?? "",
				city: sharedValue(item, swItem, "city", `${where}.items[${i}]`) ?? "",
				country: sharedValue(item, swItem, "country", `${where}.items[${i}]`) ?? "",
				flag: sharedValue(item, swItem, "flag", `${where}.items[${i}]`) ?? "",
				address_lines: lines(item, swItem, i),
				phone: sharedValue(item, swItem, "phone", `${where}.items[${i}]`) ?? "",
				email: sharedValue(item, swItem, "email", `${where}.items[${i}]`) ?? "",
				hours: sharedValue(item, swItem, "hours", `${where}.items[${i}]`) ?? "",
				type: sharedValue(item, swItem, "type", `${where}.items[${i}]`) ?? "",
				note: { en: optText(item.note), sw: optText(swItem.note) },
				lat: num(item, "lat"),
				lng: num(item, "lng"),
			};
		}),
		cta: {
			label: { en: reqText(en.cta?.label, `${where}.cta.label.en`), sw: reqText(sw.cta?.label, `${where}.cta.label.sw`) },
			href: sharedValue(en.cta, sw.cta, "href", `${where}.cta`) ?? "",
			icon: "",
		},
		id: "",
	};
}

// M11 batch 1 — contact page (2026-09-18): `contact:form` → `contactForm`
// (section chrome + submit/success strings only; the widget's field
// structure stays locale-owned — see the `contactForm` registry note).
function contactFormBuild(en, sw, where) {
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		submitLabel: { en: reqText(en.submit_label, `${where}.submit_label.en`), sw: reqText(sw.submit_label, `${where}.submit_label.sw`) },
		successHeading: { en: reqText(en.success_heading, `${where}.success_heading.en`), sw: reqText(sw.success_heading, `${where}.success_heading.sw`) },
		successBody: { en: reqText(en.success_body, `${where}.success_body.en`), sw: reqText(sw.success_body, `${where}.success_body.sw`) },
		id: "contact-form",
	};
}

// M11 batch 2 — careers page (2026-09-18): `careers:currentOpenings` →
// `careersOpenings`. Deadline values + action hrefs/icons are shared;
// titles, descriptions, TOR copy, action labels and deadline labels are
// localized. The hardcoded "Closed" pill stays English in both locales
// (legacy quirk, preserved — not migrated).
function careersOpeningsBuild(en, sw, where) {
	const opening = (item, swItem, key) => {
		const enActions = item?.actions ?? [];
		const swActions = swItem?.actions ?? [];
		if (!Array.isArray(swActions) || swActions.length !== enActions.length) {
			gap(where, `${key}.action count diverged (en=${enActions.length} sw=${swActions?.length})`);
		}
		const tor = item?.tor;
		const swTor = swItem?.tor;
		const bullets = (list, swList, name) => {
			const enList = list ?? [];
			const swL = swList ?? [];
			if (!Array.isArray(swL) || swL.length !== enList.length) {
				gap(where, `${key}.tor.${name} count diverged (en=${enList.length} sw=${swL?.length})`);
			}
			return enList.map((bullet, i) => ({
				en: reqText(bullet, `${where}.${key}.tor.${name}[${i}].en`),
				sw: reqText(swL[i], `${where}.${key}.tor.${name}[${i}].sw`),
			}));
		};
		return {
			icon: sharedValue(item, swItem, "icon", `${where}.${key}`) ?? "",
			title: { en: reqText(item.title, `${where}.${key}.title.en`), sw: reqText(swItem.title, `${where}.${key}.title.sw`) },
			applicationDeadline: {
				label: { en: optText(item.applicationDeadline?.label), sw: optText(swItem.applicationDeadline?.label) },
				value: sharedValue(item.applicationDeadline, swItem.applicationDeadline, "value", `${where}.${key}.applicationDeadline`) ?? "",
			},
			description: { en: reqText(item.description, `${where}.${key}.description.en`), sw: reqText(swItem.description, `${where}.${key}.description.sw`) },
			actions: enActions.map((action, i) => {
				const swAction = swActions[i] ?? {};
				return {
					icon: sharedValue(action, swAction, "icon", `${where}.${key}.actions[${i}]`) ?? "",
					label: { en: reqText(action.label, `${where}.${key}.actions[${i}].label.en`), sw: reqText(swAction.label, `${where}.${key}.actions[${i}].label.sw`) },
					href: sharedValue(action, swAction, "href", `${where}.${key}.actions[${i}]`) ?? "",
				};
			}),
			tor: {
				positionSummary: { en: reqText(tor?.positionSummary, `${where}.${key}.tor.positionSummary.en`), sw: reqText(swTor?.positionSummary, `${where}.${key}.tor.positionSummary.sw`) },
				duties: bullets(tor?.duties, swTor?.duties, "duties"),
				qualifications: bullets(tor?.qualifications, swTor?.qualifications, "qualifications"),
				engagement: { en: optText(tor?.engagement), sw: optText(swTor?.engagement) },
			},
		};
	};
	const list = (enList, swList, name) => {
		const swL = swList ?? [];
		if (!Array.isArray(swL) || swL.length !== (enList ?? []).length) {
			gap(where, `${name} count diverged (en=${enList?.length} sw=${swL?.length})`);
		}
		return (enList ?? []).map((item, i) => opening(item, swL[i] ?? {}, `${name}[${i}]`));
	};
	const labels = (node, swNode) => ({
		button: { en: optText(node?.button), sw: optText(swNode?.button) },
		modalTitle: { en: optText(node?.modalTitle), sw: optText(swNode?.modalTitle) },
		summaryTitle: { en: optText(node?.summaryTitle), sw: optText(swNode?.summaryTitle) },
		dutiesTitle: { en: optText(node?.dutiesTitle), sw: optText(swNode?.dutiesTitle) },
		qualificationsTitle: { en: optText(node?.qualificationsTitle), sw: optText(swNode?.qualificationsTitle) },
		engagementTitle: { en: optText(node?.engagementTitle), sw: optText(swNode?.engagementTitle) },
	});
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		torLabels: labels(en.torLabels, sw.torLabels),
		featuredOpenings: list(en.featuredOpenings, sw.featuredOpenings, "featuredOpenings"),
		items: list(en.items, sw.items, "items"),
		id: "openings",
	};
}

// M11 batch 2 — careers page (2026-09-18): `careers:applicationProcess` →
// `careersProcess` and `careers:statement` → `careersStatement` (subtitle +
// description each; `<bold>` markup travels verbatim and is parsed from
// data by the wrappers).
function careersProcessBuild(en, sw) {
	return {
		subtitle: { en: optText(en.subtitle), sw: optText(sw.subtitle) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		id: "",
	};
}

function careersStatementBuild(en, sw) {
	return {
		subtitle: { en: optText(en.subtitle), sw: optText(sw.subtitle) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		id: "",
	};
}

// M11 batch 3 — company-profile page (2026-09-18):
// `company-profile:companyProfileView` → `companyProfileViewer`. The PDF
// URL is shared; header copy, download label and viewer title are
// localized.
function companyProfileViewerBuild(en, sw, where) {
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		pdfLink: sharedValue(en, sw, "pdfLink", where) ?? "",
		downloadLabel: { en: optText(en.downloadLabel), sw: optText(sw.downloadLabel) },
		viewerTitle: { en: optText(en.viewerTitle), sw: optText(sw.viewerTitle) },
		id: "profile-viewer",
	};
}

// M11 batch 4 — about page (2026-09-18): `about:aerialSurveying` →
// `aboutAerialSurveying`. Titles, descriptions and popup copy are
// localized (9 items each); presentation stays in the wrapper.
function aboutAerialSurveyingBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
				popupContent: { en: reqText(item.popupContent, `${where}.items[${i}].popupContent.en`), sw: reqText(swItem.popupContent, `${where}.items[${i}].popupContent.sw`) },
			};
		}),
		id: "",
	};
}

// M11 batch 4 — about page (2026-09-18): `about:landSurveying` →
// `aboutLandSurveying`. The `<primary>` description markup travels
// verbatim; the unrendered legacy `itemsTitle` key is dropped (noted in
// the registry definition).
function aboutLandSurveyingBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
			};
		}),
		id: "",
	};
}

// M11 batch 4 — about page (2026-09-18): `about:impactAcrossAfrica` →
// `aboutImpact`. The image path and card icon are shared; header copy,
// card title and points are localized.
function aboutImpactBuild(en, sw, where) {
	const why = en.whyChooseUs ?? {};
	const swWhy = sw.whyChooseUs ?? {};
	const enPoints = why.items ?? [];
	const swPoints = swWhy.items ?? [];
	if (!Array.isArray(swPoints) || swPoints.length !== enPoints.length) {
		gap(where, `whyChooseUs.items count diverged (en=${enPoints.length} sw=${swPoints?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		image: sharedValue(en, sw, "image", where) ?? "",
		description: { en: optText(en.description), sw: optText(sw.description) },
		whyChooseUs: {
			icon: sharedValue(why, swWhy, "icon", `${where}.whyChooseUs`) ?? "",
			title: { en: reqText(why.title, `${where}.whyChooseUs.title.en`), sw: reqText(swWhy.title, `${where}.whyChooseUs.title.sw`) },
			items: enPoints.map((point, i) => ({
				en: reqText(point, `${where}.whyChooseUs.items[${i}].en`),
				sw: reqText(swPoints[i], `${where}.whyChooseUs.items[${i}].sw`),
			})),
		},
		id: "",
	};
}

// M11 batch 5 — hubs (2026-09-18): `surveying/landing:services` →
// `surveyingServices`. Card icons/hrefs + map image are shared;
// titles and descriptions are localized.
function surveyingServicesBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		image: sharedValue(en, sw, "image", where) ?? "",
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
				href: sharedValue(item, swItem, "href", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

// M11 batch 5 — hubs (2026-09-18): `surveying/landing:process` →
// `surveyingProcess` (indexed/watermarked cards; legacy items carry no
// icons). Titles and descriptions are localized.
function surveyingProcessBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
			};
		}),
		id: "",
	};
}

// M11 batch 5 — hubs (2026-09-18): `civil/landing:hero` → `civilHero`
// (bespoke diagonal hero). Image + CTA hrefs are shared; all other
// strings are localized.
function civilHeroBuild(en, sw, where) {
	const cta = (node, swNode, key) => ({
		label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
		href: sharedValue(node, swNode, "href", `${where}.${key}`) ?? "",
		icon: "",
	});
	return {
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		image: sharedValue(en, sw, "image", where) ?? "",
		ctaPrimary: cta(en.ctaPrimary, sw.ctaPrimary, "ctaPrimary"),
		ctaSecondary: cta(en.ctaSecondary, sw.ctaSecondary, "ctaSecondary"),
		id: "",
	};
}

// M11 batch 5 — hubs (2026-09-18): `civil/landing:process` → `civilProcess`
// (image stepper + step rail). Image + step icons are shared; titles and
// descriptions are localized.
function civilProcessBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		image: sharedValue(en, sw, "image", where) ?? "",
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
			};
		}),
		id: "",
	};
}

// M11 batch 5 — hubs (2026-09-18): any `<Deliverables ns=…>` node → shared
// `deliverables`. Item icons are shared; titles, formats and descriptions
// are localized; item images are per-locale (civil items prove paths can
// diverge); `tone` reproduces the wrapper `className` variance. M11 batch 13
// (2026-09-19): optional `id` param — the GPR wrapper carries
// `id="deliverables"` for its jump-nav anchor (other pages store "").
function deliverablesBuild(tone, id = "") {
	return (en, sw, where) => {
		const enItems = en.items ?? [];
		const swItems = sw.items ?? [];
		if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
			gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
		}
		const enChecks = en.checks ?? [];
		const swChecks = sw.checks ?? [];
		if (!Array.isArray(swChecks) || swChecks.length !== enChecks.length) {
			gap(where, `checks count diverged (en=${enChecks.length} sw=${swChecks?.length})`);
		}
		return {
			tag: { en: optText(en.tag), sw: optText(sw.tag) },
			headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
			description: { en: optText(en.description), sw: optText(sw.description) },
			liveLabel: { en: optText(en.liveLabel), sw: optText(sw.liveLabel) },
			checks: enChecks.map((check, i) => ({
				en: reqText(check, `${where}.checks[${i}].en`),
				sw: reqText(swChecks[i], `${where}.checks[${i}].sw`),
			})),
			items: enItems.map((item, i) => {
				const swItem = swItems[i] ?? {};
				return {
					title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
					format: { en: optText(item.format), sw: optText(swItem.format) },
					icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
					image: { en: optText(item.image), sw: optText(swItem.image) },
					description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
				};
			}),
			tone,
			id,
		};
	};
}

// M11 batch 6 — topographical-surveys page (2026-09-18): the six bespoke
// grid/map tails → unique sections. Icons/images shared; titles,
// descriptions and children localized.
function topoWhenYouNeedBuild(en, sw, where) {
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
			const enChildren = item?.children ?? [];
			const swChildren = swItem?.children ?? [];
			if (!Array.isArray(swChildren) || swChildren.length !== enChildren.length) {
				gap(where, `items[${i}].children count diverged (en=${enChildren.length} sw=${swChildren?.length})`);
			}
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: optText(item.description), sw: optText(swItem.description) },
				children: enChildren.map((child, j) => ({
					title: { en: reqText(child.title, `${where}.items[${i}].children[${j}].title.en`), sw: reqText(swChildren[j]?.title, `${where}.items[${i}].children[${j}].title.sw`) },
					description: { en: optText(child.description), sw: optText(swChildren[j]?.description) },
				})),
			};
		}),
		id: "",
	};
}

function topoCardGridBuild() {
	return (en, sw, where) => {
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
					title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
					description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
				};
			}),
			id: "",
		};
	};
}

function topoDetailedSurveysBuild(en, sw, where) {
	const base = topoCardGridBuild()(en, sw, where);
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	return {
		...base,
		items: enItems.map((item, i) => ({
			...base.items[i],
			image: sharedValue(item, swItems[i] ?? {}, "image", `${where}.items[${i}]`) ?? "",
		})),
	};
}

function topoInstrumentsBuild(en, sw, where) {
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
				label: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(swItem.label, `${where}.items[${i}].label.sw`) },
				image: sharedValue(item, swItem, "image", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

function topoSampleMapBuild(en, sw, where) {
	const map = en.map ?? {};
	const swMap = sw.map ?? {};
	const enHighlights = map.items ?? [];
	const swHighlights = swMap.items ?? [];
	if (!Array.isArray(swHighlights) || swHighlights.length !== enHighlights.length) {
		gap(where, `map.items count diverged (en=${enHighlights.length} sw=${swHighlights?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		map: {
			title: { en: reqText(map.title, `${where}.map.title.en`), sw: reqText(swMap.title, `${where}.map.title.sw`) },
			description: { en: optText(map.description), sw: optText(swMap.description) },
			image: sharedValue(map, swMap, "image", `${where}.map`) ?? "",
			items: enHighlights.map((highlight, i) => ({
				en: reqText(highlight, `${where}.map.items[${i}].en`),
				sw: reqText(swHighlights[i], `${where}.map.items[${i}].sw`),
			})),
		},
		id: "",
	};
}

// M11 batch 7 — sectional-properties page (2026-09-18): the five bespoke
// tails → unique sections. Icons/hrefs/phase keys/day counts shared;
// titles, descriptions, points, impacts, labels localized. The locale
// `ctaPrimary`/`ctaSecondary` workflow keys and the unrendered
// `diagramLabel` key are dropped (see registry notes).
function sectionalWhatIsBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	const bullets = (list, swList, key) => {
		const enList = list ?? [];
		const swL = swList ?? [];
		if (!Array.isArray(swL) || swL.length !== enList.length) {
			gap(where, `${key} count diverged (en=${enList.length} sw=${swL?.length})`);
		}
		return enList.map((bullet, i) => ({
			en: reqText(bullet, `${where}.${key}[${i}].en`),
			sw: reqText(swL[i], `${where}.${key}[${i}].sw`),
		}));
	};
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: optText(en.headline), sw: optText(sw.headline) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				points: bullets(item.points, swItem.points, `items[${i}].points`),
				impactsLabel: { en: optText(item.impactsLabel), sw: optText(swItem.impactsLabel) },
				impacts: bullets(item.impacts, swItem.impacts, `items[${i}].impacts`),
			};
		}),
		id: "",
	};
}

function sectionalServicesDetailBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
			};
		}),
		id: "",
	};
}

function sectionalWorkflowBuild(en, sw, where) {
	const enSteps = en.steps ?? [];
	const swSteps = sw.steps ?? [];
	if (!Array.isArray(swSteps) || swSteps.length !== enSteps.length) {
		gap(where, `step count diverged (en=${enSteps.length} sw=${swSteps?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		steps: enSteps.map((step, i) => {
			const swStep = swSteps[i] ?? {};
			return {
				phase: sharedValue(step, swStep, "phase", `${where}.steps[${i}]`) ?? "",
				label: { en: reqText(step.label, `${where}.steps[${i}].label.en`), sw: reqText(swStep.label, `${where}.steps[${i}].label.sw`) },
				description: { en: reqText(step.description, `${where}.steps[${i}].description.en`), sw: reqText(swStep.description, `${where}.steps[${i}].description.sw`) },
			};
		}),
		outcome: { en: optText(en.outcome), sw: optText(sw.outcome) },
		id: "",
	};
}

function sectionalTimelineBuild(en, sw, where) {
	const enStages = en.stages ?? [];
	const swStages = sw.stages ?? [];
	if (!Array.isArray(swStages) || swStages.length !== enStages.length) {
		gap(where, `stage count diverged (en=${enStages.length} sw=${swStages?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: optText(en.headline), sw: optText(sw.headline) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		barLabel: { en: optText(en.barLabel), sw: optText(sw.barLabel) },
		startLabel: { en: optText(en.startLabel), sw: optText(sw.startLabel) },
		endLabel: { en: optText(en.endLabel), sw: optText(sw.endLabel) },
		costNote: { en: optText(en.costNote), sw: optText(sw.costNote) },
		stages: enStages.map((stage, i) => {
			const swStage = swStages[i] ?? {};
			const days = sharedValue(stage, swStage, "days", `${where}.stages[${i}]`);
			if (typeof days !== "number") gap(`${where}.stages[${i}]`, `"days" must be a number`);
			return {
				label: { en: reqText(stage.label, `${where}.stages[${i}].label.en`), sw: reqText(swStage.label, `${where}.stages[${i}].label.sw`) },
				range: { en: optText(stage.range), sw: optText(swStage.range) },
				days: typeof days === "number" ? days : 1,
			};
		}),
		ctaEmail: {
			label: { en: reqText(en.ctaEmail?.label, `${where}.ctaEmail.label.en`), sw: reqText(sw.ctaEmail?.label, `${where}.ctaEmail.label.sw`) },
			href: sharedValue(en.ctaEmail, sw.ctaEmail, "href", `${where}.ctaEmail`) ?? "",
			icon: "",
		},
		id: "timeline",
	};
}

function sectionalWhoNeedsBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		linkLabel: { en: optText(en.linkLabel), sw: optText(sw.linkLabel) },
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
				href: sharedValue(item, swItem, "href", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
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

// M11 batch 9 — resource-mapping page (2026-09-18): the bespoke tails →
// unique sections. Icons/hrefs/phase keys shared; titles, descriptions,
// points, levels localized. Sector `tone` follows the wrapper (surface
// sectors vs default).
function rmWhatIsBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
			};
		}),
		closingStatement: { en: optText(en.closingStatement), sw: optText(sw.closingStatement) },
		id: "",
	};
}

function rmTypesBuild(en, sw, where) {
	const enCategories = en.categories ?? [];
	const swCategories = sw.categories ?? [];
	if (!Array.isArray(swCategories) || swCategories.length !== enCategories.length) {
		gap(where, `category count diverged (en=${enCategories.length} sw=${swCategories?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		categories: enCategories.map((category, i) => {
			const swCategory = swCategories[i] ?? {};
			const enEntries = category?.items ?? [];
			const swEntries = swCategory?.items ?? [];
			if (!Array.isArray(swEntries) || swEntries.length !== enEntries.length) {
				gap(where, `categories[${i}].items count diverged (en=${enEntries.length} sw=${swEntries?.length})`);
			}
			return {
				title: { en: reqText(category.title, `${where}.categories[${i}].title.en`), sw: reqText(swCategory.title, `${where}.categories[${i}].title.sw`) },
				icon: sharedValue(category, swCategory, "icon", `${where}.categories[${i}]`) ?? "",
				items: enEntries.map((entry, j) => ({
					en: reqText(entry, `${where}.categories[${i}].items[${j}].en`),
					sw: reqText(swEntries[j], `${where}.categories[${i}].items[${j}].sw`),
				})),
			};
		}),
		id: "",
	};
}

function rmSectorBuild(tone) {
	return (en, sw, where) => {
		const enImages = en.images ?? [];
		const swImages = sw.images ?? [];
		if (!Array.isArray(swImages) || swImages.length !== enImages.length) {
			gap(where, `image count diverged (en=${enImages.length} sw=${swImages?.length})`);
		}
		const enItems = en.items ?? [];
		const swItems = sw.items ?? [];
		if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
			gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
		}
		return {
			tag: { en: optText(en.tag), sw: optText(sw.tag) },
			headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
			description: { en: optText(en.description), sw: optText(sw.description) },
			// Images are per-locale (legacy paths diverge: png vs jpg, gif vs jpg)
			images: { en: enImages, sw: swImages },
			items: enItems.map((item, i) => {
				const swItem = swItems[i] ?? {};
				return {
					icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
					title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
					description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
				};
			}),
			tone,
			id: "",
		};
	};
}

function rmWorkflowBuild(en, sw, where) {
	const enSteps = en.steps ?? [];
	const swSteps = sw.steps ?? [];
	if (!Array.isArray(swSteps) || swSteps.length !== enSteps.length) {
		gap(where, `step count diverged (en=${enSteps.length} sw=${swSteps?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		steps: enSteps.map((step, i) => {
			const swStep = swSteps[i] ?? {};
			return {
				phase: sharedValue(step, swStep, "phase", `${where}.steps[${i}]`) ?? "",
				label: { en: reqText(step.label, `${where}.steps[${i}].label.en`), sw: reqText(swStep.label, `${where}.steps[${i}].label.sw`) },
				description: { en: reqText(step.description, `${where}.steps[${i}].description.en`), sw: reqText(swStep.description, `${where}.steps[${i}].description.sw`) },
			};
		}),
		outcome: { en: optText(en.outcome), sw: optText(sw.outcome) },
		id: "",
	};
}

function rmWhoUsesBuild(en, sw, where) {
	const enCategories = en.categories ?? [];
	const swCategories = sw.categories ?? [];
	if (!Array.isArray(swCategories) || swCategories.length !== enCategories.length) {
		gap(where, `category count diverged (en=${enCategories.length} sw=${swCategories?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		categories: enCategories.map((category, i) => {
			const swCategory = swCategories[i] ?? {};
			const enItems = category?.items ?? [];
			const swItems = swCategory?.items ?? [];
			if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
				gap(where, `categories[${i}].items count diverged (en=${enItems.length} sw=${swItems?.length})`);
			}
			return {
				title: { en: reqText(category.title, `${where}.categories[${i}].title.en`), sw: reqText(swCategory.title, `${where}.categories[${i}].title.sw`) },
				icon: sharedValue(category, swCategory, "icon", `${where}.categories[${i}]`) ?? "",
				items: enItems.map((item, j) => {
					const swItem = swItems[j] ?? {};
					// Legacy items are plain strings; migrate as title-only cards
					const enTitle = typeof item === "string" ? item : (item?.title ?? "");
					const swTitle = typeof swItem === "string" ? swItem : (swItem?.title ?? "");
					return {
						title: { en: reqText(enTitle, `${where}.categories[${i}].items[${j}].en`), sw: reqText(swTitle, `${where}.categories[${i}].items[${j}].sw`) },
						description: { en: "", sw: "" },
						icon: "",
						href: "",
					};
				}),
			};
		}),
		id: "",
	};
}

function rmTechStackBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				note: { en: optText(item.note), sw: optText(swItem.note) },
				href: sharedValue(item, swItem, "href", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

function rmDataAccuracyBuild(en, sw, where) {
	const enFactors = en.factors ?? [];
	const swFactors = sw.factors ?? [];
	if (!Array.isArray(swFactors) || swFactors.length !== enFactors.length) {
		gap(where, `factor count diverged (en=${enFactors.length} sw=${swFactors?.length})`);
	}
	const enLevels = en.levels ?? [];
	const swLevels = sw.levels ?? [];
	if (!Array.isArray(swLevels) || swLevels.length !== enLevels.length) {
		gap(where, `level count diverged (en=${enLevels.length} sw=${swLevels?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		factors: enFactors.map((factor, i) => ({
			en: reqText(factor, `${where}.factors[${i}].en`),
			sw: reqText(swFactors[i], `${where}.factors[${i}].sw`),
		})),
		levels: enLevels.map((level, i) => {
			const swLevel = swLevels[i] ?? {};
			return {
				label: { en: reqText(level.label, `${where}.levels[${i}].label.en`), sw: reqText(swLevel.label, `${where}.levels[${i}].label.sw`) },
				accuracy: { en: reqText(level.accuracy, `${where}.levels[${i}].accuracy.en`), sw: reqText(swLevel.accuracy, `${where}.levels[${i}].accuracy.sw`) },
			};
		}),
		id: "",
	};
}

function rmFinalCtaBuild(en, sw, where) {
	const enActions = en.actions ?? [];
	const swActions = sw.actions ?? [];
	if (!Array.isArray(swActions) || swActions.length !== enActions.length) {
		gap(where, `action count diverged (en=${enActions.length} sw=${swActions?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		note: { en: optText(en.note), sw: optText(sw.note) },
		actions: enActions.map((action, i) => {
			const swAction = swActions[i] ?? {};
			return {
				icon: sharedValue(action, swAction, "icon", `${where}.actions[${i}]`) ?? "",
				label: { en: reqText(action.label, `${where}.actions[${i}].label.en`), sw: reqText(swAction.label, `${where}.actions[${i}].label.sw`) },
				description: { en: optText(action.description), sw: optText(swAction.description) },
				href: sharedValue(action, swAction, "href", `${where}.actions[${i}]`) ?? "",
			};
		}),
		id: "get-started",
	};
}

// M11 batch 11 — aerial-surveys page (2026-09-19): the twelve bespoke tails
// → unique sections (+ shared `deliverables`). Icons, image paths, hrefs,
// watermarks and phase keys shared; all other strings localized. Fixed
// presentation (featured cards, bento spans, modal, mosaic, shimmer bands)
// stays in the wrappers.
function aerialIntroBuild(en, sw, where) {
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
		ctaPrimary: {
			label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
			href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
			icon: "",
		},
		id: "",
	};
}

function aerialWhyDronesBuild(en, sw, where) {
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
				stat: { en: optText(item.stat), sw: optText(swItem.stat) },
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: optText(item.description), sw: optText(swItem.description) },
			};
		}),
		id: "",
	};
}

function aerialServicesBuild(en, sw, where) {
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
			return {
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
				popupContent: { en: optText(item.popupContent), sw: optText(swItem.popupContent) },
			};
		}),
		id: "",
	};
}

// M13 batch 1: shared `workflow` build — same contract as the retired
// `aerialWorkflowBuild`, but the outcome key is `outcome` (the shared
// `WorkflowSection` prop) instead of the wrapper-local `outcomeLabel`.
// M13 batch 2: v2 — steps carry the shared `phase` key (cadastral-style
// phased timelines), `cta`/`ctaNote` tolerate pages without a closing CTA,
// and `acquisition` fills the shared preset (default hydrographic, or
// satellite for land-based acquisition pages like cadastral).
function workflowBuild(acquisition = "default") {
	return (en, sw, where) => {
		const enSteps = en.steps ?? [];
		const swSteps = sw.steps ?? [];
		if (!Array.isArray(swSteps) || swSteps.length !== enSteps.length) {
			gap(where, `step count diverged (en=${enSteps.length} sw=${swSteps?.length})`);
		}
		return {
			tag: { en: optText(en.tag), sw: optText(sw.tag) },
			headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
			description: { en: optText(en.description), sw: optText(sw.description) },
			outcome: { en: optText(en.outcomeLabel ?? en.outcome), sw: optText(sw.outcomeLabel ?? sw.outcome) },
			steps: enSteps.map((step, i) => {
				const swStep = swSteps[i] ?? {};
				return {
					phase: sharedValue(step, swStep, "phase", `${where}.steps[${i}]`) ?? "",
					icon: sharedValue(step, swStep, "icon", `${where}.steps[${i}]`) ?? "",
					label: { en: reqText(step.label, `${where}.steps[${i}].label.en`), sw: reqText(swStep.label, `${where}.steps[${i}].label.sw`) },
					description: { en: reqText(step.description, `${where}.steps[${i}].description.en`), sw: reqText(swStep.description, `${where}.steps[${i}].description.sw`) },
				};
			}),
			ctaNote: { en: optText(en.ctaNote), sw: optText(sw.ctaNote) },
			cta: {
				label: { en: optText(en.cta?.label), sw: optText(sw.cta?.label) },
				href: sharedValue(en.cta ?? {}, sw.cta ?? {}, "href", where) ?? "",
				icon: sharedValue(en.cta ?? {}, sw.cta ?? {}, "icon", where) ?? "",
			},
			acquisition,
			id: "",
		};
	};
}

// M13 batch 1: shared `finalCta` build factory — same contract as the
// page-local final-CTA builds, plus the wrapper-hardcoded presentation
// literals (`watermark`/`columns`/`align`) filled per page.
// M13 batch 3: `opts` covers the remaining wrapper literals —
// `descriptionTone` (accent lede pages), `actionIconFallback` and the
// legacy anchor `id` default (entries store it explicitly so the Keystatic
// branch keeps the anchor without a renderer default). `note` always
// migrates from the locale node (empty where the page has none).
function finalCtaBuild(watermark, columns, align, opts = {}) {
	const { descriptionTone = "muted", actionIconFallback = "", id = "" } = opts;
	return (en, sw, where) => {
		const enActions = en.actions ?? [];
		const swActions = sw.actions ?? [];
		if (!Array.isArray(swActions) || swActions.length !== enActions.length) {
			gap(where, `action count diverged (en=${enActions.length} sw=${swActions?.length})`);
		}
		return {
			tag: { en: optText(en.tag), sw: optText(sw.tag) },
			headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
			description: { en: optText(en.description), sw: optText(sw.description) },
			descriptionTone,
			note: { en: optText(en.note), sw: optText(sw.note) },
			actionsLabel: { en: optText(en.actionsLabel), sw: optText(sw.actionsLabel) },
			actions: enActions.map((action, i) => {
				const swAction = swActions[i] ?? {};
				return {
					icon: sharedValue(action, swAction, "icon", `${where}.actions[${i}]`) ?? "",
					label: { en: reqText(action.label, `${where}.actions[${i}].label.en`), sw: reqText(swAction.label, `${where}.actions[${i}].label.sw`) },
					description: { en: optText(action.description), sw: optText(swAction.description) },
					href: sharedValue(action, swAction, "href", `${where}.actions[${i}]`) ?? "",
				};
			}),
			actionIconFallback,
			watermark,
			columns: String(columns),
			align,
			id,
		};
	};
}

function aerialSurveyingGridBuild(en, sw, where) {
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
				label: { en: reqText(item.label, `${where}.items[${i}].label.en`), sw: reqText(swItem.label, `${where}.items[${i}].label.sw`) },
				image: sharedValue(item, swItem, "image", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

function aerialIndustriesBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: optText(item.description), sw: optText(swItem.description) },
				href: sharedValue(item, swItem, "href", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

// Industry + capability CTAs share the same data contract (split vs
// centered presentation stays in the wrappers).
function aerialCtaBuild(en, sw, where) {
	const link = (node, swNode, key) => ({
		label: { en: optText(node?.label), sw: optText(swNode?.label) },
		href: sharedValue(node, swNode, "href", `${where}.${key}`) ?? "",
		icon: sharedValue(node, swNode, "icon", `${where}.${key}`) ?? "",
	});
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		watermark: sharedValue(en, sw, "watermark", where) ?? "",
		primary: link(en.primary, sw.primary, "primary"),
		secondary: link(en.secondary, sw.secondary, "secondary"),
		id: "",
	};
}

function aerialTechStackBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				note: { en: optText(item.note), sw: optText(swItem.note) },
				href: sharedValue(item, swItem, "href", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

function aerialProjectsBuild(en, sw, where) {
	const enImages = en.images ?? [];
	const swImages = sw.images ?? [];
	if (!Array.isArray(swImages) || swImages.length !== enImages.length) {
		gap(where, `image count diverged (en=${enImages.length} sw=${swImages?.length})`);
	}
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		images: enImages.map((src, i) => sharedValue({ v: src }, { v: swImages[i] }, "v", `${where}.images[${i}]`) ?? ""),
		description: { en: optText(en.description), sw: optText(sw.description) },
		items: enItems.map((item, i) => ({
			en: reqText(item, `${where}.items[${i}].en`),
			sw: reqText(swItems[i], `${where}.items[${i}].sw`),
		})),
		id: "",
	};
}

function aerialAdditionalServicesBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		items: enItems.map((item, i) => ({
			en: reqText(item, `${where}.items[${i}].en`),
			sw: reqText(swItems[i], `${where}.items[${i}].sw`),
		})),
		description: { en: optText(en.description), sw: optText(sw.description) },
		id: "",
	};
}

// M11 batch 12 — cadastral-surveys page (2026-09-19): the nine bespoke
// tails → unique sections. Icons, image paths, hrefs, watermarks, phase
// keys, day counts and featured flags shared; all other strings localized.
// `whatsABoundarySurvey` stays DORMANT (commented out of the route — never
// migrated). Fixed presentation (sticky splits, computed bars, shimmer
// bands, positional spans) stays in the wrappers.
function cadastralPostHeroCtaBuild(en, sw, where) {
	const action = (node, swNode, key) => ({
		label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
		href: sharedValue(node, swNode, "href", `${where}.${key}`) ?? "",
		icon: sharedValue(node, swNode, "icon", `${where}.${key}`) ?? "",
	});
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		ctaPrimary: action(en.ctaPrimary, sw.ctaPrimary, "ctaPrimary"),
		ctaSecondary: action(en.ctaSecondary, sw.ctaSecondary, "ctaSecondary"),
		id: "",
	};
}

function cadastralWhenYouNeedBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		image: sharedValue(en, sw, "image", where) ?? "",
		imageBadge: { en: optText(en.imageBadge), sw: optText(sw.imageBadge) },
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: optText(item.description), sw: optText(swItem.description) },
				href: sharedValue(item, swItem, "href", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

function cadastralProcessCtaBuild(en, sw, where) {
	const action = (node, swNode, key) => ({
		label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
		href: sharedValue(node, swNode, "href", `${where}.${key}`) ?? "",
		icon: sharedValue(node, swNode, "icon", `${where}.${key}`) ?? "",
	});
	const enChips = en.chips ?? [];
	const swChips = sw.chips ?? [];
	if (!Array.isArray(swChips) || swChips.length !== enChips.length) {
		gap(where, `chip count diverged (en=${enChips.length} sw=${swChips?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		ctaPrimary: action(en.ctaPrimary, sw.ctaPrimary, "ctaPrimary"),
		ctaSecondary: action(en.ctaSecondary, sw.ctaSecondary, "ctaSecondary"),
		chips: enChips.map((chip, i) => ({
			en: reqText(chip, `${where}.chips[${i}].en`),
			sw: reqText(swChips[i], `${where}.chips[${i}].sw`),
		})),
		id: "",
	};
}

function cadastralCostBuild(en, sw, where) {
	const enTiers = en.tiers ?? [];
	const swTiers = sw.tiers ?? [];
	if (!Array.isArray(swTiers) || swTiers.length !== enTiers.length) {
		gap(where, `tier count diverged (en=${enTiers.length} sw=${swTiers?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		featuredLabel: { en: optText(en.featuredLabel), sw: optText(sw.featuredLabel) },
		tiers: enTiers.map((tier, i) => {
			const swTier = swTiers[i] ?? {};
			const enFeatures = tier.features ?? [];
			const swFeatures = swTier.features ?? [];
			if (!Array.isArray(swFeatures) || swFeatures.length !== enFeatures.length) {
				gap(where, `feature count diverged (en=${enFeatures.length} sw=${swFeatures?.length})`);
			}
			return {
				icon: sharedValue(tier, swTier, "icon", `${where}.tiers[${i}]`) ?? "",
				title: { en: reqText(tier.title, `${where}.tiers[${i}].title.en`), sw: reqText(swTier.title, `${where}.tiers[${i}].title.sw`) },
				price: { en: reqText(tier.price, `${where}.tiers[${i}].price.en`), sw: reqText(swTier.price, `${where}.tiers[${i}].price.sw`) },
				priceUnit: { en: optText(tier.priceUnit), sw: optText(swTier.priceUnit) },
				note: { en: optText(tier.note), sw: optText(swTier.note) },
				features: enFeatures.map((feature, j) => ({
					en: reqText(feature, `${where}.tiers[${i}].features[${j}].en`),
					sw: reqText(swFeatures[j], `${where}.tiers[${i}].features[${j}].sw`),
				})),
				featured: sharedValue(tier, swTier, "featured", `${where}.tiers[${i}]`) ?? false,
			};
		}),
		cta: {
			label: { en: reqText(en.cta?.label, `${where}.cta.label.en`), sw: reqText(sw.cta?.label, `${where}.cta.label.sw`) },
			href: sharedValue(en.cta, sw.cta, "href", where) ?? "",
			icon: sharedValue(en.cta, sw.cta, "icon", where) ?? "",
		},
		id: "",
	};
}

function cadastralTimelineBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		scaleNote: { en: optText(en.scaleNote), sw: optText(sw.scaleNote) },
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				range: { en: optText(item.range), sw: optText(swItem.range) },
				minDays: sharedValue(item, swItem, "minDays", `${where}.items[${i}]`) ?? null,
				maxDays: sharedValue(item, swItem, "maxDays", `${where}.items[${i}]`) ?? null,
				description: { en: optText(item.description), sw: optText(swItem.description) },
			};
		}),
		note: { en: optText(en.note), sw: optText(sw.note) },
		cta: {
			label: { en: reqText(en.cta?.label, `${where}.cta.label.en`), sw: reqText(sw.cta?.label, `${where}.cta.label.sw`) },
			href: sharedValue(en.cta, sw.cta, "href", where) ?? "",
			icon: sharedValue(en.cta, sw.cta, "icon", where) ?? "",
		},
		id: "",
	};
}

function cadastralComplianceBuild(en, sw, where) {
	const enChecklist = en.checklist ?? [];
	const swChecklist = sw.checklist ?? [];
	if (!Array.isArray(swChecklist) || swChecklist.length !== enChecklist.length) {
		gap(where, `checklist count diverged (en=${enChecklist.length} sw=${swChecklist?.length})`);
	}
	const enRelated = en.related ?? [];
	const swRelated = sw.related ?? [];
	if (!Array.isArray(swRelated) || swRelated.length !== enRelated.length) {
		gap(where, `related count diverged (en=${enRelated.length} sw=${swRelated?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		checklistTitle: { en: optText(en.checklistTitle), sw: optText(sw.checklistTitle) },
		checklist: enChecklist.map((item, i) => {
			const swItem = swChecklist[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.checklist[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.checklist[${i}].title.en`), sw: reqText(swItem.title, `${where}.checklist[${i}].title.sw`) },
				description: { en: optText(item.description), sw: optText(swItem.description) },
			};
		}),
		relatedLabel: { en: optText(en.relatedLabel), sw: optText(sw.relatedLabel) },
		related: enRelated.map((link, i) => {
			const swLink = swRelated[i] ?? {};
			return {
				label: { en: reqText(link.label, `${where}.related[${i}].label.en`), sw: reqText(swLink.label, `${where}.related[${i}].label.sw`) },
				href: sharedValue(link, swLink, "href", `${where}.related[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

function cadastralCaseStudyBuild(en, sw, where) {
	const strings = (list, swList, key) => {
		const enList = list ?? [];
		const swL = swList ?? [];
		if (!Array.isArray(swL) || swL.length !== enList.length) {
			gap(where, `${key} count diverged (en=${enList.length} sw=${swL?.length})`);
		}
		return enList.map((entry, i) => ({
			en: reqText(entry, `${where}.${key}[${i}].en`),
			sw: reqText(swL[i], `${where}.${key}[${i}].sw`),
		}));
	};
	const images = (list, swList, key) => {
		const enList = list ?? [];
		const swL = swList ?? [];
		if (!Array.isArray(swL) || swL.length !== enList.length) {
			gap(where, `${key} count diverged (en=${enList.length} sw=${swL?.length})`);
		}
		return enList.map((image, i) => {
			const swImage = swL[i] ?? {};
			return {
				src: sharedValue(image, swImage, "src", `${where}.${key}[${i}]`) ?? "",
				alt: { en: optText(image.alt), sw: optText(swImage.alt) },
			};
		});
	};
	const enCs = en, swCs = sw;
	return {
		tag: { en: optText(enCs.tag), sw: optText(swCs.tag) },
		headline: { en: reqText(enCs.headline, `${where}.headline.en`), sw: reqText(swCs.headline, `${where}.headline.sw`) },
		subtitle: { en: optText(enCs.subtitle), sw: optText(swCs.subtitle) },
		overview: {
			label: { en: reqText(enCs.overview?.label, `${where}.overview.label.en`), sw: reqText(swCs.overview?.label, `${where}.overview.label.sw`) },
			paragraphs: strings(enCs.overview?.paragraphs, swCs.overview?.paragraphs, "overview.paragraphs"),
			criticalTitle: { en: optText(enCs.overview?.criticalTitle), sw: optText(swCs.overview?.criticalTitle) },
			critical: strings(enCs.overview?.critical, swCs.overview?.critical, "overview.critical"),
			deployNote: { en: optText(enCs.overview?.deployNote), sw: optText(swCs.overview?.deployNote) },
			deployIcon: sharedValue(enCs.overview, swCs.overview, "deployIcon", `${where}.overview`) ?? "",
		},
		challenge: {
			label: { en: reqText(enCs.challenge?.label, `${where}.challenge.label.en`), sw: reqText(swCs.challenge?.label, `${where}.challenge.label.sw`) },
			intro: { en: optText(enCs.challenge?.intro), sw: optText(swCs.challenge?.intro) },
			items: strings(enCs.challenge?.items, swCs.challenge?.items, "challenge.items"),
			images: images(enCs.challenge?.images, swCs.challenge?.images, "challenge.images"),
		},
		methodology: {
			label: { en: reqText(enCs.methodology?.label, `${where}.methodology.label.en`), sw: reqText(swCs.methodology?.label, `${where}.methodology.label.sw`) },
			intro: { en: optText(enCs.methodology?.intro), sw: optText(swCs.methodology?.intro) },
			steps: (() => {
				const enSteps = enCs.methodology?.steps ?? [];
				const swSteps = swCs.methodology?.steps ?? [];
				if (!Array.isArray(swSteps) || swSteps.length !== enSteps.length) {
					gap(where, `methodology.steps count diverged (en=${enSteps.length} sw=${swSteps?.length})`);
				}
				return enSteps.map((step, i) => {
					const swStep = swSteps[i] ?? {};
					return {
						title: { en: reqText(step.title, `${where}.methodology.steps[${i}].title.en`), sw: reqText(swStep.title, `${where}.methodology.steps[${i}].title.sw`) },
						points: strings(step.points, swStep.points, `methodology.steps[${i}].points`),
					};
				});
			})(),
			images: images(enCs.methodology?.images, swCs.methodology?.images, "methodology.images"),
		},
		outcome: {
			label: { en: reqText(enCs.outcome?.label, `${where}.outcome.label.en`), sw: reqText(swCs.outcome?.label, `${where}.outcome.label.sw`) },
			intro: { en: optText(enCs.outcome?.intro), sw: optText(swCs.outcome?.intro) },
			deliverablesTitle: { en: optText(enCs.outcome?.deliverablesTitle), sw: optText(swCs.outcome?.deliverablesTitle) },
			deliverables: strings(enCs.outcome?.deliverables, swCs.outcome?.deliverables, "outcome.deliverables"),
		},
		impact: {
			label: { en: reqText(enCs.impact?.label, `${where}.impact.label.en`), sw: reqText(swCs.impact?.label, `${where}.impact.label.sw`) },
			items: (() => {
				const enItems = enCs.impact?.items ?? [];
				const swItems = swCs.impact?.items ?? [];
				if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
					gap(where, `impact.items count diverged (en=${enItems.length} sw=${swItems?.length})`);
				}
				return enItems.map((item, i) => {
					const swItem = swItems[i] ?? {};
					return {
						icon: sharedValue(item, swItem, "icon", `${where}.impact.items[${i}]`) ?? "",
						text: { en: reqText(item.text, `${where}.impact.items[${i}].text.en`), sw: reqText(swItem.text, `${where}.impact.items[${i}].text.sw`) },
					};
				});
			})(),
		},
		techSummary: {
			label: { en: reqText(enCs.techSummary?.label, `${where}.techSummary.label.en`), sw: reqText(swCs.techSummary?.label, `${where}.techSummary.label.sw`) },
			componentHeader: { en: optText(enCs.techSummary?.componentHeader), sw: optText(swCs.techSummary?.componentHeader) },
			specHeader: { en: optText(enCs.techSummary?.specHeader), sw: optText(swCs.techSummary?.specHeader) },
			rows: (() => {
				const enRows = enCs.techSummary?.rows ?? [];
				const swRows = swCs.techSummary?.rows ?? [];
				if (!Array.isArray(swRows) || swRows.length !== enRows.length) {
					gap(where, `techSummary.rows count diverged (en=${enRows.length} sw=${swRows?.length})`);
				}
				return enRows.map((row, i) => {
					const swRow = swRows[i] ?? {};
					return {
						component: { en: reqText(row.component, `${where}.techSummary.rows[${i}].component.en`), sw: reqText(swRow.component, `${where}.techSummary.rows[${i}].component.sw`) },
						specification: { en: reqText(row.specification, `${where}.techSummary.rows[${i}].specification.en`), sw: reqText(swRow.specification, `${where}.techSummary.rows[${i}].specification.sw`) },
					};
				});
			})(),
		},
		engineeringNote: {
			label: { en: optText(enCs.engineeringNote?.label), sw: optText(swCs.engineeringNote?.label) },
			text: { en: reqText(enCs.engineeringNote?.text, `${where}.engineeringNote.text.en`), sw: reqText(swCs.engineeringNote?.text, `${where}.engineeringNote.text.sw`) },
		},
		id: "",
	};
}

// M11 batch 13 — ground-penetrating-radar page (2026-09-19): the fourteen
// bespoke tails → unique sections (+ shared `deliverables` with the
// jump-nav `id`). Icons, image paths/urls, hrefs, day counts and featured
// flags shared; all other strings localized. The dead hero
// `headline`/`image` keys are dropped (never rendered). `<bold>` hero copy
// parses from data in the wrapper. Fixed presentation (slider, sticky
// scroll-spy, timeline rail, positional badges/watermarks, flip card,
// hardcoded Step/Project/Used labels) stays in the wrappers.
function gprHeroBuild(en, sw, where) {
	const enImages = en.images ?? [];
	const swImages = sw.images ?? [];
	if (!Array.isArray(swImages) || swImages.length !== enImages.length) {
		gap(where, `image count diverged (en=${enImages.length} sw=${swImages?.length})`);
	}
	const action = (node, swNode, key) => ({
		label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
		href: sharedValue(node, swNode, "href", `${where}.${key}`) ?? "",
		icon: sharedValue(node, swNode, "icon", `${where}.${key}`) ?? "",
	});
	return {
		title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
		images: enImages.map((image, i) => {
			const swImage = swImages[i] ?? {};
			const enUrl = typeof image === "object" ? image.url : image;
			const swUrl = typeof swImage === "object" ? swImage.url : swImage;
			return {
				url: sharedValue({ v: enUrl }, { v: swUrl }, "v", `${where}.images[${i}]`) ?? "",
				label: { en: optText(typeof image === "object" ? image.label : image), sw: optText(typeof swImage === "object" ? swImage.label : swImage) },
				description: { en: optText(typeof image === "object" ? image.description : ""), sw: optText(typeof swImage === "object" ? swImage.description : "") },
			};
		}),
		browseAll: {
			label: { en: reqText(en.browseAll?.label, `${where}.browseAll.label.en`), sw: reqText(sw.browseAll?.label, `${where}.browseAll.label.sw`) },
			href: sharedValue(en.browseAll, sw.browseAll, "href", where) ?? "",
		},
		description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
		ctaPrimary: action(en.ctaPrimary, sw.ctaPrimary, "ctaPrimary"),
		ctaSecondary: action(en.ctaSecondary, sw.ctaSecondary, "ctaSecondary"),
		id: "",
	};
}

function gprHighlightsBuild(en, sw, where) {
	const enItems = Array.isArray(en) ? en : [];
	const swItems = Array.isArray(sw) ? sw : [];
	if (swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}[${i}]`) ?? "",
				label: { en: reqText(item.label, `${where}[${i}].label.en`), sw: reqText(swItem.label, `${where}[${i}].label.sw`) },
			};
		}),
		id: "",
	};
}

function gprJumpNavBuild(en, sw, where) {
	const enItems = Array.isArray(en) ? en : [];
	const swItems = Array.isArray(sw) ? sw : [];
	if (swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				label: { en: reqText(item.label, `${where}[${i}].label.en`), sw: reqText(swItem.label, `${where}[${i}].label.sw`) },
				href: sharedValue(item, swItem, "href", `${where}[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

function gprOverviewBuild(en, sw, where) {
	const enParagraphs = en.paragraphs ?? [];
	const swParagraphs = sw.paragraphs ?? [];
	if (!Array.isArray(swParagraphs) || swParagraphs.length !== enParagraphs.length) {
		gap(where, `paragraph count diverged (en=${enParagraphs.length} sw=${swParagraphs?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		paragraphs: enParagraphs.map((paragraph, i) => ({
			en: reqText(paragraph, `${where}.paragraphs[${i}].en`),
			sw: reqText(swParagraphs[i], `${where}.paragraphs[${i}].sw`),
		})),
		image: { en: optText(en.image), sw: optText(sw.image) },
		id: "overview",
	};
}

function gprMethodologyBuild(en, sw, where) {
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
			const enPoints = item.points ?? [];
			const swPoints = swItem.points ?? [];
			if (!Array.isArray(swPoints) || swPoints.length !== enPoints.length) {
				gap(where, `point count diverged (en=${enPoints.length} sw=${swPoints?.length})`);
			}
			return {
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				points: enPoints.map((point, j) => ({
					en: reqText(point, `${where}.items[${i}].points[${j}].en`),
					sw: reqText(swPoints[j], `${where}.items[${i}].points[${j}].sw`),
				})),
			};
		}),
		id: "methodology",
	};
}

function gprApplicationsBuild(en, sw, where) {
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
			const enPoints = item.points ?? [];
			const swPoints = swItem.points ?? [];
			if (!Array.isArray(swPoints) || swPoints.length !== enPoints.length) {
				gap(where, `point count diverged (en=${enPoints.length} sw=${swPoints?.length})`);
			}
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				points: enPoints.map((point, j) => ({
					en: reqText(point, `${where}.items[${i}].points[${j}].en`),
					sw: reqText(swPoints[j], `${where}.items[${i}].points[${j}].sw`),
				})),
			};
		}),
		id: "applications",
	};
}

function gprDetectBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				note: { en: optText(item.note), sw: optText(swItem.note) },
			};
		}),
		id: "detect",
	};
}

function gprSueBuild(en, sw, where) {
	const enLevels = en.levels ?? [];
	const swLevels = sw.levels ?? [];
	if (!Array.isArray(swLevels) || swLevels.length !== enLevels.length) {
		gap(where, `level count diverged (en=${enLevels.length} sw=${swLevels?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		levels: enLevels.map((level, i) => {
			const swLevel = swLevels[i] ?? {};
			return {
				icon: sharedValue(level, swLevel, "icon", `${where}.levels[${i}]`) ?? "",
				level: { en: reqText(level.level, `${where}.levels[${i}].level.en`), sw: reqText(swLevel.level, `${where}.levels[${i}].level.sw`) },
				title: { en: reqText(level.title, `${where}.levels[${i}].title.en`), sw: reqText(swLevel.title, `${where}.levels[${i}].title.sw`) },
				description: { en: optText(level.description), sw: optText(swLevel.description) },
			};
		}),
		note: { en: optText(en.note), sw: optText(sw.note) },
		id: "sue",
	};
}

function gprLimitationsBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: optText(item.description), sw: optText(swItem.description) },
			};
		}),
		note: { en: optText(en.note), sw: optText(sw.note) },
		noteIcon: sharedValue(en, sw, "noteIcon", where) ?? "",
		id: "limitations",
	};
}

function gprBeforeAfterBuild(en, sw, where) {
	const side = (node, swNode, key) => {
		const enItems = node?.items ?? [];
		const swItems = swNode?.items ?? [];
		if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
			gap(where, `${key} count diverged (en=${enItems.length} sw=${swItems?.length})`);
		}
		return {
			label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
			tagline: { en: optText(node?.tagline), sw: optText(swNode?.tagline) },
			items: enItems.map((item, i) => ({
				en: reqText(item, `${where}.${key}.items[${i}].en`),
				sw: reqText(swItems[i], `${where}.${key}.items[${i}].sw`),
			})),
		};
	};
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		flipHint: { en: optText(en.flipHint), sw: optText(sw.flipHint) },
		before: side(en.before, sw.before, "before"),
		after: side(en.after, sw.after, "after"),
		id: "before-after",
	};
}

function gprTechnologyBuild(en, sw, where) {
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
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				image: sharedValue(item, swItem, "image", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: optText(item.description), sw: optText(swItem.description) },
			};
		}),
		id: "technology",
	};
}

function gprFeaturedProjectsBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				used: { en: reqText(item.used, `${where}.items[${i}].used.en`), sw: reqText(swItem.used, `${where}.items[${i}].used.sw`) },
				objective: { en: reqText(item.objective, `${where}.items[${i}].objective.en`), sw: reqText(swItem.objective, `${where}.items[${i}].objective.sw`) },
				result: { en: reqText(item.result, `${where}.items[${i}].result.en`), sw: reqText(swItem.result, `${where}.items[${i}].result.sw`) },
			};
		}),
		id: "projects",
	};
}

function gprSummaryBuild(en, sw, where) {
	const enChips = en.chips ?? [];
	const swChips = sw.chips ?? [];
	if (!Array.isArray(swChips) || swChips.length !== enChips.length) {
		gap(where, `chip count diverged (en=${enChips.length} sw=${swChips?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		chips: enChips.map((chip, i) => ({
			en: reqText(chip, `${where}.chips[${i}].en`),
			sw: reqText(swChips[i], `${where}.chips[${i}].sw`),
		})),
		id: "summary",
	};
}

// M11 batch 14 — gis-mapping page (2026-09-19): the fourteen bespoke tails
// → unique sections. Icons, image/logo paths and hrefs shared; all other
// strings localized. `<bold>` hero/whatIs copy parses from data in the
// wrappers. `remoteSensingSolutions` + `mappingServices` stay DORMANT
// (commented out of the route — never migrated). Fixed presentation
// (gradients, bento spans, ring geometry, flip cards, hardcoded row labels
// and bottom-note CTA) stays in the wrappers.
function gisHeroBuild(en, sw, where) {
	const enFootnotes = en.footnoteItems ?? [];
	const swFootnotes = sw.footnoteItems ?? [];
	if (!Array.isArray(swFootnotes) || swFootnotes.length !== enFootnotes.length) {
		gap(where, `footnote count diverged (en=${enFootnotes.length} sw=${swFootnotes?.length})`);
	}
	return {
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
		description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
		footnoteItems: enFootnotes.map((footnote, i) => ({
			en: reqText(footnote, `${where}.footnoteItems[${i}].en`),
			sw: reqText(swFootnotes[i], `${where}.footnoteItems[${i}].sw`),
		})),
		image: sharedValue(en, sw, "image", where) ?? "",
		ctaPrimary: {
			label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
			href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
		},
		id: "",
	};
}

function gisWhatIsBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
			};
		}),
		closingStatement: { en: optText(en.closingStatement), sw: optText(sw.closingStatement) },
		id: "",
	};
}

// Importance/services/industries share the {tag, headline, description,
// items[{icon, title, features[]}]} contract — one build with the caller key.
function gisChecklistGridBuild(en, sw, where) {
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
			const enFeatures = item.features ?? [];
			const swFeatures = swItem.features ?? [];
			if (!Array.isArray(swFeatures) || swFeatures.length !== enFeatures.length) {
				gap(where, `feature count diverged (en=${enFeatures.length} sw=${swFeatures?.length})`);
			}
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				features: enFeatures.map((feature, j) => ({
					en: reqText(feature, `${where}.items[${i}].features[${j}].en`),
					sw: reqText(swFeatures[j], `${where}.items[${i}].features[${j}].sw`),
				})),
			};
		}),
		id: "",
	};
}

function gisServicesBuild(en, sw, where) {
	const built = gisChecklistGridBuild(en, sw, where);
	built.id = "gis-services";
	return built;
}

function gisTechStackBuild(en, sw, where) {
	const enTools = en.tools ?? [];
	const swTools = sw.tools ?? [];
	if (!Array.isArray(swTools) || swTools.length !== enTools.length) {
		gap(where, `tool count diverged (en=${enTools.length} sw=${swTools?.length})`);
	}
	const enLogos = en.logos ?? [];
	const swLogos = sw.logos ?? [];
	if (!Array.isArray(swLogos) || swLogos.length !== enLogos.length) {
		gap(where, `logo count diverged (en=${enLogos.length} sw=${swLogos?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		tools: enTools.map((tool, i) => ({
			en: reqText(tool, `${where}.tools[${i}].en`),
			sw: reqText(swTools[i], `${where}.tools[${i}].sw`),
		})),
		logos: enLogos.map((logo, i) => {
			const swLogo = swLogos[i] ?? {};
			return {
				image: sharedValue(logo, swLogo, "image", `${where}.logos[${i}]`) ?? "",
				label: { en: optText(logo.label), sw: optText(swLogo.label) },
			};
		}),
		id: "",
	};
}

function gisWhatsappCtaBuild(en, sw, where) {
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		note: { en: optText(en.note), sw: optText(sw.note) },
		cta: {
			label: { en: optText(en.cta?.label), sw: optText(sw.cta?.label) },
			href: sharedValue(en.cta, sw.cta, "href", where) ?? "",
			icon: sharedValue(en.cta, sw.cta, "icon", where) ?? "",
		},
		id: "",
	};
}

function gisComponentsBuild(en, sw, where) {
	const enList = en.list ?? [];
	const swList = sw.list ?? [];
	if (!Array.isArray(swList) || swList.length !== enList.length) {
		gap(where, `item count diverged (en=${enList.length} sw=${swList?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		lifecycle: {
			title: { en: optText(en.lifecycle?.title), sw: optText(sw.lifecycle?.title) },
			subtitle: { en: optText(en.lifecycle?.subtitle), sw: optText(sw.lifecycle?.subtitle) },
		},
		list: enList.map((item, i) => {
			const swItem = swList[i] ?? {};
			return {
				title: { en: reqText(item.title, `${where}.list[${i}].title.en`), sw: reqText(swItem.title, `${where}.list[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.list[${i}].description.en`), sw: reqText(swItem.description, `${where}.list[${i}].description.sw`) },
			};
		}),
		id: "",
	};
}

function gisWhySmartgridBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
			};
		}),
		id: "",
	};
}

function gisDataAccuracyBuild(en, sw, where) {
	const enFactors = en.factors ?? [];
	const swFactors = sw.factors ?? [];
	if (!Array.isArray(swFactors) || swFactors.length !== enFactors.length) {
		gap(where, `factor count diverged (en=${enFactors.length} sw=${swFactors?.length})`);
	}
	const enLevels = en.levels ?? [];
	const swLevels = sw.levels ?? [];
	if (!Array.isArray(swLevels) || swLevels.length !== enLevels.length) {
		gap(where, `level count diverged (en=${enLevels.length} sw=${swLevels?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		ensureTitle: { en: optText(en.ensureTitle), sw: optText(sw.ensureTitle) },
		factors: enFactors.map((factor, i) => ({
			en: reqText(factor, `${where}.factors[${i}].en`),
			sw: reqText(swFactors[i], `${where}.factors[${i}].sw`),
		})),
		levelsTitle: { en: optText(en.levelsTitle), sw: optText(sw.levelsTitle) },
		levels: enLevels.map((level, i) => {
			const swLevel = swLevels[i] ?? {};
			return {
				icon: sharedValue(level, swLevel, "icon", `${where}.levels[${i}]`) ?? "",
				label: { en: reqText(level.label, `${where}.levels[${i}].label.en`), sw: reqText(swLevel.label, `${where}.levels[${i}].label.sw`) },
				accuracy: { en: reqText(level.accuracy, `${where}.levels[${i}].accuracy.en`), sw: reqText(swLevel.accuracy, `${where}.levels[${i}].accuracy.sw`) },
			};
		}),
		id: "",
	};
}

function gisBeforeAfterBuild(en, sw, where) {
	const side = (node, swNode, key) => {
		const enItems = node?.items ?? [];
		const swItems = swNode?.items ?? [];
		if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
			gap(where, `${key} count diverged (en=${enItems.length} sw=${swItems?.length})`);
		}
		return {
			label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
			tagline: { en: optText(node?.tagline), sw: optText(swNode?.tagline) },
			items: enItems.map((item, i) => ({
				en: reqText(item, `${where}.${key}.items[${i}].en`),
				sw: reqText(swItems[i], `${where}.${key}.items[${i}].sw`),
			})),
		};
	};
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		flipHint: { en: optText(en.flipHint), sw: optText(sw.flipHint) },
		before: side(en.before, sw.before, "before"),
		after: side(en.after, sw.after, "after"),
		id: "before-after",
	};
}

function gisProjectImpactBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
			};
		}),
		id: "",
	};
}

function gisRelatedServicesBuild(en, sw, where) {
	const enItems = en.items ?? [];
	const swItems = sw.items ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return {
		tag: { en: optText(en.tag), sw: optText(sw.tag) },
		headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
		description: { en: optText(en.description), sw: optText(sw.description) },
		bottomNote: { en: optText(en.bottomNote), sw: optText(sw.bottomNote) },
		items: enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				href: sharedValue(item, swItem, "href", `${where}.items[${i}]`) ?? "",
			};
		}),
		id: "",
	};
}

// M11 batch 15 — civil highway-surveys + as-built-surveys pages
// (2026-09-19): the two `indexed` grids → unique sections. Both share the
// {tag, headline, description, items[{title, description}]} contract —
// columns/tone/indexed presentation stays in the wrappers. Titles and
// descriptions localized.
function civilIndexedGridBuild(en, sw, where) {
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
				title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
				description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
			};
		}),
		id: "",
	};
}

const PAGES = {
	"company-profile": {
		namespace: "company-profile",
		title: "Company Profile",
		// companyProfileView (bespoke PDF viewer: DeferredMount + iframe, no
		// shared equivalent) is intentionally NOT migrated — see M4 log.
		// M11 batch 3 (2026-09-18): the viewer migrates as the
		// `companyProfileViewer` unique section (strings become data, the
		// iframe stays lazy in the renderer) — the whole page is
		// Keystatic-owned in page order → one PageBuilderDocument.
		skipped: [],
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
			{
				discriminant: "companyProfileViewer",
				from: "companyProfileView",
				// Legacy: CompanyProfileViewerSection over
				// `company-profile:companyProfileView` (PDF viewer; the
				// iframe stays lazy in the renderer).
				build(en, sw, where) {
					return companyProfileViewerBuild(en, sw, where);
				},
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
		// M11 batch 1 (2026-09-18): page order — `hero` (`contactHero`
		// unique), `talkToUs` (cardGrid), `offices` (`contactOffices`
		// unique), `form` (`contactForm` unique). The whole page is
		// Keystatic-owned, so the route renders one PageBuilderDocument
		// (M11+M12 together). `contact_reasons` options + form field
		// structure stay locale-owned (form behavior — see `contactForm`
		// registry note); `opportunities`/`direct_contacts`/`site_visit`/
		// `faq` are unrendered dead content, `social` is footer-owned.
		skipped: ["contact_reasons", "opportunities", "direct_contacts", "site_visit", "faq", "social"],
		sections: [
			{
				discriminant: "contactHero",
				from: "hero",
				// Legacy: ContactHeroSection over `contact:hero` (tag +
				// headline + description + availability badge card).
				build(en, sw, where) {
					return contactHeroBuild(en, sw, where);
				},
			},
			{
				discriminant: "cardGrid",
				from: "talkToUs",
				// Legacy: TalkToUsSection → <CardGrid columns={3} headerRow />
				build: talkToUsBuild({ columns: "3", align: "left", tone: "default", headerRow: true, cardDensity: "comfortable", cardIconSize: "md" }),
			},
			{
				discriminant: "contactOffices",
				from: "offices",
				// Legacy: OfficesSection over `contact:offices` (office
				// cards + client-only map + closing CTA).
				build(en, sw, where) {
					return contactOfficesBuild(en, sw, where);
				},
			},
			{
				discriminant: "contactForm",
				from: "form",
				// Legacy: ContactFormSection over `contact:form` (section
				// chrome + submit/success strings; widget stays
				// locale-owned — see the `contactForm` registry note).
				build(en, sw, where) {
					return contactFormBuild(en, sw, where);
				},
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
	// M11 batch 2 (2026-09-18): the whole page is Keystatic-owned in page
	// order — `hero`, `leadGenBar` + `services` (global instances embedded
	// via `fromExtra`, same verbatim copy as home), `currentOpenings`
	// (`careersOpenings` unique), `applicationProcess` (`careersProcess`
	// unique), `statement` (`careersStatement` unique) — so the route
	// renders one PageBuilderDocument (M11+M12 together). Nothing stays
	// skipped.
	"careers": {
		namespace: "careers",
		title: "Careers",
		skipped: [],
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
			{
				discriminant: "leadGenBar",
				fromExtra: { ns: "common", key: "leadGenBar" },
				// Legacy: careers route renders the global shared
				// <LeadGenBar /> over `common:leadGenBar` — embedded
				// verbatim (same copy as home; re-migrate to refresh).
				build(en, sw, where) {
					return leadGenBarBuild(en, sw, where);
				},
			},
			{
				discriminant: "services",
				fromExtra: { ns: "common", key: "services" },
				// Legacy: careers route renders the shared
				// <ServicesSection /> over `common:services` — embedded
				// verbatim (same copy as home; re-migrate to refresh).
				build(en, sw, where) {
					return servicesBuild(en, sw, where);
				},
			},
			{
				discriminant: "careersOpenings",
				from: "currentOpenings",
				// Legacy: CurrentOpeningsSection over
				// `careers:currentOpenings` (openings board + TOR modal).
				build(en, sw, where) {
					return careersOpeningsBuild(en, sw, where);
				},
			},
			{
				discriminant: "careersProcess",
				from: "applicationProcess",
				// Legacy: ApplicationProcessSection over
				// `careers:applicationProcess` (`<bold>` parsed from data).
				build(en, sw, where) {
					return careersProcessBuild(en, sw, where);
				},
			},
			{
				discriminant: "careersStatement",
				from: "statement",
				// Legacy: EqualOpportunityStatementSection over
				// `careers:statement`.
				build(en, sw, where) {
					return careersStatementBuild(en, sw, where);
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
	// M11 batch 4 (2026-09-18): the three tails migrate as unique sections
	// (`aboutAerialSurveying`, `aboutLandSurveying`, `aboutImpact`) in page
	// order — the whole page is Keystatic-owned (M11+M12 together).
	// Nothing stays skipped.
	"about": {
		namespace: "about",
		title: "About",
		skipped: [],
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
				discriminant: "aboutAerialSurveying",
				from: "aerialSurveying",
				// Legacy: AerialSurveyingSection → <CardGrid columns={3}
				// align="center" tone="surface" fallbackIcons popupTrigger />
				// (page-order position between ourStory and servicesByImages).
				build(en, sw, where) {
					return aboutAerialSurveyingBuild(en, sw, where);
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
				discriminant: "aboutLandSurveying",
				from: "landSurveying",
				// Legacy: LandSurveyingSection → <CardGrid columns={3} />
				// with `check` header icons and `<primary>`-parsed
				// description (page-order position between the drone
				// slider and landSurveyingImages).
				build(en, sw, where) {
					return aboutLandSurveyingBuild(en, sw, where);
				},
			},
			{
				discriminant: "gallery",
				from: "landSurveyingImages",
				// Legacy: LandSurveyingImagesSection → <Gallery layout="overlay" columns={4} />
				build: galleryBuild({ layout: "overlay", columns: "4", tone: "default" }),
			},
			{
				discriminant: "aboutImpact",
				from: "impactAcrossAfrica",
				// Legacy: ImpactAcrossAfricaSection (client-only globe +
				// why-choose-us card; page-order position between
				// landSurveyingImages and whyChooseSmartGrid).
				build(en, sw, where) {
					return aboutImpactBuild(en, sw, where);
				},
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
		// M11 batch 5 (2026-09-18): the whole hub is Keystatic-owned in
		// page order — `hero`, `services` (`surveyingServices` unique),
		// `process` (`surveyingProcess` unique), `deliverables` (shared)
		// — so the route renders one PageBuilderDocument (M11+M12
		// together). Nothing stays skipped.
		skipped: [],
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
			{
				discriminant: "surveyingServices",
				from: "services",
				// Legacy: SurveyingServicesSection (grid + framed map image
				// below) over `surveying/landing:services`.
				build(en, sw, where) {
					return surveyingServicesBuild(en, sw, where);
				},
			},
			{
				discriminant: "surveyingProcess",
				from: "process",
				// Legacy: SurveyingProcessSection (indexed/watermarked cards)
				// over `surveying/landing:process`.
				build(en, sw, where) {
					return surveyingProcessBuild(en, sw, where);
				},
			},
			{
				discriminant: "deliverables",
				from: "deliverables",
				// Legacy: SurveyingDeliverablesSection → <Deliverables
				// ns="surveying/landing" className="bg-surface" /> (tone
				// surface).
				build: deliverablesBuild("surface"),
			},
		],
	},
	"civil": {
		namespace: "civil/landing",
		title: "Civil",
		// M11 batch 5 (2026-09-18): the whole hub is Keystatic-owned in
		// page order — `hero` (`civilHero` unique), `services` (shared
		// cardGrid), `process` (`civilProcess` unique), `deliverables`
		// (shared) — so the route renders one PageBuilderDocument
		// (M11+M12 together). Nothing stays skipped.
		skipped: [],
		sections: [
			{
				discriminant: "civilHero",
				from: "hero",
				// Legacy: CivilHeroSection (diagonal hero) over
				// `civil/landing:hero`.
				build(en, sw, where) {
					return civilHeroBuild(en, sw, where);
				},
			},
			{
				discriminant: "cardGrid",
				from: "services",
				// Legacy: CivilServicesSection → <CardGrid columns={3} tone="surface" /> (align/card unset = defaults)
				build: cardGridBuild({ columns: "3", align: "left", tone: "surface", headerRow: false, cardDensity: "comfortable", cardIconSize: "md" }),
			},
			{
				discriminant: "civilProcess",
				from: "process",
				// Legacy: CivilProcessSection (image stepper + step rail)
				// over `civil/landing:process`.
				build(en, sw, where) {
					return civilProcessBuild(en, sw, where);
				},
			},
			{
				discriminant: "deliverables",
				from: "deliverables",
				// Legacy: CivilDeliverablesSection → <Deliverables
				// ns="civil/landing" className="bg-surface" /> (tone
				// surface).
				build: deliverablesBuild("surface"),
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
	// M11 batch 6 (2026-09-18): the seven tails migrate as unique sections
	// (`topoWhenYouNeed`, `topoWhatWeOffer`, `topoDetailedSurveys`,
	// `topoSampleMap`, `topoInstruments`, `topoWhyConduct`) plus shared
	// `deliverables` — the whole page is Keystatic-owned in page order
	// (M11+M12 together). Nothing stays skipped.
	"topographical-surveys": {
		namespace: "surveying/topographical-surveys",
		title: "Topographical Surveys",
		skipped: [],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: shared <Hero> used directly on the page (M13 batch 8 — wrapper retired; shared used directly on the page).
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
				// Legacy: shared <IntroTextSection ... /> used directly (M13 batch 8 — wrapper retired; shared used directly on the page). (all defaults)
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "topoWhenYouNeed",
				from: "whenYouNeed",
				// Legacy: WhenYouNeedSection → <CardGrid columns={2}
				// card={{iconSize:"lg"}} /> (children→subItems+wide computed
				// in the wrapper).
				build(en, sw, where) {
					return topoWhenYouNeedBuild(en, sw, where);
				},
			},
			{
				discriminant: "deliverables",
				from: "whatYouGet",
				// Legacy: shared <Deliverables ns="surveying/topographical-surveys"
				// baseKey="whatYouGet" /> used directly on the page (M13 batch 8 — wrapper retired; shared used directly on the page).
				// (no className = tone default).
				build: deliverablesBuild("default"),
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
				// Legacy: shared <IntroTextSection ... split /> used directly (M13 batch 8 — wrapper retired; shared used directly on the page). (split hardcoded; the content `split` key is not read)
				build: introTextBuild({ tone: "default", align: "left", split: true }),
			},
			{
				discriminant: "topoWhatWeOffer",
				from: "whatWeOffer",
				// Legacy: WhatWeOfferSection → <CardGrid columns={3}
				// headerAlign="left" indexed fallbackIcons ... /> (positional
				// icons + numbering stay in the wrapper).
				build(en, sw, where) {
					return topoCardGridBuild()(en, sw, where);
				},
			},
			{
				discriminant: "topoDetailedSurveys",
				from: "detailedTopographicalSurveys",
				// Legacy: DetailedSurveysSection → <CardGrid columns={4}
				// mediaBadged card={{variant:"paper"}} />.
				build(en, sw, where) {
					return topoDetailedSurveysBuild(en, sw, where);
				},
			},
			{
				discriminant: "topoSampleMap",
				from: "sampleTopographicalMap",
				// Legacy: SampleMapSection (info card + framed map image).
				build(en, sw, where) {
					return topoSampleMapBuild(en, sw, where);
				},
			},
			{
				discriminant: "topoInstruments",
				from: "surveyingInstruments",
				// Legacy: InstrumentsSection → <CardGrid columns={4}
				// headerAlign="left" tone="surface" mediaBadged ... />.
				build(en, sw, where) {
					return topoInstrumentsBuild(en, sw, where);
				},
			},
			{
				discriminant: "topoWhyConduct",
				from: "whyConductSurvey",
				// Legacy: WhyConductSection → <CardGrid columns={3} indexed
				// ... /> (crosshairs header glyph stays in the wrapper).
				build(en, sw, where) {
					return topoCardGridBuild()(en, sw, where);
				},
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
	// M11 batch 7 (2026-09-18): the six tails migrate as unique sections
	// (`sectionalWhatIs`, `sectionalServicesDetail`, `sectionalWorkflow`,
	// `sectionalTimeline`, `sectionalWhoNeeds`) plus shared `deliverables`
	// — the whole page is Keystatic-owned in page order (M11+M12 together).
	// Only dead `socials` stays skipped.
	"sectional-properties": {
		namespace: "surveying/sectional-properties",
		title: "Sectional Properties",
		skipped: ["socials"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: shared <Hero> used directly on the page (M13 batch 8 — wrapper retired; shared used directly on the page).
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
				// Legacy: shared <IntroTextSection ... cta={ctaPrimary} /> used directly (M13 batch 8 — wrapper retired; shared used directly on the page). (all defaults + pill CTA)
				build: introTextBuild({ tone: "default", align: "left", split: false }, "ctaPrimary"),
			},
			{
				discriminant: "sectionalWhatIs",
				from: "whatIs",
				// Legacy: WhatIsSection (bespoke ownership cards; the
				// `diagramLabel` figure is commented out — not migrated).
				build(en, sw, where) {
					return sectionalWhatIsBuild(en, sw, where);
				},
			},
			{
				discriminant: "gallery",
				from: "sectionalServices",
				// Legacy: ServicesImageSection → <Gallery columns={4} /> (layout/tone unset = grid/default)
				build: galleryBuild({ layout: "grid", columns: "4", tone: "default" }),
			},
			{
				discriminant: "sectionalServicesDetail",
				from: "sectionalPropertyServices",
				// Legacy: ServicesDetailSection → <CardGrid columns={4}
				// tone="surface" headerAlign="left" indexed fallbackIcons
				// ... /> (numbering + icons stay in the wrapper).
				build(en, sw, where) {
					return sectionalServicesDetailBuild(en, sw, where);
				},
			},
			{
				discriminant: "sectionalWorkflow",
				from: "process",
				// Legacy: ProcessSection → <WorkflowSection {...section}
				// phaseStyles={PHASE_STYLES} /> (domain chip styles stay in
				// the wrapper; unrendered ctaPrimary/ctaSecondary dropped).
				build(en, sw, where) {
					return sectionalWorkflowBuild(en, sw, where);
				},
			},
			{
				discriminant: "deliverables",
				from: "deliverables",
				// Legacy: shared <Deliverables (M13 batch 8 — wrapper retired; shared used directly on the page).
				// ns="surveying/sectional-properties" className="bg-surface" />
				// (tone surface).
				build: deliverablesBuild("surface"),
			},
			{
				discriminant: "sectionalWhoNeeds",
				from: "whoNeeds",
				// Legacy: WhoNeedsSection → <CardGrid columns={3}
				// tone="surface" headerAlign="left" hoverArrow ... /> (footer
				// links computed in the wrapper).
				build(en, sw, where) {
					return sectionalWhoNeedsBuild(en, sw, where);
				},
			},
			{
				discriminant: "sectionalTimeline",
				from: "timeline",
				// Legacy: TimelineSection → <Process layout="timeline"
				// tone="surface" ... /> (rail computation stays in the
				// wrapper).
				build(en, sw, where) {
					return sectionalTimelineBuild(en, sw, where);
				},
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
	// M11 batch 8 (2026-09-18): the eight tails migrate as unique sections
	// (`bathyWorkflow`, `bathyEquipment`, `bathyLimitations`,
	// `bathyDamsLakes`, `bathyApplications`, `bathyBeforeAfter`,
	// `bathyFinalCta`) plus shared `deliverables` — the whole page is
	// Keystatic-owned in page order (M11+M12 together). Nothing stays
	// skipped.
	"bathymetric-surveys": {
		namespace: "surveying/bathymetric-surveys",
		title: "Bathymetric Surveys",
		skipped: [],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: shared <Hero> used directly on the page (M13 batch 8 — wrapper retired; shared used directly on the page).
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
				// Legacy: shared <SplitMedia data (M13 batch 8 — wrapper retired; shared used directly on the page).
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
				discriminant: "workflow",
				from: "bathymetricWorkflow",
				// Legacy: shared <WorkflowSection {...section} /> used directly
				// on the page (M13 batch 8 — retired the
				// BathymetricWorkflowSection wrapper; no domain phase styles
				// on this page).
				build: workflowBuild("default"),
			},
			{
				discriminant: "bathyEquipment",
				from: "equipmentTechnology",
				// Legacy: EquipmentTechnologySection (header + staggered
				// image collage).
				build(en, sw, where) {
					return bathyEquipmentBuild(en, sw, where);
				},
			},
			{
				discriminant: "deliverables",
				from: "deliverables",
				// Legacy: shared <Deliverables (M13 batch 8 — wrapper retired; shared used directly on the page).
				// ns="surveying/bathymetric-surveys" className="bg-surface" />
				// (tone surface).
				build: deliverablesBuild("surface"),
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
			{
				discriminant: "bathyLimitations",
				from: "technicalLimitations",
				// Legacy: TechnicalLimitationsSection (accuracy factors +
				// typical outputs; card headings hardcoded — not migrated).
				build(en, sw, where) {
					return bathyLimitationsBuild(en, sw, where);
				},
			},
			{
				discriminant: "bathyDamsLakes",
				from: "damsLakesSeaOcean",
				// Legacy: DamsLakesSection → <CardGrid columns={3}
				// leadImages={images.slice(0, 2)} />.
				build(en, sw, where) {
					return bathyDamsLakesBuild(en, sw, where);
				},
			},
			{
				discriminant: "bathyApplications",
				from: "applications",
				// Legacy: ApplicationsSection → <CardGrid columns={4}
				// tone="surface" mediaBadged />.
				build(en, sw, where) {
					return bathyApplicationsBuild(en, sw, where);
				},
			},
			{
				discriminant: "bathyBeforeAfter",
				from: "beforeAfter",
				// Legacy: BathymetricBeforeAfterSection (flip card; ferry
				// icon + watermark stay in the wrapper).
				build(en, sw, where) {
					return bathyBeforeAfterBuild(en, sw, where);
				},
			},
			{
				discriminant: "finalCta",
				from: "finalCta",
				// Legacy: shared <FinalCta id="get-started"
				// descriptionTone="accent" watermark="water" ... /> used
				// directly on the page (M13 batch 8 — retired the
				// FinalCtaSection wrapper; presentation literals travel as
				// shared fields).
				build: finalCtaBuild("water", 3, "center", {
					descriptionTone: "accent",
					actionIconFallback: "email-outline",
					id: "get-started",
				}),
			},
		],
},

// M11 batch 9 (2026-09-18): resource-mapping — whole page Keystatic-owned
	// in page order → one PageBuilderDocument (M11+M12 together). The six
	// sector sections use the shared `rmSector` schema with `tone` alternating
	// (default/surface) to match the legacy wrapper variance. Nothing stays
	// skipped.
	"resource-mapping": {
		namespace: "surveying/resource-mapping",
		title: "Resource Mapping",
		skipped: [],
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
				discriminant: "rmWhatIs",
				from: "whatIsResourceMapping",
				// Legacy: WhatIsResourceMappingSection → bespoke items + closingStatement.
				build(en, sw, where) {
					return rmWhatIsBuild(en, sw, where);
				},
			},
			{
				discriminant: "rmTypes",
				from: "typesOfResourceMapping",
				// Legacy: TypesOfResourceMappingSection → categories with nested items.
				build(en, sw, where) {
					return rmTypesBuild(en, sw, where);
				},
			},
			{
				discriminant: "rmSector",
				from: "agriculture",
				// Legacy: AgricultureSection → <SectorSection sectionKey="agriculture" tone="default" />.
				build: rmSectorBuild("default"),
			},
			{
				discriminant: "rmSector",
				from: "utilitiesEnergySmartInfrastructure",
				// Legacy: UtilitiesEnergySection → <SectorSection sectionKey="utilitiesEnergySmartInfrastructure" tone="surface" />.
				build: rmSectorBuild("surface"),
			},
			{
				discriminant: "rmSector",
				from: "quarryMining",
				// Legacy: QuarryMiningSection → <SectorSection sectionKey="quarryMining" tone="default" />.
				build: rmSectorBuild("default"),
			},
			{
				discriminant: "rmSector",
				from: "constructionCivilEngineering",
				// Legacy: ConstructionCivilSection → <SectorSection sectionKey="constructionCivilEngineering" tone="surface" />.
				build: rmSectorBuild("surface"),
			},
			{
				discriminant: "rmSector",
				from: "environmentalManagementConservation",
				// Legacy: EnvironmentalConservationSection → <SectorSection sectionKey="environmentalManagementConservation" tone="default" />.
				build: rmSectorBuild("default"),
			},
			{
				discriminant: "rmSector",
				from: "disasterRiskReduction",
				// Legacy: DisasterRiskReductionSection → <SectorSection sectionKey="disasterRiskReduction" tone="surface" />.
				build: rmSectorBuild("surface"),
			},
			{
				discriminant: "cardGrid",
				from: "whySmartGridStandsOut",
				// Legacy: WhyStandOutSection → <CardGrid columns={4} tone="surface" align="center" />.
				build: cardGridBuild({ columns: "4", align: "center", tone: "surface", headerRow: false, cardDensity: "comfortable", cardIconSize: "md" }),
			},
			{
				discriminant: "rmWorkflow",
				from: "resourceMappingWorkflow",
				// Legacy: ResourceMappingWorkflowSection → <Process {...section} />.
				build(en, sw, where) {
					return rmWorkflowBuild(en, sw, where);
				},
			},
			{
				discriminant: "deliverables",
				from: "deliverables",
				// Legacy: ResourceMappingDeliverablesSection → <Deliverables ns="surveying/resource-mapping" />.
				build: deliverablesBuild("default"),
			},
			{
				discriminant: "rmWhoUses",
				from: "whoUsesResourceMapping",
				// Legacy: WhoUsesResourceMappingSection → bespoke categories grid.
				build(en, sw, where) {
					return rmWhoUsesBuild(en, sw, where);
				},
			},
			{
				discriminant: "rmTechStack",
				from: "techStack",
				// Legacy: ResourceMappingTechStackSection → <CardGrid ... /> with hrefs.
				build(en, sw, where) {
					return rmTechStackBuild(en, sw, where);
				},
			},
			{
				discriminant: "rmDataAccuracy",
				from: "dataAccuracy",
				// Legacy: DataAccuracySection → bespoke factors + levels.
				build(en, sw, where) {
					return rmDataAccuracyBuild(en, sw, where);
				},
			},
			{
				discriminant: "rmFinalCta",
				from: "finalCta",
				// Legacy: FinalCtaSection → cta-closing with multiple actions.
				build(en, sw, where) {
					return rmFinalCtaBuild(en, sw, where);
				},
			},
		],
	},
	// M11 batch 9 (2026-09-18): building-site-surveys — whole page
	// Keystatic-owned in page order → one PageBuilderDocument (M11+M12
	// together). Seven bespoke tails become unique sections. Nothing stays
	// skipped.
	"building-site-surveys": {
		namespace: "surveying/building-site-surveys",
		title: "Building Site Surveys",
		skipped: [],
		sections: [
			{
				discriminant: "bsHero",
				from: "hero",
				// Legacy: BuildingSiteHeroSection (bespoke hero with footnoteItems).
				build(en, sw, where) {
					return {
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
						description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
						image: sharedValue(en, sw, "image", where) ?? "",
						ctaPrimary: {
							label: { en: reqText(en.ctaPrimary?.label, `${where}.ctaPrimary.label.en`), sw: reqText(sw.ctaPrimary?.label, `${where}.ctaPrimary.label.sw`) },
							href: sharedValue(en.ctaPrimary, sw.ctaPrimary, "href", where) ?? "",
							icon: sharedValue(en.ctaPrimary, sw.ctaPrimary, "icon", where) ?? "",
						},
						footnoteItems: (en.footnoteItems ?? []).map((item, i) => ({
							en: reqText(item, `${where}.footnoteItems[${i}].en`),
							sw: reqText(sw.footnoteItems?.[i], `${where}.footnoteItems[${i}].sw`),
						})),
						id: "",
					};
				},
			},
			{
				discriminant: "introText",
				from: "section1",
				// Legacy: IntroSection → <IntroTextSection ... split /> (split
				// hardcoded; no CTA).
				build: introTextBuild({ tone: "default", align: "left", split: true }),
			},
			{
				discriminant: "bsSiteEngineering",
				from: "siteEngineeringSurveys",
				// Legacy: SiteEngineeringSection → <CardGrid columns={3} headerRow
				// indexed fallbackIcons /> (indexed numbering + fallback icons
				// stay in the wrapper; here we store items as plain cards).
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
								icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
								title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
								description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
								image: "",
								href: "",
							};
						}),
						id: "",
					};
				},
			},
			{
				discriminant: "bsSection2",
				from: "section2",
				// Legacy: BuildSmarterSection (bespoke with subtitle + CTA).
				build(en, sw, where) {
					const action = (node, swNode, key) => ({
						label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
						href: sharedValue(node, swNode, "href", `${where}.${key}`) ?? "",
						icon: sharedValue(node, swNode, "icon", `${where}.${key}`) ?? "",
					});
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						subtitle: { en: optText(en.subtitle), sw: optText(sw.subtitle) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						ctaPrimary: action(en.ctaPrimary, sw.ctaPrimary, "ctaPrimary"),
						id: "",
					};
				},
			},
			{
				discriminant: "bsProcess",
				from: "process",
				// Legacy: ProcessSection → layout/columns not in registry
				// contract. Image + steps; image is shared, step icons shared.
				build(en, sw, where) {
					const enItems = en.items ?? [];
					const swItems = sw.items ?? [];
					if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
						gap(where, `step count diverged (en=${enItems.length} sw=${swItems?.length})`);
					}
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						image: sharedValue(en, sw, "image", where) ?? "",
						steps: enItems.map((step, i) => {
							const swStep = swItems[i] ?? {};
							return {
								label: { en: reqText(step.label, `${where}.items[${i}].label.en`), sw: reqText(swStep.label, `${where}.items[${i}].label.sw`) },
								description: { en: reqText(step.description, `${where}.items[${i}].description.en`), sw: reqText(swStep.description, `${where}.items[${i}].description.sw`) },
								icon: sharedValue(step, swStep, "icon", `${where}.items[${i}]`) ?? "",
							};
						}),
						id: "",
					};
				},
			},
			{
				discriminant: "bsAccuracyMatters",
				from: "accuracyMatters",
				// Legacy: AccuracyMattersSection (stats + keywords, bespoke).
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
						solution: { en: optText(en.solution), sw: optText(sw.solution) },
						items: enItems.map((item, i) => {
							const swItem = swItems[i] ?? {};
							return {
								icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
								title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
								description: { en: reqText(item.description, `${where}.items[${i}].description.en`), sw: reqText(swItem.description, `${where}.items[${i}].description.sw`) },
								stat: { en: optText(item.stat), sw: optText(swItem.stat) },
							};
						}),
						keywords: {
							en: (en.keywords ?? []).map((k, i) => reqText(k, `${where}.keywords[${i}].en`)),
							sw: (sw.keywords ?? []).map((k, i) => reqText(k, `${where}.keywords[${i}].sw`)),
						},
						id: "",
					};
				},
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
				discriminant: "deliverables",
				from: "deliverables",
				// Legacy: DeliverablesSection → <Deliverables ns="surveying/building-site-surveys" />.
				build: deliverablesBuild("default"),
			},
			{
				discriminant: "bsTechnology",
				from: "technology",
				// Legacy: TechnologyStackSection → <CardGrid ... /> with
				// fallbackIcons + hoverArrow + per-card links (learnMore).
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
						learnMore: { en: optText(en.learnMore), sw: optText(sw.learnMore) },
						items: enItems.map((item, i) => {
							const swItem = swItems[i] ?? {};
							return {
								icon: sharedValue(item, swItem, "icon", `${where}.items[${i}]`) ?? "",
								title: { en: reqText(item.title, `${where}.items[${i}].title.en`), sw: reqText(swItem.title, `${where}.items[${i}].title.sw`) },
								description: { en: optText(item.description), sw: optText(swItem.description) },
								href: sharedValue(item, swItem, "href", `${where}.items[${i}]`) ?? "",
							};
						}),
						id: "",
					};
				},
			},
			{
				discriminant: "bsConsultation",
				from: "consultation",
				// Legacy: ConsultationSection (steps + dual CTA).
				build(en, sw, where) {
					const action = (node, swNode, key) => ({
						label: { en: reqText(node?.label, `${where}.${key}.label.en`), sw: reqText(swNode?.label, `${where}.${key}.label.sw`) },
						href: sharedValue(node, swNode, "href", `${where}.${key}`) ?? "",
						icon: sharedValue(node, swNode, "icon", `${where}.${key}`) ?? "",
					});
					const enSteps = en.steps ?? [];
					const swSteps = sw.steps ?? [];
					if (!Array.isArray(swSteps) || swSteps.length !== enSteps.length) {
						gap(where, `step count diverged (en=${enSteps.length} sw=${swSteps?.length})`);
					}
					return {
						tag: { en: optText(en.tag), sw: optText(sw.tag) },
						headline: { en: reqText(en.headline, `${where}.headline.en`), sw: reqText(sw.headline, `${where}.headline.sw`) },
						description: { en: optText(en.description), sw: optText(sw.description) },
						stepsLabel: { en: optText(en.stepsLabel), sw: optText(sw.stepsLabel) },
						steps: enSteps.map((step, i) => {
							const swStep = swSteps[i] ?? {};
							return {
								title: { en: reqText(step.title, `${where}.steps[${i}].title.en`), sw: reqText(swStep.title, `${where}.steps[${i}].title.sw`) },
								description: { en: reqText(step.description, `${where}.steps[${i}].description.en`), sw: reqText(swStep.description, `${where}.steps[${i}].description.sw`) },
							};
						}),
						ctaPrimary: action(en.ctaPrimary, sw.ctaPrimary, "ctaPrimary"),
						ctaSecondary: action(en.ctaSecondary, sw.ctaSecondary, "ctaSecondary"),
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
	// M11 batch 11: aerial-surveys. Whole page Keystatic-owned in page order
	// (2026-09-19) — `hero` (shared) + `section1` (aerialIntro) +
	// `whyDroneSurveys` (aerialWhyDrones) + `whatWeOffer` (aerialServices) +
	// `precision` (splitMedia) + `workflow` (shared; M13 batch 1 collapsed
	// the `aerialWorkflow` unique) +
	// `aerialSurveying` (aerialSurveyingGrid) + `deliverables` (shared,
	// surface tone for the `bg-surface` wrapper) + `industries`
	// (aerialIndustries) + `industryCta` (aerialIndustryCta) + `projects`
	// (aerialProjects) + `techStack` (aerialTechStack) + `capabilityCta`
	// (aerialCapabilityCta) + `additionalServices`
	// (aerialAdditionalServices) + `finalCta` (shared; M13 batch 1 collapsed
	// the `aerialFinalCta` unique). Mapping
	// order = entry order = page order (M12 flexible rule).
	"aerial-surveys": {
		namespace: "surveying/aerial-surveys",
		title: "Aerial Surveys",
		skipped: [],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: shared <Hero> used directly on the page (M13
				// batch 1 — retired the AerialHeroSection wrapper; default
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
				discriminant: "aerialIntro",
				from: "section1",
				// Legacy: IntroSection (manifesto + briefing card) →
				// <IntroSection data />.
				build: aerialIntroBuild,
			},
			{
				discriminant: "aerialWhyDrones",
				from: "whyDroneSurveys",
				// Legacy: WhyDroneSurveysSection (bento grid) →
				// <WhyDroneSurveysSection data />.
				build: aerialWhyDronesBuild,
			},
			{
				discriminant: "aerialServices",
				from: "whatWeOffer",
				// Legacy: AerialServicesSection (popup-card grid) →
				// <AerialServicesSection data />.
				build: aerialServicesBuild,
			},
			{
				discriminant: "splitMedia",
				from: "precision",
				// Legacy: shared <SplitMedia data imagePosition="right"
				// tone="surface" /> used directly on the page (M13 batch 1 —
				// retired the PrecisionSection wrapper; no points).
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
				discriminant: "workflow",
				from: "workflow",
				// Legacy: shared <WorkflowSection> used directly on the page
				// (M13 batch 1 — retired the AerialWorkflowSection wrapper;
				// `outcomeLabel` → `outcome` folded into the shared build).
				build: workflowBuild("default"),
			},
			{
				discriminant: "aerialSurveyingGrid",
				from: "aerialSurveying",
				// Legacy: AerialSurveyingSection (image cards) →
				// <AerialSurveyingSection data />.
				build: aerialSurveyingGridBuild,
			},
			{
				discriminant: "deliverables",
				from: "deliverables",
				// Legacy: shared <Deliverables ns="surveying/aerial-surveys"
				// className="bg-surface" /> used directly on the page (M13
				// batch 1 — retired the DeliverablesSection wrapper) —
				// shared `deliverables` with surface tone.
				build: deliverablesBuild("surface"),
			},
			{
				discriminant: "aerialIndustries",
				from: "industries",
				// Legacy: AerialIndustriesSection (link-card grid) →
				// <AerialIndustriesSection data />.
				build: aerialIndustriesBuild,
			},
			{
				discriminant: "aerialIndustryCta",
				from: "industryCta",
				// Legacy: IndustryCtaSection (split/shimmer CtaBand) →
				// <IndustryCtaSection data />.
				build: aerialCtaBuild,
			},
			{
				discriminant: "aerialProjects",
				from: "projects",
				// Legacy: ProjectsSection (mosaic + highlights) →
				// <ProjectsSection data />.
				build: aerialProjectsBuild,
			},
			{
				discriminant: "aerialTechStack",
				from: "techStack",
				// Legacy: TechStackSection (paper card grid) →
				// <TechStackSection data />.
				build: aerialTechStackBuild,
			},
			{
				discriminant: "aerialCapabilityCta",
				from: "capabilityCta",
				// Legacy: CapabilityCtaSection (centered/shimmer CtaBand) →
				// <CapabilityCtaSection data />.
				build: aerialCtaBuild,
			},
			{
				discriminant: "aerialAdditionalServices",
				from: "additionalServices",
				// Legacy: AdditionalServicesSection (pill row) →
				// <AdditionalServicesSection data />.
				build: aerialAdditionalServicesBuild,
			},
			{
				discriminant: "finalCta",
				from: "finalCta",
				// Legacy: shared <FinalCta watermark="drone" columns={4} />
				// used directly on the page (M13 batch 1 — retired the
				// AerialFinalCtaSection wrapper; presentation literals travel
				// as shared fields).
				build: finalCtaBuild("drone", 4, "center"),
			},
		],
	},
	// M11 batch 12: cadastral-surveys. Whole page Keystatic-owned in page
	// order (2026-09-19) — `hero` (shared) + `postHeroCta`
	// (cadastralPostHeroCta) + `whenYouNeed` (cadastralWhenYouNeed) +
	// `process` (shared `workflow`; M13 batch 2 collapsed the
	// `cadastralProcess` unique, ACQUISITION override as the satellite
	// preset) + `processCta` (cadastralProcessCta) + `cost` (cadastralCost) +
	// `timeline` (cadastralTimeline) + `compliance` (cadastralCompliance) +
	// `caseStudy` (cadastralCaseStudy) + `finalCta` (shared; M13 batch 2
	// collapsed the `cadastralFinalCta` unique). `whatsABoundarySurvey` stays DORMANT:
	// its IntroSection is commented out of the route, so migrating it would
	// re-enable content the editors switched off. Mapping order = entry
	// order = page order (M12 flexible rule).
	"cadastral-surveys": {
		namespace: "surveying/cadastral-surveys",
		title: "Cadastral Surveys",
		skipped: ["whatsABoundarySurvey"],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: shared <Hero> used directly on the page (M13
				// batch 2 — retired the CadastralHeroSection wrapper;
				// default bottom layout; empty description in both locales).
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
			{
				discriminant: "cadastralPostHeroCta",
				from: "postHeroCta",
				// Legacy: PostHeroCtaSection (light dual-CTA band) →
				// <PostHeroCtaSection data />.
				build: cadastralPostHeroCtaBuild,
			},
			{
				discriminant: "cadastralWhenYouNeed",
				from: "whenYouNeed",
				// Legacy: WhenYouNeedSection (sticky-image grid) →
				// <WhenYouNeedSection data />.
				build: cadastralWhenYouNeedBuild,
			},
			{
				discriminant: "workflow",
				from: "process",
				// Legacy: shared <WorkflowSection> used directly on the page
				// (M13 batch 2 — retired the ProcessFlowSection wrapper; the
				// ACQUISITION purple-chip/satellite override travels as the
				// shared `acquisition: "satellite"` preset).
				build: workflowBuild("satellite"),
			},
			{
				discriminant: "cadastralProcessCta",
				from: "processCta",
				// Legacy: ProcessCtaSection (dark band + chips) →
				// <ProcessCtaSection data />.
				build: cadastralProcessCtaBuild,
			},
			{
				discriminant: "cadastralCost",
				from: "cost",
				// Legacy: CostSection (tier cards) → <CostSection data />.
				build: cadastralCostBuild,
			},
			{
				discriminant: "cadastralTimeline",
				from: "timeline",
				// Legacy: TimelineSection (range bars) →
				// <TimelineSection data />.
				build: cadastralTimelineBuild,
			},
			{
				discriminant: "cadastralCompliance",
				from: "compliance",
				// Legacy: ComplianceSection (sticky checklist) →
				// <ComplianceSection data />.
				build: cadastralComplianceBuild,
			},
			{
				discriminant: "cadastralCaseStudy",
				from: "caseStudy",
				// Legacy: CaseStudySection (project story) →
				// <CaseStudySection data />.
				build: cadastralCaseStudyBuild,
			},
			{
				discriminant: "finalCta",
				from: "finalCta",
				// Legacy: shared <FinalCta watermark="vector-square"
				// columns={4} align="left" /> used directly on the page (M13
				// batch 2 — retired the FinalCtaSection wrapper; presentation
				// literals travel as shared fields).
				build: finalCtaBuild("vector-square", 4, "left"),
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
		// M11 batch 13 (2026-09-19): whole page Keystatic-owned in page order
		// — `hero` (gprHero) + `technicalCta` (shared ctaBand) + `highlights`
		// (gprHighlights) + `jumpNav` (gprJumpNav) + `overview` (gprOverview)
		// + `methodology` (gprMethodology) + `applications`
		// (gprApplications) + `detectCaps` (gprDetect) + `deliverables`
		// (shared, surface tone + jump-nav `id`) + `sue` (gprSue) +
		// `limitations` (gprLimitations) + `beforeAfter` (gprBeforeAfter) +
		// `technology` (gprTechnology) + `featuredProjects`
		// (gprFeaturedProjects) + `summary` (gprSummary) + `faqs` (shared
		// faq) + `finalCta` (shared; M13 batch 3 collapsed the `gprFinalCta`
		// unique). Mapping
		// order = entry order = page order (M12 flexible rule). Known minor
		// divergence: the shared `deliverables` hop drops the wrapper's
		// `scroll-mt-36` (tone maps to `bg-surface` only) — anchor scroll
		// offset for #deliverables, no visual change.
		skipped: [],
		sections: [
			{
				discriminant: "gprHero",
				from: "hero",
				// Legacy: GprServiceHero (slider + <bold> lede) →
				// <GprServiceHero data />. Dead `headline`/`image` keys
				// dropped (never rendered).
				build: gprHeroBuild,
			},
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
				discriminant: "gprHighlights",
				from: "highlights",
				// Legacy: GprHighlightsBar (root-array strip) →
				// <GprHighlightsBar data />.
				build: gprHighlightsBuild,
			},
			{
				discriminant: "gprJumpNav",
				from: "jumpNav",
				// Legacy: GprJumpNav (root-array sticky scroll-spy nav) →
				// <GprJumpNav data />.
				build: gprJumpNavBuild,
			},
			{
				discriminant: "gprOverview",
				from: "overview",
				// Legacy: GprOverviewSection → <GprOverviewSection data />.
				build: gprOverviewBuild,
			},
			{
				discriminant: "gprMethodology",
				from: "methodology",
				// Legacy: GprMethodologySection (timeline rail) →
				// <GprMethodologySection data />.
				build: gprMethodologyBuild,
			},
			{
				discriminant: "gprApplications",
				from: "applications",
				// Legacy: GprApplicationsSection (indexed grid) →
				// <GprApplicationsSection data />.
				build: gprApplicationsBuild,
			},
			{
				discriminant: "gprDetect",
				from: "detectCaps",
				// Legacy: GprDetectSection (fallbackIcons grid) →
				// <GprDetectSection data />.
				build: gprDetectBuild,
			},
			{
				discriminant: "deliverables",
				from: "deliverables",
				// Legacy: shared <Deliverables
				// ns="surveying/ground-penetrating-radar" id="deliverables"
				// className="bg-surface scroll-mt-36" /> used directly on the
				// page (M13 batch 3 — retired the GprDeliverablesSection
				// wrapper) — shared `deliverables`, surface tone + jump-nav
				// id (scroll-mt-36 documented drop, see mapping comment).
				build: deliverablesBuild("surface", "deliverables"),
			},
			{
				discriminant: "gprSue",
				from: "sue",
				// Legacy: GprSueComplianceSection (SUE level cards) →
				// <GprSueComplianceSection data />.
				build: gprSueBuild,
			},
			{
				discriminant: "gprLimitations",
				from: "limitations",
				// Legacy: GprLimitationsSection → <GprLimitationsSection data />.
				build: gprLimitationsBuild,
			},
			{
				discriminant: "gprBeforeAfter",
				from: "beforeAfter",
				// Legacy: GprBeforeAfterSection (flip card) →
				// <GprBeforeAfterSection data />.
				build: gprBeforeAfterBuild,
			},
			{
				discriminant: "gprTechnology",
				from: "technology",
				// Legacy: GprTechnologySection → <GprTechnologySection data />.
				build: gprTechnologyBuild,
			},
			{
				discriminant: "gprFeaturedProjects",
				from: "featuredProjects",
				// Legacy: FeaturedProjectsSection → <FeaturedProjectsSection data />.
				build: gprFeaturedProjectsBuild,
			},
			{
				discriminant: "gprSummary",
				from: "summary",
				// Legacy: GprSummarySection → <GprSummarySection data />.
				build: gprSummaryBuild,
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
			{
				discriminant: "finalCta",
				from: "finalCta",
				// Legacy: shared <FinalCta watermark="radar" columns={3}
				// descriptionTone="accent" id="get-started" /> used directly
				// on the page (M13 batch 3 — retired the GprFinalCtaSection
				// wrapper; presentation literals + anchor default travel as
				// shared fields).
				build: finalCtaBuild("radar", 3, "center", { descriptionTone: "accent", id: "get-started" }),
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
		// M11 batch 14 (2026-09-19): whole page Keystatic-owned in page order
		// — `hero` (gisHero) + `whatIsGis` (gisWhatIs) + `consultationCta`
		// (shared ctaBand) + `whyGisCritical` (gisImportance) + `gisServices`
		// (gisServices) + `industries` (gisIndustries) + `techStack`
		// (gisTechStack) + `whatsappCta` (gisWhatsappCta) + `gisComponents`
		// (gisComponents) + `whySmartgrid` (gisWhySmartgrid) +
		// `dataAccuracy` (gisDataAccuracy) + `beforeAfter` (gisBeforeAfter)
		// + `projectImpact` (gisProjectImpact) + `relatedServices`
		// (gisRelatedServices) + `analystCta` (gisAnalystCta).
		// `remoteSensingSolutions` + `mappingServices` stay DORMANT
		// (commented out of the route — never migrated). Mapping order =
		// entry order = page order (M12 flexible rule).
		skipped: ["remoteSensingSolutions", "mappingServices"],
		sections: [
			{
				discriminant: "gisHero",
				from: "hero",
				// Legacy: GisHeroSection (full-bleed + <bold> lede) →
				// <GisHeroSection data />.
				build: gisHeroBuild,
			},
			{
				discriminant: "gisWhatIs",
				from: "whatIsGis",
				// Legacy: WhatIsGisSection (cards + closing panel) →
				// <WhatIsGisSection data />.
				build: gisWhatIsBuild,
			},
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
			{
				discriminant: "gisImportance",
				from: "whyGisCritical",
				// Legacy: GisImportanceSection (checklist grid) →
				// <GisImportanceSection data />.
				build: gisChecklistGridBuild,
			},
			{
				discriminant: "gisServices",
				from: "gisServices",
				// Legacy: GisServicesSection (indexed grid) →
				// <GisServicesSection data />.
				build: gisServicesBuild,
			},
			{
				discriminant: "gisIndustries",
				from: "industries",
				// Legacy: GisIndustriesSection (2-col grid) →
				// <GisIndustriesSection data />.
				build: gisChecklistGridBuild,
			},
			{
				discriminant: "gisTechStack",
				from: "techStack",
				// Legacy: GisTechStackSection (pills + logo bento) →
				// <GisTechStackSection data />.
				build: gisTechStackBuild,
			},
			{
				discriminant: "gisWhatsappCta",
				from: "whatsappCta",
				// Legacy: GisWhatsappCtaSection (WhatsApp band) →
				// <GisWhatsappCtaSection data />.
				build: gisWhatsappCtaBuild,
			},
			{
				discriminant: "gisComponents",
				from: "gisComponents",
				// Legacy: GisComponentsSection (lifecycle ring) →
				// <GisComponentsSection data />.
				build: gisComponentsBuild,
			},
			{
				discriminant: "gisWhySmartgrid",
				from: "whySmartgrid",
				// Legacy: GisWhySmartgridSection (icon grid) →
				// <GisWhySmartgridSection data />.
				build: gisWhySmartgridBuild,
			},
			{
				discriminant: "gisDataAccuracy",
				from: "dataAccuracy",
				// Legacy: GisDataAccuracySection (QC + levels panels) →
				// <GisDataAccuracySection data />.
				build: gisDataAccuracyBuild,
			},
			{
				discriminant: "gisBeforeAfter",
				from: "beforeAfter",
				// Legacy: GisBeforeAfterSection (flip card) →
				// <GisBeforeAfterSection data />.
				build: gisBeforeAfterBuild,
			},
			{
				discriminant: "gisProjectImpact",
				from: "projectImpact",
				// Legacy: GisProjectImpactSection (number grid) →
				// <GisProjectImpactSection data />.
				build: gisProjectImpactBuild,
			},
			{
				discriminant: "gisRelatedServices",
				from: "relatedServices",
				// Legacy: GisRelatedServicesSection (link grid) →
				// <GisRelatedServicesSection data />.
				build: gisRelatedServicesBuild,
			},
			{
				discriminant: "finalCta",
				from: "analystCta",
				// Legacy: shared <FinalCta watermark="map-search-outline"
				// columns={3} id="talk-to-analyst" /> used directly on the
				// page (M13 batch 4 — retired the GisAnalystCtaSection
				// wrapper; presentation literals + anchor default travel as
				// shared fields).
				build: finalCtaBuild("map-search-outline", 3, "center", { id: "talk-to-analyst" }),
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
		// M11 batch 15 (2026-09-19): whole page Keystatic-owned in page order
		// — `hero` + `overview` + `services` (highwayServices) + `benefits`
		// + `highwaySurveyDeliverables` (shared `deliverables`, default tone
		// — the wrapper carries no className). Mapping order = entry order =
		// page order (M12 flexible rule).
		skipped: [],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: shared <Hero> used directly on the page (M13 batch 5 — wrapper retired; shared used directly on the page).
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
			{
				discriminant: "introText",
				from: "overview",
				// Legacy: shared <IntroTextSection tone="surface" /> used directly (M13 batch 5 — wrapper retired; shared used directly on the page).
				// (align/split unset = left/false).
				build: introTextBuild({ tone: "surface", align: "left", split: false }),
			},
			{
				discriminant: "highwayServices",
				from: "services",
				// Legacy: ServicesSection (indexed grid) →
				// <ServicesSection data />.
				build: civilIndexedGridBuild,
			},
			{
				discriminant: "cardGrid",
				from: "benefitsOfHighwaySurveys",
				// Legacy: shared <CardGrid columns={3} tone="surface" /> used directly (M13 batch 5 — wrapper retired; shared used directly on the page).
				// (align/card unset = defaults).
				build: cardGridBuild({ columns: "3", align: "left", tone: "surface", headerRow: false, cardDensity: "comfortable", cardIconSize: "md" }),
			},
			{
				discriminant: "deliverables",
				from: "highwaySurveyDeliverables",
				// Legacy: shared <Deliverables
				// ns="civil/highway-surveys"
				// baseKey="highwaySurveyDeliverables" /> used directly on the
				// page (M13 batch 5 — DeliverablesSection wrapper retired) —
				// shared `deliverables`, default tone (no wrapper className).
				build: deliverablesBuild("default"),
			},
		],
	},
	// M7 batch 11b: as-built-surveys. Six sections migrate in page order —
	// `hero` + `whatAreAsBuiltSurveys`/`maxProductivityMinGuesswork`/
	// `actionableInsights` (introText; M13 batch 5 retired the shared
	// TextSection shims, pages use IntroTextSection directly) +
	// `keyIndustries`/`applications` (cardGrids). Tails stay legacy:
	// AsBuiltSolutionsSection (`indexed` numbering) + bespoke Deliverables
	// explorer.
	"as-built-surveys": {
		namespace: "civil/as-built-surveys",
		title: "As-Built Surveys",
		// M11 batch 15 (2026-09-19): whole page Keystatic-owned in page order
		// — `hero` + `whatAre` + `asBuiltSolutions` (asBuiltSolutions) +
		// `keyIndustries` + `maxProductivity` + `applications` +
		// `actionableInsights` + `deliverables` (shared, surface tone).
		// Mapping order = entry order = page order (M12 flexible rule).
		skipped: [],
		sections: [
			{
				discriminant: "hero",
				from: "hero",
				// Legacy: shared <Hero> used directly on the page (M13 batch 5 — wrapper retired; shared used directly on the page).
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
			{
				discriminant: "introText",
				from: "whatAreAsBuiltSurveys",
				// Legacy: shared <IntroTextSection /> used directly (M13 batch 5 — wrapper retired; shared used directly on the page). (tone
				// default, align/split unset).
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "asBuiltSolutions",
				from: "asBuiltSolutions",
				// Legacy: AsBuiltSolutionsSection (indexed surface grid) →
				// <AsBuiltSolutionsSection data />.
				build: civilIndexedGridBuild,
			},
			{
				discriminant: "cardGrid",
				from: "keyIndustries",
				// Legacy: shared <CardGrid columns={3} align="center" /> used directly (M13 batch 5 — wrapper retired; shared used directly on the page).
				// (tone/card unset = defaults).
				build: cardGridBuild({ columns: "3", align: "center", tone: "default", headerRow: false, cardDensity: "comfortable", cardIconSize: "md" }),
			},
			{
				discriminant: "introText",
				from: "maxProductivityMinGuesswork",
				// Legacy: shared <IntroTextSection tone="surface" /> used directly (M13 batch 5 — wrapper retired; shared used directly on the page)..
				build: introTextBuild({ tone: "surface", align: "left", split: false }),
			},
			{
				discriminant: "cardGrid",
				from: "applications",
				// Legacy: shared <CardGrid columns={3} tone="surface" align="center" />
				// used directly (M13 batch 5 — wrapper retired; shared used directly on the page)..
				build: cardGridBuild({ columns: "3", align: "center", tone: "surface", headerRow: false, cardDensity: "comfortable", cardIconSize: "md" }),
			},
			{
				discriminant: "introText",
				from: "actionableInsights",
				// Legacy: shared <IntroTextSection /> used directly (M13 batch 5 — wrapper retired; shared used directly on the page). (tone
				// default, align/split unset).
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "deliverables",
				from: "deliverables",
				// Legacy: inline <Deliverables ns="civil/as-built-surveys"
				// className="bg-surface" /> — shared `deliverables`, surface
				// tone.
				build: deliverablesBuild("surface"),
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
				// Legacy: shared <Hero> used directly on the page (M13 batch 6 — HeroSection wrapper retired).
				// (default bottom layout; secondary-only pill).
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
				// Legacy: shared <Hero> used directly on the page (M13 batch 6 — HeroSection wrapper retired).
				// (default bottom layout; dual pills, neither with an icon key).
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
				// Legacy: shared <Hero> used directly on the page (M13 batch 6
				// — HeroSection wrapper retired; default bottom layout; dual
				// pills with icons).
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
				// Legacy: shared <IntroTextSection /> used directly (M13 batch 6 — MaxProductivityMinGuessworkSection/TextSection wrappers retired).
				// (tone default, align/split unset).
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "splitMedia",
				from: "precisionVolumetricAnalysis",
				// Legacy: shared <SplitMedia data imagePosition="right" /> used directly (M13 batch 6 — PrecisionVolumetricAnalysisSection wrapper retired).
				// (tone/mediaAspect/mediaFit unset = defaults).
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
				// Legacy: shared <IntroTextSection tone="surface" /> used directly (M13 batch 6 — ClarityAndControlSection/TextSection wrappers retired).
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
				// Legacy: shared <Hero> used directly on the page (M13 batch 7 — wrapper retired).
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
				// Legacy: shared <Hero> used directly on the page (M13 batch 7 — wrapper retired).
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
			{
				discriminant: "introText",
				from: "quarryServices",
				// Legacy: shared <IntroTextSection /> used directly (M13 batch 7 — wrapper retired; shared used directly on the page). (tone
				// default, align/split unset).
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "introText",
				from: "maximizeProductivity",
				// Legacy: shared <IntroTextSection tone="surface" /> used directly (M13 batch 7 — wrapper retired; shared used directly on the page)..
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
				// Legacy: shared <Hero> used directly on the page (M13 batch 7 — wrapper retired).
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
			{
				discriminant: "introText",
				from: "drivingSustainability",
				// Legacy: shared <IntroTextSection /> used directly (M13 batch 7 — wrapper retired; shared used directly on the page).
				// (tone default, align/split unset).
				build: introTextBuild({ tone: "default", align: "left", split: false }),
			},
			{
				discriminant: "introText",
				from: "techWeUse",
				// Legacy: shared <IntroTextSection tone="surface" /> used directly (M13 batch 7 — wrapper retired; shared used directly on the page)..
				build: introTextBuild({ tone: "surface", align: "left", split: false }),
			},
			{
				discriminant: "introText",
				from: "whyPartnerWithUs",
				// Legacy: shared <IntroTextSection /> used directly (M13 batch 7 — wrapper retired; shared used directly on the page). (tone
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
				// Legacy: shared <Hero> used directly on the page (M13 batch 7 — wrapper retired; shared used directly on the page).
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
				// Legacy: shared <Stats items columns={3} /> used directly on the page (M13 batch 7 — wrapper retired; shared used directly on the page).
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
				// Legacy: shared <Hero> used directly on the page (M13 batch 7 — wrapper retired; shared used directly on the page).
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
				// Legacy: shared <Hero> used directly on the page (M13 batch 7 — wrapper retired; shared used directly on the page).
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
			{
				discriminant: "splitMedia",
				from: "forestry",
				// Legacy: shared <SplitMedia data imagePosition="left" tone="surface"
				// mediaAspect="aspect-16/10" /> used directly (M13 batch 7 — wrapper retired; shared used directly on the page).
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
				// Legacy: shared <SplitMedia data imagePosition="right" tone="default"
				// mediaAspect="aspect-16/10" /> used directly (M13 batch 7 — wrapper retired; shared used directly on the page)..
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
	const pageBuilder = mapping.sections.map(({ discriminant, from, ns, fromExtra, build }) => {
		// M11 batch 2 (2026-09-18): `fromExtra` reads a section node from a
		// cross-namespace locale file (careers embeds the global
		// `common:leadGenBar` + `common:services` instances in page order).
		if (fromExtra) {
			const srcEn = extra[fromExtra.ns]?.en?.[fromExtra.key];
			const srcSw = extra[fromExtra.ns]?.sw?.[fromExtra.key];
			if (srcEn === undefined || srcSw === undefined) {
				gap(fromExtra.key, `section key missing in extra.${fromExtra.ns}`);
				return { discriminant, value: {} };
			}
			return { discriminant, value: stripInternalKeys(build(srcEn, srcSw, fromExtra.key, siteTitle, extra)) };
		}
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
