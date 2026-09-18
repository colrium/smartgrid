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
	// Migration source switch (M4, completed M11 batch 3): Keystatic owns
	// the whole page in page order — 6 shared sections plus the
	// `companyProfileViewer` unique tail — when the slug is allowlisted via
	// `KEYSTATIC_PAGES` and the entry is published. Otherwise the legacy
	// locale-JSON implementation renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="company-profile" />
				<PageBuilderDocument page={keystaticPage} />
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
