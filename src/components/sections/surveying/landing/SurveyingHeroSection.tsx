"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";

interface HeroCta {
	label: string;
	href: string;
}

interface SurveyingHeroContent {
	headline: string;
	title: string;
	description?: string;
	image?: string | null;
	ctaPrimary?: HeroCta | null;
}

export function SurveyingHeroSection() {
	const { t } = useTranslation(["surveying"]);
	const hero = t("surveying:hero", { returnObjects: true }) as unknown as SurveyingHeroContent;
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");

	return (
		<section className="relative overflow-hidden pt-44 sm:pt-52">
			<Blob className="w-[30rem] h-[30rem] bg-primary-100/50 -top-32 -left-24" opacity={0.5} />
			<Blob className="w-[26rem] h-[26rem] bg-primary/10 -bottom-24 -right-20" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-20">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeLeft className="lg:col-span-7">
						<div className="flex flex-col gap-6">
							<SectionTag className="justify-start">{hero.headline}</SectionTag>

							<h1 className="font-light tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl text-ink">
								{hero.title}
							</h1>

							{hero.description && (
								<p className="max-w-xl text-base sm:text-lg text-on-surface/60 leading-relaxed whitespace-pre-line">
									{hero.description}
								</p>
							)}

							{hero.ctaPrimary?.href && (
								<div className="mt-2 flex flex-wrap items-center gap-4">
									<Link
										href={hero.ctaPrimary.href}
										className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(0,151,178,0.6)]"
									>
										{hero.ctaPrimary.label}
										<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
									</Link>
								</div>
							)}
						</div>
					</FadeLeft>

					<FadeRight delay={0.08} className="lg:col-span-5">
						{hasImage && (
							<div className="relative mx-auto max-w-md lg:max-w-none">
								<div className="absolute inset-6 bg-primary/15 rounded-full blur-3xl" />

								<div className="relative bg-surface p-4 sm:p-5 rounded-[20px] hairline card-shadow">
									<div className="relative aspect-[4/3] rounded-[15px] overflow-hidden bg-primary-50/60">
										<Image
											src={hero.image as string}
											alt={hero.title}
											fill
											priority
											sizes="(min-width: 1024px) 40vw, 100vw"
											className="object-cover object-center"
										/>
									</div>
								</div>
							</div>
						)}
					</FadeRight>
				</div>
			</div>
		</section>
	);
}

export default SurveyingHeroSection;
