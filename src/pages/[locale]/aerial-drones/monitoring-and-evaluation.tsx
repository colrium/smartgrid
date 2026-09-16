import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import {
	HeroSection,
	DrivingSustainabilitySection,
	OurCapabilitiesSection,
	TechWeUseSection,
	ImpactSection,
	WhyPartnerWithUsSection,
	SmartMonitoringSection,
	WhatWeOfferSection,
	CtaSection,
} from "@/components/sections/aerial-drones/monitoring-and-evaluation";


type PageProps = {
	/** Keystatic page when the `monitoring-and-evaluation` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

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
 * sync with the mapping.
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
					<OurCapabilitiesSection />
					{renderAt(2)}
					<ImpactSection />
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
				<HeroSection />
				<DrivingSustainabilitySection />
				<OurCapabilitiesSection />
				<TechWeUseSection />
				<ImpactSection />
				<WhyPartnerWithUsSection />
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
