import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";
import { getI18nProps, getLocale } from "@/lib/i18n";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import type { Lang } from "@/lib/types";

/**
 * Catch-all for editor-created Keystatic pages (M10).
 *
 * Any single-segment slug with no dedicated fixed route (fixed files take
 * Next.js precedence and are unaffected) resolves through the unchanged M3
 * pipeline: published + allowlisted → `PageBuilderDocument`, rendered inside
 * the normal site layout with locale-resolved sections.
 *
 * Content-only pages have no legacy implementation, so every non-keystatic
 * outcome is a 404 (the resolver already server-warns with slug + reason —
 * never a blank page). Explicit 404s: multi-segment paths (nested URLs
 * belong to fixed routes), the reserved `keystatic` segment, and `home`
 * (served at `/` by `[locale]/index.tsx`).
 *
 * Known limitation (documented in the plan): published + allowlisted
 * nested/hub entries also resolve at their flat `/<slug>` URL — don't link
 * those; the fixed route is canonical.
 */

const RESERVED_SLUGS = new Set(["home", "keystatic"]);

type PageProps = {
	/** Always a resolved Keystatic page — anything else is a 404 (see above). */
	keystaticPage: ResolvedKeystaticPage;
};

const KeystaticCatchAllPage: NextPage<PageProps> = ({ keystaticPage }) => {
	// `meta:pages` keys use underscores (`terms_of_use`); unknown names fall
	// back to empty title/description + humanized breadcrumbs inside Head.
	const pageName = keystaticPage.slug.replace(/-/g, "_");
	return (
		<div className="relative">
			<PageHead pageName={pageName} />
			<PageBuilderDocument page={keystaticPage} />
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const segments = context.params?.slug;
	const slug = Array.isArray(segments) && segments.length === 1 ? segments[0] : null;
	if (!slug || RESERVED_SLUGS.has(slug)) return { notFound: true };

	const i18nProps = await getI18nProps(context, ["common", "meta"]);
	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	if (!locale) return { notFound: true };
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage(slug, lang);
	if (resolution.status !== "keystatic") return { notFound: true };

	return {
		props: { ...i18nProps, keystaticPage: resolution.page },
	};
};

export default KeystaticCatchAllPage;
