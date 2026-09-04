import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { Deliverables } from "@/components/sections/Deliverables";
import {
	HeroSection,
	WhatAreAsBuiltSurveysSection,
	AsBuiltSolutionsSection,
	KeyIndustriesSection,
	MaxProductivityMinGuessworkSection,
	ApplicationsSection,
	ActionableInsightsSection,
} from "@/components/sections/civil/as-built-surveys";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="civil-as-built-surveys" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<WhatAreAsBuiltSurveysSection />
				<AsBuiltSolutionsSection />
				<KeyIndustriesSection />
				<MaxProductivityMinGuessworkSection />
				<ApplicationsSection />
				<ActionableInsightsSection />
				<Deliverables ns="civil/as-built-surveys" className="bg-surface" />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "civil/as-built-surveys"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;