import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import HeroSection from "@/components/sections/home/HeroSection";
import { AboutSection } from "@/components/sections/home/AboutSection";
import LeadGenBar from "@/components/sections/home/LeadGenBar";

interface PageProps {
	// Add any additional props fetched server-side here
}

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative ">
			<PageHead pageName="home" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
                <div className="flex flex-col mx-auto max-w-7xl px-6 w-full">
                    <LeadGenBar className="my-12  -mt-48" />
					<AboutSection />
				</div>
			</div>
		</div>
	);
};


export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
        "home"
	]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;