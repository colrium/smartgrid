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

export function FinalCtaSection(): ReactElement {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
	const section = t("surveying/cadastral-surveys:finalCta", {
		returnObjects: true,
	}) as unknown as FinalCtaContent;

	if (!section?.headline) return <></>;

	return (
		<FinalCta
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			watermark="vector-square"
			actions={section.actions ?? null}
			actionsLabel={section.actionsLabel}
			columns={4}
			align="left"
		/>
	);
}

export default FinalCtaSection;
