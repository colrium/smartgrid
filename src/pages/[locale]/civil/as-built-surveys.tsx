import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Deliverables } from "@/components/sections/Deliverables";
import {
	HeroSection,
	WhatAreAsBuiltSurveysSection,
	AsBuiltSolutionsSection,
	KeyIndustriesSection,
	MaxProductivityMinGuessworkSection,
	ApplicationsSection,
	ActionableInsightsSection,
} from "@/components/sections/civil/as-built-surveys";

type PageProps = {
	/** Keystatic page when the `as-built-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * All eight legacy sections are Keystatic-owned in page order (see the
 * `as-built-surveys` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * hero, whatAre introText, asBuiltSolutions, keyIndustries cardGrid,
 * maxProductivity introText, applications cardGrid, actionableInsights
 * introText, deliverables (M11 batch 15, 2026-09-19 — entry order IS page
 * order, so editors can add, remove, and reorder sections freely; the M3
 * resolver taxonomy remains the only fallback).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 15): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="civil-as-built-surveys" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="civil-as-built-surveys" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<WhatAreAsBuiltSurveysSection />
				<AsBuiltSolutionsSection />
				<KeyIndustriesSection />
				<MaxProductivityMinGuessworkSection />
				<ApplicationsSection />
				<ActionableInsightsSection />
				<Deliverables ns="civil/as-built-surveys" className="bg-surface" />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "civil/as-built-surveys"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("as-built-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;