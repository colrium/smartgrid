import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";


type PageProps = {
	/** Keystatic page when the `landfill-quarry-drone-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface TextContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

interface OfferContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

const WHAT_WE_OFFER_FALLBACK_ICONS = [
	"map-outline",
	"office-building-outline",
	"leaf",
	"sprout",
	"cube-outline",
	"road-variant",
	"terrain",
	"chart-box-outline",
	"alert-octagon-outline",
];

/**
 * Sections migrated to Keystatic in page order (see the
 * `landfill-quarry-drone-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, quarryServices introText,
 * maximizeProductivity introText. Two legacy tails (QuarryServicesItemsSection
 * with `card.iconShape: "xl"`, WhatWeOfferSection with `fallbackIcons`) sit at
 * fixed positions between them, so the route renders each Keystatic section by
 * index instead of one whole PageBuilderDocument. If an edit changes the
 * section COUNT, the route falls back to legacy rather than misplacing
 * sections — keep this in sync with the mapping. (M13 batch 7, 2026-09-20 —
 * the single-shared-child wrappers `HeroSection`, `TextSection` (+ its
 * `QuarryServices`/`MaximizeProductivity` shims), `QuarryServicesItemsSection`
 * and `WhatWeOfferSection` were removed; both branches below render the
 * shared `Hero`/`IntroTextSection`/`CardGrid` directly.)
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

	const { t } = useTranslation(["aerial-drones/landfill-quarry-drone-surveys"]);
	const heroData = t("aerial-drones/landfill-quarry-drone-surveys:hero", {
		returnObjects: true,
	}) as unknown as HeroContent;
	const quarryServices = t("aerial-drones/landfill-quarry-drone-surveys:quarryServices", {
		returnObjects: true,
	}) as unknown as TextContent;
	const quarryServicesItems = t("aerial-drones/landfill-quarry-drone-surveys:quarryServicesItems", {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const quarryServiceItems = Array.isArray(quarryServicesItems?.items) ? quarryServicesItems.items : [];
	const quarryServicesGrid =
		quarryServiceItems.length === 0 ? null : (
			<CardGrid
				tag={quarryServicesItems.tag}
				headline={quarryServicesItems.headline}
				description={quarryServicesItems.description}
				items={quarryServiceItems}
				columns={3}
				align="center"
				card={{ density: "roomy", iconShape: "xl" }}
			/>
		);
	const maximizeProductivity = t("aerial-drones/landfill-quarry-drone-surveys:maximizeProductivity", {
		returnObjects: true,
	}) as unknown as TextContent;
	const whatWeOffer = t("aerial-drones/landfill-quarry-drone-surveys:whatWeOffer", {
		returnObjects: true,
	}) as unknown as OfferContent;
	const whatWeOfferItems = Array.isArray(whatWeOffer?.items) ? whatWeOffer.items : [];
	const whatWeOfferGrid =
		whatWeOfferItems.length === 0 ? null : (
			<CardGrid
				tag={whatWeOffer.tag}
				headline={whatWeOffer.headline}
				items={whatWeOfferItems}
				columns={3}
				align="center"
				tone="surface"
				card={{ density: "roomy", iconShape: "circle", iconSize: "lg" }}
				fallbackIcons={WHAT_WE_OFFER_FALLBACK_ICONS}
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
				<PageHead pageName="landfill-quarry-drone-surveys" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					{renderAt(1)}
					{quarryServicesGrid}
					{renderAt(2)}
					{whatWeOfferGrid}
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="landfill-quarry-drone-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<IntroTextSection
					tag={quarryServices?.tag}
					headline={quarryServices?.headline}
					description={quarryServices?.description}
				/>
				{quarryServicesGrid}
				<IntroTextSection
					tone="surface"
					tag={maximizeProductivity?.tag}
					headline={maximizeProductivity?.headline}
					description={maximizeProductivity?.description}
				/>
				{whatWeOfferGrid}
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
