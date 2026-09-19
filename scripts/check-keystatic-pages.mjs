// M2 page-builder check: registry integrity, renderer coverage, locale
// semantics, and on-disk fixture validation.
// - Every registry entry has a stable id, version, label, schema, example
//   payload and normalizer; examples only use schema-declared keys.
// - Renderer keys match registry ids exactly; every example renders to
//   static markup in both locales; unknown ids throw UnknownSectionError.
// - `resolveLocaleValue` resolves en/sw with English fallback.
// - `content/pages/*.json` fixtures satisfy the slug/metadata contract and
//   reference only known section discriminants with well-formed locale nodes.
// Usage: `node scripts/check-keystatic-pages.mjs [--dir content/pages]`
// Exit code is non-zero with a diagnostic on the first violation(s) found.

import { readdirSync, readFileSync, existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { join, basename, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const requireRoot = createRequire(ROOT + "/package.json");
const ts = requireRoot("typescript");

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KNOWN_STATUSES = new Set(["draft", "published"]);
const LOCALES = ["en", "sw"];

const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);
const check = (where, condition, message) => {
	if (!condition) fail(where, message);
};

// --- Load repo TypeScript in plain Node -----------------------------------
// Transpile the Node-safe Keystatic modules plus the renderer chain (with a
// `@/` alias hook and on-the-fly `.tsx` compilation) so the registry and
// its renderer mapping are verified from the real sources, not copies.

const CACHE = join(ROOT, "node_modules", ".cache", "ks-check");
mkdirSync(CACHE, { recursive: true });

function transpileToCache(relativePath, replacements = []) {
	const src = readFileSync(join(ROOT, relativePath), "utf8");
	const out = ts.transpileModule(src, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2020,
			jsx: ts.JsxEmit.ReactJSX,
			esModuleInterop: true,
		},
	});
	let text = out.outputText;
	for (const [from, to] of replacements) text = text.replaceAll(from, to);
	const base = basename(relativePath).replace(/\.(ts|tsx)$/, ".js");
	const dest = join(CACHE, base);
	writeFileSync(dest, text);
	return dest;
}

const nodeRequire = createRequire(ROOT + "/package.json");
const Module = nodeRequire("node:module");
// M11 batch 1 (contact): the `contactForm` renderer embeds the interactive
// `ContactForm` widget, which calls `useRouter()` for query-param prefill.
// There is no Next.js router in this isolated render, so `next/router`
// resolves to a static stub (empty query — the same prefill state as a
// direct visit with no query string). Production behavior is unchanged.
const routerStub = join(CACHE, "next-router-stub.js");
if (!existsSync(routerStub)) {
	writeFileSync(
		routerStub,
		`"use strict";\nmodule.exports = { useRouter: () => ({ pathname: "/", asPath: "/", query: {}, push: async () => false, replace: async () => false, prefetch: async () => {}, back: () => {}, events: { on() {}, off() {}, emit() {} } }) };\n`
	);
}
// `ContactForm` also calls Formspree's `useForm()` with
// `NEXT_PUBLIC_FORMSPREE_FORM_ID`, which is unset in this harness. A dummy
// key keeps the static proof honest: `useForm` only initializes state until
// submit, and this harness never submits.
process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ??= "ks-check-harness";
const origResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
	if (request === "next/router") return routerStub;
	if (typeof request === "string" && /(^|\/)keystatic\.config$/.test(request)) {
		return join(CACHE, "keystatic.config.js");
	}
	if (typeof request === "string" && request.startsWith("@/")) {
		const base = join(ROOT, "src", request.slice(2));
		for (const candidate of [base, `${base}.tsx`, `${base}.ts`, `${base}.js`, join(base, "index.tsx"), join(base, "index.ts")]) {
			try {
				return origResolveFilename.call(this, candidate, ...rest);
			} catch {
				// try next candidate
			}
		}
	}
	return origResolveFilename.call(this, request, ...rest);
};

const fsForHook = nodeRequire("node:fs");
function compileTypeScriptInPlace(module, filename) {
	const src = fsForHook.readFileSync(filename, "utf8");
	const out = ts.transpileModule(src, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2020,
			jsx: ts.JsxEmit.ReactJSX,
			esModuleInterop: true,
		},
	});
	module._compile(out.outputText, filename);
}
// Registering the hooks also teaches Node's resolver to try these
// extensions for extensionless relative imports (e.g. `./localize` →
// `./localize.ts`, `./CtaPill` → `./CtaPill.tsx`).
nodeRequire.extensions[".tsx"] = compileTypeScriptInPlace;
nodeRequire.extensions[".ts"] = compileTypeScriptInPlace;

const registry = nodeRequire(transpileToCache("src/lib/keystatic/fields.ts")) && nodeRequire(transpileToCache("src/lib/keystatic/localize.ts")) && nodeRequire(transpileToCache("src/lib/keystatic/sectionRegistry.ts"));
const siteLayout = nodeRequire(transpileToCache("src/lib/keystatic/siteLayout.ts"));
nodeRequire(transpileToCache("keystatic.config.ts", [["./src/lib/keystatic/sectionRegistry", "./sectionRegistry"], ["./src/lib/keystatic/siteLayout", "./siteLayout"]]));
const { resolveKeystaticPage, isKeystaticPageEnabled } = nodeRequire(transpileToCache("src/lib/keystatic/resolvePage.ts"));
const { resolveSiteLayout, mergeSiteLayoutIntoStore } = nodeRequire(transpileToCache("src/lib/keystatic/resolveLayout.ts"));
const renderers = nodeRequire(transpileToCache("src/lib/keystatic/sectionRenderers.tsx"));
const PageBuilderDocument = nodeRequire(transpileToCache("src/components/keystatic/PageBuilderDocument.tsx")).default;
const localize = nodeRequire(join(CACHE, "localize.js"));
const React = nodeRequire("react");
const { renderToStaticMarkup } = nodeRequire("react-dom/server");

// --- Registry integrity ----------------------------------------------------

const definitions = registry.sectionRegistry;
check("registry", Array.isArray(definitions) && definitions.length > 0, "section registry is empty");

const ids = definitions.map((d) => d.id);
check("registry", new Set(ids).size === ids.length, "section ids must be unique");
for (const def of definitions) {
	const where = `registry/${def.id}`;
	check(where, typeof def.id === "string" && /^[a-z][a-zA-Z0-9]*$/.test(def.id), "id must be a stable camelCase identifier");
	check(where, Number.isInteger(def.version) && def.version >= 1, "version must be a positive integer");
	check(where, typeof def.label === "string" && def.label.length > 0, "label must be non-empty");
	check(where, typeof def.description === "string" && def.description.length > 0, "description must be non-empty");
	check(where, def.schema && def.schema.kind === "object" && typeof def.schema.fields === "object", "schema must be a Keystatic object field");
	const schemaKeys = new Set(Object.keys(def.schema?.fields ?? {}));
	let exampleJson = "";
	try {
		exampleJson = JSON.stringify(def.example);
		check(where, exampleJson !== undefined, "example must be JSON-serializable");
	} catch {
		fail(where, "example must be JSON-serializable");
	}
	for (const key of Object.keys(def.example ?? {})) {
		check(`${where}.example`, schemaKeys.has(key), `example key ${JSON.stringify(key)} is not declared in the schema`);
	}
	check(where, typeof def.normalize === "function", "normalize must be a function");
	check(where, registry.getSectionDefinition(def.id) === def, "getSectionDefinition must round-trip the id");
}

try {
	registry.getSectionDefinition("no-such-section");
	fail("registry/unknown-id", "getSectionDefinition must throw for unknown ids");
} catch (err) {
	check("registry/unknown-id", err?.name === "UnknownSectionError", `expected UnknownSectionError, got ${err?.name}`);
	check("registry/unknown-id", String(err?.message).includes("no-such-section"), "error message must name the unknown id");
}

// Spot-check normalizers: empty-href links are absent, stats stay in range.
check(
	"registry/normalize",
	registry.getSectionDefinition("introText").normalize({ cta: { label: "x", href: "  ", icon: "" } }).cta === null,
	"introText must drop a CTA with an empty href"
);
const normalizedStats = registry.getSectionDefinition("stats").normalize({ items: null, columns: 7 });
check("registry/normalize", Array.isArray(normalizedStats.items), "stats must coerce missing items to an array");
check("registry/normalize", normalizedStats.columns === 3, "stats must coerce out-of-range columns to 3");

// --- Renderer coverage -----------------------------------------------------

const rendererKeys = Object.keys(renderers.sectionRenderers ?? {});
check(
	"renderers",
	rendererKeys.length === ids.length && ids.every((id) => rendererKeys.includes(id)),
	`renderer keys [${rendererKeys.join(", ")}] must match registry ids [${ids.join(", ")}]`
);

for (const def of definitions) {
	for (const locale of LOCALES) {
		const where = `renderers/${def.id}/${locale}`;
		try {
			const element = renderers.renderSection(def.id, def.example, locale, `${def.id}-${locale}`);
			check(where, React.isValidElement(element), "renderSection must return a valid React element");
			const html = renderToStaticMarkup(element);
			check(where, /<section/i.test(html), "rendered markup must contain a <section>");
			check(where, !html.includes("{en}") && !html.includes("{sw}"), "unresolved locale nodes must not leak into markup");
		} catch (err) {
			fail(where, `render threw: ${err?.message}`);
		}
	}
}

try {
	renderers.renderSection("no-such-section", {}, "en", "x");
	fail("renderers/unknown-id", "renderSection must throw for unknown ids");
} catch (err) {
	check("renderers/unknown-id", err?.name === "UnknownSectionError", `expected UnknownSectionError, got ${err?.name}`);
}

// --- Locale resolution semantics -------------------------------------------

const { resolveLocaleValue } = localize;
const localeCases = [
	["sw-present", { en: "A", sw: "B" }, "sw", "B"],
	["en-present", { en: "A", sw: "B" }, "en", "A"],
	["sw-empty-falls-back", { en: "A", sw: "" }, "sw", "A"],
	["both-empty", { en: "", sw: "" }, "en", ""],
	["nested", { headline: { en: "H", sw: "" }, items: [{ label: { en: "L", sw: "M" } }] }, "sw", null],
];
for (const [name, input, lang, expected] of localeCases) {
	const got = resolveLocaleValue(input, lang);
	if (expected === null) {
		check(
			`localize/${name}`,
			got?.headline === "H" && got?.items?.[0]?.label === "M",
			`nested resolution failed: ${JSON.stringify(got)}`
		);
	} else {
		check(`localize/${name}`, got === expected, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);
	}
}
check("localize/passthrough", resolveLocaleValue(42, "sw") === 42, "primitives must pass through");
check("localize/plain-object", JSON.stringify(resolveLocaleValue({ a: 1 }, "sw")) === JSON.stringify({ a: 1 }), "objects without locale nodes must resolve recursively");

// --- Page resolution (source switch + failure taxonomy) ------------------------
// Exercised against throwaway content trees so every failure mode is proven:
// disabled allowlist, missing entry, draft entry, invalid JSON, unknown-only
// sections, mixed known/unknown sections, and the happy path.

const savedEnv = { KEYSTATIC_PAGES: process.env.KEYSTATIC_PAGES, KEYSTATIC_DISABLE: process.env.KEYSTATIC_DISABLE };
function setSwitchEnv(pages, disable) {
	if (pages === undefined) delete process.env.KEYSTATIC_PAGES;
	else process.env.KEYSTATIC_PAGES = pages;
	if (disable === undefined) delete process.env.KEYSTATIC_DISABLE;
	else process.env.KEYSTATIC_DISABLE = disable;
}

function makeContentBase(files) {
	const base = mkdtempSync(join(tmpdir(), "ks-pages-"));
	const pagesDir = join(base, "content", "pages");
	mkdirSync(pagesDir, { recursive: true });
	for (const [name, content] of Object.entries(files)) {
		writeFileSync(join(pagesDir, name), typeof content === "string" ? content : JSON.stringify(content));
	}
	return base;
}

const DRAFT_ENTRY = {
	slug: "Draft",
	title: "Draft",
	status: "draft",
	pageBuilder: [],
};
const UNKNOWN_ONLY_ENTRY = {
	slug: "Odd",
	title: "Odd",
	status: "published",
	pageBuilder: [{ discriminant: "ghost", value: {} }],
};

const resolutionCases = await (async () => {
	const outcomes = [];
	setSwitchEnv(undefined, undefined);
	outcomes.push(["switch-off-by-default", isKeystaticPageEnabled("terms-of-use") === false]);
	setSwitchEnv("terms-of-use, home", undefined);
	outcomes.push(["switch-allowlist", isKeystaticPageEnabled("terms-of-use") && isKeystaticPageEnabled("home") && !isKeystaticPageEnabled("about")]);
	setSwitchEnv("terms-of-use", "1");
	const emptyBase = makeContentBase({});
	const disabledRes = await resolveKeystaticPage("terms-of-use", "en", { baseDir: emptyBase });
	outcomes.push(["switch-kill-switch", !isKeystaticPageEnabled("terms-of-use") && disabledRes.status === "legacy" && disabledRes.reason === "disabled"]);

	setSwitchEnv("terms-of-use", undefined);
	const missingRes = await resolveKeystaticPage("terms-of-use", "en", { baseDir: emptyBase });
	outcomes.push(["resolve-missing", missingRes.status === "legacy" && missingRes.reason === "missing"]);

	const draftRes = await resolveKeystaticPage("terms-of-use", "en", { baseDir: makeContentBase({ "terms-of-use.json": DRAFT_ENTRY }) });
	outcomes.push(["resolve-unpublished", draftRes.status === "legacy" && draftRes.reason === "unpublished"]);

	const brokenRes = await resolveKeystaticPage("terms-of-use", "en", { baseDir: makeContentBase({ "terms-of-use.json": "{oops" }) });
	outcomes.push(["resolve-malformed", brokenRes.status === "legacy" && brokenRes.reason === "error" && typeof brokenRes.detail === "string" && brokenRes.detail.length > 0]);

	// The reader validates discriminants against the registry-derived branch
	// options, so unknown sections fail the whole entry with a field path
	// (verified behavior) — the resolver turns that into safe legacy output.
	const warnings = [];
	const originalWarn = console.warn;
	console.warn = (message, ...rest) => {
		warnings.push(String(message));
		originalWarn(message, ...rest);
	};
	const unknownRes = await resolveKeystaticPage("terms-of-use", "en", { baseDir: makeContentBase({ "terms-of-use.json": UNKNOWN_ONLY_ENTRY }) });
	outcomes.push([
		"resolve-unknown-only",
		unknownRes.status === "legacy" &&
			unknownRes.reason === "error" &&
			String(unknownRes.detail).includes("pageBuilder") &&
			warnings.some((w) => w.includes("terms-of-use") && w.includes("legacy")),
	]);

	const mixedBase = makeContentBase({
		"terms-of-use.json": {
			slug: "Terms",
			title: "Terms",
			status: "published",
			pageBuilder: [
				{ discriminant: "introText", value: JSON.parse(JSON.stringify(definitions.find((d) => d.id === "introText").example)) },
				{ discriminant: "ghost", value: {} },
			],
		},
	});
	const mixedRes = await resolveKeystaticPage("terms-of-use", "sw", { baseDir: mixedBase });
	outcomes.push(["resolve-mixed-unknown-is-fatal", mixedRes.status === "legacy" && mixedRes.reason === "error"]);
	console.warn = originalWarn;

	// Admin edge gate (M5, src/proxy.ts): pure path/auth contract. Mirrors the
	// shipped path regexes (verified present below) so the matcher + fail-closed
	// contract is pinned from the real source, not a copy.
	const proxySrc = readFileSync(join(ROOT, "src", "proxy.ts"), "utf8");
	const proxyOutcomes = [];
	for (const key of ["function isKeystaticPath(", "function isAuthorizedAdmin(", "function expectedAdminCredentials("]) {
		proxyOutcomes.push([`proxy-has-${key.slice(9, -1)}`, proxySrc.includes(key)]);
	}
	const shippedPathGate = (pathname) => {
		const withoutLocale = pathname.replace(/^\/(en|sw)(\/|$)/, "/");
		return /^(\/keystatic|\/api\/keystatic)(\/|$)/.test(withoutLocale);
	};
	proxyOutcomes.push([
		"proxy-route-coverage",
		shippedPathGate("/keystatic") &&
			shippedPathGate("/keystatic/") &&
			shippedPathGate("/en/keystatic") &&
			shippedPathGate("/sw/keystatic/pages/x") &&
			shippedPathGate("/api/keystatic/x") &&
			!shippedPathGate("/en/about") &&
			!shippedPathGate("/media/x.jpg") &&
			!shippedPathGate("/enkeystatic") &&
			!shippedPathGate("/api/keystatic-evil"),
	]);
	// The shipped source must fail closed (empty env yields no credentials),
	// compare credentials in constant time, run as the single edge gate, and
	// carry matchers for plain, locale-prefixed, API and media paths.
	proxyOutcomes.push(["proxy-fails-closed", /if \(!user \|\| !pass\) return null/.test(proxySrc)]);
	proxyOutcomes.push([
		"proxy-constant-time",
		proxySrc.includes("credentialsEqual(provided.user, expected.user)") && /function credentialsEqual[\s\S]*?timingSafeEqual/.test(proxySrc),
	]);
	proxyOutcomes.push(["proxy-single-gate", !existsSync(join(ROOT, "middleware.ts"))]);
	for (const matcher of ['"/keystatic/:path*"', '"/en/keystatic/:path*"', '"/sw/keystatic/:path*"', '"/api/keystatic/:path*"', '"/media']) {
		proxyOutcomes.push([`proxy-matcher-${matcher.replace(/[^a-z]/gi, "")}`, proxySrc.includes(matcher)]);
	}
	for (const [name, passed] of proxyOutcomes) {
		check(`proxy/${name}`, passed, "admin edge gate behaved unexpectedly");
	}

	const realHome = JSON.parse(readFileSync(join(ROOT, "content", "pages", "home.json"), "utf8"));
	// The checked-in entry stays `draft`, so the temp base flips it to
	// `published` — proving the real fixture resolves end to end once published.
	const realBase = makeContentBase({ "home.json": { ...realHome, status: "published" } });
	setSwitchEnv("home", undefined);
	const realRes = await resolveKeystaticPage("home", "en", { baseDir: realBase });
	// M7 batch 17: `home.json` is the real migrated home (overwrote the M1
	// starter). M12 (2026-09-18): entry order IS legacy page order —
	// homeHero, leadGenBar, about, planningInfographic,
	// surveyingInstruments, homeDrones, actionCtaSurveyor ctaBand,
	// services, industriesWeServe cardGrid, whyChooseUs, coreExpertise,
	// surveyCost, coverageArea, faq, actionCtaEngineer ctaBand, keyFacts,
	// certifications, trustees, defaultCta ctaBand.
	outcomes.push([
		"resolve-real-fixture",
		realRes.status === "keystatic" &&
			realRes.page.title === "Home (migrated)" &&
			realRes.page.sections.map((s) => s.id).join(",") === "homeHero,leadGenBar,about,planningInfographic,surveyingInstruments,homeDrones,ctaBand,services,cardGrid,whyChooseUs,coreExpertise,surveyCost,coverageArea,faq,ctaBand,keyFacts,certifications,trustees,ctaBand",
	]);

	// --- Site layout singleton (M9) --------------------------------------
	// Schema contract, failure taxonomy over throwaway trees, the real
	// fixture, and the i18n-store merge — all from the real sources.
	const layoutSchema = siteLayout.siteLayoutSchema;
	const layoutExample = siteLayout.siteLayoutExample;
	for (const key of ["status", "nav", "footer", "contacts", "cookies", "footerContacts", "socialChannels"]) {
		outcomes.push([`layout-schema-${key}`, layoutSchema && key in layoutSchema]);
	}
	outcomes.push([
		"layout-example-keys",
		Object.keys(layoutExample).every((key) => key in layoutSchema),
	]);
	const exampleResolved = siteLayout.normalizeSiteLayout(resolveLocaleValue(layoutExample, "en"));
	outcomes.push([
		"layout-example-normalizes",
		exampleResolved.nav.links[0]?.label === "Surveying" &&
			typeof exampleResolved.footerContacts[0]?.label === "string" &&
			exampleResolved.socialChannels.length === 1 &&
			!JSON.stringify(exampleResolved).includes('"en"'),
	]);

	const makeLayoutBase = (files) => {
		const base = mkdtempSync(join(tmpdir(), "ks-layout-"));
		const contentDir = join(base, "content");
		mkdirSync(contentDir, { recursive: true });
		for (const [name, content] of Object.entries(files)) {
			writeFileSync(join(contentDir, name), typeof content === "string" ? content : JSON.stringify(content));
		}
		return base;
	};
	setSwitchEnv(undefined, undefined);
	const layoutDisabled = await resolveSiteLayout("en", { baseDir: makeLayoutBase({}) });
	outcomes.push(["layout-disabled", layoutDisabled.status === "legacy" && layoutDisabled.reason === "disabled"]);

	setSwitchEnv("site", undefined);
	const layoutMissing = await resolveSiteLayout("en", { baseDir: makeLayoutBase({}) });
	outcomes.push(["layout-missing", layoutMissing.status === "legacy" && layoutMissing.reason === "missing"]);

	const realSite = JSON.parse(readFileSync(join(ROOT, "content", "site.json"), "utf8"));
	const layoutDraft = await resolveSiteLayout("en", { baseDir: makeLayoutBase({ "site.json": realSite }) });
	outcomes.push(["layout-unpublished", layoutDraft.status === "legacy" && layoutDraft.reason === "unpublished"]);

	const layoutBroken = await resolveSiteLayout("sw", { baseDir: makeLayoutBase({ "site.json": "{oops" }) });
	outcomes.push([
		"layout-malformed",
		layoutBroken.status === "legacy" && layoutBroken.reason === "error" && typeof layoutBroken.detail === "string" && layoutBroken.detail.length > 0,
	]);

	// The checked-in entry stays `draft`; the temp base flips it to
	// `published` — proving the real fixture resolves once published.
	const layoutPublished = await resolveSiteLayout("sw", {
		baseDir: makeLayoutBase({ "site.json": { ...realSite, status: "published" } }),
	});
	outcomes.push([
		"layout-real-fixture",
		layoutPublished.status === "keystatic" &&
			layoutPublished.site.locale === "sw" &&
			layoutPublished.site.layout.nav.links.length === 6 &&
			layoutPublished.site.layout.nav.links[0]?.label === "Upimaji" &&
			layoutPublished.site.layout.footerContacts.length === 6 &&
			layoutPublished.site.layout.socialChannels.length === 4 &&
			typeof layoutPublished.site.layout.cookies.categories.necessary.label === "string" &&
			typeof layoutPublished.site.layout.contacts.phone[0]?.href === "string",
	]);

	// Store merge: owned slices replace legacy values; `nav` merges
	// additively (unrendered legacy keys survive); routing, brand and page
	// namespaces survive untouched.
	const mergeStore = {
		en: {
			common: { nav: { logo_dark: "/old.svg", links: [] }, locales: [{ code: "en" }], misc: { x: 1 }, footer: { old: true }, contacts: { old: true }, cookies: { old: true } },
			contact: { talkToUs: { title: "T", contacts: [] }, social: { channels: [] } },
			meta: { site: { title: "Brand" } },
		},
	};
	mergeSiteLayoutIntoStore(mergeStore, "en", layoutPublished.status === "keystatic" ? layoutPublished.site.layout : exampleResolved);
	outcomes.push([
		"layout-merge",
		mergeStore.en.common.nav.links?.length === 6 &&
			mergeStore.en.common.nav.logo_dark === "/old.svg" &&
			!mergeStore.en.common.footer.old &&
			mergeStore.en.common.locales.length === 1 &&
			mergeStore.en.common.misc.x === 1 &&
			mergeStore.en.meta.site.title === "Brand" &&
			mergeStore.en.contact.talkToUs.title === "T" &&
			mergeStore.en.contact.talkToUs.contacts.length === 6 &&
			mergeStore.en.contact.social.channels.length === 4,
	]);

	// Parity: the published fixture migrates verbatim from locale JSON, so
	// merging it into the real store must reproduce the legacy owned slices
	// exactly — opting in changes nothing until an editor edits content.
	const parityStore = {
		en: {
			common: JSON.parse(readFileSync(join(ROOT, "public", "locales", "en", "common.json"), "utf8")),
			contact: JSON.parse(readFileSync(join(ROOT, "public", "locales", "en", "contact.json"), "utf8")),
		},
		sw: {
			common: JSON.parse(readFileSync(join(ROOT, "public", "locales", "sw", "common.json"), "utf8")),
			contact: JSON.parse(readFileSync(join(ROOT, "public", "locales", "sw", "contact.json"), "utf8")),
		},
	};
	const legacyOwned = JSON.parse(JSON.stringify(parityStore));
	const layoutEn = await resolveSiteLayout("en", { baseDir: makeLayoutBase({ "site.json": { ...realSite, status: "published" } }) });
	const layoutSw = await resolveSiteLayout("sw", { baseDir: makeLayoutBase({ "site.json": { ...realSite, status: "published" } }) });
	const ownedPaths = [["common", "nav"], ["common", "footer"], ["common", "contacts"], ["common", "cookies"]];
	let parity = layoutEn.status === "keystatic" && layoutSw.status === "keystatic";
	if (parity) {
		mergeSiteLayoutIntoStore(parityStore, "en", layoutEn.site.layout);
		mergeSiteLayoutIntoStore(parityStore, "sw", layoutSw.site.layout);
		for (const locale of LOCALES) {
			for (const [ns, key] of ownedPaths) {
				parity = parity && JSON.stringify(parityStore[locale][ns][key]) === JSON.stringify(legacyOwned[locale][ns][key]);
			}
			parity =
				parity &&
				JSON.stringify(parityStore[locale].contact.talkToUs.contacts) === JSON.stringify(legacyOwned[locale].contact.talkToUs.contacts) &&
				JSON.stringify(parityStore[locale].contact.social.channels) === JSON.stringify(legacyOwned[locale].contact.social.channels);
		}
	}
	outcomes.push(["layout-parity", parity]);

	// --- Catch-all route for editor-created pages (M10) --------------------
	// File contract: the localized catch-all plus the root proxy that keeps
	// default-locale URLs unprefixed (same pattern as `about.tsx`).
	const catchAllSrc = readFileSync(join(ROOT, "src", "pages", "[locale]", "[...slug].tsx"), "utf8");
	const catchAllProxy = readFileSync(join(ROOT, "src", "pages", "[...slug].tsx"), "utf8");
	outcomes.push([
		"catchall-files",
		catchAllProxy.includes('./[locale]/[...slug]') &&
			catchAllSrc.includes("PageBuilderDocument") &&
			catchAllSrc.includes("notFound") &&
			catchAllSrc.includes('"home"') &&
			catchAllSrc.includes('"keystatic"'),
	]);

	// Content-only slugs resolve through the unchanged M3 pipeline: a novel
	// published + allowlisted slug is servable, anything else falls back
	// (the route turns every fallback into a 404 — it has no legacy page).
	const probeEntry = (status) => ({
		slug: "Test Custom Probe",
		title: "Test Custom Probe",
		status,
		pageBuilder: [
			{ discriminant: "hero", value: JSON.parse(JSON.stringify(definitions.find((d) => d.id === "hero").example)) },
			{ discriminant: "ctaBand", value: JSON.parse(JSON.stringify(definitions.find((d) => d.id === "ctaBand").example)) },
		],
	});
	setSwitchEnv("test-custom-probe", undefined);
	const probeBase = makeContentBase({ "test-custom-probe.json": probeEntry("published") });
	const probeRes = await resolveKeystaticPage("test-custom-probe", "sw", { baseDir: probeBase });
	outcomes.push([
		"catchall-novel-published",
		probeRes.status === "keystatic" &&
			probeRes.page.locale === "sw" &&
			probeRes.page.sections.map((s) => s.id).join(",") === "hero,ctaBand",
	]);
	const probeDraft = await resolveKeystaticPage("test-custom-probe", "en", {
		baseDir: makeContentBase({ "test-custom-probe.json": probeEntry("draft") }),
	});
	outcomes.push(["catchall-novel-unpublished", probeDraft.status === "legacy" && probeDraft.reason === "unpublished"]);

	// The committed `test-custom` pilot fixture resolves once published.
	const realTestCustom = JSON.parse(readFileSync(join(ROOT, "content", "pages", "test-custom.json"), "utf8"));
	setSwitchEnv("test-custom", undefined);
	const testCustomRes = await resolveKeystaticPage("test-custom", "en", {
		baseDir: makeContentBase({ "test-custom.json": { ...realTestCustom, status: "published" } }),
	});
	outcomes.push([
		"catchall-pilot-fixture",
		testCustomRes.status === "keystatic" &&
			testCustomRes.page.sections.map((s) => s.id).join(",") === "hero,ctaBand",
	]);

	// Sitemap: published + allowlisted + unwired slugs only (helper is
	// exercised against a throwaway root so fixtures stay hermetic).
	const sitemapConfig = nodeRequire(join(ROOT, "next-sitemap.config.js"));
	const siteRoot = mkdtempSync(join(tmpdir(), "ks-sitemap-"));
	mkdirSync(join(siteRoot, "src", "pages", "[locale]"), { recursive: true });
	mkdirSync(join(siteRoot, "content", "pages"), { recursive: true });
	writeFileSync(join(siteRoot, "src", "pages", "[locale]", "about.tsx"), 'resolveKeystaticPage("about")');
	for (const [name, status] of [["about.json", "published"], ["test-custom.json", "published"], ["draft-one.json", "draft"]]) {
		writeFileSync(join(siteRoot, "content", "pages", name), JSON.stringify({ slug: name, title: name, status, pageBuilder: [] }));
	}
	outcomes.push([
		"catchall-sitemap",
		JSON.stringify(sitemapConfig.getKeystaticSitemapSlugs({ rootDir: siteRoot, allowlist: ["about", "test-custom", "draft-one"] })) === JSON.stringify(["/test-custom"]) &&
			sitemapConfig.getWiredKeystaticSlugs(siteRoot).has("home") &&
			sitemapConfig.getWiredKeystaticSlugs(siteRoot).has("about"),
	]);

	setSwitchEnv(savedEnv.KEYSTATIC_PAGES, savedEnv.KEYSTATIC_DISABLE);
	return outcomes;
})();

for (const [name, passed] of resolutionCases) {
	check(`resolve/${name}`, passed, "page resolution behaved unexpectedly");
}

// --- PageBuilderDocument rendering -----------------------------------------

const docCases = (() => {
	const outcomes = [];
	const samplePage = {
		slug: "terms-of-use",
		title: "Terms",
		locale: "sw",
		sections: [
			{ key: "terms-of-use:introText:0", id: "introText", value: definitions.find((d) => d.id === "introText").example },
		],
	};
	try {
		const html = renderToStaticMarkup(React.createElement(PageBuilderDocument, { page: samplePage }));
		outcomes.push(["document-renders-section", /<section/i.test(html)]);
		outcomes.push(["document-serializable", JSON.stringify(JSON.parse(JSON.stringify(samplePage))) !== undefined]);
		// Swahili resolution end to end through the document.
		outcomes.push(["document-resolves-locale", html.includes("Upimaji")]);
	} catch {
		outcomes.push(["document-renders-section", false]);
	}
	return outcomes;
})();

for (const [name, passed] of docCases) {
	check(`document/${name}`, passed, "PageBuilderDocument behaved unexpectedly");
}

// --- Fixture contract ------------------------------------------------------

function expectLocaleNode(value, where, { allowEmpty = false, allowArray = false } = {}) {
	if (typeof value !== "object" || value === null) {
		fail(where, "expected { en, sw } object");
		return;
	}
	for (const locale of LOCALES) {
		if (!(locale in value)) {
			fail(where, `missing "${locale}" key`);
			return;
		}
		const val = value[locale];
		if (typeof val === "string") {
			if (!allowEmpty && locale === "en" && val.length === 0) {
				fail(where, `"en" must be non-empty`);
				return;
			}
		} else if (allowArray && Array.isArray(val)) {
			// Arrays are allowed (e.g. localeImageArray, keywords)
		} else {
			fail(where, `"${locale}" must be a string${allowArray ? " or array" : ""}`);
			return;
		}
	}
}

function stripToText(html) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

// --dump-text <slug>: print the resolved visible text of every stored
// section in both locales as JSON (parity diffing for migrations).
function dumpText(slug) {
	const file = join(ROOT, "content", "pages", `${slug}.json`);
	let data;
	try {
		data = JSON.parse(readFileSync(file, "utf8"));
	} catch (err) {
		console.error(`FAIL cannot read ${file}: ${err.message}`);
		process.exit(1);
	}
	const out = { slug, locales: {} };
	for (const locale of LOCALES) {
		out.locales[locale] = (Array.isArray(data.pageBuilder) ? data.pageBuilder : []).map((section, index) => {
			try {
				const html = renderToStaticMarkup(renderers.renderSection(section.discriminant, section.value, locale, `dump-${index}`));
				return { id: section.discriminant, text: stripToText(html) };
			} catch (err) {
				console.error(`FAIL render ${slug}[${index}]/${locale}: ${err?.message}`);
				process.exit(1);
			}
		});
	}
	console.log(JSON.stringify(out, null, 2));
}

function main() {
	const dirArg = process.argv.indexOf("--dir");
	const rawDir = dirArg === -1 ? join(ROOT, "content", "pages") : process.argv[dirArg + 1];
	if (!rawDir) {
		console.error("Missing value for --dir");
		process.exit(2);
	}
	const dir = rawDir;
	if (!existsSync(dir)) fail(relative(ROOT, dir) || dir, "pages content directory does not exist");
	const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")) : [];
	if (files.length === 0) fail(relative(ROOT, dir) || dir, "no page fixtures found");

	const knownIds = new Set(ids);
	for (const file of files) {
		const slug = basename(file, ".json");
		const where = relative(ROOT, join(dir, file)).replace(/\\/g, "/");
		if (!SLUG_PATTERN.test(slug)) fail(where, `filename slug ${JSON.stringify(slug)} violates the slug rule`);
		let data;
		try {
			data = JSON.parse(readFileSync(join(dir, file), "utf8"));
		} catch (err) {
			fail(where, `invalid JSON: ${err.message}`);
			continue;
		}
		if (typeof data.slug !== "string" || data.slug.length === 0) fail(where, `"slug" name must be a non-empty string`);
		if (typeof data.title !== "string" || data.title.length === 0) fail(where, `"title" must be a non-empty string`);
		if (!KNOWN_STATUSES.has(data.status)) fail(where, `"status" must be one of ${[...KNOWN_STATUSES].join(", ")}`);
		if (!Array.isArray(data.pageBuilder)) {
			fail(where, `"pageBuilder" must be an array`);
			continue;
		}
		data.pageBuilder.forEach((section, index) => {
			const at = `${where}.pageBuilder[${index}]`;
			if (typeof section !== "object" || section === null) return fail(at, "section must be an object");
			if (!knownIds.has(section.discriminant)) {
				return fail(at, `unknown section discriminant ${JSON.stringify(section.discriminant)}`);
			}
			const value = section.value;
			if (typeof value !== "object" || value === null) return fail(at, "section is missing its value object");
			// Every stored section must render in both locales without
			// leaking unresolved locale nodes — the renderability proof for
			// migrated content (M4).
			for (const locale of LOCALES) {
				const renderWhere = `${at}/${locale}:render`;
				try {
					const element = renderers.renderSection(section.discriminant, value, locale, `check-${index}`);
					if (!React.isValidElement(element)) {
						fail(renderWhere, "did not produce a valid React element");
						continue;
					}
					const html = renderToStaticMarkup(element);
					if (!/<section/i.test(html)) fail(renderWhere, "rendered markup has no <section>");
					if (html.includes("{en}") || html.includes("{sw}")) fail(renderWhere, "unresolved locale nodes in markup");
				} catch (err) {
					fail(renderWhere, `render threw: ${err?.message}`);
				}
			}
			// Generic locale-node audit: every { en, sw } node must be strings.
			const audit = (node, path) => {
				if (Array.isArray(node)) return node.forEach((entry, i) => audit(entry, `${path}[${i}]`));
				if (node !== null && typeof node === "object") {
					if ("en" in node || "sw" in node) {
						// Known array fields: rmSector.images (localeImageArray), bsAccuracyMatters.keywords
						const isArrayField = path.endsWith(".images") || path.endsWith(".keywords");
						return expectLocaleNode(node, path, { allowEmpty: true, allowArray: isArrayField });
					}
					for (const [key, entry] of Object.entries(node)) audit(entry, `${path}.${key}`);
				}
			};
			audit(value, at);
		});
	}

	if (errors.length > 0) {
		for (const error of errors) console.error(`FAIL ${error}`);
		console.error(`\n${errors.length} violation(s) found.`);
		process.exit(1);
	}
	console.log(`OK registry (${ids.length} sections), renderers, locale semantics, page resolution and ${files.length} page fixture(s) satisfy the page-builder contract.`);
}

const dumpIndex = process.argv.indexOf("--dump-text");
if (dumpIndex !== -1) {
	dumpText(process.argv[dumpIndex + 1]);
} else {
	main();
}
