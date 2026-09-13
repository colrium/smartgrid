"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface EngineeringItem {
	title: string;
	description?: string | null;
}

interface EngineeringContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: EngineeringItem[] | null;
}

const FALLBACK_ICONS = [
	"map-outline",
	"pencil-ruler",
	"cube-scan",
	"vector-polyline",
	"file-check-outline",
	"shovel",
];

/**
 * Site-engineering surveys — shared indexed card grid with header-row number
 * badges (content: surveying/building-site-surveys:siteEngineeringSurveys).
 */
export function SiteEngineeringSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const section = t("surveying/building-site-surveys:siteEngineeringSurveys", {
		returnObjects: true,
	}) as unknown as EngineeringContent;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			headerAlign="left"
			indexed
			fallbackIcons={FALLBACK_ICONS}
			card={{
				headerRow: true,
				indexBadgePosition: "end",
				indexBadgeClassName:
					"text-sm font-semibold tabular-nums tracking-[0.14em] text-on-surface/30",
			}}
		/>
	);
}

export default SiteEngineeringSection;
