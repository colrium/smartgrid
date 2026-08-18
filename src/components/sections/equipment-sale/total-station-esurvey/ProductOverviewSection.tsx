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
	image?: string | null;
}

export function ProductOverviewSection() {
	const { t } = useTranslation(["total-station-esurvey"]);
	const section = t("total-station-esurvey:productOverview", {
		returnObjects: true,
	}) as unknown as ProductOverviewContent;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-6">
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

					<FadeUp delay={0.1} className="lg:col-span-6">
						{section.image && (
							<div className="relative mx-auto max-w-md lg:max-w-none">
								<div className="absolute inset-6 bg-primary/15 rounded-full blur-3xl" />

								<div className="relative bg-surface p-6 sm:p-8 rounded-[20px] hairline card-shadow">
									<div className="relative aspect-square rounded-[15px] overflow-hidden bg-primary-50/60">
										<Image
											src={section.image}
											alt={section.headline}
											fill
											sizes="(min-width: 1024px) 50vw, 100vw"
											className="object-contain object-center"
										/>
									</div>
								</div>
							</div>
						)}
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default ProductOverviewSection;