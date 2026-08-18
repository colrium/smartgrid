"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";

interface HeroCta {
	icon?: string;
	label: string;
	href: string;
}

interface EquipmentHeroContent {
	headline: string;
	title: string;
	description?: string;
	image?: string | null;
	ctaPrimary?: HeroCta | null;
	ctaSecondary?: HeroCta | null;
}

interface EquipmentHeroSectionProps {
	namespace: string;
}

export function EquipmentHeroSection({ namespace }: EquipmentHeroSectionProps) {
	const { t } = useTranslation([namespace]);
	const hero = t(`${namespace}:hero`, { returnObjects: true }) as unknown as EquipmentHeroContent;
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");

	return (
		<section className="relative overflow-hidden  pt-48">
			<Blob className="w-[30rem] h-[30rem] bg-primary-100/50 -top-32 -left-24" opacity={0.5} />
			<Blob className="w-[26rem] h-[26rem] bg-primary/10 -bottom-24 -right-20" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-16 sm:pb-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-6">
						<SectionTag>{hero.headline}</SectionTag>

						<h1 className="mt-6 font-light tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl text-ink">
							{hero.title}
						</h1>

						{hero.description && (
							<p className="mt-6 max-w-xl text-base sm:text-lg text-on-surface/60 leading-relaxed whitespace-pre-line">
								{hero.description}
							</p>
						)}

						{hero.ctaPrimary?.href && (
							<div className="mt-10 flex flex-wrap items-center gap-4">
								<Link
									href={hero.ctaPrimary.href}
									className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(0,151,178,0.6)]"
								>
									{hero.ctaPrimary.icon && (
										<span className={`mdi mdi-${hero.ctaPrimary.icon} text-xl`} />
									)}
									{hero.ctaPrimary.label}
									<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
								</Link>

								{hero.ctaSecondary?.href && (
									<Link
										href={hero.ctaSecondary.href}
										className="group inline-flex items-center gap-3 h-14 rounded-full border border-ink/15 px-8 text-ink font-medium text-base transition-all duration-300 hover:border-primary hover:text-primary"
									>
										{hero.ctaSecondary.icon && (
											<span className={`mdi mdi-${hero.ctaSecondary.icon} text-xl`} />
										)}
										{hero.ctaSecondary.label}
									</Link>
								)}
							</div>
						)}
					</FadeUp>

					<FadeUp delay={0.1} className="lg:col-span-6">
						{hasImage && (
							<div className="relative mx-auto max-w-md lg:max-w-none">
								<div className="absolute inset-6 bg-primary/15 rounded-full blur-3xl" />

								<div className="relative bg-surface p-6 sm:p-8 rounded-[20px] hairline card-shadow">
									<div className="relative aspect-square rounded-[15px] overflow-hidden bg-primary-50/60">
										<Image
											src={hero.image as string}
											alt={hero.title}
											fill
											sizes="(min-width: 1024px) 50vw, 100vw"
											className="object-contain object-center"
										/>
									</div>
								</div>
							</div>
						)}
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default EquipmentHeroSection;