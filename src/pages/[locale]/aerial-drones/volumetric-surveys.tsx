import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	HeroSection,
	IntroSection,
	MaximizeProductivitySection,
	DroneTechLeverageSection,
	ServicesSection,
	BoostAccuracySection,
	CtaSection,
} from "@/components/sections/aerial-drones/volumetric-surveys";


type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="volumetric-surveys" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<IntroSection />
				<MaximizeProductivitySection />
				<DroneTechLeverageSection />
				<ServicesSection />
				<BoostAccuracySection />
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "volumetric-surveys"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
