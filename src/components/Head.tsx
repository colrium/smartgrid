// @ts-nocheck
import NextHead from "next/head";
import { useTranslation } from "@/hooks";
import { useRouter } from "next/router";

type HeadProps = {
	pageName: string;
};

const SITE_URL = "https://smartgridsurveying.com";
const LOCALES = ["en", "sw"] as const;

function toAbsoluteUrl(value: string): string {
	if (/^https?:\/\//i.test(value)) return value;
	return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function splitLocalePath(path: string): { locale: string; path: string } {
	const match = path.match(/^\/(en|sw)(?=\/|$)/);
	const locale = match?.[1] ?? "en";
	const pathWithoutLocale = match ? path.slice(match[0].length) || "/" : path || "/";
	return {
		locale,
		path: pathWithoutLocale.startsWith("/") ? pathWithoutLocale : `/${pathWithoutLocale}`,
	};
}

export default function Head({ pageName }: HeadProps) {
	const { t } = useTranslation(["meta"]);
	const router = useRouter();
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
	const routePath = router.asPath.split(/[?#]/, 1)[0] || "/";
	const route = splitLocalePath(routePath);
	const locale = route.locale === "sw" ? "sw" : "en";
	const canonicalPath = locale === "sw" ? `/sw${route.path === "/" ? "" : route.path}` : route.path;
	const canonicalUrl = toAbsoluteUrl(canonicalPath);
	const alternatePaths = {
		en: route.path,
		sw: `/sw${route.path === "/" ? "" : route.path}`,
	};
	const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
	const absoluteOgImage = ogImage ? toAbsoluteUrl(ogImage) : "";
	const siteDescription = t("meta:site.description", { defaultValue: "" });
	const companyName = t("meta:company.legalName", { defaultValue: siteTitle });
	const companyDescription = t("meta:company.description", { defaultValue: siteDescription });
	const companyPhone = t("meta:company.phone", { defaultValue: "" });
	const companyEmail = t("meta:company.email", { defaultValue: "" });
	const pageSchema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		"@id": `${canonicalUrl}#webpage`,
		url: canonicalUrl,
		name: pageTitle,
		description: description || siteDescription,
		inLanguage: locale === "sw" ? "sw-KE" : "en-KE",
		isPartOf: { "@id": `${SITE_URL}/#website` },
	};
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		"@id": `${SITE_URL}/#organization`,
		name: companyName,
		url: SITE_URL,
		logo: `${SITE_URL}/img/logo.svg`,
		description: companyDescription,
		telephone: companyPhone || undefined,
		email: companyEmail || undefined,
		address: {
			"@type": "PostalAddress",
			addressLocality: "Nairobi",
			addressCountry: "KE",
		},
		areaServed: ["Kenya", "East Africa"],
	};
	const isServicePage = /\/(surveying|aerial-drones|civil)(?:\/|$)/.test(route.path);
	const serviceSchema = isServicePage
		? {
				"@context": "https://schema.org",
				"@type": "Service",
				name: title,
				description: description || siteDescription,
				url: canonicalUrl,
				provider: { "@id": `${SITE_URL}/#organization` },
			}
		: null;

	return (
		<NextHead>
			<title>{pageTitle}</title>
			{description && <meta name="description" content={description} />}
			{title && <meta property="og:title" content={title} />}
			{description && <meta property="og:description" content={description} />}
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content={siteTitle} />
			<meta property="og:url" content={canonicalUrl} />
			<meta property="og:locale" content={locale === "sw" ? "sw_KE" : "en_KE"} />
			{absoluteOgImage && <meta property="og:image" content={absoluteOgImage} />}
			<meta name="twitter:card" content={absoluteOgImage ? "summary_large_image" : "summary"} />
			<meta name="twitter:title" content={pageTitle} />
			{description && <meta name="twitter:description" content={description} />}
			{absoluteOgImage && <meta name="twitter:image" content={absoluteOgImage} />}
			<link rel="canonical" href={canonicalUrl} />
			{LOCALES.map((alternateLocale) => (
				<link
					key={alternateLocale}
					rel="alternate"
					hrefLang={alternateLocale}
					href={toAbsoluteUrl(alternatePaths[alternateLocale])}
				/>
			))}
			<link rel="alternate" hrefLang="x-default" href={toAbsoluteUrl(alternatePaths.en)} />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
			/>
			{serviceSchema && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
				/>
			)}
		</NextHead>
	);
}
