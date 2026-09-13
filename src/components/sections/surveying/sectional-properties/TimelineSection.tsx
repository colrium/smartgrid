"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { Process, type ProcessTimelineStage } from "@/components/sections/shared/Process";

interface TimelineStage {
	label?: string;
	range?: string;
	days?: number;
}

interface TimelineContent {
	tag?: string | null;
	headline?: string;
	description?: string;
	barLabel?: string;
	startLabel?: string;
	endLabel?: string;
	costNote?: string;
	stages?: TimelineStage[];
	ctaEmail?: { label?: string; href?: string };
}

export function TimelineSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const section = t("surveying/sectional-properties:timeline", {
		returnObjects: true,
	}) as unknown as TimelineContent;
	const stages = Array.isArray(section?.stages)
		? section.stages.map((stage): ProcessTimelineStage => ({
				label: stage.label ?? undefined,
				range: stage.range ?? undefined,
				days: stage.days,
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
			id="timeline"
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
