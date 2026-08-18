"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface TopoHeroContent {
	headline: string;
	title: string;
	subTitle: string;
	description: string;
	image: string;
}

export function TopographicalHeroSection() {
	const { t } = useTranslation(["topographical-surveys"]);
	const hero = t("topographical-surveys:hero", {
		returnObjects: true,
	}) as unknown as TopoHeroContent;

	return (
		<section className="relative min-h-[86dvh] flex items-end overflow-hidden pb-14 sm:pb-20">
			{/* Background image */}
			{hero.image && (
				<Image
					src={hero.image}
					alt={hero.headline || hero.title}
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
			)}
			<div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
			<div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />

			<div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionTag dark>
						{hero.headline}
					</SectionTag>

					<h1 className="mt-5 max-w-4xl font-light tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-7xl text-surface">
						{hero.title}
					</h1>

					{(hero.subTitle || hero.description) && (
						<p className="mt-6 max-w-2xl text-base sm:text-lg text-surface/70 leading-relaxed">
							{hero.subTitle || hero.description}
						</p>
					)}
				</FadeUp>
			</div>
		</section>
	);
}

export default TopographicalHeroSection;