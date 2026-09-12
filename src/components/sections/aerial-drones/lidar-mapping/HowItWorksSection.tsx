"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Process, type ProcessItem } from "@/components/sections/shared";

const NS = "aerial-drones/lidar-mapping";

interface HowItWorksContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: ProcessItem[] | null;
}

export function HowItWorksSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:howItWorks`, {
		returnObjects: true,
	}) as unknown as HowItWorksContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<Process
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			layout="grid"
			columns={4}
		/>
	);
}

export default HowItWorksSection;