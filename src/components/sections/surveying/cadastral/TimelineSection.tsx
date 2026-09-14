"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/shared/decor";

interface TimelineItem {
	icon?: string | null;
	title: string;
	range?: string;
	minDays?: number | null;
	maxDays?: number | null;
	description?: string;
}

interface TimelineContent {
	tag?: string | null;
	headline: string;
	description?: string;
	scaleNote?: string | null;
	items?: TimelineItem[] | null;
	note?: string | null;
	cta?: { label?: string; href?: string; icon?: string | null } | null;
}

/** Widest duration in the dataset - used to scale the range bars. */
const MAX_SCALE_DAYS = 42;

export function TimelineSection(): ReactElement {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
	const section = t("surveying/cadastral-surveys:timeline", {
		returnObjects: true,
	}) as unknown as TimelineContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[24rem] h-[24rem] bg-accent-50 -bottom-32 -left-32" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-16 max-w-4xl mx-auto space-y-5">
					{items.map((item, index) => {
						const hasRange = typeof item.maxDays === "number" && item.maxDays > 0;
						const width = hasRange
							? `${Math.min(100, ((item.maxDays as number) / MAX_SCALE_DAYS) * 100)}%`
							: "100%";

						return (
							<FadeUp key={index} delay={index * 0.07}>
								<article className="rounded-c bg-surface hairline card-shadow p-6 sm:p-8 transition-all duration-250 hover:card-shadow-lift">
									<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
										<div className="flex items-start gap-4 sm:flex-1 sm:min-w-0">
											<span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
												<span className={`mdi mdi-${item.icon || "clock-outline"} text-xl`} />
											</span>
											<div className="min-w-0">
												<h3 className="text-base font-semibold tracking-tight text-ink leading-snug">
													{item.title}
												</h3>
												{item.description && (
													<p className="mt-1.5 text-sm text-on-surface/60 leading-relaxed">
														{item.description}
													</p>
												)}
											</div>
										</div>

										<div className="sm:w-56 sm:shrink-0">
											{item.range && (
												<span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold text-ink">
													<span className="mdi mdi-timer-sand text-sm text-accent-500" />
													{item.range}
												</span>
											)}
											<div
												className="relative mt-3 h-2.5 w-full rounded-full bg-ink/10 overflow-hidden"
												role="presentation"
											>
												{hasRange ? (
													<span
														className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-300 to-primary"
														style={{ width }}
													/>
												) : (
													<span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-100 via-primary-300 to-primary-100 animate-pulse" />
												)}
												{hasRange && typeof item.minDays === "number" && (
													<span
														className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-ink/80"
														style={{
															left: `${Math.min(100, (item.minDays / MAX_SCALE_DAYS) * 100)}%`,
														}}
													/>
												)}
											</div>
										</div>
									</div>
								</article>
							</FadeUp>
						);
					})}

					{section.scaleNote && (
						<p className="text-center text-[11px] uppercase tracking-[0.18em] text-ink/40 pt-1">
							{section.scaleNote}
						</p>
					)}

					{section.note && (
						<div className="flex items-start justify-center gap-3 rounded-2xl pale-panel hairline card-shadow px-6 py-5 text-sm leading-relaxed text-ink/70">
							<span className="mdi mdi-information-outline mt-0.5 shrink-0 text-lg text-accent-500" />
							{section.note}
						</div>
					)}

					{section.cta?.href && (
						<div className="flex justify-center pt-3">
							<Link
								href={section.cta.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-whatsapp px-8 text-surface font-medium text-base shadow-md shadow-whatsapp/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-whatsapp/30"
							>
								<span className={`mdi mdi-${section.cta.icon ?? "whatsapp"} text-xl text-ink`} />
								{section.cta.label}
								<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1 text-ink" />
							</Link>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

export default TimelineSection;