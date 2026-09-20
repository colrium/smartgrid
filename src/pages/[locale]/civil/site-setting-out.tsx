import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import { Deliverables } from "@/components/sections/Deliverables";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";
import { FaqSection } from "@/components/sections/civil/site-setting-out";

type PageProps = {
	/** Keystatic page when the `site-setting-out` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

interface InstrumentsContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: CardItem[] | null;
};

/**
 * Sections migrated to Keystatic in page order (see the `site-setting-out`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): hero (dual pills),
 * faq (icon/title/description items). Tails stay legacy: OurServicesSection
 * (`indexed`), OurInstrumentsSection (`mediaBadged`), bespoke Deliverables
 * explorer. If an edit changes the section COUNT, the route falls back to
 * legacy rather than misplacing sections — keep this in sync with the mapping.
 * (M13 batch 6, 2026-09-20 — the single-shared-child wrappers `HeroSection`,
 * `OurServicesSection` and `OurInstrumentsSection` were removed; both
 * branches below render the shared `Hero`/`CardGrid` directly.)
 */
const KEYSTATIC_SECTION_COUNT = 2;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "site-setting-out" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the two migrated
	// sections only when the slug is allowlisted via `KEYSTATIC_PAGES` and the
	// entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;

	const { t } = useTranslation(["civil/site-setting-out"]);
	const heroData = t("civil/site-setting-out:hero", { returnObjects: true }) as unknown as HeroContent;
	const ourServices = t("civil/site-setting-out:ourServices", {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const ourServiceItems: CardItem[] = Array.isArray(ourServices?.items) ? ourServices.items : [];
	const ourServicesGrid =
		ourServiceItems.length === 0 ? null : (
			<CardGrid
				tag={ourServices.tag}
				headline={ourServices.headline}
				description={ourServices.description}
				items={ourServiceItems}
				columns={3}
				headerAlign="left"
				indexed
			/>
		);
	const ourInstruments = t("civil/site-setting-out:ourInstruments", {
		returnObjects: true,
	}) as unknown as InstrumentsContent;
	const ourInstrumentItems = Array.isArray(ourInstruments?.items) ? ourInstruments.items : [];
	const ourInstrumentsGrid =
		ourInstrumentItems.length === 0 ? null : (
			<CardGrid
				tag={ourInstruments.tag ?? null}
				headline={ourInstruments.headline}
				description={ourInstruments.description}
				items={ourInstrumentItems}
				columns={3}
				tone="surface"
				mediaBadged
				card={{ mediaPosition: "background", mediaAspect: "h-64 sm:h-72" }}
			/>
		);

	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
		const renderAt = (index: number) => {
			const section = sections[index];
			return renderSection(section.id, section.value, locale, section.key);
		};
		return (
			<div className="relative">
				<PageHead pageName="civil-site-setting-out" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					{ourServicesGrid}
					{ourInstrumentsGrid}
					<Deliverables ns="civil/site-setting-out" className="bg-surface" />
					{renderAt(1)}
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="civil-site-setting-out" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				{ourServicesGrid}
				{ourInstrumentsGrid}
				<Deliverables ns="civil/site-setting-out" className="bg-surface" />
				<FaqSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "civil/site-setting-out"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("site-setting-out", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;