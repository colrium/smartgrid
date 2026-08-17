"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface ServiceItem {
	icon?: string;
	title: string;
	description: string;
}

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: ServiceItem[];
}

export function QuarryServicesItemsSection() {
	const { t } = useTranslation(["landfill-quarry-drone-surveys"]);
	const section = t("landfill-quarry-drone-surveys:quarryServicesItems", {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-brand-200/40 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<article className="group relative h-full flex flex-col items-center gap-4 rounded-[20px] bg-surface hairline card-shadow p-8 text-center transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								{item.icon && (
									<span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${item.icon} text-2xl`} />
									</span>
								)}

								<h3 className="text-lg sm:text-xl font-medium tracking-tight text-ink leading-snug">
									{item.title}
								</h3>
								<p className="flex-1 text-sm text-on-surface/60 leading-relaxed">
									{item.description}
								</p>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default QuarryServicesItemsSection;