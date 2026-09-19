import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
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
	/** Keystatic page when the `resource-mapping` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7/M11): Keystatic owns the whole page
	// when the slug is allowlisted via `KEYSTATIC_PAGES` and the entry is
	// published. Otherwise the legacy locale-JSON implementation renders
	// unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="resource-mapping" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

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

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("resource-mapping", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
