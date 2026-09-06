"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

interface CtaLink {
	icon?: string;
	label: string;
	href: string;
}

interface CtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: CtaLink | null;
	ctaSecondary?: CtaLink | null;
}

export function CtaSection(): ReactElement {
	const { t } = useTranslation(["equipment-catalogue"]);
	const section = t("equipment-catalogue:cta", {
		returnObjects: true,
	}) as unknown as CtaContent;

	return (
		<CtaBand
			tag={section?.tag}
			headline={section?.headline}
			description={section?.description}
			primary={
				section?.ctaPrimary?.href
					? {
							label: section.ctaPrimary.label,
							href: section.ctaPrimary.href,
							icon: section.ctaPrimary.icon,
							iconPosition: "start",
						}
					: null
			}
			secondary={
				section?.ctaSecondary?.href
					? {
							label: section.ctaSecondary.label,
							href: section.ctaSecondary.href,
							icon: section.ctaSecondary.icon,
							iconPosition: "start",
							trailingArrow: true,
						}
					: null
			}
		/>
	);
}

export default CtaSection;
