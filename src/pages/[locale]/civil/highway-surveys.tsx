import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";
import { Deliverables } from "@/components/sections/Deliverables";
import { ServicesSection } from "@/components/sections/civil/highway-surveys";

type PageProps = {
	/** Keystatic page when the `highway-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface OverviewContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

interface BenefitsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { icon?: string; title: string; description: string }[];
}

/**
 * All five legacy sections are Keystatic-owned in page order (see the
 * `highway-surveys` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * hero, overview introText, highwayServices, benefits cardGrid,
 * deliverables (M11 batch 15, 2026-09-19 — entry order IS page order, so
 * editors can add, remove, and reorder sections freely; the M3 resolver
 * taxonomy remains the only fallback. M13 batch 5, 2026-09-20 — the
 * single-shared-child wrappers `HeroSection`, `OverviewSection`,
 * `BenefitsSection` and `DeliverablesSection` were removed; the legacy
 * branch below renders the shared `Hero`, `IntroTextSection`, `CardGrid`
 * and `Deliverables` directly, and the entry uses the shared
 * `hero`/`introText`/`cardGrid`/`deliverables` branches with content
 * preserved. `ServicesSection` keeps its unique (`indexed` numbering is
 * outside the shared `cardGrid` contract).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["civil/highway-surveys"]);
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

	const heroData = t("civil/highway-surveys:hero", { returnObjects: true }) as unknown as HeroContent;
	const overview = t("civil/highway-surveys:overview", {
		returnObjects: true,
	}) as unknown as OverviewContent;
	const benefits = t("civil/highway-surveys:benefitsOfHighwaySurveys", {
		returnObjects: true,
	}) as unknown as BenefitsContent;
	const benefitItems: CardItem[] = Array.isArray(benefits?.items) ? benefits.items : [];

	return (
		<div className="relative">
			<PageHead pageName="civil-highway-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<IntroTextSection
					tag={overview.tag}
					headline={overview.headline}
					description={overview.description}
					tone="surface"
				/>
				<ServicesSection />
				{benefitItems.length === 0 ? null : (
					<CardGrid
						tag={benefits.tag}
						headline={benefits.headline}
						description={benefits.description}
						items={benefitItems}
						columns={3}
						tone="surface"
					/>
				)}
				<Deliverables ns="civil/highway-surveys" baseKey="highwaySurveyDeliverables" />
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
