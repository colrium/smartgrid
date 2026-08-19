"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";

interface WhyChooseItem {
	icon?: string | null;
	title: string;
	description: string;
}

interface WhyChooseSmartGridContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: WhyChooseItem[];
}

export function WhyChooseSmartGridSection() {
	const { t } = useTranslation(["about"]);
	const section = t("about:whyChooseSmartGrid", {
		returnObjects: true,
	}) as unknown as WhyChooseSmartGridContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader
						tag={section.tag ?? undefined}
						headline={section.headline}
						description={section.description || undefined}
						align="center"
					/>
				</FadeUp>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 5) * 0.07}>
							<article className="h-full flex flex-col items-center text-center gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 sm:p-8 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<span className="h-14 w-14 rounded-2xl bg-primary-50 text-primary flex items-center justify-center transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
									{item.icon && (
										<span className={`mdi mdi-${item.icon} text-2xl`} />
									)}
								</span>

								<h3 className="text-base font-semibold tracking-tight text-ink leading-snug">
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

export default WhyChooseSmartGridSection;