"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SplitMedia } from "@/components/sections/shared/SplitMedia";

/**
 * Boundary-survey intro — shared text + framed image split (content:
 * surveying/cadastral-surveys:whatsABoundarySurvey).
 */
export function IntroSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
	const section = t("surveying/cadastral-surveys:whatsABoundarySurvey", {
		returnObjects: true,
	}) as unknown as { tag?: string | null; headline: string; description?: string | null; image?: string | null };

	if (!section?.headline) return null;

	return (
		<SplitMedia
			data={{
				tag: section.tag ?? null,
				headline: section.headline,
				description: section.description ?? null,
				image: section.image ?? null,
			}}
			imagePosition="right"
		/>
	);
}

export default IntroSection;
