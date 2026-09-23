"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface ServiceItem {
	image?: string | null;
	title: string;
	description?: string | null;
}

interface ServicesGridContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: ServiceItem[] | null;
}

interface ServicesCardGridProps {
	sectionKey: string;
	columns?: 3 | 4;
	tone?: "default" | "surface";
}

/**
 * GIS service image cards (mapping services, remote sensing) — shared
 * media-top card grid with numbered glass chips. Also fixes the locale lookup
 * to the `surveying/gis-mapping` namespace (content:
 * surveying/gis-mapping:<sectionKey>).
 */
export function ServicesCardGrid({ sectionKey, columns = 4, tone = "default" }: ServicesCardGridProps): ReactElement | null {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t(`surveying/gis-mapping:${sectionKey}`, {
		returnObjects: true,
	}) as unknown as ServicesGridContent;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];

	if (!section?.headline && items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={columns}
			tone={tone}
			mediaBadged
		/>
	);
}

export default ServicesCardGrid;
