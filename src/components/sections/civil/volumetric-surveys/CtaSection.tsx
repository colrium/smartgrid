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
}

export function CtaSection(): ReactElement {
	const { t } = useTranslation(["civil/volumetric-surveys"]);
	const section = t("civil/volumetric-surveys:cta", {
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
							icon: section.ctaPrimary.icon ?? "arrow-right",
							iconPosition: "end",
						}
					: null
			}
		/>
	);
}

export default CtaSection;
