"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

interface CtaLink {
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
	const { t } = useTranslation(["aerial-drones/solar-panel-drone-surveys"]);
	const section = t("aerial-drones/solar-panel-drone-surveys:cta", {
		returnObjects: true,
	}) as unknown as CtaContent;

	return (
		<CtaBand
			className="pb-24 sm:pb-28 relative overflow-hidden"
			tag={section?.tag}
			headline={section?.headline}
			description={section?.description}
			primary={
				section?.ctaPrimary?.href
					? {
							label: section.ctaPrimary.label,
							href: section.ctaPrimary.href,
							icon: "arrow-right",
							iconPosition: "end",
						}
					: null
			}
		/>
	);
}

export default CtaSection;
