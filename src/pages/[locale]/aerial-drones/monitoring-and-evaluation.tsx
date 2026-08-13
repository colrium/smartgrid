import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	HeroSection,
	DrivingSustainabilitySection,
	OurCapabilitiesSection,
	TechWeUseSection,
	ImpactSection,
	WhyPartnerWithUsSection,
	SmartMonitoringSection,
	WhatWeOfferSection,
	CtaSection,
} from "@/components/sections/aerial-drones/monitoring-and-evaluation";


type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="monitoring-and-evaluation" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<DrivingSustainabilitySection />
				<OurCapabilitiesSection />
				<TechWeUseSection />
				<ImpactSection />
				<WhyPartnerWithUsSection />
				<SmartMonitoringSection />
				<WhatWeOfferSection />
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "monitoring-and-evaluation"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
