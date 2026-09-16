import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import {
	LidarHeroSection,
	IndustriesWeServeSection,
	WhyChooseLidarSection,
	LidarPowerlineSection,
	ForestrySection,
	ConstructionSection,
	LidarCtaSection,
	HowItWorksSection,
} from "@/components/sections/aerial-drones/lidar-mapping";

type PageProps = {
	/** Keystatic page when the `lidar-mapping` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * Sections migrated to Keystatic in page order (see the `lidar-mapping`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): hero, forestry
 * splitMedia, construction splitMedia. Five legacy tails
 * (IndustriesWeServeSection with an `indexed` grid, WhyChoose/Powerline
 * bespoke, HowItWorksSection with layout/columns outside the registry
 * `process` contract, LidarCtaSection with a wrapper `normalizeHref`
 * transform) sit at fixed positions between them, so the route renders each
 * Keystatic section by index instead of one whole PageBuilderDocument. If an
 * edit changes the section COUNT, the route falls back to legacy rather than
 * misplacing sections — keep this in sync with the mapping.
 */
const KEYSTATIC_SECTION_COUNT = 3;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "lidar-mapping" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
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
				<PageHead pageName="lidar-mapping" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					<IndustriesWeServeSection />
					<WhyChooseLidarSection />
					<LidarPowerlineSection />
					{renderAt(1)}
					{renderAt(2)}
					<HowItWorksSection />
					<LidarCtaSection />
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="lidar-mapping" />
			<div className="flex flex-col min-h-screen">
				<LidarHeroSection />
				<IndustriesWeServeSection />
				<WhyChooseLidarSection />
				<LidarPowerlineSection />
				<ForestrySection />
				<ConstructionSection />
				<HowItWorksSection />
				<LidarCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
		"aerial-drones/lidar-mapping",
	]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("lidar-mapping", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
