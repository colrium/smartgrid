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

interface AnalystCtaContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	actions?: CtaAction[] | null;
}

export interface GisAnalystCtaData {
	tag?: string | null;
	headline: string;
	description?: string | null;
	actions?: CtaAction[] | null;
}

/**
 * Talk-to-analyst closing CTA — shared full-bleed dark CTA with action cards
 * (content: surveying/gis-mapping:analystCta).
 */
export function GisAnalystCtaSection({ data, id }: { data?: GisAnalystCtaData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `gisAnalystCta`
	// unique section); legacy locale strings otherwise. The hardcoded
	// `id="talk-to-analyst"` + watermark + 3 columns stay in the renderer.
	const section = (data ??
		(t("surveying/gis-mapping:analystCta", {
			returnObjects: true,
		}) as unknown as AnalystCtaContent)) as AnalystCtaContent;

	if (!section?.headline) return null;

	return (
		<FinalCta
			id={id ?? "talk-to-analyst"}
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			watermark="map-search-outline"
			actions={section.actions ?? null}
			columns={3}
		/>
	);
}

export default GisAnalystCtaSection;
