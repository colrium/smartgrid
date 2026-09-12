"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SplitMedia, type SplitMediaContent } from "@/components/sections/shared";

const NS = "aerial-drones/lidar-mapping";

export function ForestrySection(): ReactElement {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:forestry`, {
		returnObjects: true,
	}) as unknown as SplitMediaContent;

	return <SplitMedia data={section} imagePosition="left" tone="surface" mediaAspect="aspect-16/10" />;
}

export default ForestrySection;