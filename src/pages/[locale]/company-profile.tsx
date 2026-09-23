import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { SplitMedia } from "@/components/sections/shared/SplitMedia";
import { Stats } from "@/components/sections/shared/Stats";
import {
	CompanyProfileHero,
	CompanyMissionVisionSection,
	CompanyServicesSection,
	CompanyWhyUsSection,
	CompanyProfileViewerSection,
} from "@/components/sections/company-profile";

type PageProps = {
	/** Keystatic page when the `company-profile` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface AboutContent {
	tag?: string | null;
	headline: string;
	image?: string | null;
	description?: string | null;
	points?: string[] | null;
}

interface StatsContent {
	items?: { icon?: string | null; value?: string; label?: string }[] | null;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M4, completed M11 batch 3): Keystatic owns
	// the whole page in page order — 6 shared sections plus the
	// `companyProfileViewer` unique tail — when the slug is allowlisted via
	// `KEYSTATIC_PAGES` and the entry is published. Otherwise the legacy
	// locale-JSON implementation renders unchanged. M13 batch 11,
	// 2026-09-20 — the single-shared-child wrappers `CompanyAboutSection`
	// and `CompanyStatsStrip` were removed; the legacy branch renders the
	// shared `SplitMedia`/`Stats` directly with content preserved.
	const { t } = useTranslation(["company-profile"]);
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="company-profile" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const about = t("company-profile:about", { returnObjects: true }) as unknown as AboutContent;
	const stats = t("company-profile:stats", { returnObjects: true }) as unknown as StatsContent;

	return (
		<div className="relative">
			<PageHead pageName="company-profile" />
			<div className="flex flex-col min-h-screen">
				<CompanyProfileHero />
				<Stats items={stats?.items ?? null} metrics={stats?.items ?? null} layout="panel" />
				{about?.headline ? (
					<SplitMedia
						data={{
							tag: about.tag ?? null,
							headline: about.headline,
							description: about.description ?? null,
							image: about.image ?? null,
							points: about.points ?? null,
						}}
						imagePosition="right"
						mediaAspect="aspect-square"
						classes={{
							mediaWrapper: "bg-transparent p-8",
							mediaCard: "bg-surface shadow-none! border-0! bg-transparent",
						}}
					/>
				) : null}
				<CompanyMissionVisionSection />
				<CompanyServicesSection />
				<CompanyWhyUsSection />
				<CompanyProfileViewerSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "company-profile"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("company-profile", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
