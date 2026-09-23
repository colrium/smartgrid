"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

interface CtaLink {
	label?: string;
	href?: string;
	icon?: string | null;
}

interface ConsultationCtaContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	watermark?: string | null;
	primary?: CtaLink | null;
	secondary?: CtaLink | null;
}

/**
 * GIS consultation CTA — shared dark split band with shimmer + watermark
 * (content: surveying/gis-mapping:consultationCta).
 */
export function GisConsultationCtaSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const content = t("surveying/gis-mapping:consultationCta", {
		returnObjects: true,
	}) as unknown as ConsultationCtaContent;

	if (!content?.headline) return null;

	return (
		<CtaBand
			layout="split"
			shimmer
			hairline
			watermark={content.watermark}
			tag={content.tag}
			headline={content.headline}
			description={content.description}
			primary={
				content.primary?.href
					? { label: content.primary.label ?? "", href: content.primary.href, icon: content.primary.icon }
					: null
			}
			secondary={
				content.secondary?.href
					? { label: content.secondary.label ?? "", href: content.secondary.href, icon: content.secondary.icon }
					: null
			}
		/>
	);
}

export default GisConsultationCtaSection;
