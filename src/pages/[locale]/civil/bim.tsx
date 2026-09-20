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
import { CtaSection } from "@/components/sections/civil/bim";

type PageProps = {
	/** Keystatic page when the `bim` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface BimServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
};

/**
 * Sections migrated to Keystatic in page order (see the `bim` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero (secondary-only pill),
 * cta ctaBand. Two legacy tails (the `indexed` BimServices grid, bespoke
 * Deliverables explorer) sit at fixed positions between them, so the route
 * renders each Keystatic section by index instead of one whole
 * PageBuilderDocument. If an edit changes the section COUNT, the route falls
 * back to legacy rather than misplacing sections — keep this in sync with
 * the mapping. (M13 batch 6, 2026-09-20 — the single-shared-child wrappers
 * `HeroSection` and `BimServicesSection` were removed; both branches below
 * render the shared `Hero`/`CardGrid` directly.)
 */
const KEYSTATIC_SECTION_COUNT = 2;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "bim" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["civil/bim"]);
	// Migration source switch (M3/M7): Keystatic owns the two migrated
	// sections only when the slug is allowlisted via `KEYSTATIC_PAGES` and the
	// entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;

	const heroData = t("civil/bim:hero", { returnObjects: true }) as unknown as HeroContent;
	const bimServices = t("civil/bim:bimServices", {
		returnObjects: true,
	}) as unknown as BimServicesContent;
	const bimServiceItems: CardItem[] = Array.isArray(bimServices?.items) ? bimServices.items : [];
	const bimServicesGrid =
		bimServiceItems.length === 0 ? null : (
			<CardGrid
				tag={bimServices.tag}
				headline={bimServices.headline}
				description={bimServices.description}
				items={bimServiceItems}
				columns={3}
				tone="surface"
				headerAlign="left"
				indexed
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
				<PageHead pageName="civil-bim" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					{bimServicesGrid}
					<Deliverables ns="civil/bim" className="bg-surface" />
					{renderAt(1)}
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="civil-bim" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				{bimServicesGrid}
				<Deliverables ns="civil/bim" className="bg-surface" />
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "civil/bim"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("bim", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;