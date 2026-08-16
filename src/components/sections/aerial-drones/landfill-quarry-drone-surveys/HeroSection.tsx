"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface HeroCta {
	icon?: string;
	label: string;
	href: string;
}

interface HeroContent {
	headline: string;
	title: string;
	description?: string;
	image?: string | null;
	ctaPrimary?: HeroCta | null;
}

export function HeroSection() {
	const { t } = useTranslation(["landfill-quarry-drone-surveys"]);
	const hero = t("landfill-quarry-drone-surveys:hero", {
		returnObjects: true,
	}) as unknown as HeroContent;
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");

	return (
		<section className="relative min-h-[86dvh] flex items-end overflow-hidden pb-14 sm:pb-20">
			{hasImage ? (
				<Image
					src={hero.image as string}
					alt={hero.headline || hero.title}
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
					<SectionTag>
						{hero.headline}
					</SectionTag>

					<h1 className="mt-5 max-w-4xl font-light tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-7xl text-white">
						{hero.title}
					</h1>

					{hero.description && (
						<p className="mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed whitespace-pre-line">
							{hero.description}
						</p>
					)}

					{hero.ctaPrimary?.href && (
						<div className="mt-10">
							<Link
								href={hero.ctaPrimary.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
							>
								<span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
								{hero.ctaPrimary.label}
								{hero.ctaPrimary.icon && (
									<span
										className={`mdi mdi-${hero.ctaPrimary.icon} text-xl text-ink transition-transform duration-300 group-hover:translate-x-1`}
									/>
								)}
							</Link>
						</div>
					)}
				</FadeUp>
			</div>
		</section>
	);
}

export default HeroSection;