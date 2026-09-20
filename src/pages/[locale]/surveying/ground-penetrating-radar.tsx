import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Deliverables } from "@/components/sections/Deliverables";
import { FinalCta, type FinalCtaAction } from "@/components/sections/shared/FinalCta";
import {
	GprServiceHero,
	GprTechnicalProposalCta,
	GprHighlightsBar,
	GprJumpNav,
	GprOverviewSection,
	GprMethodologySection,
	GprApplicationsSection,
	GprDetectSection,
	GprSueComplianceSection,
	GprLimitationsSection,
	GprBeforeAfterSection,
	GprTechnologySection,
	GprSummarySection,
	FeaturedProjectsSection,
	GprFaqSection,
} from "@/components/sections/surveying/ground-penetrating-radar";

type PageProps = {
	/** Keystatic page when the `ground-penetrating-radar` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface GprFinalCtaContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	note?: string | null;
	actions?: FinalCtaAction[] | null;
};

/**
 * All seventeen legacy sections are Keystatic-owned in page order (see the
 * `ground-penetrating-radar` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): gprHero, technicalCta ctaBand,
 * gprHighlights, gprJumpNav, gprOverview, gprMethodology, gprApplications,
 * gprDetect, deliverables, gprSue, gprLimitations, gprBeforeAfter,
 * gprTechnology, gprFeaturedProjects, gprSummary, faqs faq, finalCta
 * (M11 batch 13, 2026-09-19 — entry order IS page order, so editors can add,
 * remove, and reorder sections freely; the M3 resolver taxonomy remains the
 * only fallback. M13 batch 3, 2026-09-20 — the single-shared-child wrappers
 * `GprDeliverablesSection` and `GprFinalCtaSection` were removed; the legacy
 * branch below renders the shared `Deliverables` and `FinalCta` directly,
 * and the entry uses the shared `deliverables`/`finalCta` branches with
 * content preserved. `gprBeforeAfter` keeps its unique (section + Blob +
 * header shell around the flip card — not a single shared child).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	// Migration source switch (M3/M7, completed M11 batch 13): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="ground-penetrating-radar" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const finalCta = t("surveying/ground-penetrating-radar:finalCta", {
		returnObjects: true,
	}) as unknown as GprFinalCtaContent;

	return (
		<div className="relative">
			<PageHead pageName="ground-penetrating-radar" />
			<div className="flex flex-col min-h-screen">
				<GprServiceHero />
				<GprTechnicalProposalCta />
				<GprHighlightsBar />
				<GprJumpNav />
				<GprOverviewSection />
				<GprMethodologySection />
				<GprApplicationsSection />
				<GprDetectSection />
				<Deliverables
					ns="surveying/ground-penetrating-radar"
					id="deliverables"
					className="bg-surface scroll-mt-36"
				/>
				<GprSueComplianceSection />
				<GprLimitationsSection />
				<GprBeforeAfterSection />
				<GprTechnologySection />
				<FeaturedProjectsSection />
				<GprSummarySection />
				<GprFaqSection />
				{finalCta?.headline ? (
					<FinalCta
						id="get-started"
						tag={finalCta.tag}
						headline={finalCta.headline}
						description={finalCta.description}
						descriptionTone="accent"
						note={finalCta.note}
						watermark="radar"
						actions={finalCta.actions ?? null}
						columns={3}
					/>
				) : null}
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/ground-penetrating-radar"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("ground-penetrating-radar", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
