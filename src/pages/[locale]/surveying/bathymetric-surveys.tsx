import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
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
 * All twelve legacy sections are Keystatic-owned in page order (see the
 * `bathymetric-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, whatIs, whyCritical,
 * bathyWorkflow, bathyEquipment, deliverables, whySmartGrid,
 * bathyLimitations, bathyDamsLakes, bathyApplications, bathyBeforeAfter,
 * bathyFinalCta (M11 batch 8; converted to `PageBuilderDocument` in M12
 * batch 10, 2026-09-19 — entry order IS page order, so editors can add,
 * remove, and reorder sections freely; the M3 resolver taxonomy remains the
 * only fallback).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 8, flexible since
	// M12 batch 10): Keystatic owns the whole page when the slug is
	// allowlisted via `KEYSTATIC_PAGES` and the entry is published.
	// Otherwise the legacy locale-JSON implementation renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="bathymetric-surveys" />
				<PageBuilderDocument page={keystaticPage} />
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
