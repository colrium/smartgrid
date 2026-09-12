"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

const NS = "aerial-drones/monitoring-and-evaluation";

interface ImpactContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

const FALLBACK_ICONS = ["water", "sprout", "home-flood"];

export function ImpactSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:impact`, {
		returnObjects: true,
	}) as unknown as ImpactContent;
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
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default ImpactSection;