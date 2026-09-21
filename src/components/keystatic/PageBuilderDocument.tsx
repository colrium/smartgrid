import type { ReactElement } from "react";
import PageHead from "@/components/Head";
import type { ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";

/**
 * Renders a resolved Keystatic page inside the normal site layout (M3).
 *
 * Sections render in stored order via the registry renderer map with
 * locale-resolved, normalized props and stable keys. Only validated pages
 * reach this component: the resolver falls back to legacy content (with a
 * server-side warning) for missing, unpublished, malformed, empty, or
 * unknown-section entries, so this renderer never has to blank the page.
 *
 * M6 fix (2026-09-21): the whole-owned Keystatic branch previously skipped
 * `PageHead` entirely — published pages served `<title>`-less HTML (found
 * during the M6 browser pass on /en/aerial-drones/agricultural-ndvi-mapping;
 * every route file renders `PageHead` only in its legacy branch). The head
 * is emitted here from the same `meta:pages.<slug>` data the legacy branch
 * uses, so canonical/hreflang/OG/JSON-LD stay identical across both
 * branches. `PageHead` needs the `meta` + `contact` namespaces in the
 * per-route i18n props — all mapped routes already load them.
 */
export function PageBuilderDocument({ page }: { page: ResolvedKeystaticPage }): ReactElement {
	return (
		<div className="relative flex flex-col min-h-screen" data-keystatic-page={page.slug}>
			<PageHead pageName={page.slug} />
			{page.sections.map((section) => renderSection(section.id, section.value, page.locale, section.key))}
		</div>
	);
}

export default PageBuilderDocument;
