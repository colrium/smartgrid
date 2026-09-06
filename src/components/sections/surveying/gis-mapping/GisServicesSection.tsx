"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";

interface ServiceItem {
	icon?: string | null;
	title: string;
	features?: string[] | null;
}

interface GisServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: ServiceItem[] | null;
}

export function GisServicesSection(): ReactElement {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t("surveying/gis-mapping:gisServices", {
		returnObjects: true,
	}) as unknown as GisServicesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section id="gis-services" className="scroll-mt-36 py-24 sm:py-28 relative overflow-hidden">
			

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => {
						const features = Array.isArray(item.features) ? item.features : [];

						return (
							<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
								<article
									className={`group relative h-full flex flex-col rounded-c bg-surface hairline card-shadow p-7 transition-all duration-250 hover:card-shadow-lift hover:border-primary ${
										items.length % 2 !== 0 && index === items.length - 1
											? "sm:col-span-2 lg:col-span-1"
											: ""
									}`}
								>
									<div className="flex items-center justify-between gap-4">
										<span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span className={`mdi mdi-${item.icon || "layers-outline"} text-2xl`} />
										</span>
										<span
											aria-hidden
											className="text-4xl font-light leading-none tracking-tighter text-primary/15 transition-colors duration-250 group-hover:text-primary/40"
										>
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>

									<h3 className="mt-6 text-lg font-semibold tracking-tight text-ink leading-snug">
										{item.title}
									</h3>

									{features.length > 0 && (
										<ul className="mt-4 flex flex-col gap-2.5">
											{features.map((feature, fIndex) => (
												<li
													key={fIndex}
													className="flex items-start gap-2.5 rounded-lg bg-ink-50/30 px-3 py-2 text-sm leading-snug text-ink-500"
												>
													<span
														aria-hidden
														className="mdi mdi-check-bold text-sm text-primary shrink-0 mt-0.5"
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

export default GisServicesSection;