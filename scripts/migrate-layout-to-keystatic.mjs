// Repeatable locale-JSON → Keystatic layout migration (M9).
//
// The `site` singleton owns the site-wide layout slices rendered by the
// layout shell: Navbar (`common:nav` + `common:contacts`), both Footers
// (`common:footer` + `contact:talkToUs.contacts` +
// `contact:social.channels`) and CookieConsent (`common:cookies`). The
// generator copies every content scalar verbatim — URLs, image paths,
// icons, labels and numbers — and pairs `en`/`sw` strings into locale
// nodes. Only the `type` discriminator keys of the legacy namespaces are
// dropped (they route wrappers, not content).
//
// Completeness gate (no silent fallback): every required locale string must
// exist and be non-empty in BOTH locales; every shared non-text value
// (href, icon, url, numbers) must be identical across locales. Any gap
// aborts with a diagnostic list.
//
// Out of scope (Stage 1 decision, recorded in the plan): `common:socials`,
// `nav.ctaPrimary/ctaSecondary/ctaSearch`, `nav.logo_dark`
// (all unrendered dead content), `common:locales`/`common:misc` (routing),
// `meta:site` (brand/SEO, legacy-owned).
//
// Usage:
//   node scripts/migrate-layout-to-keystatic.mjs --write
//   node scripts/migrate-layout-to-keystatic.mjs --verify
// `--verify` regenerates from locale JSON and compares the checked-in entry
// with the status normalized: the committed file must always equal
// repeatable output.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const gaps = [];
const gap = (where, message) => gaps.push(`${where}: ${message}`);

/** Required localized string (non-empty in the given locale). */
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

/** Shared non-text value: must be identical across locales, copied exactly. */
function sharedValue(enNode, swNode, key, where) {
	const en = enNode?.[key];
	const sw = swNode?.[key];
	if (JSON.stringify(en) !== JSON.stringify(sw)) {
		gap(where, `"${key}" diverged across locales (en=${JSON.stringify(en)} sw=${JSON.stringify(sw)})`);
	}
	return en;
}

function navBuild(en, sw, where) {
	const enLinks = en.links ?? [];
	const swLinks = sw.links ?? [];
	if (!Array.isArray(swLinks) || swLinks.length !== enLinks.length) {
		gap(where, `link count diverged (en=${enLinks.length} sw=${swLinks?.length})`);
	}
	return {
		logo: sharedValue(en, sw, "logo", where) ?? "",
		logoLight: sharedValue(en, sw, "logo_light", where) ?? "",
		logoAlt: { en: reqText(en.logo_alt, `${where}.logo_alt.en`), sw: reqText(sw.logo_alt, `${where}.logo_alt.sw`) },
		links: enLinks.map((link, i) => {
			const swLink = swLinks[i] ?? {};
			const enSubs = link.links ?? [];
			const swSubs = swLink.links ?? [];
			if (!Array.isArray(swSubs) || swSubs.length !== enSubs.length) {
				gap(where, `sublink count diverged (en=${enSubs.length} sw=${swSubs?.length})`);
			}
			return {
				label: { en: reqText(link.label, `${where}.links[${i}].label.en`), sw: reqText(swLink.label, `${where}.links[${i}].label.sw`) },
				href: sharedValue(link, swLink, "href", `${where}.links[${i}]`) ?? "",
				type: sharedValue(link, swLink, "type", `${where}.links[${i}]`) ?? "standard",
				excludeOnMainNav: sharedValue(link, swLink, "excludeOnMainNav", `${where}.links[${i}]`) ?? false,
				links: enSubs.map((sub, j) => {
					const swSub = swSubs[j] ?? {};
					return {
						label: { en: reqText(sub.label, `${where}.links[${i}].links[${j}].label.en`), sw: reqText(swSub.label, `${where}.links[${i}].links[${j}].label.sw`) },
						href: sharedValue(sub, swSub, "href", `${where}.links[${i}].links[${j}]`) ?? "",
					};
				}),
			};
		}),
	};
}

function footerBuild(en, sw, where) {
	const columns = {};
	for (const key of ["company", "surveying", "drones", "civil"]) {
		const enCol = en.columns?.[key] ?? {};
		const swCol = sw.columns?.[key] ?? {};
		const enLinks = enCol.links ?? [];
		const swLinks = swCol.links ?? [];
		if (!Array.isArray(swLinks) || swLinks.length !== enLinks.length) {
			gap(where, `column ${key} link count diverged (en=${enLinks.length} sw=${swLinks?.length})`);
		}
		columns[key] = {
			heading: { en: reqText(enCol.heading, `${where}.columns.${key}.heading.en`), sw: reqText(swCol.heading, `${where}.columns.${key}.heading.sw`) },
			links: enLinks.map((link, i) => {
				const swLink = swLinks[i] ?? {};
				return {
					label: { en: reqText(link.label, `${where}.columns.${key}.links[${i}].label.en`), sw: reqText(swLink.label, `${where}.columns.${key}.links[${i}].label.sw`) },
					href: sharedValue(link, swLink, "href", `${where}.columns.${key}.links[${i}]`) ?? "",
				};
			}),
		};
	}
	return {
		description: { en: optText(en.description), sw: optText(sw.description) },
		columns,
		// Copyright keeps its `{{year}}`/`{{organization}}` interpolation
		// verbatim — the Footer interpolates at render time.
		copyright: { en: reqText(en.copyright, `${where}.copyright.en`), sw: reqText(sw.copyright, `${where}.copyright.sw`) },
		legal: {
			privacy: { en: optText(en.legal?.privacy), sw: optText(sw.legal?.privacy) },
			terms: { en: optText(en.legal?.terms), sw: optText(sw.legal?.terms) },
			cookies: { en: optText(en.legal?.cookies), sw: optText(sw.legal?.cookies) },
		},
	};
}

function contactsBuild(en, sw, where) {
	const groups = {};
	for (const key of ["address", "phone", "mail", "whatsapp"]) {
		const enItems = en[key] ?? [];
		const swItems = sw[key] ?? [];
		if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
			gap(where, `group ${key} item count diverged (en=${enItems.length} sw=${swItems?.length})`);
		}
		groups[key] = enItems.map((item, i) => {
			const swItem = swItems[i] ?? {};
			return {
				icon: sharedValue(item, swItem, "icon", `${where}.${key}[${i}]`) ?? "",
				label: { en: reqText(item.label, `${where}.${key}[${i}].label.en`), sw: reqText(swItem.label, `${where}.${key}[${i}].label.sw`) },
				value: { en: reqText(item.value, `${where}.${key}[${i}].value.en`), sw: reqText(swItem.value, `${where}.${key}[${i}].value.sw`) },
				href: sharedValue(item, swItem, "href", `${where}.${key}[${i}]`) ?? "",
			};
		});
	}
	return groups;
}

function cookiesBuild(en, sw, where) {
	const category = (key) => ({
		label: { en: reqText(en.categories?.[key]?.label, `${where}.categories.${key}.label.en`), sw: reqText(sw.categories?.[key]?.label, `${where}.categories.${key}.label.sw`) },
		description: { en: reqText(en.categories?.[key]?.description, `${where}.categories.${key}.description.en`), sw: reqText(sw.categories?.[key]?.description, `${where}.categories.${key}.description.sw`) },
	});
	return {
		title: { en: reqText(en.title, `${where}.title.en`), sw: reqText(sw.title, `${where}.title.sw`) },
		description: { en: reqText(en.description, `${where}.description.en`), sw: reqText(sw.description, `${where}.description.sw`) },
		privacyLink: { en: optText(en.privacyLink), sw: optText(sw.privacyLink) },
		acceptAll: { en: optText(en.acceptAll), sw: optText(sw.acceptAll) },
		rejectAll: { en: optText(en.rejectAll), sw: optText(sw.rejectAll) },
		customize: { en: optText(en.customize), sw: optText(sw.customize) },
		savePreferences: { en: optText(en.savePreferences), sw: optText(sw.savePreferences) },
		back: { en: optText(en.back), sw: optText(sw.back) },
		preferencesDescription: { en: optText(en.preferencesDescription), sw: optText(sw.preferencesDescription) },
		categories: {
			necessary: {
				...category("necessary"),
				alwaysActive: { en: reqText(en.categories?.necessary?.alwaysActive, `${where}.categories.necessary.alwaysActive.en`), sw: reqText(sw.categories?.necessary?.alwaysActive, `${where}.categories.necessary.alwaysActive.sw`) },
			},
			functional: category("functional"),
			analytics: category("analytics"),
		},
	};
}

function footerContactsBuild(en, sw, where) {
	const enItems = en ?? [];
	const swItems = sw ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return enItems.map((item, i) => {
		const swItem = swItems[i] ?? {};
		return {
			icon: sharedValue(item, swItem, "icon", `${where}[${i}]`) ?? "",
			label: { en: reqText(item.label, `${where}[${i}].label.en`), sw: reqText(swItem.label, `${where}[${i}].label.sw`) },
			href: sharedValue(item, swItem, "href", `${where}[${i}]`) ?? "",
			note: { en: optText(item.note), sw: optText(swItem.note) },
			color: sharedValue(item, swItem, "color", `${where}[${i}]`) ?? "",
		};
	});
}

function socialChannelsBuild(en, sw, where) {
	const enItems = en ?? [];
	const swItems = sw ?? [];
	if (!Array.isArray(swItems) || swItems.length !== enItems.length) {
		gap(where, `item count diverged (en=${enItems.length} sw=${swItems?.length})`);
	}
	return enItems.map((item, i) => {
		const swItem = swItems[i] ?? {};
		return {
			platform: sharedValue(item, swItem, "platform", `${where}[${i}]`) ?? "",
			handle: sharedValue(item, swItem, "handle", `${where}[${i}]`) ?? "",
			url: sharedValue(item, swItem, "url", `${where}[${i}]`) ?? "",
			icon: sharedValue(item, swItem, "icon", `${where}[${i}]`) ?? "",
		};
	});
}

function loadLocaleFile(locale, namespace) {
	return JSON.parse(readFileSync(join(ROOT, "public", "locales", locale, `${namespace}.json`), "utf8"));
}

function generate() {
	gaps.length = 0;
	const enCommon = loadLocaleFile("en", "common");
	const swCommon = loadLocaleFile("sw", "common");
	const enContact = loadLocaleFile("en", "contact");
	const swContact = loadLocaleFile("sw", "contact");
	return {
		status: "draft",
		nav: navBuild(enCommon.nav ?? {}, swCommon.nav ?? {}, "nav"),
		footer: footerBuild(enCommon.footer ?? {}, swCommon.footer ?? {}, "footer"),
		contacts: contactsBuild(enCommon.contacts ?? {}, swCommon.contacts ?? {}, "contacts"),
		cookies: cookiesBuild(enCommon.cookies ?? {}, swCommon.cookies ?? {}, "cookies"),
		footerContacts: footerContactsBuild(enContact.talkToUs?.contacts, swContact.talkToUs?.contacts, "talkToUs.contacts"),
		socialChannels: socialChannelsBuild(enContact.social?.channels, swContact.social?.channels, "social.channels"),
	};
}

function serialize(entry) {
	return JSON.stringify(entry, null, "\t") + "\n";
}

function main() {
	const mode = process.argv.includes("--write") ? "write" : process.argv.includes("--verify") ? "verify" : undefined;
	if (!mode) {
		console.error("Usage: node scripts/migrate-layout-to-keystatic.mjs (--write|--verify)");
		process.exit(2);
	}
	let generated;
	try {
		generated = generate();
	} catch (err) {
		console.error(`FAIL ${err.message}`);
		process.exit(1);
	}
	if (gaps.length > 0) {
		for (const message of gaps) console.error(`FAIL ${message}`);
		console.error(`\n${gaps.length} completeness gap(s) — migration aborted, no silent fallback.`);
		process.exit(1);
	}
	const dest = join(ROOT, "content", "site.json");
	if (mode === "write") {
		writeFileSync(dest, serialize(generated));
		console.log(`Wrote ${dest} (no gaps).`);
		return;
	}
	let onDisk;
	try {
		onDisk = readFileSync(dest, "utf8").replace(/\r\n/g, "\n");
	} catch {
		console.error(`FAIL ${dest} does not exist — run with --write first.`);
		process.exit(1);
	}
	// The generator always emits `draft` (a hand-published entry keeps its
	// status). Compare with the status normalized so `--verify` pins content
	// equality, not the publish flip.
	const generatedJson = serialize(generated);
	try {
		const onDiskEntry = JSON.parse(onDisk);
		const generatedEntry = JSON.parse(generatedJson);
		if (JSON.stringify({ ...onDiskEntry, status: "draft" }) === JSON.stringify({ ...generatedEntry, status: "draft" })) {
			console.log("OK site: checked-in entry equals repeatable migration output (no gaps).");
			return;
		}
	} catch {
		// Fall through to the byte-compare diagnostic below.
	}
	if (onDisk !== generatedJson) {
		console.error(`FAIL ${dest} differs from repeatable output — re-run with --write and inspect the diff.`);
		process.exit(1);
	}
	console.log("OK site: checked-in entry equals repeatable migration output (no gaps).");
}

main();
