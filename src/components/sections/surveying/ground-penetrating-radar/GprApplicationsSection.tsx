"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface ApplicationItem {
	icon?: string | null;
	title: string;
	points?: string[] | null;
}

interface ApplicationsContent {
	tag?: string | null;
	headline: string;
	items?: ApplicationItem[] | null;
}

/**
 * GPR applications — shared indexed card grid with header-row number badges;
 * each application's point list renders as the card inset checklist (content:
 * surveying/ground-penetrating-radar:applications).
 */
export function GprApplicationsSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const section = t("surveying/ground-penetrating-radar:applications", {
		returnObjects: true,
	}) as unknown as ApplicationsContent;
	const rows = Array.isArray(section?.items) ? section.items : [];

	if (rows.length === 0) return null;

	const items: CardItem[] = rows.map((item) => ({
		icon: item.icon ?? null,
		title: item.title,
		subItems: (Array.isArray(item.points) ? item.points : []).map((point) => ({ title: point })),
	}));

	return (
		<CardGrid
			id="applications"
			tag={section.tag ?? null}
			headline={section.headline}
			items={items}
			columns={3}
			headerAlign="left"
			indexed
			card={{
				headerRow: true,
				indexBadgePosition: "end",
				indexBadgeClassName:
					"text-sm font-semibold tabular-nums tracking-[0.14em] text-on-surface/30",
			}}
		/>
	);
}

export default GprApplicationsSection;
