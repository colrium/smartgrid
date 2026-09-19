import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import {
	BuildingSiteHeroSection,
	IntroSection,
	BuildSmarterSection,
	SiteEngineeringSection,
	ProcessSection,
	AccuracyMattersSection,
	ActionCtaBand,
	DeliverablesSection,
	TechnologyStackSection,
	ConsultationSection,
	ExploreMoreSection,
	SiteCtaSection,
} from "@/components/sections/surveying/building-site";

type PageProps = {
	/** Keystatic page when the `building-site-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7/M11): Keystatic owns the whole page
	// when the slug is allowlisted via `KEYSTATIC_PAGES` and the entry is
	// published. Otherwise the legacy locale-JSON implementation renders
	// unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="building-site-surveys" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="building-site-surveys" />
			<div className="flex flex-col min-h-screen">
				<BuildingSiteHeroSection />
				<IntroSection />
				<SiteEngineeringSection />
				<BuildSmarterSection />
				<ProcessSection />
				<AccuracyMattersSection />
				<ActionCtaBand />
				<DeliverablesSection />
				<TechnologyStackSection />
				<ConsultationSection />
				<ExploreMoreSection />
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
