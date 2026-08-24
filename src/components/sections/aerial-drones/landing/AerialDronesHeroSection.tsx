"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface HeroCta {
	label: string;
	href: string;
}

interface AerialDronesHeroContent {
	headline: string;
	title: string;
	description?: string;
	image?: string | null;
	ctaPrimary?: HeroCta | null;
	ctaSecondary?: HeroCta | null;
}

export function AerialDronesHeroSection() {
	const { t } = useTranslation(["aerial-drones"]);
	const hero = t("aerial-drones:hero", {
		returnObjects: true,
	}) as unknown as AerialDronesHeroContent;
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");

	return (
		<section className="relative flex min-h-[92vh] items-end overflow-hidden">
			{hasImage && (
				<>
					<Image
						src={hero.image as string}
						alt={hero.title}
						fill
						priority
						sizes="100vw"
						className="object-cover object-center"
					/>
					<div
						className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20"
						aria-hidden
					/>
					<div
						className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent"
						aria-hidden
					/>
				</>
			)}

			<div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-24 pt-56">
				<div className="max-w-3xl">
					<FadeUp>
						<div className="flex flex-col gap-6">
							<SectionTag dark>{hero.headline}</SectionTag>

							<h1 className="font-light tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl text-white drop-shadow-sm">
								{hero.title}
							</h1>

							{hero.description && (
								<p className="max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed whitespace-pre-line">
									{hero.description}
								</p>
							)}

							{(hero.ctaPrimary?.href || hero.ctaSecondary?.href) && (
								<div className="mt-2 flex flex-wrap items-center gap-4">
									{hero.ctaPrimary?.href && (
										<Link
											href={hero.ctaPrimary.href}
											className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(0,151,178,0.7)]"
										>
											<span className={`mdi mdi-email-outline text-xl`} />
											{hero.ctaPrimary.label}
											<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
										</Link>
									)}

									{hero.ctaSecondary?.href && (
										<Link
											href={hero.ctaSecondary.href}
											className="group inline-flex items-center gap-3 h-14 rounded-full border border-surface/40 px-8 bg-surface/10 backdrop-blur text-white font-medium text-base transition-all duration-300 hover:bg-surface hover:text-ink"
										>
											{hero.ctaSecondary.label}
											<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
										</Link>
									)}
								</div>
							)}
						</div>
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default AerialDronesHeroSection;
