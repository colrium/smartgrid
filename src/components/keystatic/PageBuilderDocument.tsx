import type { ReactElement } from "react";
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
 */
export function PageBuilderDocument({ page }: { page: ResolvedKeystaticPage }): ReactElement {
	return (
		<div className="relative flex flex-col min-h-screen" data-keystatic-page={page.slug}>
			{page.sections.map((section) => renderSection(section.id, section.value, page.locale, section.key))}
		</div>
	);
}

export default PageBuilderDocument;
