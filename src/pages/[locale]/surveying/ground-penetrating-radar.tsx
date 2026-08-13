import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	GprHeroSection,
	WhatIsGprSurveyingSection,
	GprLmx200Section,
	PrecisionBelowAndAboveSection,
	WhatWeDoSection,
	WhyUseLmx200Section,
	Lmx200FeaturesSection,
	FeaturedProjectsSection,
	GprImagesSliderSection,
} from "@/components/sections/surveying/ground-penetrating-radar";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="ground-penetrating-radar" />
			<div className="flex flex-col min-h-screen">
				<GprHeroSection />
				<WhatIsGprSurveyingSection />
				<GprLmx200Section />
				<PrecisionBelowAndAboveSection />
				<WhatWeDoSection />
				<WhyUseLmx200Section />
				<Lmx200FeaturesSection />
				<FeaturedProjectsSection />
				<GprImagesSliderSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "ground-penetrating-radar"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
