import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	CatalogueHeroSection,
	ProductListingSection,
	CtaSection,
} from "@/components/sections/equipment-sale/equipment-catalogue";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="equipment-catalogue" />
			<div className="flex flex-col min-h-screen">
				<CatalogueHeroSection namespace="equipment-catalogue" />
				<ProductListingSection namespace="equipment-catalogue" />
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "equipment-catalogue"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;