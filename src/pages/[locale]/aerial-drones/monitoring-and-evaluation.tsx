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
import {
	SmartMonitoringSection,
	WhatWeOfferSection,
	CtaSection,
} from "@/components/sections/aerial-drones/monitoring-and-evaluation";


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

const CAPABILITIES_FALLBACK_ICONS = ["terrain", "water-outline", "thermometer-lines", "swap-horizontal"];

const IMPACT_FALLBACK_ICONS = ["water", "sprout", "home-flood"];

/**
 * Sections migrated to Keystatic in page order (see the
 * `monitoring-and-evaluation` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, drivingSustainability
 * introText, techWeUse introText, whyPartnerWithUs introText, cta ctaBand.
 * Four legacy tails (OurCapabilitiesSection + ImpactSection with
 * `fallbackIcons`, SmartMonitoringSection with `card.iconShape` + `actions`,
 * WhatWeOfferSection with `leadImages` + media cards) sit at fixed positions
 * between them, so the route renders each Keystatic section by index instead
 * of one whole PageBuilderDocument. If an edit changes the section COUNT, the
 * route falls back to legacy rather than misplacing sections — keep this in
 * sync with the mapping. (M13 batch 7, 2026-09-20 — the single-shared-child
 * wrappers `HeroSection`, `TextSection` (+ its `DrivingSustainability`/
 * `TechWeUse`/`WhyPartnerWithUs` shims), `OurCapabilitiesSection` and
 * `ImpactSection` were removed; both branches below render the shared
 * `Hero`/`IntroTextSection`/`CardGrid` directly. `WhatWeOfferSection` keeps
 * its wrapper (leadImages empty-to-null shaping).)
 */
const KEYSTATIC_SECTION_COUNT = 5;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "monitoring-and-evaluation" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the five migrated
	// sections only when the slug is allowlisted via `KEYSTATIC_PAGES` and the
	// entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;

	const { t } = useTranslation(["aerial-drones/monitoring-and-evaluation"]);
	const heroData = t("aerial-drones/monitoring-and-evaluation:hero", {
		returnObjects: true,
	}) as unknown as HeroContent;
	const drivingSustainability = t("aerial-drones/monitoring-and-evaluation:drivingSustainability", {
		returnObjects: true,
	}) as unknown as TextContent;
	const ourCapabilities = t("aerial-drones/monitoring-and-evaluation:ourCapabilities", {
		returnObjects: true,
	}) as unknown as CapabilitiesContent;
	const capabilityItems = Array.isArray(ourCapabilities?.items) ? ourCapabilities.items : [];
	const capabilitiesGrid =
		capabilityItems.length === 0 ? null : (
			<CardGrid
				tag={ourCapabilities.tag}
				headline={ourCapabilities.headline}
				description={ourCapabilities.description}
				items={capabilityItems}
				columns={4}
				align="center"
				tone="surface"
				card={{ iconShape: "xl" }}
				fallbackIcons={CAPABILITIES_FALLBACK_ICONS}
			/>
		);
	const techWeUse = t("aerial-drones/monitoring-and-evaluation:techWeUse", {
		returnObjects: true,
	}) as unknown as TextContent;
	const impact = t("aerial-drones/monitoring-and-evaluation:impact", {
		returnObjects: true,
	}) as unknown as ImpactContent;
	const impactItems = Array.isArray(impact?.items) ? impact.items : [];
	const impactGrid =
		impactItems.length === 0 ? null : (
			<CardGrid
				tag={impact.tag}
				headline={impact.headline}
				description={impact.description}
				items={impactItems}
				columns={3}
				align="center"
				card={{ density: "roomy", iconShape: "xl" }}
				fallbackIcons={IMPACT_FALLBACK_ICONS}
			/>
		);
	const whyPartnerWithUs = t("aerial-drones/monitoring-and-evaluation:whyPartnerWithUs", {
		returnObjects: true,
	}) as unknown as TextContent;

	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
		const renderAt = (index: number) => {
			const section = sections[index];
			return renderSection(section.id, section.value, locale, section.key);
		};
		return (
			<div className="relative">
				<PageHead pageName="monitoring-and-evaluation" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					{renderAt(1)}
					{capabilitiesGrid}
					{renderAt(2)}
					{impactGrid}
					{renderAt(3)}
					<SmartMonitoringSection />
					<WhatWeOfferSection />
					{renderAt(4)}
				</div>
			</div>
		);
	}

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
				{capabilitiesGrid}
				<IntroTextSection
					tone="surface"
					tag={techWeUse?.tag}
					headline={techWeUse?.headline}
					description={techWeUse?.description}
				/>
				{impactGrid}
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
