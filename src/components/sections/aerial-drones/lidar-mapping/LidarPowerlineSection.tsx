"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SplitMedia, type SplitMediaContent } from "@/components/sections/shared";

const NS = "aerial-drones/lidar-mapping";

export function LidarPowerlineSection(): ReactElement {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:lidarPowerlineInspection`, {
		returnObjects: true,
	}) as unknown as SplitMediaContent;

	return <SplitMedia data={section} mediaAspect="aspect-16/10" />;
}

export default LidarPowerlineSection;