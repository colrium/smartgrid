"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

interface ActionCtaLink {
	label: string;
	href: string;
	icon?: string;
}

interface ActionCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	watermark?: string | null;
	primary?: ActionCtaLink | null;
	secondary?: ActionCtaLink | null;
}

export function ActionCtaBand(): ReactElement {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const content = t("surveying/building-site-surveys:actionCtaEngineer", {
		returnObjects: true,
	}) as unknown as ActionCtaContent;

	if (!content?.headline) return <></>;

	return (
		<CtaBand
			className="pb-24 sm:pb-28 relative overflow-hidden"
			layout="split"
			shimmer
			watermark={content.watermark}
			tag={content.tag}
			headline={content.headline}
			description={content.description}
			primary={
				content.primary?.href
					? {
							label: content.primary.label,
							href: content.primary.href,
							icon: content.primary.icon,
							iconPosition: "end",
						}
					: null
			}
			secondary={
				content.secondary?.href
					? {
							label: content.secondary.label,
							href: content.secondary.href,
							icon: content.secondary.icon,
						}
					: null
			}
		/>
	);
}

export default ActionCtaBand;
