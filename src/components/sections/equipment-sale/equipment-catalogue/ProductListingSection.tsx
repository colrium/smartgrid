"use client";

import { useTranslation } from "@/hooks";
import { Blob } from "@/components/sections/shared/decor";
import {
	ProductListing,
	type ProductListingItem,
	type ProductListingSort,
} from "@/components/ui/ProductListing";

interface ListingHeaderContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

interface ProductListingSectionProps {
	namespace: string;
	/** Server-assembled cards from the products.json registry. When absent, falls back to locale JSON items. */
	items?: ProductListingItem[];
	/** Exact-match category filter (e.g. "drones"). */
	category?: string | null;
	/** Keyword filter applied across title/description/badge/category. */
	query?: string | null;
	sort?: ProductListingSort;
}

export function ProductListingSection({
	namespace,
	items: propItems,
	category = null,
	query = null,
	sort = "default",
}: ProductListingSectionProps) {
	const { t } = useTranslation([namespace]);
	const header = t(`${namespace}:catalogueOverview`, {
		returnObjects: true,
	}) as unknown as ListingHeaderContent;
	const categories = t(`${namespace}:equipmentCategories`, {
		returnObjects: true,
	}) as unknown as { items?: ProductListingItem[] | null };
	const items =
		propItems && propItems.length > 0
			? propItems
			: Array.isArray(categories?.items)
				? categories.items
				: [];

	if (items.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />
			<Blob className="w-[26rem] h-[26rem] bg-primary/5 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<ProductListing
					items={items}
					category={category}
					query={query}
					sort={sort}
					header={{
						tag: header.tag ?? null,
						headline: header.headline ?? null,
						description: header.description ?? null,
					}}
				/>
			</div>
		</section>
	);
}

export default ProductListingSection;
