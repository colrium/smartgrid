import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	AgriculturalNdviHeroSection,
	WhyUseDronesSection,
	ProcessSection,
} from "@/components/sections/aerial-drones/agricultural-ndvi-mapping";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="agricultural-ndvi-mapping" />
			<div className="flex flex-col min-h-screen">
				<AgriculturalNdviHeroSection />
				<WhyUseDronesSection />
				<ProcessSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "agricultural-ndvi-mapping"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;