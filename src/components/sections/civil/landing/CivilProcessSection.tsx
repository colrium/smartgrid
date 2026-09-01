"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface ProcessItem {
	icon?: string | null;
	title: string;
	description?: string;
}

interface ProcessContent {
	tag?: string | null;
	headline: string;
	description?: string;
	image?: string | null;
	items: ProcessItem[];
}

export function CivilProcessSection() {
	const { t } = useTranslation(["civil/landing"]);
	const section = t("civil/landing:process", { returnObjects: true }) as unknown as ProcessContent;
	const items = Array.isArray(section?.items) ? section.items : [];
	const hasImage = typeof section.image === "string" && section.image.startsWith("/");

	if (items.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
					{hasImage && (
						<FadeLeft className="lg:sticky lg:top-28">
							<div className="relative overflow-hidden rounded-[20px] bg-surface hairline card-shadow">
								<div className="relative aspect-square">
									<Image
										src={section.image as string}
										alt={section.headline}
										fill
										sizes="(min-width: 1024px) 40vw, 100vw"
										className="object-fill object-center"
									/>
									<span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/60 to-transparent pointer-events-none" />
									<div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
										<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface/90 text-primary backdrop-blur">
											<span className="mdi mdi-radar text-xl" />
										</span>
										<p className="text-sm font-medium text-white leading-snug drop-shadow-sm">
											{section.headline}
										</p>
									</div>
								</div>
							</div>
						</FadeLeft>
					)}

					<FadeRight delay={0.08}>
						<ol className="relative flex flex-col gap-2">
							{items.map((item, index) => (
								<li
									key={index}
									className="group relative flex gap-5 rounded-[20px] bg-surface hairline card-shadow p-6 transition-all duration-500 hover:card-shadow-lift hover:border-primary"
								>
									<div className="flex flex-col items-center">
										<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-mute transition-colors duration-300 group-hover:bg-surface group-hover:text-primary">
											{item.icon && <span className={`mdi mdi-${item.icon} text-xl`} />}
										</span>
										{index < items.length - 1 && (
											<span className="mt-3 w-px flex-1 bg-ink/10" aria-hidden />
										)}
									</div>

									<div className="flex flex-col gap-1.5 pb-1">
										<span className="text-[11px] font-semibold uppercase tracking-widest text-primary/70">
											Step {String(index + 1).padStart(2, "0")}
										</span>
										<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
											{item.title}
										</h3>
										{item.description && (
											<p className="text-sm text-on-surface/60 leading-relaxed">
												{item.description}
											</p>
										)}
									</div>
								</li>
							))}
						</ol>
					</FadeRight>
				</div>
			</div>
		</section>
	);
}

export default CivilProcessSection;
