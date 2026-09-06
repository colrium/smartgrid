"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

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

const TONE_SEGMENTS = [
	"bg-primary-800",
	"bg-primary-700",
	"bg-primary-600",
	"bg-primary-500",
	"bg-primary-400",
	"bg-primary-300",
	"bg-primary-200",
];

export function TimelineSection(): ReactElement {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const section = t("surveying/sectional-properties:timeline", {
		returnObjects: true,
	}) as unknown as TimelineContent;
	const stages = Array.isArray(section?.stages) ? section.stages : [];
	const totalDays = stages.reduce((sum, stage) => sum + (stage.days ?? 0), 0) || 1;

	if (!section?.headline && stages.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob
				className="w-[24rem] h-[24rem] bg-accent-50 -bottom-32 -left-32"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline ?? ""}
					description={section.description || undefined}
					align="center"
				/>

				<FadeUp delay={0.1}>
					<div className="mt-14 sm:mt-16">
						{section.barLabel && (
							<p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">
								{section.barLabel}
							</p>
						)}

						<div className="mt-5 flex h-16 sm:h-20 w-full overflow-hidden rounded-2xl hairline card-shadow">
							{stages.map((stage, index) => {
								const light = index >= 5;

								return (
									<div
										key={index}
										title={`${stage.label ?? ""} - ${stage.range ?? ""}`}
										className="group relative flex items-center justify-center border-r border-surface/40 last:border-r-0 transition-[filter] duration-300 hover:brightness-110"
										style={{ width: `${((stage.days ?? 0) / totalDays) * 100}%` }}
									>
										<div className={`absolute inset-0 ${TONE_SEGMENTS[index % TONE_SEGMENTS.length]}`} />
										<span
											className={`relative z-10 px-1 text-center text-[10px] sm:text-xs font-semibold leading-tight ${
												light ? "text-ink" : "text-surface"
											}`}
										>
											{stage.days}
										</span>
									</div>
								);
							})}
						</div>

						<div className="mt-3 flex justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
							<span>{section.startLabel}</span>
							<span>{section.endLabel}</span>
						</div>

						<div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
							{stages.map((stage, index) => (
								<span
									key={index}
									className="inline-flex items-center gap-2 text-xs sm:text-sm text-ink/70"
								>
									<span
										className={`h-2.5 w-2.5 rounded-sm ${TONE_SEGMENTS[index % TONE_SEGMENTS.length]}`}
									/>
									<span className="font-semibold text-ink">{stage.label}</span>
									<span className="text-ink/50">{stage.range}</span>
								</span>
							))}
						</div>

						{section.costNote && (
							<div className="mx-auto mt-10 flex max-w-2xl items-start justify-center gap-3 rounded-2xl pale-panel hairline card-shadow px-6 py-5 text-sm leading-relaxed text-ink/70">
								<span className="mdi mdi-cash-multiple mt-0.5 shrink-0 text-lg text-accent-500" />
								{section.costNote}
							</div>
						)}

						{section.ctaEmail?.href && (
							<div className="mt-9 flex justify-center">
								<Link
									href={section.ctaEmail.href}
									className="group inline-flex items-center gap-3 h-14 rounded-full bg-ink px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:card-shadow-lift"
								>
									<span className="mdi mdi-email-fast-outline text-xl text-primary-300" />
									{section.ctaEmail.label}
								</Link>
							</div>
						)}
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default TimelineSection;
