import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { ProductHeroSection } from "@/components/sections/equipment-sale/ProductHeroSection";
import { ProductSpecsSection } from "@/components/sections/equipment-sale/ProductSpecsSection";
import { IncludedInPackageSection } from "@/components/sections/equipment-sale/IncludedInPackageSection";
import {
	CtaSection,
	RelatedProductsSection,
} from "@/components/sections/equipment-sale/total-station-dtm-152m";

const SPEC_GROUP_KEYS = [
	"measurementCapability",
	"accuracyAndPerformance",
	"dataAndInterface",
	"buildAndDurability",
	"applications",
];

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="total-station-dtm-152m" />
			<div className="flex flex-col min-h-screen">
				<ProductHeroSection namespace="total-station-dtm-152m" />
				<IncludedInPackageSection namespace="total-station-dtm-152m" />
				<ProductSpecsSection
					namespace="total-station-dtm-152m"
					groupKeys={SPEC_GROUP_KEYS}
				/>
				<CtaSection />
				<RelatedProductsSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "total-station-dtm-152m"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
