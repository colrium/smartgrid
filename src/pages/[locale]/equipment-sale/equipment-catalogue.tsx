import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { EquipmentHeroSection } from "@/components/sections/equipment-sale/EquipmentHeroSection";
import {
	CatalogueOverviewSection,
	EquipmentCategoriesSection,
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
				<EquipmentHeroSection namespace="equipment-catalogue" />
				<CatalogueOverviewSection />
				<EquipmentCategoriesSection />
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