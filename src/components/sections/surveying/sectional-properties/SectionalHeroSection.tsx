"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface SectionalHeroCta {
	label?: string;
	href?: string;
	icon?: string | null;
}

interface SectionalHeroContent {
	headline: string;
	description: string;
	image?: string | null;
	tag?: string;
	ctaPrimary?: SectionalHeroCta | null;
	ctaSecondary?: SectionalHeroCta | null;
}

export function SectionalHeroSection() {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const hero = t("surveying/sectional-properties:hero", {
		returnObjects: true,
	}) as unknown as SectionalHeroContent;
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");

	return (
		<section className="relative min-h-[86dvh] flex items-end overflow-hidden pb-14 sm:pb-20">
			{/* Background image */}
			{hasImage ? (
				<Image
					src={hero.image as string}
					alt={hero.headline}
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
			) : (
				<div className="absolute inset-0 bg-ink" />
			)}
			<div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
			<div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />

			<div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12">
				<FadeUp>
					{hero.tag && <SectionTag>{hero.tag}</SectionTag>}

					<h1 className="mt-5 max-w-4xl font-light tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-7xl text-surface">
						{hero.headline}
					</h1>

					{hero.description && (
						<p className="mt-6 max-w-2xl text-base sm:text-lg text-surface/70 leading-relaxed whitespace-pre-line">
							{hero.description}
						</p>
					)}

					{(hero.ctaPrimary?.href || hero.ctaSecondary?.href) && (
						<div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
							{hero.ctaPrimary?.href && (
								<Link
									href={hero.ctaPrimary.href}
									className="group inline-flex items-center justify-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
								>
									<span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
									{hero.ctaPrimary.label}
									<span className="mdi mdi-arrow-right text-xl text-ink transition-transform duration-300 group-hover:translate-x-1" />
								</Link>
							)}
							{hero.ctaSecondary?.href && (
								<Link
									href={hero.ctaSecondary.href}
									target="_blank"
									rel="noopener noreferrer"
									className="group inline-flex items-center justify-center gap-3 h-14 rounded-full border border-whatsapp/60 bg-ink/20 px-8 text-whatsapp font-medium text-base backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-whatsapp/10"
								>
									<span
										className={`mdi mdi-${hero.ctaSecondary.icon ?? "whatsapp"} text-xl`}
									/>
									{hero.ctaSecondary.label}
								</Link>
							)}
						</div>
					)}
				</FadeUp>
			</div>
		</section>
	);
}

export default SectionalHeroSection;