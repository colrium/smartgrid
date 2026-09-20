import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";
import { SplitMedia, type SplitMediaContent } from "@/components/sections/shared/SplitMedia";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";
import { IntroSection, CtaSection } from "@/components/sections/aerial-drones/volumetric-surveys";


type PageProps = {
	// Add custom props here
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

/**
 * Legacy-only route (no `sw` locale namespace — deferred from Keystatic in
 * M7). (M13 batch 7, 2026-09-20 — the single-shared-child wrappers
 * `HeroSection`, `TextSection` (+ its `BoostAccuracy`/`MaximizeProductivity`
 * shims), `DroneTechLeverageSection` and `ServicesSection` were removed; the
 * route below renders the shared `Hero`/`IntroTextSection`/`SplitMedia`/
 * `CardGrid` directly. `IntroSection`/`CtaSection` keep their wrappers
 * (link shaping).)
 */
const Page: NextPage<PageProps> = () => {
	const NS = "aerial-drones/volumetric-surveys";
	const { t } = useTranslation([NS]);
	const heroData = t(`${NS}:hero`, { returnObjects: true }) as unknown as HeroContent;
	const maximizeProductivity = t(`${NS}:maximizeProductivity`, {
		returnObjects: true,
	}) as unknown as TextContent;
	const droneTechLeverage = t(`${NS}:droneTechLeverage`, {
		returnObjects: true,
	}) as unknown as SplitMediaContent;
	const services = t(`${NS}:services`, {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const serviceItems: CardItem[] = Array.isArray(services?.items) ? services.items : [];
	const servicesGrid =
		serviceItems.length === 0 ? null : (
			<CardGrid
				tag={services.tag}
				headline={services.headline}
				description={services.description}
				items={serviceItems}
				columns={3}
				tone="surface"
				card={{ iconShape: "xl" }}
			/>
		);
	const boostAccuracy = t(`${NS}:boostAccuracy`, {
		returnObjects: true,
	}) as unknown as TextContent;

	return (
		<div className="relative">
			<PageHead pageName="volumetric-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<IntroSection />
				<IntroTextSection
					tag={maximizeProductivity?.tag}
					headline={maximizeProductivity?.headline}
					description={maximizeProductivity?.description}
				/>
				<SplitMedia data={droneTechLeverage} />
				{servicesGrid}
				<IntroTextSection
					tone="surface"
					tag={boostAccuracy?.tag}
					headline={boostAccuracy?.headline}
					description={boostAccuracy?.description}
				/>
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
		"aerial-drones/volumetric-surveys",
	]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
