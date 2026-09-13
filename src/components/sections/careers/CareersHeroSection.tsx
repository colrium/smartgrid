"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";

/**
 * Careers hero — shared banner variant (ink band, giant ghost title,
 * labelled scroll cue; the layout key on the locale entry selects it).
 * The scroll-cue label comes from the shared `common` namespace.
 */
export function CareersHeroSection(): ReactElement {
	const { t } = useTranslation(["careers", "common"]);
	const data = t("careers:hero", { returnObjects: true }) as unknown as HeroContent;

	return <Hero data={{ ...data, cueLabel: t("common:misc.openRoles") }} />;
}

export default CareersHeroSection;
