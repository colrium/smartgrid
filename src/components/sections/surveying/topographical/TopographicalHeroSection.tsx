"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";

/**
 * Topographical-surveys hero — shared full-bleed bottom hero (content:
 * surveying/topographical-surveys:hero; the email pill renders its icon
 * leading via `ctaPrimary.iconPosition`).
 */
export function TopographicalHeroSection(): ReactElement {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	const data = t("surveying/topographical-surveys:hero", { returnObjects: true }) as unknown as HeroContent;

	return <Hero data={data} />;
}

export default TopographicalHeroSection;
