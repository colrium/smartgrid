"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "./SectionHeader";
import { FadeUp } from "@/components/animations/Fade";
import { ParallaxDecor, Blob } from "./decor";

interface WhyChooseUsItem {
	icon?: string | null;
	name: string;
	label: string;
	description: string;
}

const FALLBACK_ICONS = [
	"account-tie",
	"access-point",
	"briefcase-check",
	"shield-check",
	"emoticon-happy",
	"trophy",
];

export function WhyChooseUsSection() {
	const { t } = useTranslation(["home"]);
	const items = t("home:whyChooseUs.items", {
		returnObjects: true,
	}) as unknown as WhyChooseUsItem[];

	return (
		<section id="why-choose-us" className="py-24 sm:py-28 relative overflow-hidden">
			{/* Soft institutional background shapes */}
			<Blob className="w-[26rem] h-[26rem] bg-brand-200/40 -top-20 right-0" opacity={0.5} />
			<ParallaxDecor speed={-0.06} className="absolute bottom-24 -left-20 z-0">
				<Blob className="w-80 h-80 bg-brand-100/80" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
					{/* Sticky manifesto header */}
					<FadeUp className="lg:col-span-5 lg:sticky lg:top-28 self-start">
						<SectionHeader
							tag={t("home:whyChooseUs.tag") as string}
							headline={t("home:whyChooseUs.headline") as string}
							description={t("home:whyChooseUs.description") as string}
						/>
						<div className="mt-10 inline-flex items-center gap-4">
							<span className="h-[1px] w-12 bg-primary/60" />
							<span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface/40">
								{String(1).padStart(2, "0")} —{" "}
								{String(Array.isArray(items) ? items.length : 0).padStart(2, "0")}
							</span>
						</div>
					</FadeUp>

					{/* Editorial list */}
					<div className="lg:col-span-7">
						{Array.isArray(items) &&
							items.map((item, index) => (
								<FadeUp key={index} delay={index * 0.05}>
									<div className="group border-t border-ink/10 py-7 sm:py-8 flex items-start gap-6 sm:gap-8 transition-colors duration-300 hover:bg-surface/60 px-1 sm:px-3 -mx-1 sm:-mx-3">
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

										<span className="mdi mdi-arrow-right mt-1.5 text-xl text-on-surface/25 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary" />
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