"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";

/**
 * About hero — shared full-bleed bottom hero with a solid primary pill and
 * an optional outline secondary pill (content: about:hero).
 */
export function HeroSection(): ReactElement {
	const { t } = useTranslation(["about"]);
	const data = t("about:hero", { returnObjects: true }) as unknown as HeroContent;

	return <Hero data={data} />;
}

export default HeroSection;
