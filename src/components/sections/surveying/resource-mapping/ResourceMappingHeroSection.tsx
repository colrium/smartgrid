"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";

/**
 * Resource-mapping hero — shared full-bleed bottom hero with primary +
 * secondary pills (content: surveying/resource-mapping:hero).
 */
export function ResourceMappingHeroSection(): ReactElement {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	const data = t("surveying/resource-mapping:hero", { returnObjects: true }) as unknown as HeroContent;

	return <Hero data={data} />;
}

export default ResourceMappingHeroSection;
