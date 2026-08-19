import type { GetServerSideProps, NextPage } from "next";

import { getI18nProps } from "@/lib/i18n";
import PageHead from "@/components/Head";
import { ContactFormSection } from "@/components/sections";
import {
	ContactHeroSection,
	TalkToUsSection,
	OfficesSection,
} from "@/components/sections/contact";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="contact" />
			<ContactHeroSection />
			<TalkToUsSection />
			<OfficesSection />
			<ContactFormSection />
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
        "meta",
        "contact"
	]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
