import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import type { CardItem } from "@/components/sections/shared/CardGrid";
import { Stats, type StatItem } from "@/components/sections/shared/Stats";
import { CtaSection } from "@/components/sections/aerial-drones/as-built-surveys";
import { AbWhyUseDronesCard } from "@/components/sections/aerial-drones/as-built-surveys/AbWhyUseDronesCard";
import { AbProcessTimeline } from "@/components/sections/aerial-drones/as-built-surveys/AbProcessTimeline";

type PageProps = {
	/** Keystatic page when the `aerial-drones-as-built-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface WhyDronesContent {
	tag?: string | null;
	headline: string;
	items?: CardItem[] | null;
}

interface ProcessContent {
	tag?: string | null;
	headline: string;
	items: { title: string; description: string }[];
}

interface MetricsContent {
	items?: StatItem[] | null;
}

/**
 * All five legacy sections are Keystatic-owned in page order (see the
 * `aerial-drones-as-built-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, abWhyUseDrones
 * (fallback-icons grid), abProcess (the `Process` grid variant),
 * metrics stats, ctaSection bleed ctaBand — M11 batch 18, 2026-09-20.
 * Entry order IS page order, so editors can add, remove, and reorder
 * sections freely; the M3 resolver taxonomy remains the only fallback.
 * The hero/stats/cta entries keep their M7 shared branches;
 * `abWhyUseDrones` and `abProcess` are the batch-18 uniques (the
 * hardcoded `fallbackIcons` array and the grid layout/columns sit
 * outside the shared `cardGrid`/`process` contracts). M13 batch 7
 * retired the `WhyUseDronesSection`/`ProcessSection` wrappers; the
 * legacy branch renders the batch-18 renderer components with the
 * wrappers' literals.
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const NS = "aerial-drones/aerial-drones-as-built-surveys";
	const { t } = useTranslation([NS]);
	// Migration source switch (M3/M7, completed M11 batch 18): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="aerial-drones-as-built-surveys" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const heroData = t(`${NS}:hero`, { returnObjects: true }) as unknown as HeroContent;
	const whyUseDrones = t(`${NS}:whyUseDrones`, {
		returnObjects: true,
	}) as unknown as WhyDronesContent;
	const process = t(`${NS}:process`, {
		returnObjects: true,
	}) as unknown as ProcessContent;
	const metrics = t(`${NS}:metrics`, {
		returnObjects: true,
	}) as unknown as MetricsContent;
	const metricItems = Array.isArray(metrics?.items) ? metrics.items : [];
	const metricsBand = metricItems.length === 0 ? null : <Stats items={metricItems} columns={3} />;

	return (
		<div className="relative">
			<PageHead pageName="aerial-drones-as-built-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<AbWhyUseDronesCard data={whyUseDrones} />
				<AbProcessTimeline data={process} />
				{metricsBand}
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
		"aerial-drones/aerial-drones-as-built-surveys",
	]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("aerial-drones-as-built-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
