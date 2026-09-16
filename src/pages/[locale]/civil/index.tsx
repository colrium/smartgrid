import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import {
	CivilHeroSection,
	CivilServicesSection,
	CivilProcessSection,
	CivilDeliverablesSection,
} from "@/components/sections/civil/landing";

type PageProps = {
	/** Keystatic page when the `civil` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the shared services card
	// grid only when the slug is allowlisted via `KEYSTATIC_PAGES` and the
	// entry is published. The bespoke diagonal hero, image stepper process,
	// and deliverables explorer always render from legacy locale JSON (hybrid
	// strategy) — see the `civil` mapping in
	// `scripts/migrate-locale-to-keystatic.mjs`.
	return (
		<div className="relative">
			<PageHead pageName="civil" />
			<div className="flex flex-col min-h-screen">
				<CivilHeroSection />
				{keystaticPage ? <PageBuilderDocument page={keystaticPage} /> : <CivilServicesSection />}
				<CivilProcessSection />
				<CivilDeliverablesSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "civil/landing"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("civil", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
