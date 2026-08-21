import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { ProductHeroSection } from "@/components/sections/equipment-sale/ProductHeroSection";
import { ProductOverviewSection } from "@/components/sections/equipment-sale/ProductOverviewSection";
import { ProductModelSection } from "@/components/sections/equipment-sale/ProductModelSection";
import { ProductFeaturesSection } from "@/components/sections/equipment-sale/ProductFeaturesSection";
import { ProductSpecsSection } from "@/components/sections/equipment-sale/ProductSpecsSection";
import { ProductCtaSection } from "@/components/sections/equipment-sale/ProductCtaSection";
import { ProductRelatedSection } from "@/components/sections/equipment-sale/ProductRelatedSection";

const SPEC_GROUP_KEYS = [
	"cameraSystem",
	"flightAndCoverage",
	"accuracyNotes",
	"surveyApplications",
];

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="dji-air-3s" />
			<div className="flex flex-col min-h-screen">
				<ProductHeroSection namespace="dji-air-3s" />
				<ProductOverviewSection namespace="dji-air-3s" />
				<ProductModelSection namespace="dji-air-3s" />
				<ProductFeaturesSection namespace="dji-air-3s" />
				<ProductSpecsSection
					namespace="dji-air-3s"
					groupKeys={SPEC_GROUP_KEYS}
				/>
				<ProductCtaSection namespace="dji-air-3s" />
				<ProductRelatedSection namespace="dji-air-3s" />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "dji-air-3s"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
