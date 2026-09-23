"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

interface CtaAction {
	label?: string;
	href?: string;
	icon?: string | null;
}

interface RegistrationCtaContent {
	tag?: string | null;
	headline?: string;
	description?: string | null;
	watermark?: string | null;
	primary?: CtaAction | null;
	secondary?: CtaAction | null;
}

/**
 * Sectional registration CTA — shared centred dark band with watermark
 * (content: surveying/sectional-properties:registrationCta).
 */
export function RegistrationCtaSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const section = t("surveying/sectional-properties:registrationCta", {
		returnObjects: true,
	}) as unknown as RegistrationCtaContent;

	if (!section?.headline) return null;

	return (
		<CtaBand
			watermark={section.watermark}
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			primary={
				section.primary?.href
					? { label: section.primary.label ?? "", href: section.primary.href, icon: section.primary.icon }
					: null
			}
			secondary={
				section.secondary?.href
					? { label: section.secondary.label ?? "", href: section.secondary.href, icon: section.secondary.icon }
					: null
			}
		/>
	);
}

export default RegistrationCtaSection;
