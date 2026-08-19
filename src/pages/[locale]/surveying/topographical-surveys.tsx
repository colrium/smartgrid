import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	TopographicalHeroSection,
	IntroSection,
	WhatWeOfferSection,
	DetailedSurveysSection,
	SampleMapSection,
	InstrumentsSection,
	WhyConductSection,
} from "@/components/sections/surveying/topographical";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="topographical-surveys" />
			<div className="flex flex-col min-h-screen">
				<TopographicalHeroSection />
				<IntroSection />
				<WhatWeOfferSection />
				<DetailedSurveysSection />
				<SampleMapSection />
				<InstrumentsSection />
				<WhyConductSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "topographical-surveys"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
