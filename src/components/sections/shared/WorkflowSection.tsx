"use client";

import type { ReactElement } from "react";
import {
	Process,
	type ProcessClassesProp,
	type ProcessItem,
	type ProcessPhaseStyle,
	type ProcessPhaseStyles,
	type ProcessCta,
} from "@/components/sections/shared/Process";

/**
 * Legacy workflow types kept so existing consumers (aerial, resource-mapping)
 * compile unchanged. `label` maps onto the shared Process item `title`.
 */
export type WorkflowStep = ProcessItem & { label?: string };
export type WorkflowCta = ProcessCta;
export type WorkflowPhaseStyle = ProcessPhaseStyle;
export type WorkflowPhaseStyles = ProcessPhaseStyles;

export interface WorkflowClassesProp {
	sectionHeader?: ProcessClassesProp["sectionHeader"];
	grid?: string;
	card?: string;
	footer?: string;
	note?: string;
	outcome?: string;
}
export interface WorkflowSectionProps {
	tag?: string | null;
	headline?: string;
	description?: string | null;
	steps?: WorkflowStep[] | null;
	/** Closing highlight pill rendered under the timeline. */
	outcome?: string | null;
	/** Supporting copy rendered under the outcome pill. */
	ctaNote?: string | null;
	cta?: WorkflowCta | null;
	/** Per-phase chip style overrides merged over the defaults. */
	phaseStyles?: WorkflowPhaseStyles | null;
	classes?: WorkflowClassesProp;
	/** Anchor id forwarded to the underlying timeline. */
	id?: string;
}

const PHASE_STYLES: WorkflowPhaseStyles = {
	PLANNING: {
		chip: "border-ink/30 bg-ink-50 text-ink-700",
		icon: "clipboard-text",
	},
	CONTROL: {
		chip: "border-warning/30 bg-warning-50 text-warning-700",
		icon: "crosshairs-gps",
	},
	ACQUISITION: {
		chip: "border-accent/30 bg-accent-50 text-accent-700",
		icon: "boat",
	},
	PROCESSING: {
		chip: "border-teal-300/60 bg-teal-50 text-teal-700",
		icon: "cog-outline",
	},
	MODELLING: {
		chip: "border-green-300/60 bg-green-50 text-green-700",
		icon: "cube-outline",
	},
	ANALYSIS: {
		chip: "border-teal-300/60 bg-teal-50 text-teal-700",
		icon: "chart-timeline-variant",
	},
	VALIDATION: {
		chip: "border-success-200/60 bg-success-50/50 text-success-400",
		icon: "check-circle-outline",
	},
	DELIVERY: {
		chip: "border-success/30 bg-success/10 text-success-700",
		icon: "file-document-outline",
	},
};

/**
 * Root workflow section — thin shim over the shared `Process` timeline
 * (consolidated in B1). The centre-line timeline, phase chips, outcome pill
 * and closing CTA map 1:1 onto Process props, so existing wrappers compile
 * unchanged.
 */
export function WorkflowSection(props: WorkflowSectionProps): ReactElement {
	const steps = Array.isArray(props.steps) ? props.steps : [];

	if (steps.length === 0) return <></>;

	const items: ProcessItem[] = steps.map((step) => ({
		phase: step.phase ?? null,
		title: step.label ?? "",
		description: step.description ?? null,
		icon: step.icon ?? null,
	}));

	return (
		<Process
			id={props.id}
			tag={props.tag ?? null}
			headline={props.headline ?? ""}
			description={props.description ?? null}
			steps={items}
			layout="timeline"
			tone="surface"
			phaseStyles={{ ...PHASE_STYLES, ...(props.phaseStyles ?? {}) }}
			outcome={props.outcome ?? null}
			ctaNote={props.ctaNote ?? null}
			classes={props.classes ? { sectionHeader: props.classes.sectionHeader, grid: props.classes.grid, card: props.classes.card, footer: props.classes.footer, note: props.classes.note, outcome: props.classes.outcome } : undefined}
			cta={
				props.cta?.href
					? {
							label: props.cta.label ?? "",
							href: props.cta.href,
							icon: props.cta.icon ?? null,
						}
					: null
			}
		/>
	);
}

export default WorkflowSection;