"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface ExploreItem {
	image?: string | null;
	title: string;
}

interface ExploreMoreContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: ExploreItem[];
}

export function ExploreMoreSection() {
	const { t } = useTranslation(["civil-site-engineering"]);
	const section = t("civil-site-engineering:exploreMore", {
		returnObjects: true,
	}) as unknown as ExploreMoreContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					{section.tag && <SectionTag>{section.tag}</SectionTag>}

					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-ink max-w-3xl">
						{section.headline}
					</h2>
				</FadeUp>

				<div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<article className="group relative h-64 sm:h-72 rounded-[20px] overflow-hidden card-shadow hairline">
								{item.image && (
									<Image
										src={item.image}
										alt={item.title}
										fill
										sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
										className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
									/>
								)}

								<div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />

								<div className="absolute inset-x-0 bottom-0 p-6">
									<h3 className="text-lg sm:text-xl font-medium tracking-tight text-surface">
										{item.title}
									</h3>
								</div>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default ExploreMoreSection;