"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";

/**
 * Company-profile hero — shared light centred intro hero (the `layout: light`
 * key on the locale entry selects it; content: company-profile:hero).
 */
export function CompanyProfileHero(): ReactElement {
	const { t } = useTranslation(["company-profile"]);
	const data = t("company-profile:hero", { returnObjects: true }) as unknown as HeroContent;

	return <Hero data={data} />;
}

export default CompanyProfileHero;

