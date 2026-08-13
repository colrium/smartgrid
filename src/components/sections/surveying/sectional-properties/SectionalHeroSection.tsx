"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface SectionalHeroContent {
	headline: string;
	description: string;
	image?: string | null;
	tag?: string;
}

export function SectionalHeroSection() {
	const { t } = useTranslation(["sectional-properties"]);
	const hero = t("sectional-properties:hero", {
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
				<div className="absolute inset-0 ink-panel" />
			)}
			<div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
			<div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />

			<div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12">
				<FadeUp>
					{hero.tag && <SectionTag>{hero.tag}</SectionTag>}

					<h1 className="mt-5 max-w-4xl font-light tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-7xl text-white">
						{hero.headline}
					</h1>

					{hero.description && (
						<p className="mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
							{hero.description}
						</p>
					)}
				</FadeUp>
			</div>
		</section>
	);
}

export default SectionalHeroSection;