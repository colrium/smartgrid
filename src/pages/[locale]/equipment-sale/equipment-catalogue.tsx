import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { getCatalogueItems } from "@/lib/catalogue";
import {
	CatalogueHeroSection,
	ProductListingSection,
	CtaSection,
} from "@/components/sections/equipment-sale/equipment-catalogue";

type PageProps = {
	catalogueItems: ReturnType<typeof getCatalogueItems>;
};

const Page: NextPage<PageProps> = ({ catalogueItems }) => {
	return (
		<div className="relative">
			<PageHead pageName="equipment-catalogue" />
			<div className="flex flex-col min-h-screen">
				<CatalogueHeroSection namespace="equipment-catalogue" />
				<ProductListingSection namespace="equipment-catalogue" items={catalogueItems} />
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

	return { props: { ...i18nProps, catalogueItems: getCatalogueItems(locale) } };
};

export default Page;