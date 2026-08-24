import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { getCatalogueItems } from "@/lib/catalogue";
import {
	PRODUCT_LISTING_SORTS,
	type ProductListingSort,
} from "@/components/ui/ProductListing";
import {
	CatalogueHeroSection,
	ProductListingSection,
	CtaSection,
} from "@/components/sections/equipment-sale/equipment-catalogue";

type PageProps = {
	catalogueItems: ReturnType<typeof getCatalogueItems>;
	category: string | null;
	query: string | null;
	sort: ProductListingSort;
};

const Page: NextPage<PageProps> = ({ catalogueItems, category, query, sort }) => {
	return (
		<div className="relative">
			<PageHead pageName="equipment-catalogue" />
			<div className="flex flex-col min-h-screen">
				<CatalogueHeroSection namespace="equipment-catalogue" />
				<ProductListingSection
					namespace="equipment-catalogue"
					items={catalogueItems}
					category={category}
					query={query}
					sort={sort}
				/>
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "equipment-catalogue"]);

	if (!i18nProps) return { notFound: true };

	const locale =
		typeof context.params?.locale === "string"
			? context.params.locale
			: (context.locale ?? "en");

	const rawSort = context.query.sort;
	const sort = Array.isArray(rawSort)
		? rawSort[0]
		: typeof rawSort === "string"
			? rawSort
			: "default";
	const validSort = (PRODUCT_LISTING_SORTS as readonly string[]).includes(sort)
		? (sort as ProductListingSort)
		: "default";

	const pickParam = (name: string): string | null => {
		const raw = context.query[name];
		const value = Array.isArray(raw) ? raw[0] : raw;
		if (typeof value !== "string") return null;
		const trimmed = value.trim().slice(0, 100);
		return trimmed.length > 0 ? trimmed : null;
	};

	return {
		props: {
			...i18nProps,
			catalogueItems: getCatalogueItems(locale),
			category: pickParam("category"),
			query: pickParam("q"),
			sort: validSort,
		},
	};
};

export default Page;