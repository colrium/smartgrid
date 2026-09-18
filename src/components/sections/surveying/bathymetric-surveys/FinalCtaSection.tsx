"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { FinalCta, type FinalCtaAction } from "@/components/sections/shared";

interface CtaAction {
	icon?: string | null;
	label?: string | null;
	description?: string | null;
	href?: string | null;
}

interface FinalCtaContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	note?: string | null;
	actions?: CtaAction[] | null;
}

export interface BathyFinalCtaData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	note?: string | null;
	actions?: CtaAction[] | null;
}

export function FinalCtaSection({ data, id }: { data?: BathyFinalCtaData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `bathyFinalCta`
	// unique section); legacy locale strings otherwise. Presentation (accent
	// description tone, water watermark, 3 columns) stays in the wrapper.
	const section = (data ??
		(t("surveying/bathymetric-surveys:finalCta", {
			returnObjects: true,
		}) as unknown as FinalCtaContent)) as FinalCtaContent;

	if (!section?.headline) return <></>;

	return (
		<FinalCta
			id={id ?? "get-started"}
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description ?? undefined}
			descriptionTone="accent"
			note={section.note ?? undefined}
			watermark="water"
			actions={(section.actions ?? []) as FinalCtaAction[]}
			actionIconFallback="email-outline"
			columns={3}
		/>
	);
}

export default FinalCtaSection;
