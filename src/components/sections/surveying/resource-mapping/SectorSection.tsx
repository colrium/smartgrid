"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface SectorItem {
	icon?: string | null;
	title: string;
	description?: string | null;
}

interface SectorContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	images?: string[] | null;
	items?: SectorItem[] | null;
}

interface SectorSectionProps {
	sectionKey: string;
	/** Retired: the lead-image strip renders identically for every sector. */
	imagePosition?: "left" | "right";
	tone?: "default" | "surface";
}

/**
 * Resource-mapping sector section (agriculture, energy, mining, civil,
 * environment, disaster) — shared card grid with a lead image strip above
 * the cards. The `imagePosition` presentation prop is retired: the strip
 * renders identically for every sector (content:
 * surveying/resource-mapping:<sectionKey>).
 */
export function SectorSection({ sectionKey, tone = "default" }: SectorSectionProps): ReactElement | null {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	const section = t(`surveying/resource-mapping:${sectionKey}`, {
		returnObjects: true,
	}) as unknown as SectorContent;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];
	const images = Array.isArray(section?.images) ? section.images : [];

	if (items.length === 0 && images.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			tone={tone}
			leadImages={images.slice(0, 2)}
		/>
	);
}

export default SectorSection;
