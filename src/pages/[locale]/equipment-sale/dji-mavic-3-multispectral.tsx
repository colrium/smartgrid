import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { ProductHeroSection } from "@/components/sections/equipment-sale/ProductHeroSection";
import { ProductOverviewSection } from "@/components/sections/equipment-sale/ProductOverviewSection";
import { ProductFeaturesSection } from "@/components/sections/equipment-sale/ProductFeaturesSection";
import { ProductSpecsSection } from "@/components/sections/equipment-sale/ProductSpecsSection";
import { ProductCtaSection } from "@/components/sections/equipment-sale/ProductCtaSection";
import { ProductRelatedSection } from "@/components/sections/equipment-sale/ProductRelatedSection";

const SPEC_GROUP_KEYS = [
	"sensorSpecifications",
	"mappingCapabilities",
	"surveyApplications",
];

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="dji-mavic-3-multispectral" />
			<div className="flex flex-col min-h-screen">
				<ProductHeroSection namespace="dji-mavic-3-multispectral" />
				<ProductOverviewSection namespace="dji-mavic-3-multispectral" />
				<ProductFeaturesSection namespace="dji-mavic-3-multispectral" />
				<ProductSpecsSection
					namespace="dji-mavic-3-multispectral"
					groupKeys={SPEC_GROUP_KEYS}
				/>
				<ProductCtaSection namespace="dji-mavic-3-multispectral" />
				<ProductRelatedSection namespace="dji-mavic-3-multispectral" />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "dji-mavic-3-multispectral"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
