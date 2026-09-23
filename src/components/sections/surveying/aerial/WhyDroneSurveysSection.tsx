"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob, ParallaxDecor } from "@/components/sections/shared/decor";

interface WhyItem {
	icon?: string | null;
	stat?: string | null;
	title: string;
	description?: string;
}

interface WhyDroneSurveysContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: WhyItem[];
}

export interface AerialWhyDronesData {
	tag?: string | null;
	headline: string;
	description?: string;
	items: WhyItem[];
}

const FALLBACK_ICONS = ["speedometer", "cash-multiple", "crosshairs-gps", "file-cad", "drone"];

export function WhyDroneSurveysSection({ data, id }: { data?: AerialWhyDronesData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `aerialWhyDrones`
	// unique section); legacy locale strings otherwise.
	const section = (data ??
		(t("surveying/aerial-surveys:whyDroneSurveys", {
			returnObjects: true,
		}) as unknown as WhyDroneSurveysContent)) as WhyDroneSurveysContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section id={id} className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />
			<ParallaxDecor speed={-0.06} className="absolute top-24 -left-20 z-0">
				<Blob className="w-64 h-64 bg-primary-50" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 sm:gap-6">
					{items.map((item, index) => {
						const isFirst = index === 0;
						const wide = index >= 3;

						return (
							<FadeUp
								key={index}
								delay={(index % 3) * 0.07}
								className={`h-full ${wide ? "lg:col-span-3" : "lg:col-span-2"}`}
							>
								<article
									className={`group relative h-full flex flex-col rounded-c bg-surface hairline card-shadow p-7 sm:p-8 transition-all duration-250 hover:card-shadow-lift hover:border-primary ${
										isFirst ? "sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary-50/80 to-surface" : ""
									}`}
								>
									<div className="flex items-start justify-between gap-4">
										<span
											className={`inline-flex items-center justify-center rounded-xl transition-colors duration-300 ${
												isFirst
													? "h-12 w-12 bg-primary text-surface"
													: "h-11 w-11 bg-primary-50 text-primary group-hover:bg-primary group-hover:text-surface"
											}`}
										>
											<span
												className={`mdi mdi-${
													item.icon || FALLBACK_ICONS[index % FALLBACK_ICONS.length]
												} ${isFirst ? "text-2xl" : "text-xl"}`}
											/>
										</span>
										{item.stat && (
											<span className="text-5xl sm:text-6xl font-light tracking-tighter leading-none text-primary/90">
												{item.stat}
											</span>
										)}
									</div>

									<h3
										className={`mt-6 font-medium tracking-tight text-ink leading-snug ${
											isFirst ? "text-xl sm:text-2xl" : "text-lg"
										}`}
									>
										{item.title}
									</h3>
									{item.description && (
										<p className="mt-3 text-sm text-on-surface/60 leading-relaxed">
											{item.description}
										</p>
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

export default WhyDroneSurveysSection;