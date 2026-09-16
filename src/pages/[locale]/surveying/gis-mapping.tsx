import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
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
	GisAnalystCtaSection,
	GisDataAccuracySection,
	GisBeforeAfterSection,
	GisProjectImpactSection,
	GisRelatedServicesSection,
} from "@/components/sections/surveying/gis-mapping";

type PageProps = {
	/** Keystatic page when the `gis-mapping` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * Sections migrated to Keystatic in page order (see the `gis-mapping` mapping
 * in `scripts/migrate-locale-to-keystatic.mjs`): consultationCta ctaBand only.
 * The bespoke hero (`<bold>` pseudo-markup the shared Hero would render
 * literally, string footnote chips) stays legacy; every cardGrid uses
 * non-contract props (`fallbackIcons`, `indexed`, `mediaBadged`); the rest
 * (whatIs, workflow, deliverables, techStack, whatsappCta, components,
 * dataAccuracy, beforeAfter, projectImpact, relatedServices, analystCta) are
 * bespoke. If an edit changes the section COUNT, the route falls back to
 * legacy rather than misplacing sections — keep this in sync with the mapping.
 */
const KEYSTATIC_SECTION_COUNT = 1;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "gis-mapping" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the consultation CTA only
	// when the slug is allowlisted via `KEYSTATIC_PAGES` and the entry is
	// published. Otherwise the legacy locale-JSON implementation renders
	// unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;

	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
		const renderAt = (index: number) => {
			const section = sections[index];
			return renderSection(section.id, section.value, locale, section.key);
		};
		return (
			<div className="relative">
				<PageHead pageName="gis-mapping" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					<GisHeroSection />
					<WhatIsGisSection />
					{renderAt(0)}
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
					<GisAnalystCtaSection />
				</div>
			</div>
		);
	}

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
				<GisAnalystCtaSection />
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
