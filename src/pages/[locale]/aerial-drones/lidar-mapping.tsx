import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
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
 * M11 batch 19 (2026-09-20): all eight sections (hero, industries grid,
 * why-choose grid, powerline split, forestry + construction splitMedia,
 * how-it-works grid, CTA) are Keystatic-owned in page order, so the whole
 * page renders from one `PageBuilderDocument` when the slug is allowlisted
 * via `KEYSTATIC_PAGES` and the entry is published. Otherwise the legacy
 * locale-JSON implementation renders unchanged.
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	if (keystaticPage) {
		return <PageBuilderDocument page={keystaticPage} />;
	}

	return (
		<div className="relative">
			<PageHead pageName="lidar-mapping" />
			<div className="flex flex-col min-h-screen">
				<LidarLegacy />
			</div>
		</div>
	);
};

function LidarLegacy() {
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

	return (
		<>
			<Hero data={heroData} />
			{industriesGrid}
			{whyChooseGrid}
			<SplitMedia data={powerline} mediaAspect="aspect-16/10" />
			<SplitMedia data={forestry} imagePosition="left" tone="surface" mediaAspect="aspect-16/10" />
			<SplitMedia data={construction} imagePosition="right" tone="default" mediaAspect="aspect-16/10" />
			{howItWorksGrid}
			<LidarCtaSection />
		</>
	);
}
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
