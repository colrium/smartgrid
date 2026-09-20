import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { SplitMedia, type SplitMediaContent } from "@/components/sections/shared/SplitMedia";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";
import { Process, type ProcessItem } from "@/components/sections/shared/Process";
import { LidarCtaSection } from "@/components/sections/aerial-drones/lidar-mapping";

type PageProps = {
	/** Keystatic page when the `lidar-mapping` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface LidarCardsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

interface HowItWorksContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: ProcessItem[] | null;
}

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
 * misplacing sections — keep this in sync with the mapping. (M13 batch 7,
 * 2026-09-20 — the single-shared-child wrappers `LidarHeroSection`,
 * `IndustriesWeServeSection`, `WhyChooseLidarSection`,
 * `LidarPowerlineSection`, `ForestrySection`, `ConstructionSection` and
 * `HowItWorksSection` were removed; both branches below render the shared
 * `Hero`/`CardGrid`/`SplitMedia`/`Process` directly.)
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

	const NS = "aerial-drones/lidar-mapping";
	const { t } = useTranslation([NS]);
	const heroData = t(`${NS}:hero`, { returnObjects: true }) as unknown as HeroContent;
	const industriesWeServe = t(`${NS}:industriesWeServe`, {
		returnObjects: true,
	}) as unknown as LidarCardsContent;
	const industriesItems: CardItem[] = Array.isArray(industriesWeServe?.items) ? industriesWeServe.items : [];
	const industriesGrid =
		industriesItems.length === 0 ? null : (
			<CardGrid
				tag={industriesWeServe.tag}
				headline={industriesWeServe.headline}
				description={industriesWeServe.description}
				items={industriesItems}
				columns={4}
				indexed
				tone="surface"
			/>
		);
	const whyChooseLidar = t(`${NS}:whyChooseLidar`, {
		returnObjects: true,
	}) as unknown as LidarCardsContent;
	const whyChooseItems: CardItem[] = Array.isArray(whyChooseLidar?.items) ? whyChooseLidar.items : [];
	const whyChooseGrid =
		whyChooseItems.length === 0 ? null : (
			<CardGrid
				tag={whyChooseLidar.tag}
				headline={whyChooseLidar.headline}
				description={whyChooseLidar.description}
				items={whyChooseItems}
				columns={4}
				indexed
			/>
		);
	const powerline = t(`${NS}:lidarPowerlineInspection`, {
		returnObjects: true,
	}) as unknown as SplitMediaContent;
	const forestry = t(`${NS}:forestry`, {
		returnObjects: true,
	}) as unknown as SplitMediaContent;
	const construction = t(`${NS}:construction`, {
		returnObjects: true,
	}) as unknown as SplitMediaContent;
	const howItWorks = t(`${NS}:howItWorks`, {
		returnObjects: true,
	}) as unknown as HowItWorksContent;
	const howItWorksItems = Array.isArray(howItWorks?.items) ? howItWorks.items : [];
	const howItWorksGrid =
		howItWorksItems.length === 0 ? null : (
			<Process
				tag={howItWorks.tag}
				headline={howItWorks.headline}
				description={howItWorks.description}
				items={howItWorksItems}
				layout="grid"
				columns={4}
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
				<PageHead pageName="lidar-mapping" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					{industriesGrid}
					{whyChooseGrid}
					<SplitMedia data={powerline} mediaAspect="aspect-16/10" />
					{renderAt(1)}
					{renderAt(2)}
					{howItWorksGrid}
					<LidarCtaSection />
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="lidar-mapping" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				{industriesGrid}
				{whyChooseGrid}
				<SplitMedia data={powerline} mediaAspect="aspect-16/10" />
				<SplitMedia data={forestry} imagePosition="left" tone="surface" mediaAspect="aspect-16/10" />
				<SplitMedia data={construction} imagePosition="right" tone="default" mediaAspect="aspect-16/10" />
				{howItWorksGrid}
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
