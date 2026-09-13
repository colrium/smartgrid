"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SplitMedia } from "@/components/sections/shared/SplitMedia";

interface PrecisionContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	image?: string | null;
}

/** Precision split — shared split-media section (content:
 * surveying/aerial-surveys:precision). */
export function PrecisionSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	const section = t("surveying/aerial-surveys:precision", {
		returnObjects: true,
	}) as unknown as PrecisionContent;

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

export default PrecisionSection;