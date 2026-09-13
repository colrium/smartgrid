"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";

/**
 * Bathymetric-surveys hero — shared full-bleed bottom hero (content:
 * surveying/bathymetric-surveys:hero).
 */
export function BathymetricHeroSection(): ReactElement {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	const data = t("surveying/bathymetric-surveys:hero", { returnObjects: true }) as unknown as HeroContent;

	return <Hero data={data} />;
}

export default BathymetricHeroSection;
