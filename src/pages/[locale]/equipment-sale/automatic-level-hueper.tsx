import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { EquipmentHeroSection } from "@/components/sections/equipment-sale/EquipmentHeroSection";
import {
	ImagesSection,
	SpecificationsSection,
	SaleBannerSection,
	CtaSection,
	RelatedProductsSection,
} from "@/components/sections/equipment-sale/automatic-level-hueper";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="automatic-level-hueper" />
			<div className="flex flex-col min-h-screen">
				<EquipmentHeroSection namespace="automatic-level-hueper" />
				<ImagesSection />
				<SpecificationsSection />
				<SaleBannerSection />
				<CtaSection />
				<RelatedProductsSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "automatic-level-hueper"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;