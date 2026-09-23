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
import {
	SmartMonitoringSection,
	WhatWeOfferSection,
	CtaSection,
} from "@/components/sections/aerial-drones/monitoring-and-evaluation";
import { MeOurCapabilitiesCard } from "@/components/sections/aerial-drones/monitoring-and-evaluation/MeOurCapabilitiesCard";
import { MeImpactCard } from "@/components/sections/aerial-drones/monitoring-and-evaluation/MeImpactCard";

type PageProps = {
	/** Keystatic page when the `monitoring-and-evaluation` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface TextContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

interface CapabilitiesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

interface ImpactContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

/**
 * All nine legacy sections are Keystatic-owned in page order (see the
 * `monitoring-and-evaluation` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, drivingSustainability
 * introText, meOurCapabilities (fallback-icons grid), techWeUse introText,
 * meImpact (fallback-icons grid), whyPartnerWithUs introText,
 * meSmartMonitoring (action-pills grid), meWhatWeOffer (lead-images grid),
 * cta ctaBand — M11 batch 18, 2026-09-20. Entry order IS page order, so
 * editors can add, remove, and reorder sections freely; the M3 resolver
 * taxonomy remains the only fallback. The hero/introText/cta entries keep
 * their M7 shared branches; the four grids are the batch-18 uniques
 * (icon shapes, the hardcoded `fallbackIcons` arrays, the computed action
 * pills and the leadImages strip sit outside the shared `cardGrid`
 * contract). M13 batch 7 retired the `OurCapabilitiesSection`/`ImpactSection`
 * wrappers — the legacy branch renders the batch-18 renderer components
 * with the wrappers' literals; the surviving `SmartMonitoringSection`/
 * `WhatWeOfferSection` wrappers got the additive-`data` refactor.
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["aerial-drones/monitoring-and-evaluation"]);
	// Migration source switch (M3/M7, completed M11 batch 18): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="monitoring-and-evaluation" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const NS = "aerial-drones/monitoring-and-evaluation";
	const heroData = t(`${NS}:hero`, {
		returnObjects: true,
	}) as unknown as HeroContent;
	const drivingSustainability = t(`${NS}:drivingSustainability`, {
		returnObjects: true,
	}) as unknown as TextContent;
	const ourCapabilities = t(`${NS}:ourCapabilities`, {
		returnObjects: true,
	}) as unknown as CapabilitiesContent;
	const techWeUse = t(`${NS}:techWeUse`, {
		returnObjects: true,
	}) as unknown as TextContent;
	const impact = t(`${NS}:impact`, {
		returnObjects: true,
	}) as unknown as ImpactContent;
	const whyPartnerWithUs = t(`${NS}:whyPartnerWithUs`, {
		returnObjects: true,
	}) as unknown as TextContent;

	return (
		<div className="relative">
			<PageHead pageName="monitoring-and-evaluation" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<IntroTextSection
					tag={drivingSustainability?.tag}
					headline={drivingSustainability?.headline}
					description={drivingSustainability?.description}
				/>
				<MeOurCapabilitiesCard data={ourCapabilities} />
				<IntroTextSection
					tone="surface"
					tag={techWeUse?.tag}
					headline={techWeUse?.headline}
					description={techWeUse?.description}
				/>
				<MeImpactCard data={impact} />
				<IntroTextSection
					tag={whyPartnerWithUs?.tag}
					headline={whyPartnerWithUs?.headline}
					description={whyPartnerWithUs?.description}
				/>
				<SmartMonitoringSection />
				<WhatWeOfferSection />
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
		"aerial-drones/monitoring-and-evaluation",
	]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("monitoring-and-evaluation", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
