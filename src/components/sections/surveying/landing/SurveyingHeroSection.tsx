"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";

/**
 * Land-surveying landing hero — framed centre-stage variant of the shared
 * <Hero /> (content: surveying/landing:hero; the layout, frame ring, scroll
 * cue and pill icon are driven by the locale entry).
 */
export function SurveyingHeroSection(): ReactElement {
	const { t } = useTranslation(["surveying/landing"]);
	const data = t("surveying/landing:hero", { returnObjects: true }) as unknown as HeroContent;

	return <Hero data={data} />;
}

export default SurveyingHeroSection;

