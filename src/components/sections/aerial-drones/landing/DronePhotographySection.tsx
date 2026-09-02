"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface PhotoItem {
	title: string;
	description?: string;
}

interface PhotographyContent {
	tag?: string | null;
	headline: string;
	description?: string;
	backgroundImage?: string | null;
	items: PhotoItem[];
}

export function DronePhotographySection() {
	const { t } = useTranslation(["aerial-drones/landing"]);
	const section = t("aerial-drones/landing:dronePhotography", {
		returnObjects: true,
	}) as unknown as PhotographyContent;
	const items = Array.isArray(section?.items) ? section.items : [];
	const hasBg =
		typeof section.backgroundImage === "string" && section.backgroundImage.startsWith("/");

	if (items.length === 0) return null;

	return (
		<section className="relative overflow-hidden">
			{hasBg && (
				<>
					<Image
						src={section.backgroundImage as string}
						alt={section.headline}
						fill
						sizes="100vw"
						className="object-cover object-center"
					/>
					<div
						className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/80 to-ink/90"
						aria-hidden
					/>
				</>
			)}

			<div className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 ${hasBg ? "py-28 sm:py-32" : "py-24 sm:py-28"}`}>
				<div className="flex flex-col items-center text-center gap-5">
					<FadeUp>
						<div className="flex flex-col items-center gap-5">
							{section.tag && <SectionTag dark>{section.tag}</SectionTag>}

							<h2 className="font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-[2.85rem] text-white max-w-3xl">
								{section.headline}
							</h2>

							{section.description && (
								<p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
									{section.description}
								</p>
							)}
						</div>
					</FadeUp>
				</div>

				<div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
							<article className="group h-full flex flex-col gap-3 rounded-[20px] bg-surface/10 border border-surface/20 backdrop-blur-md p-7 transition-all duration-500 hover:bg-surface hover:border-primary hover:card-shadow-lift">
								<span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-primary-300 transition-colors duration-300 group-hover:bg-primary-50 group-hover:text-primary">
									<span className="mdi mdi-camera-retake-outline text-xl" />
								</span>

								<h3 className="text-base font-medium tracking-tight leading-snug text-white transition-colors duration-300 group-hover:text-ink">
									{item.title}
								</h3>

								{item.description && (
									<p className="flex-1 text-sm leading-relaxed text-white/65 transition-colors duration-300 group-hover:text-on-surface/60">
										{item.description}
									</p>
								)}
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default DronePhotographySection;
