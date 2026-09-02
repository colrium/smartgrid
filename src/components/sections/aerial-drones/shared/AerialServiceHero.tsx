"use client";

import Image from "next/image";
import type { ReactElement } from "react";
import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface AerialServiceHeroCta {
	label: string;
	href: string;
}

export interface AerialServiceHeroContent {
	headline: string;
	title: string;
	description?: string;
	image?: string | null;
	ctaPrimary?: AerialServiceHeroCta | null;
}

interface AerialServiceHeroProps {
	hero: AerialServiceHeroContent;
}

/**
 * Shared full-bleed hero for individual aerial-drone services. Copy and imagery
 * stay page-owned so each route can retain its own translated content.
 */
export function AerialServiceHero({ hero }: AerialServiceHeroProps): ReactElement {
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");

	return (
		<section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink pt-28 sm:pt-36">
			{hasImage ? (
				<Image
					src={hero.image}
					alt={hero.headline || hero.title}
					fill
					priority
					fetchPriority="high"
					sizes="100vw"
					className="object-cover object-[62%_center]"
				/>
			) : (
				<div className="absolute inset-0 ink-panel" aria-hidden="true" />
			)}

			<div
				className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,55,61,0.98)_0%,rgba(1,55,61,0.9)_30%,rgba(1,55,61,0.4)_60%,rgba(1,55,61,0.08)_100%)]"
				aria-hidden="true"
			/>
			<div
				className="absolute inset-0 bg-[linear-gradient(0deg,rgba(1,55,61,0.94)_0%,rgba(1,55,61,0.1)_52%,rgba(1,55,61,0.48)_100%)]"
				aria-hidden="true"
			/>
			

			<div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 pb-12 sm:px-8 sm:pb-16 lg:grid-cols-12 lg:items-end lg:gap-8 lg:px-12 lg:pb-20">
				<div className="max-w-3xl lg:col-span-8">
					<FadeUp>
						<SectionTag dark>{hero.headline}</SectionTag>

						<h1 className="mt-6 text-5xl font-light leading-[0.98] tracking-[-0.045em] text-surface sm:text-6xl lg:text-8xl">
							{hero.title}
						</h1>

						{hero.description && (
							<p className="mt-7 max-w-2xl border-l border-primary-300/70 pl-5 text-base leading-relaxed text-surface/80 sm:text-lg">
								{hero.description}
							</p>
						)}

						{hero.ctaPrimary?.href && (
							<Link
								href={hero.ctaPrimary.href}
								className="group mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-primary px-7 text-base font-medium text-surface transition duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-[0_18px_42px_-10px_rgba(0,151,178,0.8)]"
							>
								<span className="mdi mdi-arrow-top-right text-xl transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
								{hero.ctaPrimary.label}
							</Link>
						)}
					</FadeUp>
				</div>

				<div className="hidden justify-self-end lg:col-span-4 lg:block">
					<div className="w-64 border border-surface/20 bg-ink/35 p-5 backdrop-blur-md">
						<div className="flex items-center justify-between text-primary-200">
							<span className="mdi mdi-crosshairs-gps text-2xl" aria-hidden="true" />
							<span className="text-[10px] font-medium tracking-[0.24em]">01 / 01</span>
						</div>
						<div className="mt-8 h-px w-full bg-surface/20" />
						<p className="mt-4 text-xs font-medium uppercase leading-relaxed tracking-[0.18em] text-surface/80">
							{hero.headline}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
