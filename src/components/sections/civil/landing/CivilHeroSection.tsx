"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeLeft } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface HeroCta {
	label?: string | null;
	href?: string | null;
}

interface CivilHeroContent {
	headline?: string | null;
	title?: string | null;
	description?: string | null;
	image?: string | null;
	ctaPrimary?: HeroCta | null;
	ctaSecondary?: HeroCta | null;
}

export interface CivilHeroData {
	headline?: string | null;
	title?: string | null;
	description?: string | null;
	image?: string | null;
	ctaPrimary?: HeroCta | null;
	ctaSecondary?: HeroCta | null;
}

export function CivilHeroSection({ data, id }: { data?: CivilHeroData | null; id?: string } = {}) {
	const { t } = useTranslation(["civil/landing"]);
	// Keystatic-owned content when `data` is provided (M11 `civilHero`
	// unique section); legacy `civil/landing:hero` locale strings
	// otherwise. Presentation (diagonal seam, pill styles) stays in the
	// wrapper — only strings, image and links are data.
	const hero = (data ??
		(t("civil/landing:hero", { returnObjects: true }) as unknown as CivilHeroContent)) as CivilHeroContent;
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");

	return (
		<section id={id} className="relative overflow-hidden bg-ink">
			<div className="relative flex min-h-[92vh] items-center">
				{/* full-bleed image panel with diagonal seam */}
				{hasImage && (
					<div
						className="absolute inset-0 lg:left-[34%] lg:[clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]"
						aria-hidden
					>
						<Image
							src={hero.image as string}
							alt={hero.title}
							fill
							priority
							sizes="100vw"
							className="object-cover object-center"
						/>
						<span className="absolute inset-0 bg-ink/55 lg:bg-gradient-to-r lg:from-transparent lg:via-ink/25 lg:to-transparent" />
					</div>
				)}

				{/* diagonal accent line along the seam */}
				<span
					className="pointer-events-none absolute inset-y-0 right-[62%] hidden w-px bg-gradient-to-b from-transparent via-primary/70 to-transparent lg:block"
					style={{ transform: "skewX(-14deg)" }}
					aria-hidden
				/>

				<div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-44">
					<FadeLeft className="max-w-xl">
						<div className="flex flex-col gap-7">
							<SectionTag dark>{hero.headline}</SectionTag>

							<h1 className="font-light tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl text-white drop-shadow-sm">
								{hero.title}
							</h1>

							{hero.description && (
								<p className="text-base sm:text-lg text-white/75 leading-relaxed whitespace-pre-line">
									{hero.description}
								</p>
							)}

							{(hero.ctaPrimary?.href || hero.ctaSecondary?.href) && (
								<div className="mt-1 flex flex-wrap items-center gap-4">
									{hero.ctaPrimary?.href && (
										<Link
											href={hero.ctaPrimary.href}
											className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(0,151,178,0.7)]"
										>
											<span className="mdi mdi-email-outline text-xl" />
											{hero.ctaPrimary.label}
											<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
										</Link>
									)}

									{hero.ctaSecondary?.href && (
										<Link
											href={hero.ctaSecondary.href}
											className="group inline-flex items-center gap-3 h-14 rounded-full border border-surface/40 bg-surface/10 backdrop-blur px-8 text-white font-medium text-base transition-all duration-300 hover:bg-surface hover:text-ink"
										>
											{hero.ctaSecondary.label}
											<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
										</Link>
									)}
								</div>
							)}
						</div>
					</FadeLeft>
				</div>
			</div>
		</section>
	);
}

export default CivilHeroSection;
