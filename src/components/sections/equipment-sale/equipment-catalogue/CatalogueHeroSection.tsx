"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";
import { Breadcrumbs } from "@/components/sections/equipment-sale/Breadcrumbs";

interface HeroCta {
	icon?: string;
	label: string;
	href: string;
}

interface BreadcrumbContent {
	home: string;
	section: string;
	sectionHref: string;
}

interface CatalogueHeroContent {
	headline: string;
	title: string;
	description?: string;
	image?: string | null;
	ctaPrimary?: HeroCta | null;
}

interface CtaContent {
	ctaSecondary?: HeroCta | null;
}

interface OverviewContent {
	tag?: string | null;
}

interface CatalogueHeroSectionProps {
	namespace: string;
}

export function CatalogueHeroSection({ namespace }: CatalogueHeroSectionProps) {
	const { t } = useTranslation([namespace]);
	const hero = t(`${namespace}:hero`, { returnObjects: true }) as unknown as CatalogueHeroContent;
	const breadcrumb = t(`${namespace}:breadcrumb`, { returnObjects: true }) as unknown as BreadcrumbContent;
	const overview = t(`${namespace}:catalogueOverview`, { returnObjects: true }) as unknown as OverviewContent;
	const cta = t(`${namespace}:cta`, { returnObjects: true }) as unknown as CtaContent;

	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");

	return (
		<section className="relative overflow-hidden pt-44 sm:pt-52">
			<Blob className="w-[30rem] h-[30rem] bg-primary-100/50 -top-32 -left-24" opacity={0.5} />
			<Blob className="w-[26rem] h-[26rem] bg-primary/10 -bottom-24 -right-20" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-20">
				<Breadcrumbs
					className="mb-8 sm:mb-10"
					items={[
						{ label: breadcrumb.home, href: "/" },
						{ label: breadcrumb.section, href: breadcrumb.sectionHref },
					]}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeLeft className="lg:col-span-7">
						<div className="flex flex-col gap-6">
							{hero.headline && (
								<SectionTag className="justify-start">{hero.headline}</SectionTag>
							)}

							<h1 className="font-light tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl text-ink">
								{hero.title}
							</h1>

							{hero.description && (
								<p className="max-w-xl text-base sm:text-lg text-on-surface/60 leading-relaxed whitespace-pre-line">
									{hero.description}
								</p>
							)}

							{(hero.ctaPrimary?.href || cta.ctaSecondary?.href) && (
								<div className="mt-2 flex flex-wrap items-center gap-4">
									{hero.ctaPrimary?.href && (
										<Link
											href={hero.ctaPrimary.href}
											className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(0,151,178,0.6)]"
										>
											{hero.ctaPrimary.icon && (
												<span className={`mdi mdi-${hero.ctaPrimary.icon} text-xl`} />
											)}
											{hero.ctaPrimary.label}
											<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
										</Link>
									)}

									{cta.ctaSecondary?.href && (
										<Link
											href={cta.ctaSecondary.href}
											className="group inline-flex items-center gap-3 h-14 rounded-full border border-ink/15 px-8 text-ink font-medium text-base transition-all duration-300 hover:border-primary hover:text-primary"
										>
											{cta.ctaSecondary.icon && (
												<span className={`mdi mdi-${cta.ctaSecondary.icon} text-xl`} />
											)}
											{cta.ctaSecondary.label}
										</Link>
									)}
								</div>
							)}
						</div>
					</FadeLeft>

					<FadeRight delay={0.08} className="lg:col-span-5">
						{hasImage && (
							<div className="relative mx-auto max-w-md lg:max-w-none">
								<div className="absolute inset-6 bg-primary/15 rounded-full blur-3xl" />

								<div className="relative bg-surface p-6 sm:p-8 rounded-[20px] hairline card-shadow">
									<div className="relative aspect-square rounded-[15px] overflow-hidden bg-primary-50/60">
										<Image
											src={hero.image as string}
											alt={hero.title}
											fill
											priority
											sizes="(min-width: 1024px) 40vw, 100vw"
											className="object-contain object-center"
										/>
									</div>

									{overview.tag && (
										<span className="absolute -bottom-5 left-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-surface card-shadow">
											<span className="mdi mdi-check-decagram text-base text-primary-300" />
											{overview.tag}
										</span>
									)}
								</div>
							</div>
						)}
					</FadeRight>
				</div>
			</div>
		</section>
	);
}

export default CatalogueHeroSection;
