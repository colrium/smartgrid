"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "./SectionHeader";
import { Blob } from "./decor";

interface IndustryItem {
	icon?: string | null;
	label: string;
}

interface IndustriesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: IndustryItem[];
}

export function IndustriesWeServeSection() {
	const { t } = useTranslation(["home"]);
	const section = t("home:industriesWeServe", {
		returnObjects: true,
	}) as unknown as IndustriesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-20 sm:py-24 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={index * 0.07} className="h-full">
							<article className="group h-full flex flex-col gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
									{item.icon && <span className={`mdi mdi-${item.icon} text-2xl`} />}
								</span>

								<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
									{item.label}
								</h3>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default IndustriesWeServeSection;