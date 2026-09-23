"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface IndustryItem {
	icon?: string | null;
	title: string;
	features?: string[] | null;
}

interface IndustriesContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: IndustryItem[] | null;
}

export interface GisIndustriesData {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: IndustryItem[] | null;
}

/**
 * GIS industries — shared 2-col card grid; each industry's feature list
 * renders as the card inset checklist (content:
 * surveying/gis-mapping:industries).
 */
export function GisIndustriesSection({ data }: { data?: GisIndustriesData | null } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `gisIndustries`
	// unique section — 2 columns + `fallbackIcons` are outside the shared
	// `cardGrid` contract); legacy locale strings otherwise.
	const section = (data ??
		(t("surveying/gis-mapping:industries", {
			returnObjects: true,
		}) as unknown as IndustriesContent)) as IndustriesContent;
	const rows = Array.isArray(section?.items) ? section.items : [];

	if (rows.length === 0) return null;

	const items: CardItem[] = rows.map((item) => ({
		icon: item.icon ?? null,
		title: item.title,
		subItems: (Array.isArray(item.features) ? item.features : []).map((feature) => ({ title: feature })),
	}));

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={2}
			fallbackIcons={["account-group"]}
		/>
	);
}

export default GisIndustriesSection;
