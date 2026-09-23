"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";

interface SueLevel {
	icon?: string | null;
	level: string;
	title: string;
	description?: string;
}

interface SueContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	levels: SueLevel[];
	note?: string | null;
}

export interface GprSueData {
	tag?: string | null;
	headline: string;
	description?: string | null;
	levels: SueLevel[];
	note?: string | null;
}

export function GprSueComplianceSection({ data, id }: { data?: GprSueData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	// Keystatic-owned content when `data` is provided (M11 `gprSue` unique
	// section); legacy locale strings otherwise. The positional A–D letter
	// watermark stays in the renderer.
	const section = (data ??
		(t("surveying/ground-penetrating-radar:sue", {
			returnObjects: true,
		}) as unknown as SueContent)) as SueContent;
	const levels = Array.isArray(section?.levels) ? section.levels : [];

	if (levels.length === 0) return <></>;

	return (
		<section id={id ?? "sue"} className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
					{levels.map((level, index) => (
						<FadeUp key={index} delay={index * 0.07} className="h-full">
							<article className="group relative h-full flex flex-col rounded-c bg-surface hairline card-shadow p-7 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
								<div className="flex items-center justify-between gap-4">
									<span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${level.icon || "layers-outline"} text-xl`} />
									</span>
									<span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
										{level.level}
									</span>
								</div>

								<h3 className="mt-6 text-base font-semibold tracking-tight text-ink leading-snug">
									{level.title}
								</h3>

								{level.description && (
									<p className="mt-3 text-[13px] text-on-surface/60 leading-relaxed">
										{level.description}
									</p>
								)}

								<span
									aria-hidden
									className="mt-auto pt-5 text-2xl font-light tracking-tighter text-primary/15 tabular-nums"
								>
									{String.fromCharCode(65 + index)}
								</span>
							</article>
						</FadeUp>
					))}
				</div>

				{section.note && (
					<FadeUp delay={0.15}>
						<div className="mt-10 mx-auto flex max-w-2xl items-start justify-center gap-3 rounded-2xl pale-panel hairline card-shadow px-6 py-5 text-sm leading-relaxed text-ink/70 text-center">
							<span className="mdi mdi-check-decagram mt-0.5 shrink-0 text-lg text-primary" />
							{section.note}
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default GprSueComplianceSection;
