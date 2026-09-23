import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { Deliverables } from "@/components/sections/Deliverables";
import {
	SurveyingServicesSection,
	SurveyingProcessSection,
} from "@/components/sections/surveying/landing";

type PageProps = {
	/** Keystatic page when the `surveying` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * All four hub sections are Keystatic-owned in page order (see the
 * `surveying` mapping in `scripts/migrate-locale-to-keystatic.mjs`): hero,
 * surveyingServices, surveyingProcess, deliverables (M11 batch 5; M13 batch
 * 10, 2026-09-20 — the single-shared-child wrappers `SurveyingHeroSection`
 * and `SurveyingDeliverablesSection` were removed; the legacy branch below
 * renders the shared `Hero` and `Deliverables` directly with identical
 * `t()` calls and presentation literals, and the entry already uses the
 * shared `hero`/`deliverables` branches with content preserved.
 * `SurveyingServicesSection`/`SurveyingProcessSection` keep their wrappers —
 * shaping grids outside the shared contracts).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["surveying/landing"]);
	// Migration source switch (M3/M7, completed M11 batch 5): Keystatic owns
	// the whole hub in page order — `hero`, `surveyingServices`,
	// `surveyingProcess`, `deliverables` — when the slug is allowlisted via
	// `KEYSTATIC_PAGES` and the entry is published. Otherwise the legacy
	// locale-JSON implementation renders unchanged.
	const heroData = t("surveying/landing:hero", { returnObjects: true }) as unknown as HeroContent;

	return (
		<div className="relative">
			<PageHead pageName="surveying" />
			<div className="flex flex-col min-h-screen">
				{keystaticPage ? (
					<PageBuilderDocument page={keystaticPage} />
				) : (
					<>
						<Hero data={heroData} />
						<SurveyingServicesSection />
						<SurveyingProcessSection />
						<Deliverables ns="surveying/landing" className="bg-surface" />
					</>
				)}
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/landing"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("surveying", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
