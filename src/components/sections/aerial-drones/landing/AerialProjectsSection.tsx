"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface ProjectsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	images?: string[] | null;
	items: string[];
}

export function AerialProjectsSection() {
	const { t } = useTranslation(["aerial-drones"]);
	const section = t("aerial-drones:projects", {
		returnObjects: true,
	}) as unknown as ProjectsContent;
	const items = Array.isArray(section?.items) ? section.items : [];
	const images = Array.isArray(section?.images) ? section.images : [];

	if (items.length === 0 && images.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
					<FadeLeft>
						<ul className="relative flex flex-col gap-2.5">
							{items.map((item, index) => (
								<li
									key={index}
									className="group flex items-start gap-4 rounded-[15px] bg-surface hairline card-shadow px-5 py-4 transition-all duration-500 hover:card-shadow-lift hover:border-primary"
								>
									<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary text-xs font-semibold transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										{String(index + 1).padStart(2, "0")}
									</span>
									<p className="text-sm sm:text-[15px] text-on-surface/75 leading-relaxed pt-1.5">
										{item}
									</p>
								</li>
							))}
						</ul>
					</FadeLeft>

					{images.length > 0 && (
						<FadeRight delay={0.08} className="lg:sticky lg:top-28">
							<div className="grid grid-cols-1 gap-5">
								{images.map((image, index) => (
									<div
										key={index}
										className="group relative aspect-[16/10] overflow-hidden rounded-[20px] bg-primary-50/60 hairline card-shadow"
									>
										<Image
											src={image}
											alt={`${section.headline} ${index + 1}`}
											fill
											sizes="(min-width: 1024px) 45vw, 100vw"
											className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
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

export default AerialProjectsSection;
