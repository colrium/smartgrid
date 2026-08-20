"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProductGallery } from "./ProductGallery";
import { EnquiryButtons } from "./EnquiryButtons";

interface EnquiryCta {
	icon?: string;
	label: string;
	href: string;
}

interface QuickFact {
	icon?: string;
	label: string;
	value: string;
}

interface PriceOption {
	label: string;
	currency: string;
	amount: number;
}

interface Category {
	name: string;
	label: string;
	href: string;
}

interface ProductHeroContent {
	tag?: string | null;
	headline: string;
	title: string;
	description?: string;
	image?: string | null;
	ctaPrimary?: EnquiryCta | null;
}

interface BreadcrumbContent {
	home: string;
	section: string;
	sectionHref: string;
}

interface ProductOverviewContent {
	images?: string[] | null;
}

interface CtaContent {
	ctaSecondary?: EnquiryCta | null;
}

interface ProductHeroSectionProps {
	namespace: string;
}

const formatAmount = (amount: number) => amount.toLocaleString("en-US");

export function ProductHeroSection({ namespace }: ProductHeroSectionProps) {
	const { t, tObject } = useTranslation([namespace]);
	const hero = t(`${namespace}:hero`, { returnObjects: true }) as unknown as ProductHeroContent;
	const breadcrumb = t(`${namespace}:breadcrumb`, { returnObjects: true }) as unknown as BreadcrumbContent;
	const quickFacts = (t(`${namespace}:quickFacts`, { returnObjects: true }) as unknown as QuickFact[]) ?? [];
	const pricing = t(`${namespace}:pricing`, { returnObjects: true }) as unknown as Record<string, PriceOption> | null;
	const categories = (t(`${namespace}:categories`, { returnObjects: true }) as unknown as Category[]) ?? [];
	const overview = t(`${namespace}:productOverview`, {
		returnObjects: true,
	}) as unknown as ProductOverviewContent;
	const cta = t(`${namespace}:cta`, { returnObjects: true }) as unknown as CtaContent;

	const priceOptions = pricing
		? Object.keys(pricing)
				.map((key) => pricing[key])
				.filter((price): price is PriceOption => Boolean(price?.amount))
		: [];

	const images = [
		hero.image,
		...(overview.images ?? []),
	].filter((src): src is string => typeof src === "string" && src.startsWith("/"));

	return (
		<section className="relative overflow-hidden pt-44 sm:pt-52">
			<Blob className="w-[30rem] h-[30rem] bg-primary-100/50 -top-32 -left-24" opacity={0.5} />
			<Blob className="w-[26rem] h-[26rem] bg-primary/10 -bottom-24 -right-20" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-24">
				<Breadcrumbs
					className="mb-8 sm:mb-10"
					items={[
						{ label: breadcrumb.home, href: "/" },
						{ label: breadcrumb.section, href: breadcrumb.sectionHref },
						{ label: hero.title },
					]}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					<FadeLeft className="lg:col-span-7">
						<ProductGallery images={images} alt={hero.title} />
					</FadeLeft>

					<FadeRight delay={0.08} className="lg:col-span-5 lg:sticky lg:top-28">
						<div className="flex flex-col gap-6">
							{hero.tag && <SectionTag className="justify-start">{hero.tag}</SectionTag>}

							<h1 className="font-light tracking-tight leading-[1.05] text-4xl sm:text-5xl text-ink">
								{hero.title}
							</h1>

							{hero.description && (
								<p className="text-base sm:text-lg text-on-surface/60 leading-relaxed whitespace-pre-line">
									{hero.description}
								</p>
							)}

							{categories.length > 0 && (
								<div className="flex flex-wrap items-center gap-2">
									{categories.map((category) => (
										<Link
											key={category.name}
											href={category.href}
											className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-medium text-primary transition-colors duration-300 hover:bg-primary hover:text-surface"
										>
											<span className="mdi mdi-folder-outline text-sm" />
											{category.label}
										</Link>
									))}
								</div>
							)}

							{priceOptions.length > 0 && (
								<div className="grid grid-cols-2 gap-3 sm:gap-4">
									{priceOptions.map((price) => (
										<div
											key={price.label}
											className="rounded-2xl bg-surface hairline card-shadow p-4 sm:p-5"
										>
											<span className="text-[11px] uppercase tracking-wider text-on-surface/50">
												{price.label}
											</span>
											<span className="mt-1.5 block text-xl sm:text-2xl font-semibold tracking-tight text-ink">
												{price.currency}{" "}
												{formatAmount(price.amount)}
											</span>
										</div>
									))}
								</div>
							)}

							{quickFacts.length > 0 && (
								<div className="grid grid-cols-2 gap-3 sm:gap-4">
									{quickFacts.map((fact, index) => (
										<div
											key={index}
											className="flex items-center gap-3 rounded-2xl bg-surface hairline card-shadow p-4"
										>
											<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
												{fact.icon && <span className={`mdi mdi-${fact.icon} text-xl`} />}
											</span>
											<span className="flex min-w-0 flex-col">
												<span className="text-[11px] uppercase tracking-wider text-on-surface/50">
													{fact.label}
												</span>
												<span className="text-sm font-medium text-ink leading-snug">
													{fact.value}
												</span>
											</span>
										</div>
									))}
								</div>
							)}

							<div className="mt-2 flex flex-col gap-5 border-t border-ink/10 pt-6">
								<EnquiryButtons primary={hero.ctaPrimary} secondary={cta.ctaSecondary} />
							</div>
						</div>
					</FadeRight>
				</div>
			</div>
		</section>
	);
}

export default ProductHeroSection;