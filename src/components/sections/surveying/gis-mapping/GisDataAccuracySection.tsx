"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/shared/decor";

interface AccuracyLevel {
	icon?: string | null;
	label: string;
	accuracy: string;
}

interface DataAccuracyContent {
	tag?: string | null;
	headline: string;
	ensureTitle?: string | null;
	factors?: string[] | null;
	levelsTitle?: string | null;
	levels?: AccuracyLevel[] | null;
}

export interface GisDataAccuracyData {
	tag?: string | null;
	headline: string;
	ensureTitle?: string | null;
	factors?: string[] | null;
	levelsTitle?: string | null;
	levels?: AccuracyLevel[] | null;
}

export function GisDataAccuracySection({ data, id }: { data?: GisDataAccuracyData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `gisDataAccuracy`
	// unique section); legacy locale strings otherwise.
	const section = (data ??
		(t("surveying/gis-mapping:dataAccuracy", {
			returnObjects: true,
		}) as unknown as DataAccuracyContent)) as DataAccuracyContent;
	const factors = Array.isArray(section?.factors) ? section.factors : [];
	const levels = Array.isArray(section?.levels) ? section.levels : [];

	if (factors.length === 0 && levels.length === 0) return <></>;

	return (
		<section id={id} className="py-24 sm:py-28 relative overflow-hidden ">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Quality control measures */}
					<FadeUp className="h-full">
						<article className="relative overflow-hidden h-full flex flex-col rounded-c bg-paper hairline card-shadow p-7 sm:p-8">
							<span
								aria-hidden
								className="pointer-events-none absolute -right-4 -bottom-10 select-none text-[9rem] leading-none text-primary/5 mdi mdi-checkbox-multiple-marked-outline"
							/>
							{section.ensureTitle && (
								<h3 className="text-lg sm:text-xl font-semibold tracking-tight text-ink leading-snug">
									{section.ensureTitle}
								</h3>
							)}
							<ul className="mt-6 space-y-4">
								{factors.map((factor, index) => (
									<li key={index} className="flex items-start gap-3">
										<span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
											<span className="mdi mdi-checkbox-marked-circle-outline text-sm" />
										</span>
										<span className="text-base text-on-surface/70 leading-relaxed">
											{factor}
										</span>
									</li>
								))}
							</ul>
						</article>
					</FadeUp>

					{/* Typical accuracy levels */}
					<FadeUp delay={0.1} className="h-full">
						<article className="relative overflow-hidden h-full flex flex-col rounded-c bg-paper hairline card-shadow p-7 sm:p-8">
							<span
								aria-hidden
								className="pointer-events-none absolute -right-4 -bottom-10 select-none text-[9rem] leading-none text-primary/5 mdi mdi-crosshairs-gps"
							/>
							{section.levelsTitle && (
								<h3 className="text-lg sm:text-xl font-semibold tracking-tight text-ink leading-snug">
									{section.levelsTitle}
								</h3>
							)}
							<div className="mt-6 space-y-5">
								{levels.map((level, index) => (
									<div
										key={index}
										className="group relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-xl bg-ink-50/50 transition-all duration-300 hover:bg-ink-50"
									>
										<div className="flex items-center gap-3">
											<span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
												<span className={`mdi mdi-${level.icon || "crosshairs-gps"} text-lg`} />
											</span>
											<div>
												<p className="text-base font-medium text-ink">{level.label}</p>
												<p className="text-sm text-ink-400">{level.accuracy}</p>
											</div>
										</div>
										{/* <span
											aria-hidden
											className="mdi mdi-arrow-right text-primary group-hover:translate-x-1 transition-transform"
										/> */}
									</div>
								))}
							</div>
						</article>
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default GisDataAccuracySection;