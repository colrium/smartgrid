"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SplitMedia, type SplitMediaContent } from "@/components/sections/shared";

const NS = "aerial-drones/lidar-mapping";

export function ConstructionSection(): ReactElement {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:construction`, {
		returnObjects: true,
	}) as unknown as SplitMediaContent;

	return <SplitMedia data={section} imagePosition="right" tone="default" mediaAspect="aspect-16/10" />;
}

export default ConstructionSection;