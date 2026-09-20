import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";
import { CtaBand } from "@/components/sections/shared/CtaBand";
import { Deliverables } from "@/components/sections/Deliverables";
import { Gallery } from "@/components/sections/shared/Gallery";
import {
	BuildingSiteHeroSection,
	BuildSmarterSection,
	SiteEngineeringSection,
	ProcessSection,
	AccuracyMattersSection,
	ActionCtaBand,
	TechnologyStackSection,
	ConsultationSection,
	SiteCtaSection,
} from "@/components/sections/surveying/building-site";

type PageProps = {
	/** Keystatic page when the `building-site-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface Section1Content {
	tag?: string | null;
	headline: string;
	description?: string | null;
}

interface ActionCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	watermark?: string | null;
	primary?: { label: string; href: string; icon?: string } | null;
	secondary?: { label: string; href: string; icon?: string } | null;
}

interface ExploreContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: (string | { image?: string | null; title?: string | null; description?: string | null })[] | null;
}

/**
 * All twelve legacy sections are Keystatic-owned in page order (see the
 * `building-site-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): bsHero, introText,
 * bsSiteEngineering, bsSection2, bsProcess, bsAccuracyMatters,
 * actionCtaEngineer ctaBand, deliverables, bsTechnology, bsConsultation,
 * exploreMore gallery, cta ctaBand (M11 batch 9; M13 batch 9, 2026-09-20 —
 * the single-shared-child wrappers `IntroSection`, `DeliverablesSection`,
 * `ActionCtaBand` and `ExploreMoreSection` were removed; the legacy branch
 * below renders the shared `IntroTextSection`, `Deliverables`, `CtaBand` and
 * `Gallery` directly, and the entry already uses the shared
 * `introText`/`ctaBand`/`deliverables`/`gallery` branches with content
 * preserved).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	// Migration source switch (M3/M7, completed M11 batch 9, flexible since
	// M12): Keystatic owns the whole page when the slug is allowlisted via
	// `KEYSTATIC_PAGES` and the entry is published. Otherwise the legacy
	// locale-JSON implementation renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="building-site-surveys" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const section1 = t("surveying/building-site-surveys:section1", {
		returnObjects: true,
	}) as unknown as Section1Content;
	const actionCta = t("surveying/building-site-surveys:actionCtaEngineer", {
		returnObjects: true,
	}) as unknown as ActionCtaContent;
	const exploreMore = t("surveying/building-site-surveys:exploreMore", {
		returnObjects: true,
	}) as unknown as ExploreContent;

	return (
		<div className="relative">
			<PageHead pageName="building-site-surveys" />
			<div className="flex flex-col min-h-screen">
				<BuildingSiteHeroSection />
				<IntroTextSection
					tag={section1.tag ?? null}
					headline={section1.headline}
					description={section1.description ?? undefined}
					split
				/>
				<SiteEngineeringSection />
				<BuildSmarterSection />
				<ProcessSection />
				<AccuracyMattersSection />
				{actionCta?.headline ? (
					<CtaBand
						className="pb-24 sm:pb-28 relative overflow-hidden"
						layout="split"
						shimmer
						watermark={actionCta.watermark}
						tag={actionCta.tag}
						headline={actionCta.headline}
						description={actionCta.description}
						primary={
							actionCta.primary?.href
								? {
										label: actionCta.primary.label,
										href: actionCta.primary.href,
										icon: actionCta.primary.icon,
										iconPosition: "end",
									}
								: null
						}
						secondary={
							actionCta.secondary?.href
								? {
										label: actionCta.secondary.label,
										href: actionCta.secondary.href,
										icon: actionCta.secondary.icon,
									}
								: null
						}
					/>
				) : (
					<></>
				)}
				<Deliverables ns="surveying/building-site-surveys" />
				<TechnologyStackSection />
				<ConsultationSection />
				{Array.isArray(exploreMore?.items) && exploreMore.items.length > 0 ? (
					<Gallery tag={exploreMore.tag ?? null} headline={exploreMore.headline} description={exploreMore.description} items={exploreMore.items} columns={3} />
				) : null}
				<SiteCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/building-site-surveys"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("building-site-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
