"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface WhyStandOutItem {
	icon?: string | null;
	title: string;
	description?: string | null;
}

interface WhyStandOutContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: WhyStandOutItem[] | null;
}

/**
 * Why-SmartGrid-stands-out differentiators — shared centred card grid
 * (content: surveying/resource-mapping:whySmartGridStandsOut).
 */
export function WhyStandOutSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	const section = t("surveying/resource-mapping:whySmartGridStandsOut", {
		returnObjects: true,
	}) as unknown as WhyStandOutContent;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
			tone="surface"
			align="center"
		/>
	);
}

export default WhyStandOutSection;
