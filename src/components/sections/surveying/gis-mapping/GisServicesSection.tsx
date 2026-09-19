"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface ServiceItem {
	icon?: string | null;
	title: string;
	features?: string[] | null;
}

interface GisServicesContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: ServiceItem[] | null;
}

export interface GisServicesData {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: ServiceItem[] | null;
}

/**
 * GIS services — shared indexed card grid with header-row number badges; each
 * service's feature list renders as the card inset checklist (content:
 * surveying/gis-mapping:gisServices).
 */
export function GisServicesSection({ data, id }: { data?: GisServicesData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `gisServices`
	// unique section — `indexed` + header-row badges are outside the shared
	// `cardGrid` contract); legacy locale strings otherwise.
	const section = (data ??
		(t("surveying/gis-mapping:gisServices", {
			returnObjects: true,
		}) as unknown as GisServicesContent)) as GisServicesContent;
	const rows = Array.isArray(section?.items) ? section.items : [];

	if (rows.length === 0) return null;

	const items: CardItem[] = rows.map((item) => ({
		icon: item.icon ?? null,
		title: item.title,
		subItems: (Array.isArray(item.features) ? item.features : []).map((feature) => ({ title: feature })),
	}));

	return (
		<CardGrid
			id={id ?? "gis-services"}
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			headerAlign="left"
			indexed
			fallbackIcons={["layers-outline"]}
			card={{
				headerRow: true,
				indexBadgePosition: "end",
				indexBadgeClassName:
					"text-sm font-semibold tabular-nums tracking-[0.14em] text-on-surface/30",
			}}
		/>
	);
}

export default GisServicesSection;
