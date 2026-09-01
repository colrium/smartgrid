import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	CivilHeroSection,
	CivilServicesSection,
	CivilProcessSection,
	CivilDeliverablesSection,
} from "@/components/sections/civil/landing";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="civil" />
			<div className="flex flex-col min-h-screen">
				<CivilHeroSection />
				<CivilServicesSection />
				<CivilProcessSection />
				<CivilDeliverablesSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "civil/landing"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
