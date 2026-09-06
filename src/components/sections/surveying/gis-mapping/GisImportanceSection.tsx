"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface ImportanceItem {
	icon?: string | null;
	title: string;
	features?: string[] | null;
}

interface WhyGisCriticalContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: ImportanceItem[] | null;
}

export function GisImportanceSection(): ReactElement {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t("surveying/gis-mapping:whyGisCritical", {
		returnObjects: true,
	}) as unknown as WhyGisCriticalContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => {
						const features = Array.isArray(item.features) ? item.features : [];

						return (
							<FadeUp key={index} delay={(index % 4) * 0.07} className="h-full">
								<article className="group relative h-full flex flex-col rounded-c bg-paper hairline card-shadow p-6 sm:p-7 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
									<span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${item.icon || "map-marker-radius"} text-2xl`} />
									</span>

									<h3 className="mt-5 text-lg font-semibold tracking-tight text-ink leading-snug">
										{item.title}
									</h3>

									{features.length > 0 && (
										<ul className="mt-4 flex flex-col gap-2.5">
											{features.map((feature, fIndex) => (
												<li
													key={fIndex}
													className="flex items-start gap-2.5 text-sm text-on-surface/60 leading-snug"
												>
													<span
														aria-hidden
														className="mdi mdi-chevron-right text-base text-primary shrink-0 mt-0.5"
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

export default GisImportanceSection;