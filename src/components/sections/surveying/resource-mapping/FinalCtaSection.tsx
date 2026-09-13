"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { FinalCta } from "@/components/sections/shared";

interface CtaAction {
	icon?: string | null;
	label: string;
	description?: string | null;
	href: string;
}

interface FinalCtaContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	note?: string | null;
	actions?: CtaAction[] | null;
}

/**
 * Resource-mapping closing CTA — shared full-bleed dark CTA with accent lede
 * and action cards (content: surveying/resource-mapping:finalCta).
 */
export function FinalCtaSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	const section = t("surveying/resource-mapping:finalCta", {
		returnObjects: true,
	}) as unknown as FinalCtaContent;

	if (!section?.headline) return null;

	return (
		<FinalCta
			id="get-started"
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			descriptionTone="accent"
			note={section.note}
			watermark="map-marker-radius"
			actions={section.actions ?? null}
			columns={3}
		/>
	);
}

export default FinalCtaSection;
