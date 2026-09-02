import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import AerialHeroSection from "@/components/sections/surveying/aerial/AerialHeroSection";
import IntroSection from "@/components/sections/surveying/aerial/IntroSection";
import WhyDroneSurveysSection from "@/components/sections/surveying/aerial/WhyDroneSurveysSection";
import AerialServicesSection from "@/components/sections/surveying/aerial/AerialServicesSection";
import PrecisionSection from "@/components/sections/surveying/aerial/PrecisionSection";
import AerialWorkflowSection from "@/components/sections/surveying/aerial/AerialWorkflowSection";
import AerialSurveyingSection from "@/components/sections/surveying/aerial/AerialSurveyingSection";
import DeliverablesSection from "@/components/sections/surveying/aerial/DeliverablesSection";
import AerialIndustriesSection from "@/components/sections/surveying/aerial/AerialIndustriesSection";
import IndustryCtaSection from "@/components/sections/surveying/aerial/IndustryCtaSection";
import ProjectsSection from "@/components/sections/surveying/aerial/ProjectsSection";
import TechStackSection from "@/components/sections/surveying/aerial/TechStackSection";
import CapabilityCtaSection from "@/components/sections/surveying/aerial/CapabilityCtaSection";
import AdditionalServicesSection from "@/components/sections/surveying/aerial/AdditionalServicesSection";
import AerialFinalCtaSection from "@/components/sections/surveying/aerial/AerialFinalCtaSection";

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
				<WhyDroneSurveysSection />
				<AerialServicesSection />
				<PrecisionSection />
				<AerialWorkflowSection />
				<AerialSurveyingSection />
				<DeliverablesSection />
				<AerialIndustriesSection />
				<IndustryCtaSection />
				<ProjectsSection />
				<TechStackSection />
				<CapabilityCtaSection />
				<AdditionalServicesSection />
				<AerialFinalCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/aerial-surveys"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
