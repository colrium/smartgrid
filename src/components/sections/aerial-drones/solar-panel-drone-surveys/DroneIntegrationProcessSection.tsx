"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

const NS = "aerial-drones/solar-panel-drone-surveys";

interface ProcessContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

export function DroneIntegrationProcessSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:droneIntegrationProcess`, {
		returnObjects: true,
	}) as unknown as ProcessContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			headerRow
			indexed
			card={{
				density: "comfortable",
				iconShape: "xl",
				iconSize: "sm",
				indexBadgePosition: "end",
				indexBadgeClassName:
					"h-9 w-9 rounded-full bg-primary/10 text-primary text-sm transition-colors duration-300 group-hover:bg-primary/20",
			}}
		/>
	);
}

export default DroneIntegrationProcessSection;