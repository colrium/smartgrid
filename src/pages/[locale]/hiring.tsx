import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	CareersHeroSection,
	CurrentOpeningsSection,
	ApplicationProcessSection,
	EqualOpportunityStatementSection,
} from "@/components/sections/careers";
import { ServicesSection } from "@/components/sections/shared/ServicesSection";
import LeadGenBar from "@/components/sections/shared/LeadGenBar";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="careers" />
			<div className="flex flex-col min-h-screen">
                <CareersHeroSection />
                <div className="flex flex-col mx-auto max-w-7xl px-6 w-full">
                    <LeadGenBar />
                </div>                
                <ServicesSection />
				<CurrentOpeningsSection />
				<ApplicationProcessSection />
				<EqualOpportunityStatementSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "careers"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;