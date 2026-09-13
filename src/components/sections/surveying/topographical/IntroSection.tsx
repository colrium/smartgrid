"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";

interface IntroContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
}

/**
 * Topographical-surveys intro — shared intro text section with the
 * description split beside the header (content:
 * surveying/topographical-surveys:section1).
 */
export function IntroSection(): ReactElement {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	const section = t("surveying/topographical-surveys:section1", {
		returnObjects: true,
	}) as unknown as IntroContent;

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
