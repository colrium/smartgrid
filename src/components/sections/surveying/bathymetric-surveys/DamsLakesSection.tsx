"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface DamsLakesItem {
	icon?: string | null;
	title: string;
	description?: string | null;
}

interface DamsLakesContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	images?: string[] | null;
	items?: DamsLakesItem[] | null;
}

/**
 * Dams/lakes/sea/ocean coverage — shared card grid with a lead image strip
 * above the cards (content: surveying/bathymetric-surveys:damsLakesSeaOcean).
 */
export function DamsLakesSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	const section = t("surveying/bathymetric-surveys:damsLakesSeaOcean", {
		returnObjects: true,
	}) as unknown as DamsLakesContent;
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
			leadImages={images.slice(0, 2)}
		/>
	);
}

export default DamsLakesSection;
