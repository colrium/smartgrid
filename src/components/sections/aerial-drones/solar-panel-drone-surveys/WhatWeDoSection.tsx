"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

const NS = "aerial-drones/solar-panel-drone-surveys";

interface WhatWeDoContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

export function WhatWeDoSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:whatWeDo`, {
		returnObjects: true,
	}) as unknown as WhatWeDoContent;
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
		/>
	);
}

export default WhatWeDoSection;