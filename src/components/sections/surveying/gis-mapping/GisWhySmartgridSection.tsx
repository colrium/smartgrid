"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";

interface WhyItem {
	icon?: string | null;
	title: string;
}

interface WhySmartgridContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: WhyItem[] | null;
}

export function GisWhySmartgridSection(): ReactElement {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t("surveying/gis-mapping:whySmartgrid", {
		returnObjects: true,
	}) as unknown as WhySmartgridContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
							<article className="group relative h-full flex items-center gap-5 rounded-c bg-paper hairline card-shadow p-6 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<span className="inline-flex h-13 w-13 min-h-[3.25rem] min-w-[3.25rem] items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
									<span className={`mdi mdi-${item.icon || "check-decagram"} text-2xl`} />
								</span>
								<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
									{item.title}
								</h3>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default GisWhySmartgridSection;