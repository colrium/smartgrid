"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "./SectionHeader";
import { FadeUp } from "@/components/animations/Fade";

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
			<div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

			<div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={t("home:whyChooseUs.tag") as string}
					headline={t("home:whyChooseUs.headline") as string}
					description={t("home:whyChooseUs.description") as string}
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
					{Array.isArray(items) &&
						items.map((item, index) => (
							<FadeUp key={index} delay={(index % 3) * 0.1}>
								<div className="group h-full relative rounded-3xl bg-surface border border-slate-200/70 shadow-sm hover:shadow-lg hover:border-primary/40 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1">
									<div className="flex items-start justify-between mb-5">
										<span className="w-13 h-13 p-3.5 rounded-2xl bg-brand-100 text-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
											<span
												className={`mdi mdi-${item.icon || FALLBACK_ICONS[index % FALLBACK_ICONS.length]} text-2xl`}
											/>
										</span>
										<span className="text-4xl font-display font-light text-primary/15 group-hover:text-primary/25 transition-colors duration-300">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>

									<span className="text-[11px] font-mono uppercase tracking-[0.18em] text-primary font-semibold">
										{item.name}
									</span>
									<h3 className="text-lg sm:text-xl font-bold text-on-surface leading-snug mt-2 mb-3">
										{item.label}
									</h3>
									<p className="text-sm sm:text-base text-on-surface/70 leading-relaxed">
										{item.description}
									</p>
								</div>
							</FadeUp>
						))}
				</div>
			</div>
		</section>
	);
}

export default WhyChooseUsSection;