"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Gallery, type GalleryItem } from "@/components/sections/shared/Gallery";

interface ExploreContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: GalleryItem[] | null;
}

/**
 * Explore-more service tiles — shared overlay gallery (content:
 * surveying/building-site-surveys:exploreMore).
 */
export function ExploreMoreSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const section = t("surveying/building-site-surveys:exploreMore", {
		returnObjects: true,
	}) as unknown as ExploreContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<Gallery
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
		/>
	);
}

export default ExploreMoreSection;
