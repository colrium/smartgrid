"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import type { MediaImage } from "@/lib/types";

export interface ProductListingCta {
	icon?: string;
	label: string;
	href: string;
}

export interface ProductListingPrice {
	prefix?: string | null;
	currency: string;
	amount: number;
}

export interface ProductListingItem {
	slug?: string;
	category?: string | null;
	icon?: string | null;
	title: string;
	description: string;
	image?: string | MediaImage | null;
	badge?: string | null;
	price?: ProductListingPrice | null;
	ctaPrimary?: ProductListingCta | null;
}

export type ProductListingSort =
	| "default"
	| "title-asc"
	| "title-desc"
	| "price-asc"
	| "price-desc";

export const PRODUCT_LISTING_SORTS: readonly ProductListingSort[] = [
	"default",
	"title-asc",
	"title-desc",
	"price-asc",
	"price-desc",
];

interface ListingHeader {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
}

export interface ProductListingProps {
	items: ProductListingItem[];
	/** Exact-match category filter (item.category). */
	category?: string | null;
	/** Keyword filter: every whitespace-separated token must appear in title/description/badge/category. */
	query?: string | null;
	sort?: ProductListingSort;
	header?: ListingHeader | null;
	columns?: 2 | 3 | 4;
	emptyMessage?: ReactNode;
	className?: string;
}

const formatAmount = (amount: number) => amount.toLocaleString("en-US");

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

/** Single-pass normalize + tokenize done once per items identity change. */
function buildCorpus(item: ProductListingItem): string {
	return [item.title, item.description, item.badge, item.category]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();
}

function applyFilterSort(
	items: ProductListingItem[],
	category: string | null,
	query: string | null,
	sort: ProductListingSort,
): ProductListingItem[] {
	const tokens = (query ?? "")
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean);

	const corpus = new Map<ProductListingItem, string>();
	let filtered = items;

    if (category) {
        
        filtered = filtered.filter((item) => item.category === category);
        console.log("filtered", filtered);
	}
	if (tokens.length > 0) {
		filtered = filtered.filter((item) => {
			let hay = corpus.get(item);
			if (hay === undefined) {
				hay = buildCorpus(item);
				corpus.set(item, hay);
			}
			return tokens.every((token) => hay.includes(token));
		});
	}

	if (sort === "default") return filtered;

	const sorted = [...filtered];
	switch (sort) {
		case "title-asc":
			sorted.sort((a, b) => collator.compare(a.title, b.title));
			break;
		case "title-desc":
			sorted.sort((a, b) => collator.compare(b.title, a.title));
			break;
		case "price-asc":
		case "price-desc": {
			const dir = sort === "price-asc" ? 1 : -1;
			sorted.sort((a, b) => {
				const pa = a.price?.amount ?? null;
				const pb = b.price?.amount ?? null;
				// Items without a price always sink to the bottom.
				if (pa === null && pb === null) return 0;
				if (pa === null) return 1;
				if (pb === null) return -1;
				return (pa - pb) * dir;
			});
			break;
		}
	}
	return sorted;
}

const GRID_COLS: Record<number, string> = {
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Reusable product listing grid with keyword/category filtering and sorting.
 * Purely props-driven (no i18n coupling): filtering runs client-side over the
 * already-assembled `items` in a single memoized pass, so wiring URL search
 * params is just passing them down as props.
 */
export function ProductListing({
	items,
	category = null,
	query = null,
	sort = "default",
	header = null,
	columns = 3,
	emptyMessage = "No products match your filters.",
	className = "",
}: ProductListingProps) {
	const visible = useMemo(
		() => applyFilterSort(items, category, query, sort),
		[items, category, query, sort],
	);

	return (
		<div className={className}>
			{header && (header.headline || header.tag || header.description) && (
				<FadeUp>
					<SectionHeader
						tag={header.tag ?? undefined}
						headline={header.headline ?? ""}
						description={header.description ?? undefined}
						align="center"
					/>
				</FadeUp>
			)}

			{visible.length > 0 ? (
				<div
					className={`mt-14 sm:mt-20 grid grid-cols-1 ${GRID_COLS[columns] ?? GRID_COLS[3]} gap-6 sm:gap-8`}
				>
					{visible.map((item, index) => (
						<FadeUp
							key={item.slug ?? `${item.title}-${index}`}
							delay={(index % columns) * 0.07}
							className="h-full"
						>
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
			) : (
				<p className="py-16 text-center text-sm text-on-surface/55">{emptyMessage}</p>
			)}
		</div>
	);
}

function CardBody({ item }: { item: ProductListingItem }) {
	const hasImage =
		typeof item.image === "string"
			? item.image.startsWith("/")
			: Boolean(item.image);

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

export default ProductListing;
