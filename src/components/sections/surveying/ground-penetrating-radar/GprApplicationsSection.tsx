"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface ApplicationItem {
	icon?: string | null;
	title: string;
	points?: string[] | null;
}

interface ApplicationsContent {
	tag?: string | null;
	headline: string;
	items: ApplicationItem[];
}

export function GprApplicationsSection() {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const section = t("surveying/ground-penetrating-radar:applications", {
		returnObjects: true,
	}) as unknown as ApplicationsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section id="applications" className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -bottom-24 -right-24" opacity={0.4} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{items.map((item, index) => {
						const points = Array.isArray(item.points) ? item.points : [];

						return (
							<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
								<article className="group h-full flex flex-col gap-3.5 rounded-[16px] bg-surface hairline card-shadow p-6 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
									<div className="flex items-center justify-between gap-4">
										<span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											{item.icon && <span className={`mdi mdi-${item.icon} text-xl`} />}
										</span>
										<span className="text-sm font-semibold tabular-nums tracking-[0.14em] text-on-surface/25">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>

									<h3 className="text-sm sm:text-[15px] font-semibold tracking-tight text-ink leading-snug">
										{item.title}
									</h3>

									{points.length > 0 && (
										<ul className="flex flex-col gap-2">
											{points.map((point, pointIndex) => (
												<li
													key={pointIndex}
													className="flex items-start gap-2 text-[13px] text-on-surface/60 leading-snug"
												>
													<span className="mdi mdi-circle-small text-primary text-lg shrink-0 -mt-1" />
													{point}
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

export default GprApplicationsSection;
