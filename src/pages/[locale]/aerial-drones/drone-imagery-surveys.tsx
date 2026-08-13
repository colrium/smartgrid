import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	DroneImageryHeroSection,
	WhatWeOfferSection,
	WhyDronesMatterSection,
	AerialSurveyDeliverablesSection,
	DronesSection,
	ProjectsAcrossAfricaSection,
} from "@/components/sections/aerial-drones/drone-imagery-surveys";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="drone-imagery-surveys" />
			<div className="flex flex-col min-h-screen">
				<DroneImageryHeroSection />
				<WhatWeOfferSection />
				<WhyDronesMatterSection />
				<AerialSurveyDeliverablesSection />
				<DronesSection />
				<ProjectsAcrossAfricaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "drone-imagery-surveys"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
