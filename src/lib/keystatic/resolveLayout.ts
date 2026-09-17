import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../../keystatic.config";
import type { Lang } from "../types";
import { resolveLocaleValue } from "./localize";
import { isKeystaticPageEnabled } from "./resolvePage";
import { normalizeSiteLayout, type NormalizedSiteLayout } from "./siteLayout";

/**
 * Site-layout resolution with explicit source precedence (M9).
 *
 * Same switch and taxonomy as the per-page resolver (`resolvePage.ts`), but
 * for the `site` singleton instead of a page entry:
 * - Reserved slug `site` in `KEYSTATIC_PAGES` opts the whole site into the
 *   Keystatic layout; `KEYSTATIC_DISABLE="1"` is the emergency rollback.
 * - `disabled` → legacy store untouched (not opted in, or kill-switch).
 * - `missing` → legacy (no `content/site.json`; `reader.read` is `null`).
 * - `unpublished` → legacy (singleton `status` is not `published`).
 * - `error` → legacy (unreadable entry: invalid JSON or wrong types —
 *   `reader.read` throws with a field path; detail is server-logged).
 *
 * There is no `empty` case: a published singleton always carries its full
 * shape (every group defaults to `[]`/`""` and components null-guard).
 * Non-silent fallbacks (`error`) are reported via `console.warn` — the
 * development diagnostic. Visitors always see a complete layout.
 */

export interface ResolvedSiteLayout {
	locale: Lang;
	layout: NormalizedSiteLayout;
}

export type LayoutResolution =
	| { status: "keystatic"; site: ResolvedSiteLayout }
	| { status: "legacy"; reason: "disabled" | "missing" | "unpublished" | "error"; detail?: string };

function toErrorDetail(error: unknown): string {
	if (error instanceof Error) return error.message.slice(0, 300);
	return String(error).slice(0, 300);
}

export async function resolveSiteLayout(
	locale: Lang,
	opts?: { baseDir?: string }
): Promise<LayoutResolution> {
	if (!isKeystaticPageEnabled("site")) return { status: "legacy", reason: "disabled" };

	let entry;
	try {
		const reader = createReader(opts?.baseDir ?? process.cwd(), keystaticConfig);
		entry = await reader.singletons.site.read();
	} catch (error) {
		const detail = toErrorDetail(error);
		console.warn(`[keystatic] layout "site" falls back to legacy content (unreadable entry): ${detail}`);
		return { status: "legacy", reason: "error", detail };
	}
	if (!entry) return { status: "legacy", reason: "missing" };
	if ((entry as { status?: string }).status !== "published")
		return { status: "legacy", reason: "unpublished" };

	const resolved = resolveLocaleValue(entry, locale) as Record<string, any>;
	return { status: "keystatic", site: { locale, layout: normalizeSiteLayout(resolved) } };
}

/**
 * Merge a resolved layout into a next-i18next store (`getI18nProps` calls
 * this server-side before signing). `nav` merges additively over the legacy
 * object (unrendered keys survive); every other owned slice is replaced
 * wholesale — single-source semantics, no stale keys — while the remaining
 * namespaces (`locales`, `misc`, `meta`, page content) are preserved
 * untouched.
 */
export function mergeSiteLayoutIntoStore(
	store: Record<string, Record<string, any>>,
	locale: Lang,
	layout: NormalizedSiteLayout
): void {
	store[locale] = store[locale] ?? {};
	const common = { ...(store[locale].common ?? {}) };
	// `nav` merges ADDITIVELY over the legacy object: owned keys (`logo`,
	// `logo_light`, `logo_alt`, `links`) are replaced while unrendered
	// legacy keys (`logo_dark`, `ctaPrimary`, …) survive untouched. Every
	// other owned slice is replaced wholesale (their legacy shapes carry no
	// dead keys), while the remaining namespaces (`locales`, `misc`,
	// `meta`, page content) are preserved untouched.
	common.nav = { ...((store[locale].common ?? {}).nav ?? {}), ...layout.nav };
	common.footer = layout.footer;
	common.contacts = layout.contacts;
	common.cookies = layout.cookies;
	store[locale].common = common;

	const contact = { ...(store[locale].contact ?? {}) };
	const talkToUs = { ...(contact.talkToUs ?? {}) };
	talkToUs.contacts = layout.footerContacts;
	contact.talkToUs = talkToUs;
	const social = { ...(contact.social ?? {}) };
	social.channels = layout.socialChannels;
	contact.social = social;
	store[locale].contact = contact;
}
