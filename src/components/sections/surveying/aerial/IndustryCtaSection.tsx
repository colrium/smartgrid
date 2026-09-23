"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared/CtaBand";

interface CtaLink {
	label?: string;
	href?: string;
	icon?: string | null;
}

interface IndustryCtaContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	watermark?: string | null;
	primary?: CtaLink | null;
	secondary?: CtaLink | null;
}

export interface AerialIndustryCtaData {
	tag?: string | null;
	headline: string;
	description?: string | null;
	watermark?: string | null;
	primary?: CtaLink | null;
	secondary?: CtaLink | null;
}

/** Industry split CTA band — shared split CtaBand with the gold shimmer edge
 * (content: surveying/aerial-surveys:industryCta). */
export function IndustryCtaSection({ data, id }: { data?: AerialIndustryCtaData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	// Keystatic-owned content when `data` is provided (M11
	// `aerialIndustryCta` unique section); legacy locale strings otherwise.
	// Split layout + shimmer presentation stays in the renderer.
	const content = (data ??
		(t("surveying/aerial-surveys:industryCta", { returnObjects: true }) as unknown as IndustryCtaContent)) as IndustryCtaContent;

	if (!content?.headline) return null;

	return (
		<CtaBand
			layout="split"
			size="lg"
			decor="none"
			shimmer
			hairline
			id={id}
			watermark={content.watermark ?? null}
			tag={content.tag ?? null}
			headline={content.headline}
			description={content.description ?? null}
			primary={
				content.primary?.href
					? {
							label: content.primary.label ?? "",
							href: content.primary.href,
							icon: content.primary.icon ?? null,
							iconPosition: "start",
							trailingArrow: true,
						}
					: null
			}
			secondary={
				content.secondary?.href
					? {
							label: content.secondary.label ?? "",
							href: content.secondary.href,
							icon: content.secondary.icon ?? null,
						}
					: null
			}
		/>
	);
}

export default IndustryCtaSection;