import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import {
	CareersHeroSection,
	CurrentOpeningsSection,
	ApplicationProcessSection,
	EqualOpportunityStatementSection,
} from "@/components/sections/careers";
import { ServicesSection, LeadGenBar } from "@/components/sections/shared";

type PageProps = {
	/** Keystatic page when the `careers` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
	resolution: any;
};

const Page: NextPage<PageProps> = ({ keystaticPage, resolution }) => {
	// Migration source switch (M3/M7, completed M11 batch 2): Keystatic owns
	// the whole page in page order — `hero`, `leadGenBar`, `services`,
	// `careersOpenings`, `careersProcess`, `careersStatement` — when the
	// slug is allowlisted via `KEYSTATIC_PAGES` and the entry is published.
	// Otherwise the legacy locale-JSON implementation renders unchanged.
	// NOTE: the `leadGenBar`/`services` entry copies embed the global
	// `common:leadGenBar`/`common:services` instances verbatim (same copy
	// as home); re-run the migration to refresh them.
	console.log("resolution", resolution);
	return (
		<div className="relative">
			<PageHead pageName="careers" />
			<div className="flex flex-col min-h-screen">
				{keystaticPage ? (
					<PageBuilderDocument page={keystaticPage} />
				) : (
					<>
						<CareersHeroSection />
						<LeadGenBar />
						<ServicesSection />
						<CurrentOpeningsSection />
						<ApplicationProcessSection />
						<EqualOpportunityStatementSection />
					</>
				)}
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "careers"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("careers", lang);

	return {
		props: {
			...i18nProps,
			keystaticPage: resolution.status === "keystatic" ? resolution.page : null,
			resolution,
		},
	};
};

export default Page;
