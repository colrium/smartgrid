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

interface SurveyingHeroContent {
	headline: string;
	title: string;
	description?: string;
	image?: string | null;
	ctaPrimary?: HeroCta | null;
}

export function SurveyingHeroSection() {
	const { t } = useTranslation(["surveying/landing"]);
	const hero = t("surveying/landing:hero", { returnObjects: true }) as unknown as SurveyingHeroContent;
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");

	return (
		<section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-ink">
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
						className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/45 to-ink/85"
						aria-hidden
					/>
					<span
						className="pointer-events-none absolute inset-x-64 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
						aria-hidden
					/>
				</>
			)}

			{/* inset frame */}
			<span
				className="pointer-events-none absolute inset-4 sm:inset-7 rounded-[24px] border border-surface/20"
				aria-hidden
			/>

			<div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-48">
				<FadeUp className="mx-auto max-w-3xl">
					<div className="flex flex-col items-center text-center gap-7">
						<SectionTag dark>{hero.headline}</SectionTag>

						<h1 className="font-light tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl text-white drop-shadow-sm">
							{hero.title}
						</h1>

						{hero.description && (
							<p className="max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed whitespace-pre-line">
								{hero.description}
							</p>
						)}

						{hero.ctaPrimary?.href && (
							<div className="mt-1 flex flex-wrap items-center justify-center gap-4">
								<Link
									href={hero.ctaPrimary.href}
									className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-9 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(0,151,178,0.7)]"
								>
									<span className="mdi mdi-email-outline text-xl" />
									{hero.ctaPrimary.label}
									<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
								</Link>
							</div>
						)}
					</div>
				</FadeUp>
			</div>

			{/* scroll cue */}
			<span
				className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 mdi mdi-chevron-double-down text-2xl text-white/50 animate-bounce"
				aria-hidden
			/>
		</section>
	);
}

export default SurveyingHeroSection;
