import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "@/hooks";
import { getI18nProps } from "@/lib/i18n";
import { ErrorPageSection } from "@/components/sections";

type PageProps = {
	// Add custom props here
};

const NotFoundPage: NextPage<PageProps> = () => {
    const { t } = useTranslation(["common", "meta"]);
    const siteTitle = t("meta:site.title", { defaultValue: "" });
	const title = t("common:errors.notFoundTitle");
	const description = t("common:errors.notFoundDescription");

	return (
		<div className="relative">
			<Head>
				<title>
					{t("common:errors.pageTitle", {
						statusCode: 404,
						title,
					})} | {siteTitle}
				</title>
				<meta name="description" content={description} />
			</Head>
			<ErrorPageSection
				statusCode={404}
				statusLabel={t("common:errors.statusLabel", { statusCode: 404 })}
				title={title}
				description={description}
				homeLabel={t("common:errors.actions.home")}
				contactLabel={t("common:errors.actions.contact")}
			/>
		</div>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta"]);
	return { props: { ...i18nProps } };
};

export default NotFoundPage;
