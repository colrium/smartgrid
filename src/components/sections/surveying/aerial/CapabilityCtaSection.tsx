"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

interface CtaLink {
	label?: string;
	href?: string;
	icon?: string | null;
}

interface CapabilityCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	watermark?: string | null;
	primary?: CtaLink | null;
	secondary?: CtaLink | null;
}

export interface AerialCapabilityCtaData {
	tag?: string | null;
	headline: string;
	description?: string;
	watermark?: string | null;
	primary?: CtaLink | null;
	secondary?: CtaLink | null;
}

export function CapabilityCtaSection({ data, id }: { data?: AerialCapabilityCtaData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	// Keystatic-owned content when `data` is provided (M11
	// `aerialCapabilityCta` unique section); legacy locale strings otherwise.
	// Centered layout + shimmer presentation stays in the renderer.
	const content = (data ??
		(t("surveying/aerial-surveys:capabilityCta", {
			returnObjects: true,
		}) as unknown as CapabilityCtaContent)) as CapabilityCtaContent;

	if (!content?.headline) return <></>;

	return (
		<CtaBand
			size="lg"
			decor="none"
			shimmer
			hairline
			id={id}
			watermark={content.watermark}
			tag={content.tag}
			headline={content.headline}
			description={content.description}
			primary={
				content.primary?.href
					? {
							label: content.primary.label ?? "",
							href: content.primary.href,
							icon: content.primary.icon,
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
							icon: content.secondary.icon,
						}
					: null
			}
		/>
	);
}

export default CapabilityCtaSection;
