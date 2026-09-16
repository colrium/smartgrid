"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "../shared/SectionHeader";
import { FadeUp } from "@/components/animations/Fade";

interface WhyChooseUsItem {
	icon?: string | null;
	name: string;
	label: string;
	description: string;
}

export function WhyChooseUsSection() {
	const { t } = useTranslation(["common", "home"]);
	const items = t("common:whyChooseUs.items", {
		returnObjects: true,
	}) as unknown as WhyChooseUsItem[];

	return (
		<section id="why-choose-us" className="py-24 sm:py-28 relative overflow-hidden ">
			

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
					{/* Sticky manifesto header */}
					<FadeUp className="lg:col-span-4 lg:sticky lg:top-28 self-start">
						<SectionHeader
							tag={t("common:whyChooseUs.tag") as string}
							headline={t("common:whyChooseUs.headline") as string}
							description={t("common:whyChooseUs.description") as string}
						/>
					</FadeUp>

					{/* Editorial list */}
					<div className="lg:col-span-8 rounded-c bg-surface hairline card-shadow py-8">
						{Array.isArray(items) &&
							items.map((item, index) => (
								<FadeUp key={index} delay={index * 0.05}>
									<div className="group  py-7 sm:py-8 flex items-start gap-6 sm:gap-8 transition-colors duration-300 hover:bg-surface/60 px-1 sm:px-9 ">
										<span className="pt-1 text-sm font-semibold tabular-nums tracking-[0.14em] text-primary">
											{String(index + 1).padStart(2, "0")}
										</span>

										<div className="flex-1 min-w-0">
											<span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface/45">
												{/*item.icon && (
													<span className={`mdi mdi-${item.icon} text-sm text-primary`} />
												)*/}
												{item.name}
											</span>
											<h3 className="mt-2 text-xl sm:text-2xl font-medium tracking-tight text-ink leading-snug transition-colors duration-300 group-hover:text-primary">
												{item.label}
											</h3>
											<p className="mt-3 text-sm sm:text-[15px] text-on-surface/60 leading-relaxed">
												{item.description}
											</p>
										</div>
									</div>
								</FadeUp>
							))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default WhyChooseUsSection;