"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { FinalCta } from "@/components/sections/shared";

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

export interface RmFinalCtaData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	note?: string | null;
	actions?: CtaAction[] | null;
}

/**
 * Resource-mapping closing CTA — shared full-bleed dark CTA with accent lede
 * and action cards (content: surveying/resource-mapping:finalCta).
 */
export function FinalCtaSection({ data, id }: { data?: RmFinalCtaData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `rmFinalCta`
	// unique section); legacy locale strings otherwise. Presentation
	// (accent lede, map-marker watermark, 3 columns) stays in the wrapper.
	const section = (data ??
		(t("surveying/resource-mapping:finalCta", {
			returnObjects: true,
		}) as unknown as FinalCtaContent)) as FinalCtaContent;

	if (!section?.headline) return null;

	return (
		<FinalCta
			id={id ?? "get-started"}
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description ?? undefined}
			descriptionTone="accent"
			note={section.note ?? undefined}
			watermark="map-marker-radius"
			actions={(section.actions ?? []).map((action) => ({
				icon: action.icon ?? null,
				label: action.label ?? "",
				description: action.description ?? undefined,
				href: action.href ?? "",
			}))}
			columns={3}
		/>
	);
}

export default FinalCtaSection;
