import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import {
	CompanyProfileHero,
	CompanyStatsStrip,
	CompanyAboutSection,
	CompanyMissionVisionSection,
	CompanyServicesSection,
	CompanyWhyUsSection,
	CompanyProfileViewerSection,
} from "@/components/sections/company-profile";

type PageProps = {
	/** Keystatic page when the `company-profile` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M4): Keystatic owns the shared sections only
	// when the slug is allowlisted via `KEYSTATIC_PAGES` and the entry is
	// published. The bespoke PDF viewer has no shared equivalent and always
    // renders from legacy locale JSON (hybrid strategy) — see registry header.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="company-profile" />
				<PageBuilderDocument page={keystaticPage} />
				<CompanyProfileViewerSection />
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="company-profile" />
			<div className="flex flex-col min-h-screen">
				<CompanyProfileHero />
				<CompanyStatsStrip />
				<CompanyAboutSection />
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
