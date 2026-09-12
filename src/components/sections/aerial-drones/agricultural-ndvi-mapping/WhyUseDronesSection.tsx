"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import {
	SplitMedia,
	type SplitMediaContent,
	type CardItem,
} from "@/components/sections/shared";

const NS = "aerial-drones/agricultural-ndvi-mapping";

interface WhyUseContent extends SplitMediaContent {
	items?: CardItem[] | null;
}

export function WhyUseDronesSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:whyUseDronesInAgriculture`, {
		returnObjects: true,
	}) as unknown as WhyUseContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (!section?.headline) return null;

	return (
		<SplitMedia
			data={section}
			tone="surface"
			columns={4}
			items={items}
			align="left"
			card={{ density: "comfortable", iconShape: "xl", iconSize: "sm" }}
		/>
	);
}

export default WhyUseDronesSection;