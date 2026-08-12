"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface HeroCta {
	label: string;
	href: string;
}

interface BuildingHeroContent {
	headline: string;
	title: string;
	image?: string | null;
	description: string;
	ctaPrimary?: HeroCta | null;
}

export function BuildingSiteHeroSection() {
	const { t } = useTranslation(["building-site-surveys"]);
	const hero = t("building-site-surveys:hero", {
		returnObjects: true,
	}) as unknown as BuildingHeroContent;
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");

	return (
		<section className="relative min-h-[86dvh] flex items-end overflow-hidden pb-14 sm:pb-20">
			{/* Institutional panel background (falls back to gradients when no image url) */}
			<div className="absolute inset-0 ink-panel" />
			<span className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-300/30 blur-[90px] pointer-events-none" />
			<span className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-[90px] pointer-events-none" />
			<span
				className="absolute -bottom-10 right-4 font-light tracking-tighter text-[11rem] leading-none text-white/[0.04] select-none pointer-events-none hidden sm:block"
				aria-hidden
			>
				⌖
			</span>
			{hasImage && (
				<div
					className="absolute inset-0 opacity-25 bg-cover bg-center"
					style={{ backgroundImage: `url("${hero.image}")` }}
				/>
			)}
			<div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />

			<div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<span className="inline-flex items-center gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">
						<span className="inline-block h-px w-9 bg-brand-200/70" />
						{hero.headline}
					</span>

					<h1 className="mt-5 max-w-4xl font-light tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-7xl text-white">
						{hero.title}
					</h1>

					{hero.description && (
						<p className="mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
							{hero.description}
						</p>
					)}

					{hero.ctaPrimary?.href && (
						<div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
							<Link
								href={hero.ctaPrimary.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
							>
								<span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
								{hero.ctaPrimary.label}
								<span className="mdi mdi-arrow-right text-xl text-ink transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</div>
					)}
				</FadeUp>
			</div>
		</section>
	);
}

export default BuildingSiteHeroSection;