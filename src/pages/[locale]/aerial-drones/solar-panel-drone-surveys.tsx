import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	HeroSection,
	WhatWeDoSection,
	DroneIntegrationProcessSection,
	CtaSection,
} from "@/components/sections/aerial-drones/solar-panel-drone-surveys";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="solar-panel-drone-surveys" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<WhatWeDoSection />
				<DroneIntegrationProcessSection />
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "solar-panel-drone-surveys"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
