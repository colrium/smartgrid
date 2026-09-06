"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { FinalCta } from "@/components/sections/shared";

interface CtaAction {
	icon?: string | null;
	label: string;
	description?: string;
	href: string;
}

interface FinalCtaContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	note?: string | null;
	actions?: CtaAction[] | null;
}

export function FinalCtaSection(): ReactElement {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	const section = t("surveying/bathymetric-surveys:finalCta", {
		returnObjects: true,
	}) as unknown as FinalCtaContent;

	if (!section?.headline) return <></>;

	return (
		<FinalCta
			id="get-started"
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			descriptionTone="accent"
			note={section.note}
			watermark="water"
			actions={section.actions ?? null}
			actionIconFallback="email-outline"
			columns={3}
		/>
	);
}

export default FinalCtaSection;
