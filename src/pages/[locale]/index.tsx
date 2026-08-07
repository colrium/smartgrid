import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";

interface PageProps {
	// Add any additional props fetched server-side here
}

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative ">
			<PageHead pageName="home" />

		</div>
	);
};


export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta"
	]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;