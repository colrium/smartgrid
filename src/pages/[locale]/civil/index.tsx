import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { Deliverables } from "@/components/sections/Deliverables";
import {
	CivilHeroSection,
	CivilServicesSection,
	CivilProcessSection,
} from "@/components/sections/civil/landing";

type PageProps = {
	/** Keystatic page when the `civil` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * All four hub sections are Keystatic-owned in page order (see the `civil`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): civilHero,
 * services cardGrid, civilProcess, deliverables (M11 batch 5; M13 batch 10,
 * 2026-09-20 — the single-shared-child wrapper `CivilDeliverablesSection`
 * was removed; the legacy branch below renders the shared `Deliverables`
 * directly with identical props, and the entry already uses the shared
 * `deliverables` branch with content preserved. `CivilHeroSection`,
 * `CivilServicesSection` and `CivilProcessSection` keep their wrappers —
 * bespoke hero and shaping grids/process outside the shared contracts).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 5): Keystatic owns
	// the whole hub in page order — `civilHero`, `services` cardGrid,
	// `civilProcess`, `deliverables` — when the slug is allowlisted via
	// `KEYSTATIC_PAGES` and the entry is published. Otherwise the legacy
	// locale-JSON implementation renders unchanged.
	return (
		<div className="relative">
			<PageHead pageName="civil" />
			<div className="flex flex-col min-h-screen">
				{keystaticPage ? (
					<PageBuilderDocument page={keystaticPage} />
				) : (
					<>
						<CivilHeroSection />
						<CivilServicesSection />
						<CivilProcessSection />
						<Deliverables ns="civil/landing" className="bg-surface" />
					</>
				)}
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
