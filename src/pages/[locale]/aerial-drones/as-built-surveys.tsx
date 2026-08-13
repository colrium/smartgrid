import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	AsBuiltHeroSection,
	WhyUseDronesSection,
	ProcessSection,
	MetricsSection,
	CtaSection,
} from "@/components/sections/aerial-drones/as-built-surveys";


type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="aerial-drones-as-built-surveys" />
			<div className="flex flex-col min-h-screen">
				<AsBuiltHeroSection />
				<WhyUseDronesSection />
				<ProcessSection />
				<MetricsSection />
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
		"aerial-drones-as-built-surveys",
	]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
