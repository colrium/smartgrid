"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SplitMedia } from "@/components/sections/shared/SplitMedia";

interface OurStoryContent {
	tag?: string | null;
	headline: string;
	image?: string | null;
	description?: string | null;
}

/**
 * Our story — shared split-media section with a contain-fit image
 * (content: about:ourStory).
 */
export function OurStorySection(): ReactElement | null {
	const { t } = useTranslation(["about"]);
	const section = t("about:ourStory", { returnObjects: true }) as unknown as OurStoryContent;

	if (!section?.headline) return null;

	return (
		<SplitMedia
			data={{
				tag: section.tag ?? null,
				headline: section.headline,
				description: section.description ?? null,
				image: section.image ?? null,
			}}
			imagePosition="left"
			mediaAspect="aspect-square"
			mediaFit="contain"
		/>
	);
}

export default OurStorySection;
