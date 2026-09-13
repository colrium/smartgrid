"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";

/**
 * Sectional-properties hero — shared full-bleed bottom hero with primary +
 * secondary pills (content: surveying/sectional-properties:hero).
 */
export function SectionalHeroSection(): ReactElement {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const data = t("surveying/sectional-properties:hero", { returnObjects: true }) as unknown as HeroContent;

	return <Hero data={data} />;
}

export default SectionalHeroSection;
