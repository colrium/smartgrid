"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface ImpactItem {
	icon?: string | null;
	title: string;
}

interface ProjectImpactContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: ImpactItem[] | null;
}

/**
 * GIS project impact — shared numbered card grid (content:
 * surveying/gis-mapping:projectImpact).
 */
export function GisProjectImpactSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t("surveying/gis-mapping:projectImpact", {
		returnObjects: true,
	}) as unknown as ProjectImpactContent;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={5}
			tone="surface"
			indexed
			fallbackIcons={["trending-up"]}
		/>
	);
}

export default GisProjectImpactSection;
