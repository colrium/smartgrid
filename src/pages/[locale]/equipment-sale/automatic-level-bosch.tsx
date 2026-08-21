import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { ProductHeroSection } from "@/components/sections/equipment-sale/ProductHeroSection";
import { ProductSpecsSection } from "@/components/sections/equipment-sale/ProductSpecsSection";
import {
	CtaSection,
	RelatedProductsSection,
} from "@/components/sections/equipment-sale/automatic-level-bosch";

const SPEC_GROUP_KEYS = [
	"opticalPerformance",
	"accuracyAndLeveling",
	"buildAndDurability",
	"operationAndFeatures",
	"applications",
];

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="automatic-level-bosch" />
			<div className="flex flex-col min-h-screen">
				<ProductHeroSection namespace="automatic-level-bosch" />
				<ProductSpecsSection
					namespace="automatic-level-bosch"
					groupKeys={SPEC_GROUP_KEYS}
				/>
				<CtaSection />
				<RelatedProductsSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "automatic-level-bosch"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
