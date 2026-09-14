import { fields } from "@keystatic/core";

/**
 * Reusable Keystatic schema factories for the page builder (M2).
 *
 * Every factory produces inline-data fields that serialize into the entry
 * JSON (`format: { data: "json" }`), stay hand-writable, and read back
 * without credentials in local mode. Nothing in this module may import
 * React, browser APIs, or component code, so `keystatic.config.ts` keeps
 * loading in plain Node.
 *
 * Deliberately NOT provided (verified against `@keystatic/core` 0.6.9):
 * - `fields.markdoc` / `document` / `mdx` are *content* fields: they
 *   serialize to a separate content file, which the single-file
 *   `content/pages/*` JSON layout cannot persist. Rich text is therefore
 *   modelled as multiline localized text (`localeLongText`) until a
 *   directory-per-entry layout is adopted.
 * - `fields.url` rejects relative URLs, so internal locale-prefixed paths
 *   (`/en/contact`) use plain text via `linkObject`.
 * - `fields.image` uploads into the repo and needs a directory-per-entry
 *   layout the single-file `content/pages/*` JSON cannot persist; images
 *   are referenced as `/public` paths via `imagePath` (M5 media policy).
 */

/** Every translatable node keeps both `en` and `sw` keys. */
export const localeText = (
	label: string,
	opts?: { multiline?: boolean; optionalInEnglish?: boolean }
) =>
	fields.object(
		{
			en: fields.text({
				label: `${label} — English`,
				multiline: opts?.multiline,
				validation: opts?.optionalInEnglish ? undefined : { isRequired: true },
			}),
			sw: fields.text({ label: `${label} — Swahili`, multiline: opts?.multiline }),
		},
		{ label }
	);

/** Paragraph-scale localized copy (plain text, `whitespace-pre-line` safe). */
export const localeLongText = (label: string, opts?: { optionalInEnglish?: boolean }) =>
	localeText(label, { multiline: true, optionalInEnglish: opts?.optionalInEnglish ?? true });

/**
 * Editor-friendly link: localized label plus a path-or-URL string.
 * Leave `href` empty to hide the action — renderers treat a missing
 * `href` as absent.
 */
export const linkObject = (label: string) =>
	fields.object(
		{
			label: localeText("Label", { optionalInEnglish: true }),
			href: fields.text({ label: "Link", description: "Internal path (/en/contact) or full URL." }),
			icon: fields.text({
				label: "MDI icon (optional)",
				description: "Icon slug without the `mdi-` prefix.",
			}),
		},
		{ label }
	);

/** Reference to an image under `/public` (M5 media policy: references only, no uploads). */
export const imagePath = (label: string) =>
	fields.text({ label, description: "Path under /public, e.g. /images/cta-band-1.jpg." });

/**
 * Localized media reference. Legacy content proves paths can diverge per
 * locale (company-profile `about.image` is `/img/logo.svg` in `en` but a
 * `/media/…` photo in `sw`), so a single shared path would silently drop
 * one locale's media. Resolves to a plain string like any locale node.
 *
 * Media policy (M5, decided): references only — no `fields.image` uploads.
 * Keep paths under `/public` (JPEG/PNG/WebP/AVIF/SVG); gated `/media/**`
 * photos resolve to short-lived signed URLs at render time. Every stored
 * image must render with meaningful alt text (components fall back to the
 * headline/title) and pages keep one `h1` with `h2` section headlines —
 * see the README operator guide for the editor-facing rules.
 */
export const localeMedia = (label: string) =>
	fields.object(
		{
			en: imagePath(`${label} — English`),
			sw: imagePath(`${label} — Swahili`),
		},
		{ label }
	);

/** Anchor id for a `<section>` element. */
export const anchorField = () =>
	fields.text({ label: "Anchor id (optional)", description: "Used as the section id for deep links." });

/**
 * Safely read a nested string out of an untyped array `itemLabel` prop.
 * Array preview props are `unknown` by type, so narrow defensively and
 * fall back to `fallback` instead of throwing in the editor.
 */
export function previewText(item: unknown, path: string[], fallback: string): string {
	let current: unknown = item;
	for (const key of path) {
		if (typeof current !== "object" || current === null) return fallback;
		current = (current as Record<string, unknown>)[key];
	}
	return typeof current === "string" && current.length > 0 ? current : fallback;
}

/** `itemLabel` for arrays of `{ title: localeText }`-shaped elements. */
export const previewTitledItem = (fallback: string) => (item: unknown) =>
	previewText(item, ["fields", "title", "fields", "en", "value"], fallback);
