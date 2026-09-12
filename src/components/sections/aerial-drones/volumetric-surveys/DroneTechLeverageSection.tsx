"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SplitMedia, type SplitMediaContent } from "@/components/sections/shared";

const NS = "aerial-drones/volumetric-surveys";

export function DroneTechLeverageSection(): ReactElement {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:droneTechLeverage`, {
		returnObjects: true,
	}) as unknown as SplitMediaContent;

	return <SplitMedia data={section} />;
}

export default DroneTechLeverageSection;