import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { EquipmentHeroSection } from "@/components/sections/equipment-sale/EquipmentHeroSection";
import {
	ProductOverviewSection,
	SpecificationsSection,
	SaleBannerSection,
	CtaSection,
	RelatedProductsSection,
} from "@/components/sections/equipment-sale/total-station-esurvey";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="total-station-esurvey" />
			<div className="flex flex-col min-h-screen">
				<EquipmentHeroSection namespace="total-station-esurvey" />
				<ProductOverviewSection />
				<SpecificationsSection />
				<SaleBannerSection />
				<CtaSection />
				<RelatedProductsSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "total-station-esurvey"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;