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

export interface GprFinalCtaData {
	tag?: string | null;
	headline: string;
	description?: string | null;
	note?: string | null;
	actions?: CtaAction[] | null;
}

/**
 * GPR closing CTA — shared full-bleed dark CTA with accent lede, note and
 * action cards (content: surveying/ground-penetrating-radar:finalCta).
 */
export function GprFinalCtaSection({ data, id }: { data?: GprFinalCtaData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	// Keystatic-owned content when `data` is provided (M11 `gprFinalCta`
	// unique section); legacy locale strings otherwise. Accent lede,
	// `watermark="radar"` and 3 columns stay in the renderer.
	const section = (data ??
		(t("surveying/ground-penetrating-radar:finalCta", {
			returnObjects: true,
		}) as unknown as FinalCtaContent)) as FinalCtaContent;

	if (!section?.headline) return null;

	return (
		<FinalCta
			id={id ?? "get-started"}
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			descriptionTone="accent"
			note={section.note}
			watermark="radar"
			actions={section.actions ?? null}
			columns={3}
		/>
	);
}

export default GprFinalCtaSection;
