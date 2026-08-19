"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface HeroCta {
	icon?: string;
	label: string;
	href: string;
}

interface CareersHeroContent {
	headline: string;
	title: string;
	description?: string;
	ctaPrimary?: HeroCta | null;
}

export function CareersHeroSection() {
	const { t } = useTranslation(["careers"]);
	const hero = t("careers:hero", { returnObjects: true }) as unknown as CareersHeroContent;

	return (
		<section className="relative min-h-[88dvh] flex items-center justify-center overflow-hidden pt-40 pb-24 sm:pt-44 sm:pb-28">
			<div className="absolute inset-0 ink-panel" />

			<div
				className="absolute inset-0 opacity-[0.35] pointer-events-none"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
					backgroundSize: "56px 56px",
				}}
			/>

			<span className="absolute -top-32 -left-24 w-[30rem] h-[30rem] rounded-full bg-primary/25 blur-[120px] pointer-events-none" />
			<span className="absolute -bottom-32 -right-24 w-[30rem] h-[30rem] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

			<span
				aria-hidden
				className="absolute inset-x-0 top-14 select-none pointer-events-none text-center font-mono font-bold uppercase tracking-[0.5em] text-surface/[0.06] text-[22vw] lg:text-[13rem] leading-none whitespace-nowrap"
			>
				{hero.title}
			</span>

			<div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12">
				<FadeUp className="max-w-4xl mx-auto flex flex-col items-center text-center">
					<SectionTag dark>{hero.title}</SectionTag>

					<h1 className="mt-7 max-w-4xl font-light tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-[4.5rem] text-surface">
						{hero.headline}
					</h1>

					{hero.description && (
						<p className="mt-8 max-w-3xl text-base sm:text-lg text-surface/70 leading-relaxed">
							{hero.description}
						</p>
					)}

					{hero.ctaPrimary?.href && (
						<div className="mt-11 flex flex-wrap items-center justify-center gap-4">
							<Link
								href={hero.ctaPrimary.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-9 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
							>
								{hero.ctaPrimary.icon && (
									<span className={`mdi mdi-${hero.ctaPrimary.icon} text-xl text-ink`} />
								)}
								{hero.ctaPrimary.label}
								<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</div>
					)}
				</FadeUp>
			</div>

			<div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-surface/50">
				<span className="text-[10px] uppercase tracking-[0.28em] font-semibold">Open Roles</span>
				<span className="mdi mdi-chevron-down animate-bounce text-xl" />
			</div>
		</section>
	);
}

export default CareersHeroSection;