"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeLeft } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";

interface HeroCta {
	icon?: string;
	label: string;
	href: string;
}

interface CompanyProfileHeroContent {
	headline: string;
	title: string;
	description?: string;
	ctaPrimary?: HeroCta | null;
}

export function CompanyProfileHero() {
	const { t } = useTranslation(["company-profile"]);
	const hero = t("company-profile:hero", {
		returnObjects: true,
	}) as unknown as CompanyProfileHeroContent;

	return (
		<section className="relative overflow-hidden pt-44 sm:pt-52">
			<Blob className="w-[30rem] h-[30rem] bg-primary-100/50 -top-32 -left-24" opacity={0.5} />
			<Blob className="w-[26rem] h-[26rem] bg-primary/10 -bottom-24 -right-20" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-20">
				<FadeLeft>
					<div className="flex flex-col items-center text-center gap-6">
						<SectionTag>{hero.headline}</SectionTag>

						<h1 className="font-light tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl text-ink max-w-4xl">
							{hero.title}
						</h1>

						{hero.description && (
							<p className="max-w-2xl text-base sm:text-lg text-on-surface/60 leading-relaxed whitespace-pre-line">
								{hero.description}
							</p>
						)}

						{hero.ctaPrimary?.href && (
							<Link
								href={hero.ctaPrimary.href}
								target="_blank"
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-9 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(0,151,178,0.6)]"
							>
								{hero.ctaPrimary.icon && (
									<span className={`mdi mdi-${hero.ctaPrimary.icon} text-xl`} />
								)}
								{hero.ctaPrimary.label}
								<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						)}
					</div>
				</FadeLeft>
			</div>
		</section>
	);
}

export default CompanyProfileHero;
