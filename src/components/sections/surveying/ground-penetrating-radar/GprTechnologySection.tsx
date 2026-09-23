"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";

interface TechItem {
	icon?: string | null;
	image?: string | null;
	title: string;
	description?: string;
}

interface TechnologyContent {
	tag?: string | null;
	headline: string;
	items: TechItem[];
}

export interface GprTechnologyData {
	tag?: string | null;
	headline: string;
	items: TechItem[];
}

export function GprTechnologySection({ data, id }: { data?: GprTechnologyData | null; id?: string } = {}) {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	// Keystatic-owned content when `data` is provided (M11 `gprTechnology`
	// unique section); legacy locale strings otherwise. The image-vs-icon
	// branch stays in the renderer.
	const section = (data ??
		(t("surveying/ground-penetrating-radar:technology", {
			returnObjects: true,
		}) as unknown as TechnologyContent)) as TechnologyContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section id={id ?? "technology"} className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
					{items.map((item, index) => {
						const hasImage = typeof item.image === "string" && item.image.startsWith("/");

						return (
							<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full w-full">
								<article className="group h-full flex items-center gap-4 rounded-[16px] bg-surface hairline card-shadow p-4 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
									{hasImage ? (
										<span className="relative flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-primary-50/60 overflow-hidden">
											<Image
												src={item.image as string}
												alt={item.title}
												fill
												sizes="120px"
												className="object-contain object-center p-2"
											/>
										</span>
									) : (
										<span className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
											{item.icon && <span className={`mdi mdi-${item.icon} text-3xl`} />}
										</span>
									)}

									<div className="flex min-w-0 flex-col gap-1.5">
										<h3 className="text-sm font-semibold tracking-tight text-ink leading-snug">
											{item.title}
										</h3>
										{item.description && (
											<p className="text-xs text-on-surface/55 leading-relaxed">
												{item.description}
											</p>
										)}
									</div>
								</article>
							</FadeUp>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default GprTechnologySection;
