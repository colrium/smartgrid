import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";
import { CtaSection } from "@/components/sections/aerial-drones/solar-panel-drone-surveys";

type PageProps = {
	/** Keystatic page when the `solar-panel-drone-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface WhatWeDoContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

interface ProcessContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

/**
 * Sections migrated to Keystatic in page order (see the
 * `solar-panel-drone-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, cta ctaBand. Two legacy
 * tails (WhatWeDoSection with `card.iconShape: "xl"`, `indexed`
 * DroneIntegrationProcessSection) sit at fixed positions between them, so the
 * route renders each Keystatic section by index instead of one whole
 * PageBuilderDocument. If an edit changes the section COUNT, the route falls
 * back to legacy rather than misplacing sections — keep this in sync with
 * the mapping. (M13 batch 7, 2026-09-20 — the single-shared-child wrappers
 * `HeroSection`, `WhatWeDoSection` and `DroneIntegrationProcessSection` were
 * removed; both branches below render the shared `Hero`/`CardGrid`
 * directly.)
 */
const KEYSTATIC_SECTION_COUNT = 2;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "solar-panel-drone-surveys" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the two migrated
	// sections only when the slug is allowlisted via `KEYSTATIC_PAGES` and the
	// entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;

	const { t } = useTranslation(["aerial-drones/solar-panel-drone-surveys"]);
	const heroData = t("aerial-drones/solar-panel-drone-surveys:hero", {
		returnObjects: true,
	}) as unknown as HeroContent;
	const whatWeDo = t("aerial-drones/solar-panel-drone-surveys:whatWeDo", {
		returnObjects: true,
	}) as unknown as WhatWeDoContent;
	const whatWeDoItems = Array.isArray(whatWeDo?.items) ? whatWeDo.items : [];
	const whatWeDoGrid =
		whatWeDoItems.length === 0 ? null : (
			<CardGrid
				tag={whatWeDo.tag}
				headline={whatWeDo.headline}
				description={whatWeDo.description}
				items={whatWeDoItems}
				columns={4}
				align="center"
				tone="surface"
				card={{ iconShape: "xl" }}
			/>
		);
	const integrationProcess = t("aerial-drones/solar-panel-drone-surveys:droneIntegrationProcess", {
		returnObjects: true,
	}) as unknown as ProcessContent;
	const integrationItems = Array.isArray(integrationProcess?.items) ? integrationProcess.items : [];
	const integrationGrid =
		integrationItems.length === 0 ? null : (
			<CardGrid
				tag={integrationProcess.tag}
				headline={integrationProcess.headline}
				description={integrationProcess.description}
				items={integrationItems}
				columns={3}
				headerRow
				indexed
				card={{
					density: "comfortable",
					iconShape: "xl",
					iconSize: "sm",
					indexBadgePosition: "end",
					indexBadgeClassName:
						"h-9 w-9 rounded-full bg-primary/10 text-primary text-sm transition-colors duration-300 group-hover:bg-primary/20",
				}}
			/>
		);

	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
		const renderAt = (index: number) => {
			const section = sections[index];
			return renderSection(section.id, section.value, locale, section.key);
		};
		return (
			<div className="relative">
				<PageHead pageName="solar-panel-drone-surveys" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					{whatWeDoGrid}
					{integrationGrid}
					{renderAt(1)}
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="solar-panel-drone-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				{whatWeDoGrid}
				{integrationGrid}
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "aerial-drones/solar-panel-drone-surveys"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("solar-panel-drone-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
