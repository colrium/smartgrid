import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import {
	HeroSection,
	OverviewSection,
	ServicesSection,
	BenefitsSection,
	DeliverablesSection,
} from "@/components/sections/civil/highway-surveys";

type PageProps = {
	/** Keystatic page when the `highway-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * All five legacy sections are Keystatic-owned in page order (see the
 * `highway-surveys` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * hero, overview introText, highwayServices, benefits cardGrid,
 * deliverables (M11 batch 15, 2026-09-19 — entry order IS page order, so
 * editors can add, remove, and reorder sections freely; the M3 resolver
 * taxonomy remains the only fallback).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 15): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="civil-highway-surveys" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="civil-highway-surveys" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<OverviewSection />
				<ServicesSection />
				<BenefitsSection />
				<DeliverablesSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "civil/highway-surveys"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("highway-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;