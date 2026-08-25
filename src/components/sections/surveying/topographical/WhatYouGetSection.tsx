"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface WhatYouGetContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: string[];
}

export function WhatYouGetSection() {
	const { t } = useTranslation(["topographical-surveys"]);
	const section = t("topographical-surveys:whatYouGet", {
		returnObjects: true,
	}) as unknown as WhatYouGetContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-20 sm:py-24 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<article className="group flex items-center gap-4 rounded-[16px] bg-surface hairline card-shadow px-5 py-5 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
									<span className="mdi mdi-package-variant-closed-check text-xl" />
								</span>
								<p className="text-sm font-medium text-ink leading-snug">{item}</p>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default WhatYouGetSection;
