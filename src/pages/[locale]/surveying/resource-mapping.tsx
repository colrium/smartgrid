import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	ResourceMappingHeroSection,
	WhatIsResourceMappingSection,
	TypesOfResourceMappingSection,
	ResourceMappingWorkflowSection,
	ResourceMappingDeliverablesSection,
	WhoUsesResourceMappingSection,
	ResourceMappingTechStackSection,
	DataAccuracySection,
	FinalCtaSection,
	AgricultureSection,
	UtilitiesEnergySection,
	QuarryMiningSection,
	ConstructionCivilSection,
	EnvironmentalConservationSection,
	DisasterRiskReductionSection,
	WhyStandOutSection,
} from "@/components/sections/surveying/resource-mapping";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="resource-mapping" />
			<div className="flex flex-col min-h-screen">
				<ResourceMappingHeroSection />
				<WhatIsResourceMappingSection />
				<TypesOfResourceMappingSection />
				<AgricultureSection />
				<UtilitiesEnergySection />
				<QuarryMiningSection />
				<ConstructionCivilSection />
				<EnvironmentalConservationSection />
				<DisasterRiskReductionSection />
				<WhyStandOutSection />
				<ResourceMappingWorkflowSection />
				<ResourceMappingDeliverablesSection />
				<WhoUsesResourceMappingSection />
				<ResourceMappingTechStackSection />
				<DataAccuracySection />
				<FinalCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/resource-mapping"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
