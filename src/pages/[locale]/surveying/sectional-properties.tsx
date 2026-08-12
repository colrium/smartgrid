import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	SectionalHeroSection,
	IntroSection,
	ServicesImageSection,
	ServicesDetailSection,
	ProcessSection,
	SectionalFaqSection,
	SocialsSection,
} from "@/components/sections/surveying/sectional-properties";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="sectional-properties" />
			<div className="flex flex-col min-h-screen">
				<SectionalHeroSection />
				<IntroSection />
				<ServicesImageSection />
				<ServicesDetailSection />
				<ProcessSection />
				<SectionalFaqSection />
				<SocialsSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "sectional-properties"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
