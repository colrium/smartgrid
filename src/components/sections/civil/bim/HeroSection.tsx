"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared";

const NS = "civil/bim";

/**
 * BIM hero — shared bottom hero
 * (content: civil/bim:hero).
 */
export function HeroSection(): ReactElement {
	const { t } = useTranslation([NS]);
	const data = t(`${NS}:hero`, { returnObjects: true }) as unknown as HeroContent;

	return <Hero data={data} />;
}

export default HeroSection;
