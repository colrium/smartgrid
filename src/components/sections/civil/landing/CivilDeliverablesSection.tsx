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
	image?: string | null;
	list?: string[] | null;
}

export function CivilDeliverablesSection() {
	const { t } = useTranslation(["civil/landing"]);
	const section = t("civil/landing:deliverables", {
		returnObjects: true,
	}) as unknown as DeliverablesContent;
	const list = Array.isArray(section?.list) ? section.list : [];
	const hasImage = typeof section.image === "string" && section.image.startsWith("/");

	if (list.length === 0 && !hasImage) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start">
					{list.length > 0 && (
						<FadeLeft>
							<ul className="grid grid-cols-1 gap-3.5 rounded-[20px] bg-surface hairline card-shadow p-7 sm:p-9">
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

					{hasImage && (
						<FadeRight delay={0.08}>
							<div className="group relative overflow-hidden rounded-[20px] bg-primary-50/60 hairline card-shadow">
								<div className="relative aspect-[4/5]">
									<Image
										src={section.image as string}
										alt={section.headline}
										fill
										sizes="(min-width: 1024px) 40vw, 100vw"
										className="object-fill object-center transition-transform duration-700 group-hover:scale-105"
									/>
								</div>
							</div>
						</FadeRight>
					)}
				</div>
			</div>
		</section>
	);
}

export default CivilDeliverablesSection;
