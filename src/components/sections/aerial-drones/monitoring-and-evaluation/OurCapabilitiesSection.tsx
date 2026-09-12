"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

const NS = "aerial-drones/monitoring-and-evaluation";

interface CapabilitiesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

const FALLBACK_ICONS = [
	"terrain",
	"water-outline",
	"thermometer-lines",
	"swap-horizontal",
];

export function OurCapabilitiesSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:ourCapabilities`, {
		returnObjects: true,
	}) as unknown as CapabilitiesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
			align="center"
			tone="surface"
			card={{ iconShape: "xl" }}
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default OurCapabilitiesSection;