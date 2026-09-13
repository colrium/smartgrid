"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

/**
 * Why-SmartGrid-bathymetric differentiators — shared check-card grid
 * (content: surveying/bathymetric-surveys:whySmartGridBathymetric).
 */
export function WhySmartGridBathymetricSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	const section = t("surveying/bathymetric-surveys:whySmartGridBathymetric", {
		returnObjects: true,
	}) as unknown as { tag?: string | null; headline: string; items?: string[] | null };
	const rows = Array.isArray(section?.items) ? section.items : [];

	if (rows.length === 0) return null;

	const items: CardItem[] = rows.map((row) => ({ icon: "check-bold", title: row }));

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			items={items}
			columns={3}
			tone="surface"
		/>
	);
}

export default WhySmartGridBathymetricSection;
