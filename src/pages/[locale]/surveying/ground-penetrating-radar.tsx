import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	GprServiceHero,
	GprTechnicalProposalCta,
	GprHighlightsBar,
	GprJumpNav,
	GprOverviewSection,
	GprMethodologySection,
	GprApplicationsSection,
	GprDetectSection,
	GprDeliverablesSection,
	GprSueComplianceSection,
	GprLimitationsSection,
	GprBeforeAfterSection,
	GprTechnologySection,
	GprSummarySection,
	GprFinalCtaSection,
	FeaturedProjectsSection,
	GprFaqSection,
} from "@/components/sections/surveying/ground-penetrating-radar";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="ground-penetrating-radar" />
			<div className="flex flex-col min-h-screen">
				<GprServiceHero />
				<GprTechnicalProposalCta />
				<GprHighlightsBar />
				<GprJumpNav />
				<GprOverviewSection />
				<GprMethodologySection />
				<GprApplicationsSection />
				<GprDetectSection />
				<GprDeliverablesSection />
				<GprSueComplianceSection />
				<GprLimitationsSection />
				<GprBeforeAfterSection />
				<GprTechnologySection />
				<FeaturedProjectsSection />
				<GprSummarySection />
				<GprFaqSection />
				<GprFinalCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/ground-penetrating-radar"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
