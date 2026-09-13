"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

interface CtaLink {
	label: string;
	href: string;
}

interface SiteCtaContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	ctaPrimary?: CtaLink | null;
}

/**
 * Building-site CTA — shared centred dark panel with glyph (content:
 * surveying/building-site-surveys:cta).
 */
export function SiteCtaSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const section = t("surveying/building-site-surveys:cta", {
		returnObjects: true,
	}) as unknown as SiteCtaContent;

	if (!section?.headline) return null;

	return (
		<CtaBand
			glyph="↗"
			hairline
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			primary={
				section.ctaPrimary?.href
					? { label: section.ctaPrimary.label, href: section.ctaPrimary.href }
					: null
			}
		/>
	);
}

export default SiteCtaSection;
