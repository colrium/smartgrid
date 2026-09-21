import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../../keystatic.config";
import type { Lang } from "../types";
import { signMediaDeep } from "@/lib/media";
import { getSectionDefinition } from "./sectionRegistry";

/**
 * Page resolution with explicit source precedence (M3).
 *
 * Source switch (per-page opt-in, migration policy):
 * - `KEYSTATIC_PAGES="slug-a,slug-b"` allowlists slugs served from
 *   Keystatic. Unset/empty (the default) means every route renders its
 *   legacy locale-JSON implementation byte-identically — no URL changes,
 *   no duplicated route logic.
 * - `KEYSTATIC_DISABLE="1"` is the emergency rollback: every route renders
 *   legacy regardless of the allowlist. Never commit either variable with
 *   values; see `.env.example`.
 *
 * Failure taxonomy (all resolve to safe, diagnosable outcomes):
 * - disabled   → legacy (slug not opted in, or global kill-switch).
 * - missing    → legacy (no entry for the slug; `reader.read` is `null`).
 * - unpublished→ legacy (entry `status` is not `published`).
 * - error      → legacy (entry unreadable: invalid JSON, wrong types, or
 *   an unknown section discriminant — `reader.read` throws with a field
 *   path; detail is captured and server-logged). The reader validates
 *   discriminants against the registry-derived branch options, so an
 *   unknown section always surfaces here rather than at render time.
 * - empty      → legacy (a published page with zero sections renders
 *   nothing, so legacy wins over a blank page).
 *
 * Non-silent fallbacks (`error`, `empty`) are reported via `console.warn`
 * with the slug, reason and detail — the development diagnostic. Production
 * visitors always see a complete page (Keystatic or legacy), never blank.
 */

export interface ResolvedPageSection {
	/** Stable React key (`${slug}:${id}:${index}`). */
	key: string;
	/** Registry section id (discriminant). */
	id: string;
	/** Raw stored `value` for the section (locale resolution happens at render). */
	value: unknown;
}

export interface ResolvedKeystaticPage {
	slug: string;
	title: string;
	locale: Lang;
	sections: ResolvedPageSection[];
}

export type LegacyReason = "disabled" | "missing" | "unpublished" | "error" | "empty";

export type PageResolution =
	| { status: "keystatic"; page: ResolvedKeystaticPage }
	| { status: "legacy"; reason: LegacyReason; detail?: string };

export function isKeystaticPageEnabled(slug: string): boolean {
	if (process.env.KEYSTATIC_DISABLE === "1") return false;
	const allowlist = (process.env.KEYSTATIC_PAGES ?? "")
		.split(",")
		.map((entry) => entry.trim())
		.filter((entry) => entry.length > 0);
	return allowlist.length === 0 || allowlist.includes(slug);
}

function toErrorDetail(error: unknown): string {
	if (error instanceof Error) return error.message.slice(0, 300);
	return String(error).slice(0, 300);
}

export async function resolveKeystaticPage(
	slug: string,
	locale: Lang,
	opts?: { baseDir?: string }
): Promise<PageResolution> {
	if (!isKeystaticPageEnabled(slug)) return { status: "legacy", reason: "disabled" };

	let entry;
	try {
		const reader = createReader(opts?.baseDir ?? process.cwd(), keystaticConfig);
		entry = await reader.collections.pages.read(slug);
	} catch (error) {
		const detail = toErrorDetail(error);
		console.warn(`[keystatic] page "${slug}" falls back to legacy content (unreadable entry): ${detail}`);
		return { status: "legacy", reason: "error", detail };
	}
	if (!entry) return { status: "legacy", reason: "missing" };
	if (entry.status !== "published") return { status: "legacy", reason: "unpublished" };

	const stored = Array.isArray(entry.pageBuilder) ? entry.pageBuilder : [];
	if (stored.length === 0) {
		console.warn(`[keystatic] page "${slug}" falls back to legacy content (no sections).`);
		return { status: "legacy", reason: "empty", detail: "Page has no sections." };
	}
	// Discriminants are validated by the reader against the registry-derived
	// branch options; re-check here so a registry/reader skew still resolves
	// to safe legacy output instead of rendering an unknown section.
	try {
		const sections: ResolvedPageSection[] = stored.map(
			(section: { discriminant: string; value: unknown }, index: number) => {
				getSectionDefinition(section.discriminant);
				// Display-only media protection: every `/media/...` image/media
				// path stored in Keystatic content must leave the server as a
				// short-lived `signMediaPath` URL, or the edge gate (`src/proxy.ts`)
				// 404s it. `signMediaDeep` is idempotent — non-media strings pass
				// through untouched. Site-layout media needs no handling here:
				// it merges into the i18n store, which `getI18nProps` signs after.
				return { key: `${slug}:${section.discriminant}:${index}`, id: section.discriminant, value: signMediaDeep(section.value) };
			}
		);
		return { status: "keystatic", page: { slug, title: entry.title, locale, sections } };
	} catch (error) {
		const detail = toErrorDetail(error);
		console.warn(`[keystatic] page "${slug}" falls back to legacy content (unknown section): ${detail}`);
		return { status: "legacy", reason: "error", detail };
	}
}
