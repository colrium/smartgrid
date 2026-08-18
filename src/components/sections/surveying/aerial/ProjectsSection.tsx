"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface ProjectsContent {
	tag?: string | null;
	headline: string;
	images?: string[];
	description?: string;
	items: string[];
}

export function ProjectsSection() {
	const { t } = useTranslation(["aerial-surveys"]);
	const section = t("aerial-surveys:projects", {
		returnObjects: true,
	}) as unknown as ProjectsContent;
	const images = Array.isArray(section.images) ? section.images : [];
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				{images.length > 0 && (
					<FadeUp className="mt-14 sm:mt-20">
						<div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
							{images.map((src, index) => (
								<div
									key={index}
									className={`relative overflow-hidden rounded-2xl hairline bg-surface card-shadow group ${
										index === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : ""
									}`}
									style={{ height: index === 0 ? "unset" : "12rem" }}
								>
									{index === 0 ? (
										<div className="relative h-full w-full min-h-[24rem]">
											<Image
												src={src}
												alt={`Project ${index + 1}`}
												fill
												sizes="(min-width: 768px) 40vw, 100vw"
												className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
											/>
										</div>
									) : (
										<div className="relative h-full w-full">
											<Image
												src={src}
												alt={`Project ${index + 1}`}
												fill
												sizes="(min-width: 768px) 20vw, 50vw"
												className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
											/>
										</div>
									)}
								</div>
							))}
						</div>
					</FadeUp>
				)}

				{items.length > 0 && (
					<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
						{items.map((item, index) => (
							<FadeUp key={index} delay={(index % 2) * 0.06}>
								<div className="flex items-start gap-4 rounded-[16px] border border-ink/10 bg-surface px-5 py-5 transition-colors duration-300 hover:border-primary">
									<span className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-primary-50 text-primary flex items-center justify-center">
										<span className="mdi mdi-map-marker-outline text-base" />
									</span>
									<p className="text-sm sm:text-[15px] text-on-surface/80 leading-relaxed flex-1">
										{item}
									</p>
								</div>
							</FadeUp>
						))}
					</div>
				)}
			</div>
		</section>
	);
}

export default ProjectsSection;