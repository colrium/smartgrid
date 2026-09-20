import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Deliverables } from "@/components/sections/Deliverables";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";
import { AsBuiltSolutionsSection } from "@/components/sections/civil/as-built-surveys";

type PageProps = {
	/** Keystatic page when the `as-built-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface TextContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

interface GridContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { icon?: string; title: string; description: string }[];
}

/**
 * All eight legacy sections are Keystatic-owned in page order (see the
 * `as-built-surveys` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * hero, whatAre introText, asBuiltSolutions, keyIndustries cardGrid,
 * maxProductivity introText, applications cardGrid, actionableInsights
 * introText, deliverables (M11 batch 15, 2026-09-19 — entry order IS page
 * order, so editors can add, remove, and reorder sections freely; the M3
 * resolver taxonomy remains the only fallback. M13 batch 5, 2026-09-20 —
 * the single-shared-child wrappers `HeroSection`, `TextSection` (+ its
 * `WhatAre`/`MaxProductivity`/`ActionableInsights` shims),
 * `KeyIndustriesSection` and `ApplicationsSection` were removed; the legacy
 * branch below renders the shared `Hero`, `IntroTextSection` and `CardGrid`
 * directly, and the entry uses the shared `hero`/`introText`/`cardGrid`
 * branches with content preserved. `AsBuiltSolutionsSection` keeps its
 * unique (`indexed` numbering is outside the shared `cardGrid` contract).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["civil/as-built-surveys"]);
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

	const heroData = t("civil/as-built-surveys:hero", { returnObjects: true }) as unknown as HeroContent;
	const whatAre = t("civil/as-built-surveys:whatAreAsBuiltSurveys", {
		returnObjects: true,
	}) as unknown as TextContent;
	const keyIndustries = t("civil/as-built-surveys:keyIndustries", {
		returnObjects: true,
	}) as unknown as GridContent;
	const keyIndustryItems: CardItem[] = Array.isArray(keyIndustries?.items) ? keyIndustries.items : [];
	const maxProductivity = t("civil/as-built-surveys:maxProductivityMinGuesswork", {
		returnObjects: true,
	}) as unknown as TextContent;
	const applications = t("civil/as-built-surveys:applications", {
		returnObjects: true,
	}) as unknown as GridContent;
	const applicationItems: CardItem[] = Array.isArray(applications?.items) ? applications.items : [];
	const actionableInsights = t("civil/as-built-surveys:actionableInsights", {
		returnObjects: true,
	}) as unknown as TextContent;

	return (
		<div className="relative">
			<PageHead pageName="civil-as-built-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<IntroTextSection
					tag={whatAre?.tag}
					headline={whatAre?.headline}
					description={whatAre?.description}
				/>
				<AsBuiltSolutionsSection />
				{keyIndustryItems.length === 0 ? null : (
					<CardGrid
						tag={keyIndustries.tag}
						headline={keyIndustries.headline}
						description={keyIndustries.description}
						items={keyIndustryItems}
						columns={3}
						align="center"
					/>
				)}
				<IntroTextSection
					tone="surface"
					tag={maxProductivity?.tag}
					headline={maxProductivity?.headline}
					description={maxProductivity?.description}
				/>
				{applicationItems.length === 0 ? null : (
					<CardGrid
						tag={applications.tag}
						headline={applications.headline}
						description={applications.description}
						items={applicationItems}
						columns={3}
						tone="surface"
						align="center"
					/>
				)}
				<IntroTextSection
					tag={actionableInsights?.tag}
					headline={actionableInsights?.headline}
					description={actionableInsights?.description}
				/>
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
