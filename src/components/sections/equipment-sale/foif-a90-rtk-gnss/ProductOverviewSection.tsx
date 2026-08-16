"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";

interface ProductOverviewContent {
	tag?: string | null;
	headline: string;
	description?: string;
	images?: string[] | null;
}

export function ProductOverviewSection() {
	const { t } = useTranslation(["foif-a90-rtk-gnss"]);
	const section = t("foif-a90-rtk-gnss:productOverview", {
		returnObjects: true,
	}) as unknown as ProductOverviewContent;
	const images = Array.isArray(section.images) ? section.images : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-brand-200/40 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="max-w-3xl">
					<FadeUp>
						{section.tag && <SectionTag>{section.tag}</SectionTag>}

						<h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-ink max-w-2xl">
							{section.headline}
						</h2>

						{section.description && (
							<p className="mt-8 text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
								{section.description}
							</p>
						)}
					</FadeUp>
				</div>

				<div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
					{images.map((image, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<div className="group relative aspect-square rounded-[20px] bg-surface hairline card-shadow p-6 sm:p-8 transition-all duration-500 hover:card-shadow-lift">
								<div className="relative h-full w-full rounded-[15px] overflow-hidden bg-brand-50/60">
									<Image
										src={image}
										alt={`${section.headline} ${index + 1}`}
										fill
										sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
										className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
									/>
								</div>
							</div>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default ProductOverviewSection;