"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SplitMedia } from "@/components/sections/shared";

/**
 * Precision volumetric analysis — shared split-media section with the framed
 * image on the right (content: civil/volumetric-surveys:precisionVolumetricAnalysis).
 */
export function PrecisionVolumetricAnalysisSection(): ReactElement | null {
	const { t } = useTranslation(["civil/volumetric-surveys"]);
	const section = t("civil/volumetric-surveys:precisionVolumetricAnalysis", {
		returnObjects: true,
	}) as unknown as {
		tag?: string | null;
		headline: string;
		description?: string | null;
		image?: string | null;
	};

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

export default PrecisionVolumetricAnalysisSection;
