"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface OfferItem {
	label?: string;
	title?: string;
	image?: string | null;
}

interface WhatWeOfferContent {
	tag?: string | null;
	headline: string;
	description?: string;
	images?: string[];
	items: OfferItem[];
}

export function WhatWeOfferSection() {
	const { t } = useTranslation(["monitoring-and-evaluation"]);
	const section = t("monitoring-and-evaluation:whatWeOffer", {
		returnObjects: true,
	}) as unknown as WhatWeOfferContent;
	const items = Array.isArray(section.items) ? section.items : [];
	const leadImages = Array.isArray(section.images) ? section.images : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description || undefined}
				/>

				{leadImages.length > 0 && (
					<FadeUp>
						<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
							{leadImages.map((src, index) => (
								<div
									key={index}
									className="relative h-64 sm:h-80 rounded-[20px] overflow-hidden hairline"
								>
									<Image
										src={src}
										alt=""
										fill
										sizes="(min-width: 640px) 50vw, 100vw"
										className="object-cover object-center transition-transform duration-700 hover:scale-105"
									/>
								</div>
							))}
						</div>
					</FadeUp>
				)}

				<div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.06}>
							<article className="group relative flex flex-col rounded-[20px] overflow-hidden bg-surface hairline card-shadow transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								{item.image && (
									<div className="relative h-40 overflow-hidden">
										<Image
											src={item.image}
											alt={item.title || item.label || ""}
											fill
											sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
											className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
										/>
									</div>
								)}

								<div className="p-5">
									<h3 className="text-sm sm:text-base font-medium tracking-tight text-ink leading-snug">
										{item.title || item.label}
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

export default WhatWeOfferSection;