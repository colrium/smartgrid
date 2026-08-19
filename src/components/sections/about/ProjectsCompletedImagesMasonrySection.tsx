"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { Blob } from "@/components/sections/home/decor";

interface ProjectsCompletedMasonryContent {
	headline: string;
	items: string[];
}

export function ProjectsCompletedImagesMasonrySection() {
	const { t } = useTranslation(["about"]);
	const section = t("about:projectsCompletedImagesMasonry", {
		returnObjects: true,
	}) as unknown as ProjectsCompletedMasonryContent;
	const images = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader headline={section.headline} align="center" />
				</FadeUp>

				<div className="mt-12 sm:mt-16 columns-2 lg:columns-3 gap-5 sm:gap-6 [&>*]:mb-5 sm:[&>*]:mb-6">
					{images.map((image, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<figure
								className={`group relative overflow-hidden rounded-[20px] bg-ink hairline card-shadow break-inside-avoid ${
									index % 3 === 0 ? "aspect-[3/4]" : index % 3 === 1 ? "aspect-square" : "aspect-[4/5]"
								}`}
							>
								<Image
									src={image}
									alt={`Project ${index + 1}`}
									fill
									sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
									className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
								/>
							</figure>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default ProjectsCompletedImagesMasonrySection;