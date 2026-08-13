import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import AerialHeroSection from "@/components/sections/surveying/aerial/AerialHeroSection";
import IntroSection from "@/components/sections/surveying/aerial/IntroSection";
import AerialServicesSection from "@/components/sections/surveying/aerial/AerialServicesSection";
import PrecisionSection from "@/components/sections/surveying/aerial/PrecisionSection";
import AerialSurveyingSection from "@/components/sections/surveying/aerial/AerialSurveyingSection";
import DeliverablesSection from "@/components/sections/surveying/aerial/DeliverablesSection";
import ProjectsSection from "@/components/sections/surveying/aerial/ProjectsSection";
import AdditionalServicesSection from "@/components/sections/surveying/aerial/AdditionalServicesSection";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="aerial-surveys" />
			<div className="flex flex-col min-h-screen">
				<AerialHeroSection />
				<IntroSection />
				<AerialServicesSection />
				<PrecisionSection />
				<AerialSurveyingSection />
				<DeliverablesSection />
				<ProjectsSection />
				<AdditionalServicesSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "aerial-surveys"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
