"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";
import { MediaImage } from "@/lib/types";
import Slider from "@/components/Slider";

interface GprCta {
	icon?: string;
	label: string;
	href: string;
}

interface BrowseLink {
	label: string;
	href: string;
}

interface GprHeroContent {
	headline?: string;
	title: string;
	image?: string | null;
	images?: string[] | MediaImage[];
	browseAll?: BrowseLink | null;
	description?: string;
	ctaPrimary?: GprCta | null;
	ctaSecondary?: GprCta | null;
}

export function GprServiceHero() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const hero = t("ground-penetrating-radar:hero", {
		returnObjects: true,
	}) as unknown as GprHeroContent;
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");
    const images = Array.isArray(hero?.images) ? hero.images : [];
    const slides = images
		.filter((item) => {
			const url = typeof item === "object" ? item.url : item;
			return typeof url === "string" && url.startsWith("/");
		})
		.map((item, index) => ({
			image: (typeof item === "object" ? item.url : item) as string,
			alt: (typeof item === "object" ? item.label : item) ?? "GPR",
			title: (typeof item === "object" ? item.label : null) ?? "GPR",
			description: (typeof item === "object" ? item.description : null) ?? `Ground Penetrating Radar ${index+1}`,
        }));
	return (
		<section className="relative overflow-hidden pt-40 sm:pt-44 pb-10">
			<Blob
				className="w-[26rem] h-[26rem] bg-primary-100/50 -top-24 -right-20"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
					<FadeLeft>
						<div className="flex flex-col gap-6">
							{hero.browseAll?.href && (
								<Link
									href={hero.browseAll.href}
									className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-on-surface/55 transition-colors duration-300 hover:text-primary"
								>
									<span className="mdi mdi-chevron-left text-base" />
									{hero.browseAll.label}
								</Link>
							)}

							<h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-ink leading-tight">
								{hero.title}
							</h1>

							{hero.description && (
								<p className="max-w-xl text-sm sm:text-base text-on-surface/60 leading-relaxed">
									{hero.description}
								</p>
							)}

							{(hero.ctaPrimary?.href || hero.ctaSecondary?.href) && (
								<div className="mt-1 flex flex-wrap items-center gap-3">
									{hero.ctaPrimary?.href && (
										<Link
											href={hero.ctaPrimary.href}
											className="group inline-flex items-center gap-2.5 h-12 rounded-full bg-primary px-7 text-surface text-sm font-medium transition-all duration-300 hover:bg-primary-700"
										>
											{hero.ctaPrimary.label}
											<span className="mdi mdi-arrow-right text-lg transition-transform duration-300 group-hover:translate-x-1" />
										</Link>
									)}

									{hero.ctaSecondary?.href && (
										<a
											href={hero.ctaSecondary.href}
											target="_blank"
											className="inline-flex items-center gap-2.5 h-12 rounded-full bg-emerald-600 px-7 text-white text-sm font-medium transition-all duration-300 hover:bg-emerald-700"
										>
											{hero.ctaSecondary.icon && (
												<span
													className={`mdi mdi-${hero.ctaSecondary.icon} text-lg`}
												/>
											)}
											{hero.ctaSecondary.label}
										</a>
									)}
								</div>
							)}
						</div>
					</FadeLeft>

					<FadeRight delay={0.08}>
						{slides.length > 0 && (
							<FadeRight delay={0.08}>
								
									<Slider
										slides={slides}
										autoplay={5000}
										showArrows
										showDots
										imgClassName="object-fill!"
										containerClassName=" aspect-3/4!"
									/>
							</FadeRight>
						)}
						{/*hasImage && (
							<div className="relative rounded-[24px] overflow-hidden bg-primary-50/60 hairline card-shadow">
								<div className="relative aspect-[3/4]">
									<Image
										src={hero.image as string}
										alt={hero.title}
										fill
										priority
										sizes="(min-width: 720px) 50vw, 100vw"
										className="object-fill object-center"
									/>
								</div>
							</div>
						)*/}
					</FadeRight>
				</div>
			</div>
		</section>
	);
}

export default GprServiceHero;
