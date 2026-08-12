"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface ExploreItem {
	title: string;
	image?: string | null;
}

interface ExploreContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: ExploreItem[];
}

export function ExploreMoreSection() {
	const { t } = useTranslation(["building-site-surveys"]);
	const section = t("building-site-surveys:exploreMore", {
		returnObjects: true,
	}) as unknown as ExploreContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-brand-100/70 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.08}>
							<article className="group relative h-64 sm:h-72 overflow-hidden rounded-2xl hairline bg-surface card-shadow transition-all duration-500 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-primary">
								{item.image && (
									<Image
										src={item.image}
										alt={item.title}
										fill
										sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
										className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
									/>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

								<div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3">
									<h3 className="text-xl sm:text-2xl font-light tracking-tight text-white leading-none">
										{item.title}
									</h3>
									<span className="h-10 w-10 shrink-0 rounded-full glass flex items-center justify-center text-ink">
										<span className="mdi mdi-arrow-right text-lg transition-transform duration-300 group-hover:translate-x-0.5" />
									</span>
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