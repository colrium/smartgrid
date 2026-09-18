import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import {
	BathymetricHeroSection,
	WhatIsBathymetricSection,
	WhyBathymetricCriticalSection,
	BathymetricWorkflowSection,
	EquipmentTechnologySection,
	BathymetricDeliverablesSection,
	WhySmartGridBathymetricSection,
	TechnicalLimitationsSection,
	BathymetricBeforeAfterSection,
	FinalCtaSection,
	DamsLakesSection,
	ApplicationsSection,
} from "@/components/sections/surveying/bathymetric-surveys";

type PageProps = {
	/** Keystatic page when the `bathymetric-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * Sections migrated to Keystatic in legacy page order (see the
 * `bathymetric-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, whatIs, whyCritical,
 * bathyWorkflow, bathyEquipment, deliverables, whySmartGrid,
 * bathyLimitations, bathyDamsLakes, bathyApplications, bathyBeforeAfter,
 * bathyFinalCta (M11 batch 8, 2026-09-18 — entry order IS page order). The
 * Keystatic branch destructures them once into named slots (no index
 * literals) at the legacy positions. If an edit changes the section COUNT,
 * the route falls back to legacy rather than misplacing sections — keep
 * this in sync with the mapping.
 */
const KEYSTATIC_SECTION_COUNT = 12;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "bathymetric-surveys" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 8): Keystatic owns
	// the twelve migrated sections only when the slug is allowlisted via
	// `KEYSTATIC_PAGES` and the entry is published. Otherwise the legacy
	// locale-JSON implementation renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;

	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
		// M12: entry order IS page order — destructure once into named
		// slots, no index literals. Positions below mirror the legacy
		// branch; the count guard in `orderedSections` keeps a mismatch
		// on legacy.
		const [
			hero,
			whatIs,
			whyCritical,
			workflow,
			equipment,
			deliverables,
			whySmartGrid,
			limitations,
			damsLakes,
			applications,
			beforeAfter,
			finalCta,
		] = sections.map((section) => renderSection(section.id, section.value, locale, section.key));
		return (
			<div className="relative">
				<PageHead pageName="bathymetric-surveys" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{hero}
					{whatIs}
					{whyCritical}
					{workflow}
					{equipment}
					{deliverables}
					{whySmartGrid}
					{limitations}
					{damsLakes}
					{applications}
					{beforeAfter}
					{finalCta}
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="bathymetric-surveys" />
			<div className="flex flex-col min-h-screen">
				<BathymetricHeroSection />
				<WhatIsBathymetricSection />
				<WhyBathymetricCriticalSection />
				<BathymetricWorkflowSection />
				<EquipmentTechnologySection />
				<BathymetricDeliverablesSection />
				<WhySmartGridBathymetricSection />
				<TechnicalLimitationsSection />
				<DamsLakesSection />
				<ApplicationsSection />
				<BathymetricBeforeAfterSection />
				<FinalCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/bathymetric-surveys"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("bathymetric-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
