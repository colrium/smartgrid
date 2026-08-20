import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { ProductHeroSection } from "@/components/sections/equipment-sale/ProductHeroSection";
import { ProductSpecsSection } from "@/components/sections/equipment-sale/ProductSpecsSection";
import { IncludedInPackageSection } from "@/components/sections/equipment-sale/IncludedInPackageSection";
import {
	ProductOverviewSection,
	KeyFeaturesSection,
	CtaSection,
	RelatedProductsSection,
} from "@/components/sections/equipment-sale/foif-a90-rtk-gnss";

const SPEC_GROUP_KEYS = [
	"engineAndSignal",
	"performance",
	"configurationAndConnectivity",
	"physicalAndBattery",
	"environmentalSpecs",
];

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="foif-a90-rtk-gnss" />
			<div className="flex flex-col min-h-screen">
				<ProductHeroSection namespace="foif-a90-rtk-gnss" />
				<ProductOverviewSection />
				<KeyFeaturesSection />
                <IncludedInPackageSection namespace="foif-a90-rtk-gnss" />
                <ProductSpecsSection
					namespace="foif-a90-rtk-gnss"
					groupKeys={SPEC_GROUP_KEYS}
				/>
				<CtaSection />
				<RelatedProductsSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "foif-a90-rtk-gnss"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;