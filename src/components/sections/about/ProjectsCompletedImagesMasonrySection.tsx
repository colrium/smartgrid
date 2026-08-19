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
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader headline={section.headline} align="center" />
				</FadeUp>

				<div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{images.map((image, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<figure className="group relative aspect-[4/3] overflow-hidden rounded-[20px] bg-primary-50/40 hairline card-shadow p-3 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<div className="relative h-full w-full overflow-hidden rounded-[13px] bg-white">
									<Image
										src={image}
										alt={`Project ${index + 1}`}
										fill
										sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
										className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.04]"
									/>
								</div>
								<figcaption className="mt-3 flex items-center justify-between px-1">
									<span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface/50">
										Project {index + 1}
									</span>
									<span className="h-1.5 w-1.5 rounded-full bg-primary transition-colors duration-300 group-hover:bg-primary-300" />
								</figcaption>
							</figure>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default ProjectsCompletedImagesMasonrySection;
