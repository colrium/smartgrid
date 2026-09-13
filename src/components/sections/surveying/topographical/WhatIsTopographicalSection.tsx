"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";

interface WhatIsContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
}

/**
 * What-is-topographical explainer — shared intro text section (content:
 * surveying/topographical-surveys:whatIs).
 */
export function WhatIsTopographicalSection(): ReactElement {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	const section = t("surveying/topographical-surveys:whatIs", {
		returnObjects: true,
	}) as unknown as WhatIsContent;

	return (
		<IntroTextSection
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description ?? undefined}
		/>
	);
}

export default WhatIsTopographicalSection;

