import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";
import type { CardItem } from "@/components/sections/shared/CardGrid";
import { LqQuarryServicesCard } from "@/components/sections/aerial-drones/landfill-quarry-drone-surveys/LqQuarryServicesCard";
import { LqWhatWeOfferCard } from "@/components/sections/aerial-drones/landfill-quarry-drone-surveys/LqWhatWeOfferCard";

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

/**
 * All five legacy sections are Keystatic-owned in page order (see the
 * `landfill-quarry-drone-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, quarryServices
 * introText, lqQuarryServicesItems (the `iconShape: "xl"` services grid),
 * maximizeProductivity introText, lqWhatWeOffer (the fallback-icons +
 * popup grid) — M11 batch 17, 2026-09-20. Entry order IS page order, so
 * editors can add, remove, and reorder sections freely; the M3 resolver
 * taxonomy remains the only fallback. The hero/introText entries keep
 * their M7 shared branches; `lqQuarryServicesItems` and `lqWhatWeOffer`
 * are the batch-17 uniques (icon shapes, densities, the hardcoded
 * `fallbackIcons` array and the popup items sit outside the shared
 * `cardGrid` contract). M13 batch 7 retired the
 * `QuarryServicesItemsSection`/`WhatWeOfferSection` wrappers; the legacy
 * branch renders the batch-17 renderer components with the wrappers'
 * literals.
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["aerial-drones/landfill-quarry-drone-surveys"]);
	// Migration source switch (M3/M7, completed M11 batch 17): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="landfill-quarry-drone-surveys" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const heroData = t("aerial-drones/landfill-quarry-drone-surveys:hero", {
		returnObjects: true,
	}) as unknown as HeroContent;
	const quarryServices = t("aerial-drones/landfill-quarry-drone-surveys:quarryServices", {
		returnObjects: true,
	}) as unknown as TextContent;
	const quarryServicesItems = t("aerial-drones/landfill-quarry-drone-surveys:quarryServicesItems", {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const maximizeProductivity = t("aerial-drones/landfill-quarry-drone-surveys:maximizeProductivity", {
		returnObjects: true,
	}) as unknown as TextContent;
	const whatWeOffer = t("aerial-drones/landfill-quarry-drone-surveys:whatWeOffer", {
		returnObjects: true,
	}) as unknown as OfferContent;

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
				<LqQuarryServicesCard data={quarryServicesItems} />
				<IntroTextSection
					tone="surface"
					tag={maximizeProductivity?.tag}
					headline={maximizeProductivity?.headline}
					description={maximizeProductivity?.description}
				/>
				<LqWhatWeOfferCard data={whatWeOffer} />
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
