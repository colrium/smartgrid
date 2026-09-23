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
	WhatIsSection,
	ServicesImageSection,
	ServicesDetailSection,
	ProcessSection,
	WhoNeedsSection,
	TimelineSection,
	RegistrationCtaSection,
	SectionalFaqSection,
	// SocialsSection,
} from "@/components/sections/surveying/sectional-properties";

type PageProps = {
	/** Keystatic page when the `sectional-properties` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface Section1Content {
	tag?: string | null;
	headline: string;
	description?: string | null;
	ctaPrimary?: { label: string; href: string } | null;
};

/**
 * All eleven legacy sections are Keystatic-owned in page order (see the
 * `sectional-properties` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, section1,
 * sectionalWhatIs, sectionalServices, sectionalServicesDetail,
 * sectionalWorkflow, deliverables, sectionalWhoNeeds, sectionalTimeline,
 * faq, registrationCta (M11 batch 7; converted to `PageBuilderDocument` in
 * M12 batch 10, 2026-09-19 — entry order IS page order, so editors can add,
 * remove, and reorder sections freely; the M3 resolver taxonomy remains the
 * only fallback. M13 batch 8, 2026-09-20 — the single-shared-child wrappers
 * `SectionalHeroSection`, `IntroSection` and `SectionalDeliverablesSection`
 * were removed; the legacy branch below renders the shared `Hero`,
 * `IntroTextSection` and `Deliverables` directly, and the entry uses the
 * shared `hero`/`introText`/`deliverables` branches with content preserved.
 * `ProcessSection` keeps its unique (custom FIELD/OFFICE/REGISTRY phase
 * styles have no shared-contract home — see M13 rule refinement).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 7, flexible since
	// M12 batch 10): Keystatic owns the whole page when the slug is
	// allowlisted via `KEYSTATIC_PAGES` and the entry is published.
	// Otherwise the legacy locale-JSON implementation renders unchanged.
	const { t } = useTranslation(["surveying/sectional-properties"]);
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="sectional-properties" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const heroData = t("surveying/sectional-properties:hero", { returnObjects: true }) as unknown as HeroContent;
	const section1 = t("surveying/sectional-properties:section1", {
		returnObjects: true,
	}) as unknown as Section1Content;

	return (
		<div className="relative">
			<PageHead pageName="sectional-properties" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<IntroTextSection
					tag={section1.tag ?? null}
					headline={section1.headline}
					description={section1.description ?? undefined}
					cta={section1.ctaPrimary ?? null}
				/>
				<WhatIsSection />
				<ServicesImageSection />
				<ServicesDetailSection />
				<ProcessSection />
				<Deliverables ns="surveying/sectional-properties" className="bg-surface" />
				<WhoNeedsSection />
				<TimelineSection />

				<SectionalFaqSection />
				{/* <SocialsSection /> */}
				<RegistrationCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/sectional-properties"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("sectional-properties", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
