"use client";

import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import Slider from "@/components/Slider";
import { MediaImage } from "@/lib/types";


interface DeliverablesContent {
	tag?: string | null;
	headline: string;
	list?: string[] | null;
	images?: MediaImage[] | null;
}

export function GprDeliverablesSection() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const section = t("ground-penetrating-radar:deliverables", {
		returnObjects: true,
	}) as unknown as DeliverablesContent;
	const list = Array.isArray(section?.list) ? section.list : [];
	const images = Array.isArray(section?.images) ? section.images : [];

	if (list.length === 0 && images.length === 0) return null;

    const slides = images
		.filter((item) => {
			const url = typeof item === "object" ? item.url : item;
			return typeof url === "string" && url.startsWith("/");
		})
		.map((item, _index) => ({
			image: (typeof item === "object" ? item.url : item) as string,
			alt: (typeof item === "object" ? item.label : item) ?? "GPR",
			title: (typeof item === "object" ? item.label : null) ?? null,
			description:
				(typeof item === "object" ? item.description : null) ??
				null,
		}));

	return (
		<section
			id="deliverables"
			className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden bg-surface"
		>
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
					{list.length > 0 && (
						<FadeLeft>
							<ul className="flex flex-col gap-3.5">
								{list.map((item, index) => (
									<li
										key={index}
										className="flex items-center gap-3.5 rounded-[14px] bg-surface hairline card-shadow px-5 py-4 text-sm font-medium text-on-surface/80 transition-all duration-500 hover:card-shadow-lift hover:border-primary"
									>
										<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
											<span className="mdi mdi-file-check-outline text-base" />
										</span>
										{item}
									</li>
								))}
							</ul>
						</FadeLeft>
					)}

					{slides.length > 0 && (
						<FadeRight delay={0.08}>
							
								<Slider
									slides={slides}
									autoplay={5000}
									showArrows
									showDots
									imgClassName="object-fill!"
									containerClassName=" aspect-square!"
								/>
						</FadeRight>
					)}
				</div>
			</div>
		</section>
	);
}

export default GprDeliverablesSection;
