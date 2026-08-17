"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface SectorItem {
	icon?: string;
	title: string;
	description: string;
}

interface SectorContent {
	tag?: string | null;
	headline: string;
	description?: string;
	images?: string[];
	items: SectorItem[];
}

interface SectorSectionProps {
	sectionKey: string;
	imagePosition?: "left" | "right";
	tone?: "default" | "surface";
}

export function SectorSection({
	sectionKey,
	imagePosition = "right",
	tone = "default",
}: SectorSectionProps) {
	const { t } = useTranslation(["resource-mapping"]);
	const section = t(`resource-mapping:${sectionKey}`, {
		returnObjects: true,
	}) as unknown as SectorContent;
	const items = Array.isArray(section.items) ? section.items : [];
	const images = Array.isArray(section.images) ? section.images : [];

	const text = (
		<FadeUp className="lg:col-span-6">
			<SectionHeader tag={section.tag} headline={section.headline} />

			{section.description && (
				<p className="mt-8 text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
					{section.description}
				</p>
			)}
		</FadeUp>
	);

	const media = (
		<FadeUp delay={0.1} className="lg:col-span-6">
			{images.length > 0 && (
				<div className="grid grid-cols-2 gap-4 sm:gap-5">
					{images.slice(0, 2).map((src, index) => (
						<div
							key={index}
							className={`relative overflow-hidden rounded-[20px] hairline bg-surface card-shadow ${
								index === 0 ? "mt-6" : "-mt-6"
							}`}
						>
							<div className="relative aspect-[3/4] bg-slate-900">
								<Image
									src={src}
									alt={`${section.headline} ${index + 1}`}
									fill
									sizes="(min-width: 1024px) 25vw, 50vw"
									className="object-cover object-center transition-transform duration-700 hover:scale-105"
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</FadeUp>
	);

	return (
		<section
			className={`py-24 sm:py-28 relative overflow-hidden ${
				tone === "surface" ? "bg-surface" : ""
			}`}
		>
			<Blob
				className={`w-[26rem] h-[26rem] bg-brand-100/60 ${
					imagePosition === "left" ? "-bottom-24 -left-24" : "-bottom-24 -right-24"
				}`}
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{imagePosition === "left" ? (
						<>
							{media}
							{text}
						</>
					) : (
						<>
							{text}
							{media}
						</>
					)}
				</div>

				{items.length > 0 && (
					<div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
						{items.map((item, index) => (
							<FadeUp key={index} delay={(index % 3) * 0.08}>
								<article className="group relative h-full flex flex-col gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
									{item.icon && (
										<span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span className={`mdi mdi-${item.icon} text-lg`} />
										</span>
									)}

									<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
										{item.title}
									</h3>
									<p className="flex-1 text-sm text-on-surface/60 leading-relaxed">
										{item.description}
									</p>
								</article>
							</FadeUp>
						))}
					</div>
				)}
			</div>
		</section>
	);
}

export default SectorSection;