"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Gallery, type GalleryItem } from "@/components/sections/shared/Gallery";

interface ServicesImageContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: GalleryItem[] | null;
}

/**
 * Sectional services image tiles — shared overlay gallery (content:
 * surveying/sectional-properties:sectionalServices).
 */
export function ServicesImageSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const section = t("surveying/sectional-properties:sectionalServices", {
		returnObjects: true,
	}) as unknown as ServicesImageContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<Gallery
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
		/>
	);
}

export default ServicesImageSection;
