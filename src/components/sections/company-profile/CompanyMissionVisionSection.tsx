"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface ValueItem {
	icon?: string | null;
	title: string;
	description?: string;
}

interface MissionVisionContent {
	tag?: string | null;
	headline: string;
	items: ValueItem[];
}

export function CompanyMissionVisionSection() {
	const { t } = useTranslation(["company-profile"]);
	const section = t("company-profile:missionVision", {
		returnObjects: true,
	}) as unknown as MissionVisionContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={index * 0.07} className="h-full">
							<article className="group h-full flex flex-col gap-4 rounded-c bg-surface hairline card-shadow p-8 text-center transition-all duration-250 hover:card-shadow-lift hover:border-primary">
								<span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
									{item.icon && <span className={`mdi mdi-${item.icon} text-3xl`} />}
								</span>

								<h3 className="text-lg font-semibold tracking-tight text-ink">
									{item.title}
								</h3>

								{item.description && (
									<p className="flex-1 text-sm text-on-surface/60 leading-relaxed">
										{item.description}
									</p>
								)}
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default CompanyMissionVisionSection;
