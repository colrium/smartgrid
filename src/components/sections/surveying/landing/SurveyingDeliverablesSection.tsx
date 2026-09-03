"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface DeliverablesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	images?: string[] | null;
	list?: string[] | null;
}

export function SurveyingDeliverablesSection() {
	const { t } = useTranslation(["surveying/landing"]);
	const section = t("surveying/landing:deliverables", {
		returnObjects: true,
	}) as unknown as DeliverablesContent;
	const images = Array.isArray(section?.images) ? section.images : [];
	const list = Array.isArray(section?.list) ? section.list : [];

	if (list.length === 0 && images.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -left-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
					{list.length > 0 && (
						<FadeLeft>
							<ul className="grid grid-cols-1 gap-3.5 rounded-c bg-surface hairline card-shadow p-7 sm:p-9">
								{list.map((item, index) => (
									<li
										key={index}
										className="flex items-start gap-3 text-sm sm:text-base text-on-surface/75 leading-relaxed"
									>
										<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
											<span className="mdi mdi-check text-sm" />
										</span>
										{item}
									</li>
								))}
							</ul>
						</FadeLeft>
					)}

					{images.length > 0 && (
						<FadeRight delay={0.08}>
							<div className="grid grid-cols-2 gap-4 sm:gap-5">
								{images.map((image, index) => (
									<div
										key={index}
										className={`group relative overflow-hidden rounded-[15px] bg-primary-50/60 hairline card-shadow aspect-square ${index === 0 ? "col-span-2" : ""}`}
									>
										<Image
											src={image}
											alt={`${section.headline} ${index + 1}`}
											fill
											sizes="(min-width: 1024px) 30vw, 50vw"
											className="object-fill object-center transition-transform duration-700 group-hover:scale-105"
										/>
									</div>
								))}
							</div>
						</FadeRight>
					)}
				</div>
			</div>
		</section>
	);
}

export default SurveyingDeliverablesSection;
