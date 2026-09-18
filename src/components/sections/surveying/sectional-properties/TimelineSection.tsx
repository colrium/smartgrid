"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { Process, type ProcessTimelineStage } from "@/components/sections/shared/Process";

interface TimelineStage {
	label?: string | null;
	range?: string | null;
	days?: number | null;
}

interface TimelineContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	barLabel?: string | null;
	startLabel?: string | null;
	endLabel?: string | null;
	costNote?: string | null;
	stages?: TimelineStage[] | null;
	ctaEmail?: { label?: string | null; href?: string | null } | null;
}

export interface SectionalTimelineData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	barLabel?: string | null;
	startLabel?: string | null;
	endLabel?: string | null;
	costNote?: string | null;
	stages?: TimelineStage[] | null;
	ctaEmail?: { label?: string | null; href?: string | null } | null;
}

export function TimelineSection({ data, id }: { data?: SectionalTimelineData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	// Keystatic-owned content when `data` is provided (M11
	// `sectionalTimeline` unique section); legacy
	// `surveying/sectional-properties:timeline` locale strings otherwise.
	// The timeline layout computation stays in the wrapper.
	const section = (data ??
		(t("surveying/sectional-properties:timeline", {
			returnObjects: true,
		}) as unknown as TimelineContent)) as TimelineContent;
	const stages = Array.isArray(section?.stages)
		? section.stages.map((stage): ProcessTimelineStage => ({
				label: stage.label ?? undefined,
				range: stage.range ?? undefined,
				days: typeof stage.days === "number" ? stage.days : undefined,
			}))
		: [];

	const timeline = stages.length > 0 || !section?.headline
		? {
				barLabel: section.barLabel ?? undefined,
				startLabel: section.startLabel ?? undefined,
				endLabel: section.endLabel ?? undefined,
				costNote: section.costNote ?? undefined,
				emailCta: section.ctaEmail?.href
					? { label: section.ctaEmail.label ?? "", href: section.ctaEmail.href }
					: undefined,
				stages,
			}
		: undefined;

	if (!section?.headline && stages.length === 0) return null;

	return (
		<Process
			id={id ?? "timeline"}
			tag={section.tag}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
			layout="timeline"
			tone="surface"
			timeline={timeline}
		/>
	);
}

export default TimelineSection;
