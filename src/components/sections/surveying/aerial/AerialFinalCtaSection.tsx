"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { FinalCta } from "@/components/sections/shared";

interface CtaCard {
	icon?: string | null;
	label: string;
	description?: string;
	href: string;
}

interface FinalCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	actionsLabel?: string | null;
	actions?: CtaCard[] | null;
}

export function AerialFinalCtaSection(): ReactElement {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	const section = t("surveying/aerial-surveys:finalCta", {
		returnObjects: true,
	}) as unknown as FinalCtaContent;

	if (!section?.headline) return <></>;

	return (
		<FinalCta
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			watermark="drone"
			actions={section.actions ?? null}
			actionsLabel={section.actionsLabel}
			columns={4}
		/>
	);
}

export default AerialFinalCtaSection;
