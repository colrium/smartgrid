"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SplitMedia } from "@/components/sections/shared/SplitMedia";

/**
 * What-is-bathymetric intro — shared text + framed image split (content:
 * surveying/bathymetric-surveys:whatIsBathymetricSurveys).
 */
export function WhatIsBathymetricSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	const section = t("surveying/bathymetric-surveys:whatIsBathymetricSurveys", {
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
			tone="surface"
		/>
	);
}

export default WhatIsBathymetricSection;
