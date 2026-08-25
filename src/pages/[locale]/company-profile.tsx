import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	CompanyProfileHero,
	CompanyStatsStrip,
	CompanyAboutSection,
	CompanyMissionVisionSection,
	CompanyServicesSection,
	CompanyWhyUsSection,
	CompanyProfileViewerSection,
} from "@/components/sections/company-profile";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="company-profile" />
			<div className="flex flex-col min-h-screen">
				<CompanyProfileHero />
				<CompanyStatsStrip />
				<CompanyAboutSection />
				<CompanyMissionVisionSection />
				<CompanyServicesSection />
				<CompanyWhyUsSection />
				<CompanyProfileViewerSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "company-profile"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
