import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import HeroSection from "@/components/sections/home/HeroSection";
import LeadGenBar from "@/components/sections/shared/LeadGenBar";
import {
	About,
	Certifications,
	CoreExpertise,
	CoverageArea,
	Faq,
	IndustriesWeServe,
	KeyFacts,
	PlanningInfographic,
	SurveyCost,
	SurveyingInstruments,
	Trustees,
	WhyChooseUs,
	type AboutProps,
	type CertificationsProps,
	type CoreExpertiseProps,
	type CoverageAreaProps,
	type IndustriesWeServeProps,
	type KeyFactsProps,
	type PlanningInfographicProps,
	type SurveyCostProps,
	type SurveyingInstrumentsProps,
	type TrusteesProps,
	type WhyChooseUsProps,
} from "@/components/sections/shared";
import type { FaqSectionItem } from "@/components/sections/FaqSectionItems";
import {
	ActionCtaSection,
	CtaSection,
	DronesSection,
	ServicesSection,
} from "@/components/sections/home";

interface PageProps {
	/** Keystatic page when the `home` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
    resolution: any;
}

interface FaqContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: FaqSectionItem[];
	stillCurious?: {
		label?: string;
		description?: string;
		cta?: { label: string; href: string; icon?: string };
	};
}

/**
 * Sections migrated to Keystatic in legacy page order (see the `home`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): homeHero,
 * leadGenBar, about, planningInfographic, surveyingInstruments, homeDrones,
 * actionCtaSurveyor ctaBand, services, industriesWeServe cardGrid,
 * whyChooseUs, coreExpertise, surveyCost, coverageArea, faq,
 * actionCtaEngineer ctaBand, keyFacts, certifications, trustees,
 * defaultCta ctaBand (M12, 2026-09-18 — entry order IS page order).
 * The Keystatic branch destructures them once into named slots in entry
 * order (`hero`, `leadGenBar`, … — no index literals) and places each slot
 * at its legacy position instead of one whole PageBuilderDocument, because
 * route-level layout chrome (centering divs, the `-mt-48` overlap) lives
 * outside the registry. If an edit changes the section COUNT, the route
 * falls back to legacy rather than misplacing sections — keep this in sync
 * with the mapping.
 *
 * `leadGenBar` keeps its route-level positioning (`-mt-48` overlap) via
 * `cloneElement`: the registry stores content only, never `className`.
 *
 * M13 batch 11, 2026-09-20 — the twelve single-shared-child wrappers
 * (`AboutSection`, `CertificationsSection`, `KeyFactsSection`,
 * `TrusteesSection`, `MetricsSection` (commented out of the route),
 * `WhyChooseUsSection`, `PlanningInfographicSection`,
 * `SurveyingInstrumentsSection`, `CoreExpertiseSection`,
 * `SurveyCostSection`, `CoverageAreaSection`, `IndustriesWeServeSection`)
 * and the shaping `FaqSection` were deleted; the legacy branch below renders
 * the shared components directly with the identical `t()` lookups, anchor
 * ids and guards, and the entries already use the shared branches with
 * content preserved. `homeHero`/`homeDrones` keep their uniques (bespoke);
 * the two ActionCta/CtaSection wrappers collapsed in M7 batch 17 stay
 * collapsed onto `ctaBand`.
 */
const KEYSTATIC_SECTION_COUNT = 19;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "home" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage, resolution }) => {
	const { t } = useTranslation(["common"]);
	// Migration source switch (M3/M7): Keystatic owns the nineteen migrated
	// sections only when the slug is allowlisted via `KEYSTATIC_PAGES` and the
	// entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;
	console.log("resolution", resolution);
	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
		// M12: entry order IS page order — destructure once into named
		// slots, no index literals. Positions below mirror the legacy
		// branch; the count guard in `orderedSections` keeps a mismatch
		// on legacy.
		const [
			hero,
			leadGenBar,
			aboutSection,
			planning,
			instruments,
			drones,
			surveyorCta,
			servicesSection,
			industries,
			whyChoose,
			coreExpertise,
			surveyCost,
			coverageArea,
			faqSection,
			engineerCta,
			keyFacts,
			certifications,
			trustees,
			defaultCta,
		] = sections.map((section) =>
			renderSection(section.id, section.value, locale, section.key)
		);
		return (
			<div className="relative ">
				<PageHead pageName="home" />
				<div
					className="flex flex-col min-h-screen"
					data-keystatic-page={keystaticPage.slug}
				>
					{hero}
					<div className="flex flex-col mx-auto max-w-7xl px-6 w-full">
						{/*cloneElement(leadGenBar as ReactElement<{ className?: string }>, {
							className: "my-12  -mt-48",
						})*/}
						{leadGenBar}
						{aboutSection}
						{planning}
					</div>
					{instruments}
					{drones}

					{surveyorCta}

					{servicesSection}
					{industries}
					<div className="flex flex-col  w-full">
						{whyChoose}

						{coreExpertise}

						{surveyCost}
						{coverageArea}
						{faqSection}
						{engineerCta}
						{keyFacts}
						{certifications}
						{trustees}
						{/* <Metrics /> (metrics stays registered-only — commented out of the route) */}
					</div>

					{defaultCta}
				</div>
			</div>
		);
	}

	const aboutData = t("common:about", { returnObjects: true }) as unknown as AboutProps["data"];
	const planningData = t("common:planningInfographic", {
		returnObjects: true,
	}) as unknown as PlanningInfographicProps["data"];
	const instrumentsData = t("common:surveyingInstruments", {
		returnObjects: true,
	}) as unknown as SurveyingInstrumentsProps["data"];
	const industriesData = t("common:industriesWeServe", {
		returnObjects: true,
	}) as unknown as IndustriesWeServeProps["data"];
	const whyChooseUsData = t("common:whyChooseUs", {
		returnObjects: true,
	}) as unknown as WhyChooseUsProps["data"];
	const coreExpertiseData = t("common:coreExpertise", {
		returnObjects: true,
	}) as unknown as CoreExpertiseProps["data"];
	const surveyCostData = t("common:surveyCostInKenya", {
		returnObjects: true,
	}) as unknown as SurveyCostProps["data"];
	const coverageAreaData = t("common:coverageArea", {
		returnObjects: true,
	}) as unknown as CoverageAreaProps["data"];
	const faqContent = t("common:faq", { returnObjects: true }) as unknown as FaqContent;
	const faqItems = Array.isArray(faqContent?.items) ? faqContent.items : [];
	const keyFactsData = t("common:keyFacts", {
		returnObjects: true,
	}) as unknown as KeyFactsProps["data"];
	const certificationsData = t("common:certifications", {
		returnObjects: true,
	}) as unknown as CertificationsProps["data"];
	const trusteesData = t("common:trustees", {
		returnObjects: true,
	}) as unknown as TrusteesProps["data"];

	return (
		<div className="relative ">
			<PageHead pageName="home" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<div className="flex flex-col mx-auto max-w-7xl px-6 w-full">
					<LeadGenBar
						className="my-12  -mt-48"
						// className="my-12 "
					/>
					<About data={aboutData} id="about" />
					<PlanningInfographic data={planningData} />
				</div>
				<SurveyingInstruments data={instrumentsData} id="surveying-instruments" />
				<DronesSection />

				<ActionCtaSection contentKey="actionCtaSurveyor" />

				<ServicesSection />
				<IndustriesWeServe data={industriesData} id="industries-we-serve" />
				<div className="flex flex-col  w-full">
					<WhyChooseUs data={whyChooseUsData} id="why-choose-us" />

					<CoreExpertise data={coreExpertiseData} id="core-expertise" />

					<SurveyCost data={surveyCostData} id="survey-cost" />
					<CoverageArea data={coverageAreaData} id="coverage-area" />
					{faqItems.length === 0 ? null : (
						<Faq
							tag={faqContent.tag}
							headline={faqContent.headline}
							description={faqContent.description}
							items={faqItems}
							stillCurious={faqContent.stillCurious}
						/>
					)}
					{/* ActionCtaSection contentKey="actionCtaEngineer" */}
					<ActionCtaSection contentKey="actionCtaEngineer" />
					<KeyFacts data={keyFactsData} id="key-facts" />
					<Certifications data={certificationsData} id="certifications" />
					<Trustees data={trusteesData} id="trustees" />
					{/* <Metrics /> (metrics stays registered-only — commented out of the route) */}
				</div>

				<CtaSection />
			</div>
		</div>
	);
};


export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
        "home"
	]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("home", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null, resolution } };
};

export default Page;
