import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	CadastralHeroSection,
	IntroSection,
	WhyBoundarySurveysSection,
} from "@/components/sections/surveying/cadastral";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="cadastral-surveys" />
			<div className="flex flex-col min-h-screen">
				<CadastralHeroSection />
				<IntroSection />
				<WhyBoundarySurveysSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "cadastral-surveys"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
