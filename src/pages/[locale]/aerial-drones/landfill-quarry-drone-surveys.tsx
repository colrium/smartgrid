import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import {
	HeroSection,
	QuarryServicesSection,
	QuarryServicesItemsSection,
	MaximizeProductivitySection,
	WhatWeOfferSection,
} from "@/components/sections/aerial-drones/landfill-quarry-drone-surveys";


type PageProps = {
	/** Keystatic page when the `landfill-quarry-drone-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * Sections migrated to Keystatic in page order (see the
 * `landfill-quarry-drone-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, quarryServices introText,
 * maximizeProductivity introText. Two legacy tails (QuarryServicesItemsSection
 * with `card.iconShape: "xl"`, WhatWeOfferSection with `fallbackIcons`) sit at
 * fixed positions between them, so the route renders each Keystatic section by
 * index instead of one whole PageBuilderDocument. If an edit changes the
 * section COUNT, the route falls back to legacy rather than misplacing
 * sections — keep this in sync with the mapping.
 */
const KEYSTATIC_SECTION_COUNT = 3;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "landfill-quarry-drone-surveys" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the three migrated
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
				<PageHead pageName="landfill-quarry-drone-surveys" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					{renderAt(1)}
					<QuarryServicesItemsSection />
					{renderAt(2)}
					<WhatWeOfferSection />
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="landfill-quarry-drone-surveys" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<QuarryServicesSection />
				<QuarryServicesItemsSection />
				<MaximizeProductivitySection />
				<WhatWeOfferSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
		"aerial-drones/landfill-quarry-drone-surveys",
	]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("landfill-quarry-drone-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
