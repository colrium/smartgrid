"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { Blob } from "@/components/sections/home/decor";

interface ProductCta {
	icon?: string;
	label: string;
	href: string;
}

interface ProductPrice {
	prefix?: string | null;
	currency: string;
	amount: number;
}

interface ProductItem {
	icon?: string | null;
	title: string;
	description: string;
	image?: string | null;
	badge?: string | null;
	price?: ProductPrice | null;
	ctaPrimary?: ProductCta | null;
}

interface ListingHeaderContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

interface ProductListingSectionProps {
	namespace: string;
}

const formatAmount = (amount: number) => amount.toLocaleString("en-US");

export function ProductListingSection({ namespace }: ProductListingSectionProps) {
	const { t } = useTranslation([namespace]);
	const header = t(`${namespace}:catalogueOverview`, {
		returnObjects: true,
	}) as unknown as ListingHeaderContent;
	const categories = t(`${namespace}:equipmentCategories`, {
		returnObjects: true,
	}) as unknown as { items?: ProductItem[] | null };
	const items = Array.isArray(categories?.items) ? categories.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />
			<Blob className="w-[26rem] h-[26rem] bg-primary/5 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader
						tag={header.tag ?? undefined}
						headline={header.headline}
						description={header.description}
						align="center"
					/>
				</FadeUp>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
							{item.ctaPrimary?.href ? (
								<Link
									href={item.ctaPrimary.href}
									className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-surface hairline card-shadow transition-all duration-500 hover:card-shadow-lift hover:border-primary"
								>
									<CardBody item={item} />
								</Link>
							) : (
								<article className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-surface hairline card-shadow transition-all duration-500 hover:card-shadow-lift hover:border-primary">
									<CardBody item={item} />
								</article>
							)}
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

function CardBody({ item }: { item: ProductItem }) {
	const hasImage = typeof item.image === "string" && item.image.startsWith("/");

	return (
		<>
			<div className="relative aspect-[4/3] overflow-hidden border-b border-ink/5 bg-gradient-to-b from-primary-50/70 to-surface">
				{hasImage && (
					<Image
						src={item.image as string}
						alt={item.title}
						fill
						sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						className="object-contain object-center p-7 transition-transform duration-700 ease-out group-hover:scale-110"
					/>
				)}

				{!hasImage && item.icon && (
					<span className="absolute inset-0 m-auto h-16 w-16 rounded-2xl bg-primary-50 text-primary flex items-center justify-center">
						<span className={`mdi mdi-${item.icon} text-3xl`} />
					</span>
				)}

				{item.badge && (
					<span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-surface backdrop-blur">
						{item.badge}
					</span>
				)}

				<span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface/85 text-primary shadow-sm backdrop-blur transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
					<span className="mdi mdi-arrow-right text-base" />
				</span>
			</div>

			<div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
				<h3 className="text-lg font-semibold tracking-tight text-ink leading-snug">
					{item.title}
				</h3>

				<p className="flex-1 text-sm leading-relaxed text-on-surface/60 line-clamp-3">
					{item.description}
				</p>

				<div className="mt-2 flex items-end justify-between gap-3 border-t border-ink/10 pt-5">
					<div className="min-w-0">
						{item.price && (
							<>
								{item.price.prefix && (
									<span className="block text-[11px] uppercase tracking-wider text-on-surface/45">
										{item.price.prefix}
									</span>
								)}
								<span className="block truncate text-xl font-semibold tracking-tight text-ink">
									{item.price.currency} {formatAmount(item.price.amount)}
								</span>
							</>
						)}
					</div>

					{item.ctaPrimary?.label && (
						<span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
							{item.ctaPrimary.label}
							<span className="mdi mdi-arrow-right text-sm transition-transform duration-300 group-hover:translate-x-1" />
						</span>
					)}
				</div>
			</div>
		</>
	);
}

export default ProductListingSection;
