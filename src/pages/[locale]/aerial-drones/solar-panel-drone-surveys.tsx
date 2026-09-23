import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import type { CardItem } from "@/components/sections/shared/CardGrid";
import { CtaSection } from "@/components/sections/aerial-drones/solar-panel-drone-surveys";
import { SolWhatWeDoCard } from "@/components/sections/aerial-drones/solar-panel-drone-surveys/SolWhatWeDoCard";
import { SolProcessCard } from "@/components/sections/aerial-drones/solar-panel-drone-surveys/SolProcessCard";

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
 * All four legacy sections are Keystatic-owned in page order (see the
 * `solar-panel-drone-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, solWhatWeDo (the
 * `iconShape: "xl"` capabilities grid), solProcess (the indexed
 * drone-integration grid), cta ctaBand — M11 batch 17, 2026-09-20. Entry
 * order IS page order, so editors can add, remove, and reorder sections
 * freely; the M3 resolver taxonomy remains the only fallback. The
 * hero/cta entries keep their M7 shared branches; `solWhatWeDo` and
 * `solProcess` are the batch-17 uniques (icon shapes, indexed numbering
 * and the badge card literal sit outside the shared `cardGrid` contract).
 * M13 batch 7 retired the `WhatWeDoSection`/`DroneIntegrationProcessSection`
 * wrappers; the legacy branch renders the batch-17 renderer components
 * with the wrappers' literals.
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["aerial-drones/solar-panel-drone-surveys"]);
	// Migration source switch (M3/M7, completed M11 batch 17): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="solar-panel-drone-surveys" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const heroData = t("aerial-drones/solar-panel-drone-surveys:hero", {
		returnObjects: true,
	}) as unknown as HeroContent;
	const whatWeDo = t("aerial-drones/solar-panel-drone-surveys:whatWeDo", {
		returnObjects: true,
	}) as unknown as WhatWeDoContent;
	const integrationProcess = t("aerial-drones/solar-panel-drone-surveys:droneIntegrationProcess", {
		returnObjects: true,
	}) as unknown as ProcessContent;

	return (
		<div className="relative">
			<PageHead pageName="solar-panel-drone-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<SolWhatWeDoCard data={whatWeDo} />
				<SolProcessCard data={integrationProcess} />
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
