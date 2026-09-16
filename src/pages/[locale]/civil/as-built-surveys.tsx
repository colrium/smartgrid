import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
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
 * Sections migrated to Keystatic in page order (see the `as-built-surveys`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): hero, whatIs
 * introText, keyIndustries cardGrid, maxProductivity introText, applications
 * cardGrid, actionableInsights introText. Two legacy tails (the `indexed`
 * AsBuiltSolutions grid, bespoke Deliverables explorer) sit at fixed
 * positions between them, so the route renders each Keystatic section by
 * index instead of one whole PageBuilderDocument. If an edit changes the
 * section COUNT, the route falls back to legacy rather than misplacing
 * sections — keep this in sync with the mapping.
 */
const KEYSTATIC_SECTION_COUNT = 6;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "as-built-surveys" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the six migrated
	// sections only when the slug is allowlisted via `KEYSTATIC_PAGES` and the
	// entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;

	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
		const renderAt = (index: number) => {
			const section = sections[index];
			return renderSection(section.id, section.value, locale, section.key);
		};
		return (
			<div className="relative">
				<PageHead pageName="civil-as-built-surveys" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					{renderAt(1)}
					<AsBuiltSolutionsSection />
					{renderAt(2)}
					{renderAt(3)}
					{renderAt(4)}
					{renderAt(5)}
					<Deliverables ns="civil/as-built-surveys" className="bg-surface" />
				</div>
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