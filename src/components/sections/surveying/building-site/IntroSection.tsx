"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";

/**
 * Building-site intro — shared intro text section with the description split
 * beside the header (content: surveying/building-site-surveys:section1).
 */
export function IntroSection(): ReactElement {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const section = t("surveying/building-site-surveys:section1", {
		returnObjects: true,
	}) as unknown as { tag?: string | null; headline: string; description?: string | null };

	return (
		<IntroTextSection
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description ?? undefined}
			split
		/>
	);
}

export default IntroSection;
