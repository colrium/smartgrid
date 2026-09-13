"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";

/**
 * Aerial-surveys hero — shared full-bleed bottom hero; trust-marker footnote
 * chips come from the locale `hero.footnoteItems` (content:
 * surveying/aerial-surveys:hero).
 */
export function AerialHeroSection(): ReactElement {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	const data = t("surveying/aerial-surveys:hero", { returnObjects: true }) as unknown as HeroContent;

	return <Hero data={data} />;
}

export default AerialHeroSection;