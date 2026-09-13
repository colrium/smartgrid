"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";

/**
 * Sectional-properties intro — shared intro text section with brand pill CTA
 * (content: surveying/sectional-properties:section1).
 */
export function IntroSection(): ReactElement {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const section = t("surveying/sectional-properties:section1", {
		returnObjects: true,
	}) as unknown as { tag?: string | null; headline: string; description?: string | null; ctaPrimary?: { label: string; href: string } | null };

	return (
		<IntroTextSection
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description ?? undefined}
			cta={section.ctaPrimary ?? null}
		/>
	);
}

export default IntroSection;
