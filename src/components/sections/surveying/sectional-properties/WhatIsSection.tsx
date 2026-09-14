"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp, FadeLeft } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/shared/decor";

interface WhatIsItem {
	icon?: string | null;
	title?: string;
	points?: string[];
	impactsLabel?: string;
	impacts?: string[];
}

interface WhatIsContent {
	tag?: string | null;
	headline?: string;
	description?: string;
	diagramLabel?: string;
	items?: WhatIsItem[];
}

const CARD_ICONS = ["door-open", "elevator", "chart-donut"];
const CARD_NUMBERS = ["01", "02", "03"];

export function WhatIsSection(): ReactElement {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const section = t("surveying/sectional-properties:whatIs", {
		returnObjects: true,
	}) as unknown as WhatIsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (!section?.headline && items.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob
				className="w-[26rem] h-[26rem] bg-primary-100/50 -top-24 -left-32"
				opacity={0.4}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-12 lg:gap-16 items-start">
					<FadeLeft className="lg:sticky lg:top-28">
						<SectionHeader
							tag={section.tag || undefined}
							headline={section.headline ?? ""}
							description={section.description || undefined}
							align="left"
						/>

						{/* <figure className="mt-10 max-w-sm">
							<div className="relative rounded-c pale-panel hairline card-shadow p-6 sm:p-7">
								{section.diagramLabel && (
									<span className="absolute -top-3.5 left-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-surface card-shadow">
										<span className="mdi mdi-domain text-sm text-primary-300" />
										{section.diagramLabel}
									</span>
								)}
								<div className="mt-4 flex items-stretch gap-5">
									<div className="relative w-36 shrink-0 pt-2" aria-hidden>
										<div className="space-y-1.5">
											{[0, 1, 2].map((floor) => (
												<div
													key={floor}
													className={`flex h-9 items-center justify-between rounded-md px-3 ${
														floor === 1
															? "bg-primary text-surface card-shadow"
															: "hairline bg-surface-200/70 text-ink/40"
													}`}
												>
													<span className="mdi mdi-door-open text-base" />
													<span className="mdi mdi-chair-rolling text-sm" />
												</div>
											))}
										</div>
										<div className="mt-1.5 flex h-11 items-center justify-between rounded-md bg-ink px-3 text-surface">
											<span className="mdi mdi-elevator text-base text-primary-300" />
											<span className="mdi mdi-car text-base text-surface/70" />
											<span className="mdi mdi-flower text-base text-surface/70" />
										</div>
										<div className="mx-auto mt-1.5 h-1.5 w-3/4 rounded-full bg-ink-soft/30" />
									</div>
									<div className="flex flex-1 flex-col justify-center gap-4 border-l border-dashed border-primary/30 pl-5">
										<span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-500 hairline">
											<span className="mdi mdi-chart-donut text-2xl" />
										</span>
										<div className="flex flex-col gap-2" aria-hidden>
											{[85, 55, 30].map((pct) => (
												<span
													key={pct}
													className="block h-1.5 rounded-full bg-primary-100"
													style={{ width: `${pct}%` }}
												/>
											))}
										</div>
									</div>
								</div>
								<figcaption className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink/10 pt-4">
									{items.map((item, index) => (
										<span
											key={index}
											className="inline-flex items-center gap-2 text-[11px] font-medium text-ink/60"
										>
											<span
												className={`mdi mdi-${item.icon ?? CARD_ICONS[index % CARD_ICONS.length]} text-sm text-primary`}
											/>
											{item.title}
										</span>
									))}
								</figcaption>
							</div>
						</figure> */}
					</FadeLeft>

					<div className="flex flex-col gap-5">
						{items.map((item, index) => (
							<FadeUp key={index} delay={index * 0.08}>
								<article className="group relative overflow-hidden rounded-c pale-panel hairline card-shadow p-7 sm:p-8 transition-shadow duration-300 hover:card-shadow-lift">
									<span className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary-50 opacity-0 blur-2xl transition-opacity duration-250 group-hover:opacity-100" />
									<div className="relative flex items-start gap-5">
										<span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary hairline transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span
												className={`mdi mdi-${item.icon ?? CARD_ICONS[index % CARD_ICONS.length]} text-2xl`}
											/>
										</span>
										<div>
											<p className="text-[11px] font-semibold tracking-[0.2em] text-primary/60">
												{CARD_NUMBERS[index % CARD_NUMBERS.length]}
											</p>
											<h3 className="mt-1 text-xl font-medium tracking-tight text-ink">
												{item.title}
											</h3>
										</div>
									</div>
									<ul className="relative mt-5 space-y-3">
										{(item.points ?? []).map((point, pIndex) => (
											<li
												key={pIndex}
												className="flex items-start gap-3 text-sm leading-relaxed text-ink/70"
											>
												<span className="mdi mdi-check-circle mt-0.5 text-base text-primary-500" />
												{point}
											</li>
										))}
									</ul>
									{Array.isArray(item.impacts) && item.impacts.length > 0 && (
										<div className="relative mt-6 rounded-xl bg-accent-50/70 hairline p-4 sm:p-5">
											<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-600">
												<span className="mdi mdi-arrow-decision mr-1.5" />
												{item.impactsLabel}
											</p>
											<div className="mt-3 flex flex-wrap gap-2">
												{item.impacts.map((impact, iIndex) => (
													<span
														key={iIndex}
														className="rounded-full bg-paper px-3.5 py-1.5 text-xs font-medium text-ink/75 hairline"
													>
														{impact}
													</span>
												))}
											</div>
										</div>
									)}
								</article>
							</FadeUp>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default WhatIsSection;
