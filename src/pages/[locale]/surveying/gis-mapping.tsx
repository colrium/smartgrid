import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	GisHeroSection,
	WhatIsGisSection,
	GisConsultationCtaSection,
	GisImportanceSection,
	GisServicesSection,
	// RemoteSensingSection,
	// MappingServicesSection,
	GisIndustriesSection,
	GisTechStackSection,
	GisWhatsappCtaSection,
	GisComponentsSection,
	GisWhySmartgridSection,
	GisAnalystCtaSection,
	GisDataAccuracySection,
	GisBeforeAfterSection,
	GisProjectImpactSection,
	GisRelatedServicesSection,
} from "@/components/sections/surveying/gis-mapping";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="gis-mapping" />
			<div className="flex flex-col min-h-screen">
				<GisHeroSection />
				<WhatIsGisSection />
				<GisConsultationCtaSection />
				<GisImportanceSection />
				<GisServicesSection />
				{/* <RemoteSensingSection />
				<MappingServicesSection /> */}
				<GisIndustriesSection />
				<GisTechStackSection />
				<GisWhatsappCtaSection />
				<GisComponentsSection />
				<GisWhySmartgridSection />				
				<GisDataAccuracySection />
				<GisBeforeAfterSection />
				<GisProjectImpactSection />
				<GisRelatedServicesSection />
                <GisAnalystCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/gis-mapping"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
