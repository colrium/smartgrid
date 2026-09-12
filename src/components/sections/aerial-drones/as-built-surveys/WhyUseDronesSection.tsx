"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

const NS = "aerial-drones/aerial-drones-as-built-surveys";

interface WhyDronesContent {
	tag?: string | null;
	headline: string;
	items?: CardItem[] | null;
}

const FALLBACK_ICONS = ["vector-triangle", "speedometer", "leaf", "layers-triple"];

export function WhyUseDronesSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:whyUseDrones`, {
		returnObjects: true,
	}) as unknown as WhyDronesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			items={items}
			columns={2}
			align="center"
			tone="surface"
			card={{ density: "roomy", iconShape: "xl", iconSize: "lg" }}
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default WhyUseDronesSection;