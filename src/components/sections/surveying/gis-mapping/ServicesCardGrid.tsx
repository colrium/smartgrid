"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob, ParallaxDecor } from "@/components/sections/home/decor";

interface ServiceItem {
	image?: string | null;
	title: string;
	description: string;
}

interface ServicesGridContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: ServiceItem[];
}

interface ServicesCardGridProps {
	sectionKey: string;
	columns?: 3 | 4;
	tone?: "default" | "surface";
}

export function ServicesCardGrid({
	sectionKey,
	columns = 4,
	tone = "default",
}: ServicesCardGridProps) {
	const { t } = useTranslation(["gis-mapping"]);
	const section = t(`gis-mapping:${sectionKey}`, {
		returnObjects: true,
	}) as unknown as ServicesGridContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section
			className={`py-24 sm:py-28 relative overflow-hidden ${
				tone === "surface" ? "bg-surface" : ""
			}`}
		>
			<Blob className="w-[28rem] h-[28rem] bg-brand-200/40 -top-24 -right-24" opacity={0.5} />
			<ParallaxDecor speed={-0.06} className="absolute bottom-16 -left-24 z-0">
				<Blob className="w-72 h-72 bg-brand-100/80" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				<div
					className={`mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 ${
						columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
					}`}
				>
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % columns) * 0.06}>
							<article className="group relative h-full flex flex-col overflow-hidden rounded-[20px] bg-surface hairline card-shadow transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								{item.image && (
									<div className="relative h-56 overflow-hidden bg-slate-900">
										<Image
											src={item.image}
											alt={item.title}
											fill
											sizes={
												columns === 3
													? "(min-width: 1024px) 33vw, 100vw"
													: "(min-width: 1024px) 25vw, 100vw"
											}
											className="object-fill object-center transition-transform duration-700 ease-out group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
									</div>
								)}

								<div className="flex flex-col flex-1 p-6">
									<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
										{item.title}
									</h3>
									<p className="mt-3 flex-1 text-sm text-on-surface/60 leading-relaxed">
										{item.description}
									</p>
								</div>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default ServicesCardGrid;