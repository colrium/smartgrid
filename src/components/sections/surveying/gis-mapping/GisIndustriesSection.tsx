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
		<section className="py-24 sm:py-28 relative overflow-hidden">
			
			

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
					{items.map((item, index) => {
						const features = Array.isArray(item.features) ? item.features : [];

						return (
							<FadeUp key={index} delay={(index % 2) * 0.08} className="h-full">
								<article className="group relative h-full flex flex-col rounded-c bg-surface hairline card-shadow p-7 sm:p-8 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span className={`mdi mdi-${item.icon || "account-group"} text-2xl`} />
										</span>
										<h3 className="text-lg sm:text-xl font-semibold tracking-tight text-ink leading-snug">
											{item.title}
										</h3>
									</div>

									{features.length > 0 && (
										<ul className="mt-6 flex flex-wrap gap-2.5">
											{features.map((feature, fIndex) => (
												<li
													key={fIndex}
													className="inline-flex items-center gap-2 rounded-full bg-ink-50 px-4 py-2 text-sm font-medium text-ink/80"
												>
													<span
														aria-hidden
														className="mdi mdi-check-circle-outline text-base text-primary"
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