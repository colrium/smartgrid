"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

interface CtaLink {
	label?: string;
	href?: string;
	icon?: string | null;
}

interface TechnicalCtaContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	watermark?: string | null;
	primary?: CtaLink | null;
	secondary?: CtaLink | null;
}

/**
 * GPR technical-proposal CTA — shared dark split band with shimmer +
 * watermark (content: surveying/ground-penetrating-radar:technicalCta).
 */
export function GprTechnicalProposalCta(): ReactElement | null {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const content = t("surveying/ground-penetrating-radar:technicalCta", {
		returnObjects: true,
	}) as unknown as TechnicalCtaContent;

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

export default GprTechnicalProposalCta;
