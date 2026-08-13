import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	LidarHeroSection,
	IndustriesWeServeSection,
	WhyChooseLidarSection,
	LidarPowerlineSection,
	ForestrySection,
	ConstructionSection,
	LidarCtaSection,
	HowItWorksSection,
} from "@/components/sections/aerial-drones/lidar-mapping";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="lidar-mapping" />
			<div className="flex flex-col min-h-screen">
				<LidarHeroSection />
				<IndustriesWeServeSection />
				<WhyChooseLidarSection />
				<LidarPowerlineSection />
				<ForestrySection />
				<ConstructionSection />
				<HowItWorksSection />
				<LidarCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "lidar-mapping"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
