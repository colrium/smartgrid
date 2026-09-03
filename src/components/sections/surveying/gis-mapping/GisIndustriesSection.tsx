"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";

interface IndustryItem {
	icon?: string | null;
	title: string;
	features?: string[] | null;
}

interface IndustriesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: IndustryItem[] | null;
}

export function GisIndustriesSection(): ReactElement {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t("surveying/gis-mapping:industries", {
		returnObjects: true,
	}) as unknown as IndustriesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section className="relative overflow-hidden ink-panel py-24 sm:py-28">
			<span
				aria-hidden
				className="pointer-events-none absolute -bottom-20 -right-12 select-none font-light leading-none text-[18rem] text-surface/5 mdi mdi-earth"
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					tone="dark"
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
					{items.map((item, index) => {
						const features = Array.isArray(item.features) ? item.features : [];

						return (
							<FadeUp key={index} delay={(index % 2) * 0.08} className="h-full">
								<article className="group relative h-full flex flex-col rounded-[20px] bg-surface/[0.05] hairline-dark p-7 sm:p-8 transition-all duration-500 hover:bg-surface/10 hover:border-primary-300/50">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-200 transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span className={`mdi mdi-${item.icon || "account-group"} text-2xl`} />
										</span>
										<h3 className="text-lg sm:text-xl font-semibold tracking-tight text-surface leading-snug">
											{item.title}
										</h3>
									</div>

									{features.length > 0 && (
										<ul className="mt-6 flex flex-col gap-3">
											{features.map((feature, fIndex) => (
												<li
													key={fIndex}
													className="flex items-start gap-3 rounded-xl bg-surface/[0.04] hairline-dark px-4 py-3 text-sm leading-snug text-surface/80"
												>
													<span
														aria-hidden
														className="mdi mdi-check-circle-outline text-base text-primary-300 shrink-0 mt-0.5"
													/>
													{feature}
												</li>
											))}
										</ul>
									)}
								</article>
							</FadeUp>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default GisIndustriesSection;