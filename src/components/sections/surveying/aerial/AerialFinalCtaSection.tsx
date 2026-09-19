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

export interface AerialFinalCtaData {
	tag?: string | null;
	headline: string;
	description?: string;
	actionsLabel?: string | null;
	actions?: CtaCard[] | null;
}

export function AerialFinalCtaSection({ data, id }: { data?: AerialFinalCtaData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `aerialFinalCta`
	// unique section); legacy locale strings otherwise. The hardcoded
	// `watermark="drone"` + `columns={4}` presentation stays in the renderer.
	const section = (data ??
		(t("surveying/aerial-surveys:finalCta", {
			returnObjects: true,
		}) as unknown as FinalCtaContent)) as FinalCtaContent;

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
			id={id}
		/>
	);
}

export default AerialFinalCtaSection;
