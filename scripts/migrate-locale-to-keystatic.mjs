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
};

function loadNamespace(locale, namespace) {
	return JSON.parse(readFileSync(join(ROOT, "public", "locales", locale, `${namespace}.json`), "utf8"));
}

function generate(pageSlug) {
	const mapping = PAGES[pageSlug];
	if (!mapping) throw new Error(`No migration mapping for page ${JSON.stringify(pageSlug)}.`);
	gaps.length = 0;
	const en = loadNamespace("en", mapping.namespace);
	const sw = loadNamespace("sw", mapping.namespace);
	const pageBuilder = mapping.sections.map(({ discriminant, from, build }) => {
		if (!(from in en) || !(from in sw)) {
			gap(from, "section key missing in one locale");
			return { discriminant, value: {} };
		}
		return { discriminant, value: build(en[from], sw[from], from) };
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
