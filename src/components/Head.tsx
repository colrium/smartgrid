// @ts-nocheck
import NextHead from "next/head";
import { useTranslation } from "react-i18next";

type HeadProps = {
	pageName: string;
};

export default function Head({ pageName }: HeadProps) {
	const { t } = useTranslation(["meta"]);
	const pageKey = `meta:pages.${pageName}`;
	const siteTitle = t("meta:site.title", { defaultValue: "" });
	const title = t(`${pageKey}.page_title`, {
		defaultValue: t(`${pageKey}.title`, { defaultValue: "" }),
		site_title: siteTitle,
	});
	const description = t(`${pageKey}.meta_description`, {
		defaultValue: t(`${pageKey}.description`, { defaultValue: "" }),
		site_title: siteTitle,
	});
	const ogImage = t(`${pageKey}.og_image`, {
		defaultValue: "",
		site_title: siteTitle,
	});

	return (
		<NextHead>
			{title && (
				<title>
					{title} | {siteTitle}
				</title>
			)}
			{description && <meta name="description" content={description} />}
			{title && <meta property="og:title" content={title} />}
			{description && <meta property="og:description" content={description} />}
			{ogImage && <meta property="og:image" content={ogImage} />}
		</NextHead>
	);
}
