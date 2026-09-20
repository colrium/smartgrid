import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";
import { Deliverables } from "@/components/sections/Deliverables";
import {
	WhenYouNeedSection,
	TopographicalCostSection,
	WhatWeOfferSection,
	DetailedSurveysSection,
	SampleMapSection,
	InstrumentsSection,
	WhyConductSection,
} from "@/components/sections/surveying/topographical";

type PageProps = {
	/** Keystatic page when the `topographical-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface IntroContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
};

/**
 * All eleven legacy sections are Keystatic-owned in page order (see the
 * `topographical-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, whatIs,
 * topoWhenYouNeed, deliverables, cost, section1, topoWhatWeOffer,
 * topoDetailedSurveys, topoSampleMap, topoInstruments, topoWhyConduct
 * (M11 batch 6; converted to `PageBuilderDocument` in M12 batch 10,
 * 2026-09-19 — entry order IS page order, so editors can add, remove, and
 * reorder sections freely; the M3 resolver taxonomy remains the only
 * fallback. M13 batch 8, 2026-09-20 — the single-shared-child wrappers
 * `TopographicalHeroSection`, `WhatIsTopographicalSection`, `IntroSection`
 * and `WhatYouGetSection` were removed; the legacy branch below renders the
 * shared `Hero`, `IntroTextSection` and `Deliverables` directly, and the
 * entry uses the shared `hero`/`introText`/`deliverables` branches with
 * content preserved).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 6, flexible since
	// M12 batch 10): Keystatic owns the whole page when the slug is
	// allowlisted via `KEYSTATIC_PAGES` and the entry is published.
	// Otherwise the legacy locale-JSON implementation renders unchanged.
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="topographical-surveys" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const heroData = t("surveying/topographical-surveys:hero", { returnObjects: true }) as unknown as HeroContent;
	const whatIs = t("surveying/topographical-surveys:whatIs", {
		returnObjects: true,
	}) as unknown as IntroContent;
	const section1 = t("surveying/topographical-surveys:section1", {
		returnObjects: true,
	}) as unknown as IntroContent;

	return (
		<div className="relative">
			<PageHead pageName="topographical-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<IntroTextSection
					tag={whatIs.tag ?? null}
					headline={whatIs.headline}
					description={whatIs.description ?? undefined}
				/>
				<WhenYouNeedSection />
				<Deliverables ns="surveying/topographical-surveys" baseKey="whatYouGet" />
				<TopographicalCostSection />
				<IntroTextSection
					tag={section1.tag ?? null}
					headline={section1.headline}
					description={section1.description ?? undefined}
					split
				/>
				<WhatWeOfferSection />
				<DetailedSurveysSection />
				<SampleMapSection />
				<InstrumentsSection />
				<WhyConductSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
		"surveying/topographical-surveys",
	]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("topographical-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
