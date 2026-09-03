"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";

interface WhatIsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	image?: string | null;
}

export function WhatIsTopographicalSection() {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	const section = t("surveying/topographical-surveys:whatIs", {
		returnObjects: true,
	}) as unknown as WhatIsContent;
	const hasImage = typeof section.image === "string" && section.image.startsWith("/");

	return (
		<section className="py-20 sm:py-24 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/50 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
				<FadeLeft className="lg:col-span-7">
					<div className="flex flex-col gap-6">
						<SectionTag className="justify-start">{section.tag}</SectionTag>

						<h2 className="text-3xl sm:text-4xl font-light tracking-tight leading-[1.1] text-ink max-w-xl">
							{section.headline}
						</h2>

						{section.description && (
							<p className="text-base sm:text-lg text-on-surface/60 leading-relaxed max-w-2xl">
								{section.description}
							</p>
						)}
					</div>
				</FadeLeft>

				<FadeRight delay={0.08} className="lg:col-span-5">
					{hasImage && (
						<div className="relative rounded-c overflow-hidden bg-surface hairline card-shadow">
							<div className="relative aspect-[4/3]">
								<Image
									src={section.image as string}
									alt={section.headline}
									fill
									sizes="(min-width: 1024px) 40vw, 100vw"
									className="object-cover object-center"
								/>
							</div>
						</div>
					)}
				</FadeRight>
			</div>
		</section>
	);
}

export default WhatIsTopographicalSection;
