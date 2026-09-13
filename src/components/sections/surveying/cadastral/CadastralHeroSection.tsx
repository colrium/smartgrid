"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";

/**
 * Cadastral-surveys hero — shared full-bleed bottom hero (content:
 * surveying/cadastral-surveys:hero).
 */
export function CadastralHeroSection(): ReactElement {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
	const data = t("surveying/cadastral-surveys:hero", { returnObjects: true }) as unknown as HeroContent;

	return <Hero data={data} />;
}

export default CadastralHeroSection;
