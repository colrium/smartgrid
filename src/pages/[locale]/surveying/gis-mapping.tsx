import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { FinalCta, type FinalCtaAction } from "@/components/sections/shared/FinalCta";
import {
	GisHeroSection,
	WhatIsGisSection,
	GisConsultationCtaSection,
	GisImportanceSection,
	GisServicesSection,
	// RemoteSensingSection,
	// MappingServicesSection,
	GisIndustriesSection,
	GisTechStackSection,
	GisWhatsappCtaSection,
	GisComponentsSection,
	GisWhySmartgridSection,
	GisDataAccuracySection,
	GisBeforeAfterSection,
	GisProjectImpactSection,
	GisRelatedServicesSection,
} from "@/components/sections/surveying/gis-mapping";

type PageProps = {
	/** Keystatic page when the `gis-mapping` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface GisAnalystCtaContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	actions?: FinalCtaAction[] | null;
};

/**
 * All fifteen legacy sections are Keystatic-owned in page order (see the
 * `gis-mapping` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * gisHero, gisWhatIs, consultationCta ctaBand, gisImportance, gisServices,
 * gisIndustries, gisTechStack, gisWhatsappCta, gisComponents,
 * gisWhySmartgrid, gisDataAccuracy, gisBeforeAfter, gisProjectImpact,
 * gisRelatedServices, finalCta (M11 batch 14, 2026-09-19 — entry order
 * IS page order, so editors can add, remove, and reorder sections freely;
 * the M3 resolver taxonomy remains the only fallback. M13 batch 4,
 * 2026-09-20 — the single-shared-child wrapper `GisAnalystCtaSection` was
 * removed; the legacy branch below renders the shared `FinalCta` directly,
 * and the entry uses the shared `finalCta` branch with content preserved).
 * `remoteSensingSolutions` + `mappingServices` stay DORMANT (commented out
 * of the route — never migrated).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	// Migration source switch (M3/M7, completed M11 batch 14): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="gis-mapping" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const analystCta = t("surveying/gis-mapping:analystCta", {
		returnObjects: true,
	}) as unknown as GisAnalystCtaContent;

	return (
		<div className="relative">
			<PageHead pageName="gis-mapping" />
			<div className="flex flex-col min-h-screen">
				<GisHeroSection />
				<WhatIsGisSection />
				<GisConsultationCtaSection />
				<GisImportanceSection />
				<GisServicesSection />
				{/* <RemoteSensingSection />
				<MappingServicesSection /> */}
				<GisIndustriesSection />
				<GisTechStackSection />
				<GisWhatsappCtaSection />
				<GisComponentsSection />
				<GisWhySmartgridSection />
				<GisDataAccuracySection />
				<GisBeforeAfterSection />
				<GisProjectImpactSection />
				<GisRelatedServicesSection />
				{analystCta?.headline ? (
					<FinalCta
						id="talk-to-analyst"
						tag={analystCta.tag}
						headline={analystCta.headline}
						description={analystCta.description}
						watermark="map-search-outline"
						actions={analystCta.actions ?? null}
						columns={3}
					/>
				) : null}
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/gis-mapping"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("gis-mapping", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
