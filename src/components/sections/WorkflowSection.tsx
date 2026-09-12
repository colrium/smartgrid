"use client";

import type { ReactElement } from "react";

import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";

export interface WorkflowStep {
    icon?: string | null;
    label?: string;
    description?: string;
    phase?: string | null;
}

export interface WorkflowCta {
    label?: string;
    href?: string;
    icon?: string | null;
}

export interface WorkflowPhaseStyle {
    /** Tailwind classes for the phase chip (border/background/text). */
    chip: string;
    /** MDI icon name rendered inside the phase chip. */
    icon: string;
}

export type WorkflowPhaseStyles = Record<string, WorkflowPhaseStyle>;

export interface WorkflowSectionProps {
    tag?: string | null;
    headline?: string;
    description?: string;
    steps?: WorkflowStep[] | null;
    /** Closing highlight pill rendered under the timeline. */
    outcome?: string | null;
    /** Supporting copy rendered under the outcome pill. */
    ctaNote?: string | null;
    cta?: WorkflowCta | null;
    /** Per-phase chip style overrides merged over the defaults. */
    phaseStyles?: WorkflowPhaseStyles | null;
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

const PHASE_FALLBACK = PHASE_STYLES.PLANNING;

export function WorkflowSection({
    tag,
    headline,
    description,
    steps,
    outcome,
    ctaNote,
    cta,
    phaseStyles,
}: WorkflowSectionProps): ReactElement {
    const items = Array.isArray(steps) ? steps : [];

    if (items.length === 0) return <></>;

    const phaseMap: WorkflowPhaseStyles = { ...PHASE_STYLES, ...(phaseStyles ?? {}) };
    const hasOutcome = !!(outcome || ctaNote || cta?.href)
    return (
        <section className="bg-surface py-24 sm:py-28 relative overflow-hidden">
            

            <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
                <SectionHeader
                    tag={tag || undefined}
                    headline={headline ?? ""}
                    description={description || undefined}
                    align="center"
                />

                <div className="relative mt-16 sm:mt-20">
                    <div
                        aria-hidden
                        className={`absolute left-4 lg:left-1/2 lg:-translate-x-1/2 top-2 ${hasOutcome? "-bottom-14" : "bottom-2"}  w-px bg-linear-to-b from-warning/10  via-primary/40  to-success/50`}
                    />
                    <ol className="space-y-10 lg:space-y-14">
                        {items.map((step, index) => {
                            const phase =
                                phaseMap[(step.phase ?? "").toUpperCase()] ?? PHASE_FALLBACK;
                            const alignLeft = index % 2 === 0;

                            return (
                                <li key={index} className="relative">
                                    <FadeUp delay={Math.min(index * 0.05, 0.3)}>
                                        <div
                                            className={`relative flex items-start gap-5 pl-14 lg:pl-0 ${
                                                alignLeft
                                                    ? "lg:pr-[calc(50%+2.75rem)]"
                                                    : "lg:pl-[calc(50%+2.75rem)]"
                                            }`}
                                        >
                                            <span className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-surface text-[11px] font-semibold text-primary shadow-[0_0_0_6px_rgba(0,151,178,0.08)]">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <div className="flex-1 rounded-c bg-surface hairline card-shadow p-6 sm:p-7 transition-colors duration-300 hover:border-primary/40">
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    {step.phase ? (
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${phase.chip}`}
                                                        >
                                                            <span
                                                                className={`mdi mdi-${phase.icon} text-xs`}
                                                            />
                                                            {step.phase}
                                                        </span>
                                                    ) : step.icon ? (
                                                        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-700">
                                                            <span
                                                                className={`mdi mdi-${step.icon} text-xs`}
                                                            />
                                                        </span>
                                                    ) : null}
                                                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface/30">
                                                        Step {String(index + 1).padStart(2, "0")}
                                                    </span>
                                                </div>
                                                <h3 className="mt-4 text-lg sm:text-xl font-medium tracking-tight text-ink leading-snug">
                                                    {step.label}
                                                </h3>
                                                {step.description && (
                                                    <p className="mt-2.5 text-sm leading-relaxed text-on-surface/60 whitespace-pre-line">
                                                        {step.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </FadeUp>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                {(outcome || ctaNote || cta?.href) && (
                    <FadeUp>
                        <div className="relative mt-14 flex flex-col items-center gap-6 text-center">
                            {outcome && (
                                <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-whatsapp/40 bg-whatsapp/10 px-7 py-3.5 text-sm sm:text-base font-medium text-ink/80 text-center">
                                    <span className="mdi mdi-check-decagram text-xl text-whatsapp" />
                                    {outcome}
                                </div>
                            )}

                            {ctaNote && (
                                <p className="max-w-2xl text-sm sm:text-base text-on-surface/60 leading-relaxed">
                                    {ctaNote}
                                </p>
                            )}

                            {cta?.href && (
                                <Link
                                    href={cta.href}
                                    className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:card-shadow-lift"
                                >
                                    <span
                                        className={`mdi mdi-${cta.icon ?? "download"} text-xl text-primary-surface`}
                                    />
                                    {cta.label}
                                    <span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            )}
                        </div>
                    </FadeUp>
                )}
            </div>
        </section>
    );
}

export default WorkflowSection;
