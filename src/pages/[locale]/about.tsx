import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	HeroSection,
	OurStorySection,
	AerialSurveyingSection,
	ServicesByImagesSection,
	DronePhotographyImageSliderSection,
	LandSurveyingSection,
	LandSurveyingImagesSection,
	ImpactAcrossAfricaSection,
	WhyChooseSmartGridSection,
	ProjectsCompletedImagesMasonrySection,
} from "@/components/sections/about";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="about" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<OurStorySection />
				<AerialSurveyingSection />
				<ServicesByImagesSection />
				<DronePhotographyImageSliderSection />
				<LandSurveyingSection />
				<LandSurveyingImagesSection />
				<ImpactAcrossAfricaSection />
				<WhyChooseSmartGridSection />
				<ProjectsCompletedImagesMasonrySection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "about"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;