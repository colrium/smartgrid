import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	HeroSection,
	OurServicesSection,
	OurInstrumentsSection,
	FaqSection,
} from "@/components/sections/civil/site-setting-out";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="civil-site-setting-out" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<OurServicesSection />
				<OurInstrumentsSection />
				<FaqSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "civil-site-setting-out"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;