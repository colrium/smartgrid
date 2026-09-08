// @ts-nocheck
import NextHead from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "@/hooks";

type HeadProps = {
	pageName: string;
};

/**
 * Canonical site origin — single source of truth for every canonical,
 * hreflang, Open Graph and JSON-LD URL emitted in <head>. Must mirror the
 * fallback in next-sitemap.config.js so the generated sitemap/robots.txt and
 * the on-page metadata always resolve to the same host (a prerequisite for
 * consistent crawling and Google sitelink generation).
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://smartgridsurveying.com").replace(
	/\/+$/,
	""
);
const LOCALES = ["en", "sw"] as const;
const DEFAULT_LOCALE = "en";

// schema.org WebPage subtypes for well-known routes.
const PAGE_TYPES: Record<string, string> = {
	"/about": "AboutPage",
	"/contact": "ContactPage",
};

// Route prefix under which Service structured data applies.
const SERVICE_HUB_PATTERN = /\/(surveying|aerial-drones|civil)(?:\/|$)/;

function toAbsoluteUrl(value: string): string {
	if (/^https?:\/\//i.test(value)) return value;
	return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function splitLocalePath(path: string): { locale: string; path: string } {
	const match = path.match(/^\/(en|sw)(?=\/|$)/);
	const locale = match?.[1] ?? DEFAULT_LOCALE;
	const pathWithoutLocale = match ? path.slice(match[0].length) || "/" : path || "/";
	return {
		locale,
		path: pathWithoutLocale.startsWith("/") ? pathWithoutLocale : `/${pathWithoutLocale}`,
	};
}

/** "topographical-surveys" -> "Topographical surveys" (breadcrumb fallback). */
function humanizeSegment(segment: string): string {
	const words = segment.replace(/[-_]+/g, " ").trim();
	return words ? words.charAt(0).toUpperCase() + words.slice(1) : words;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export default function Head({ pageName }: HeadProps) {
	const { t, tObject } = useTranslation(["meta", "contact"]);
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
	const canonicalPath =
		locale === "sw" ? `/sw${route.path === "/" ? "" : route.path}` : route.path;
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
	const inLanguage = locale === "sw" ? "sw-KE" : "en-KE";

	// ---------------------------------------------------------------------
	// Breadcrumb trail — localized names resolved from meta:pages (by slug,
	// then by key, e.g. product slugs), with a humanized-segment fallback.
	// ---------------------------------------------------------------------
	const metaPages = tObject("meta:pages");
	const pageNameFor = (subPath: string): string => {
		const segments = subPath.split("/").filter(Boolean);
		const lastSegment = segments[segments.length - 1] || "";
		if (isRecord(metaPages)) {
			const bySlug = Object.values(metaPages).find(
				(entry) => isRecord(entry) && entry.slug === subPath
			);
			const byKey = isRecord(metaPages[lastSegment]) ? metaPages[lastSegment] : null;
			const entry = bySlug || byKey;
			if (entry) {
				const name = (entry.page_title || entry.title) as string | undefined;
				if (name) return name;
			}
		}
		return humanizeSegment(lastSegment);
	};

	const homeUrl = toAbsoluteUrl(locale === "sw" ? "/sw" : "/");
	const homeName = t("meta:pages.home.title", { defaultValue: "Home" });
	const breadcrumbItems = [{ name: homeName, item: homeUrl }];
	const segments = route.path.split("/").filter(Boolean);
	for (let i = 0; i < segments.length; i += 1) {
		const subPath = `/${segments.slice(0, i + 1).join("/")}`;
		breadcrumbItems.push({
			name: pageNameFor(subPath),
			item: toAbsoluteUrl(locale === "sw" ? `/sw${subPath}` : subPath),
		});
	}

	// ---------------------------------------------------------------------
	// Structured data — one @graph with stable @ids so Google can link the
	// Organization, WebSite, WebPage, Breadcrumb and entity nodes together.
	// ---------------------------------------------------------------------
	const socialMedia = tObject("meta:company.socialMedia");
	const sameAs = isRecord(socialMedia)
		? Object.values(socialMedia).filter(
				(value) => typeof value === "string" && value.startsWith("http")
			)
		: [];

	// HQ facts come from the shared contact namespace (auto-loaded on every
	// page) so the schema stays in sync with the contact page content.
	const offices = tObject("contact:offices.items");
	const hqOffice = Array.isArray(offices)
		? offices.find((office) => isRecord(office) && office.type === "hq")
		: null;

	const organizationSchema = {
		"@type": "ProfessionalService",
		"@id": `${SITE_URL}/#organization`,
		name: companyName,
		alternateName: siteTitle,
		url: `${SITE_URL}/`,
		logo: `${SITE_URL}/img/logo.svg`,
		image: `${SITE_URL}/img/logo.svg`,
		description: companyDescription,
		telephone: companyPhone || undefined,
		email: companyEmail || undefined,
		address: {
			"@type": "PostalAddress",
			streetAddress: hqOffice?.address_lines?.[0],
			addressLocality: hqOffice?.city || "Nairobi",
			addressCountry: "KE",
		},
		geo:
			typeof hqOffice?.lat === "number" && typeof hqOffice?.lng === "number"
				? {
						"@type": "GeoCoordinates",
						latitude: hqOffice.lat,
						longitude: hqOffice.lng,
					}
				: undefined,
		sameAs: sameAs.length > 0 ? sameAs : undefined,
		contactPoint:
			companyPhone || companyEmail
				? [
						{
							"@type": "ContactPoint",
							contactType: "customer service",
							telephone: companyPhone || undefined,
							email: companyEmail || undefined,
							areaServed: ["KE", "UG", "TZ"],
							availableLanguage: LOCALES,
						},
					]
				: undefined,
		areaServed: ["Kenya", "East Africa"],
	};

	const websiteSchema = {
		"@type": "WebSite",
		"@id": `${SITE_URL}/#website`,
		url: `${SITE_URL}/`,
		name: siteTitle,
		alternateName: companyName,
		description: siteDescription,
		publisher: { "@id": `${SITE_URL}/#organization` },
		inLanguage,
	};

	const breadcrumbSchema = {
		"@type": "BreadcrumbList",
		"@id": `${canonicalUrl}#breadcrumb`,
		itemListElement: breadcrumbItems.map((crumb, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: crumb.name,
			item: crumb.item,
		})),
	};

	const webpageSchema = {
		"@type": PAGE_TYPES[route.path] || "WebPage",
		"@id": `${canonicalUrl}#webpage`,
		url: canonicalUrl,
		name: pageTitle,
		description: description || siteDescription,
		inLanguage,
		isPartOf: { "@id": `${SITE_URL}/#website` },
		about: { "@id": `${SITE_URL}/#organization` },
		breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
		primaryImageOfPage: absoluteOgImage
			? { "@type": "ImageObject", url: absoluteOgImage }
			: undefined,
	};

	const isServicePage = SERVICE_HUB_PATTERN.test(route.path);
	const serviceSchema = isServicePage
		? {
				"@type": "Service",
				"@id": `${canonicalUrl}#service`,
				name: title,
				serviceType: title,
				description: description || siteDescription,
				url: canonicalUrl,
				areaServed: ["Kenya", "East Africa"],
				provider: { "@id": `${SITE_URL}/#organization` },
			}
		: null;

	const isProductPage =
		/^\/equipment-sale\/.+/.test(route.path) &&
		route.path !== "/equipment-sale/equipment-catalogue";
	const productSchema = isProductPage
		? {
				"@type": "Product",
				"@id": `${canonicalUrl}#product`,
				name: title,
				description: description || siteDescription,
				url: canonicalUrl,
				image: absoluteOgImage ? [absoluteOgImage] : undefined,
				category: "Surveying Equipment",
				breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
			}
		: null;

	const graph = [organizationSchema, websiteSchema, webpageSchema, breadcrumbSchema];
	if (serviceSchema) graph.push(serviceSchema);
	if (productSchema) graph.push(productSchema);
	const jsonLd = { "@context": "https://schema.org", "@graph": graph };

	return (
		<NextHead>
			<title>{pageTitle}</title>
			{description && <meta name="description" content={description} />}
			<meta
				name="robots"
				content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
			/>
			{title && <meta property="og:title" content={title} />}
			{description && <meta property="og:description" content={description} />}
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content={siteTitle} />
			<meta property="og:url" content={canonicalUrl} />
			<meta property="og:locale" content={locale === "sw" ? "sw_KE" : "en_KE"} />
			<meta property="og:locale:alternate" content={locale === "sw" ? "en_KE" : "sw_KE"} />
			{absoluteOgImage && (
				<>
					<meta property="og:image" content={absoluteOgImage} />
					<meta property="og:image:alt" content={pageTitle} />
				</>
			)}
			<meta
				name="twitter:card"
				content={absoluteOgImage ? "summary_large_image" : "summary"}
			/>
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
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</NextHead>
	);
}
