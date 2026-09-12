"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

const NS = "aerial-drones/landfill-quarry-drone-surveys";

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

export function QuarryServicesItemsSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:quarryServicesItems`, {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			align="center"
			card={{ density: "roomy", iconShape: "xl" }}
		/>
	);
}

export default QuarryServicesItemsSection;