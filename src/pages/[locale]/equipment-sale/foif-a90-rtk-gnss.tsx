import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { EquipmentHeroSection } from "@/components/sections/equipment-sale/EquipmentHeroSection";
import {
	ProductOverviewSection,
	KeyFeaturesSection,
	SpecificationsSection,
	CtaSection,
	RelatedProductsSection,
} from "@/components/sections/equipment-sale/foif-a90-rtk-gnss";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="foif-a90-rtk-gnss" />
			<div className="flex flex-col min-h-screen">
				<EquipmentHeroSection namespace="foif-a90-rtk-gnss" />
				<ProductOverviewSection />
				<KeyFeaturesSection />
				<SpecificationsSection />
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