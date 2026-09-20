import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import { Deliverables } from "@/components/sections/Deliverables";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";
import { SplitMedia } from "@/components/sections/shared/SplitMedia";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";
import { CtaSection } from "@/components/sections/civil/volumetric-surveys";

type PageProps = {
	/** Keystatic page when the `volumetric-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface TextContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

interface PrecisionContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	image?: string | null;
}

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { icon?: string | null; title: string; description: string }[];
};

/**
 * Sections migrated to Keystatic in page order (see the `volumetric-surveys`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): hero, maxProductivity
 * introText, precision splitMedia, clarityAndControl introText, cta ctaBand.
 * Two legacy tails (ServicesSection with a non-default `headerAlign="left"` —
 * a plain cardGrid would centre it — bespoke Deliverables explorer) sit at
 * fixed positions between them, so the route renders each Keystatic section
 * by index instead of one whole PageBuilderDocument. If an edit changes the
 * section COUNT, the route falls back to legacy rather than misplacing
 * sections — keep this in sync with the mapping. (M13 batch 6, 2026-09-20 —
 * the single-shared-child wrappers `HeroSection`, `TextSection` (+ its
 * `MaxProductivity`/`ClarityAndControl` shims),
 * `PrecisionVolumetricAnalysisSection` and `ServicesSection` were removed;
 * both branches below render the shared `Hero`, `IntroTextSection`,
 * `SplitMedia` and `CardGrid` directly.)
 */
const KEYSTATIC_SECTION_COUNT = 5;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "volumetric-surveys" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the five migrated
	// sections only when the slug is allowlisted via `KEYSTATIC_PAGES` and the
	// entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;

	const { t } = useTranslation(["civil/volumetric-surveys"]);
	const heroData = t("civil/volumetric-surveys:hero", { returnObjects: true }) as unknown as HeroContent;
	const maxProductivity = t("civil/volumetric-surveys:maxProductivityMinGuesswork", {
		returnObjects: true,
	}) as unknown as TextContent;
	const precision = t("civil/volumetric-surveys:precisionVolumetricAnalysis", {
		returnObjects: true,
	}) as unknown as PrecisionContent;
	const services = t("civil/volumetric-surveys:services", {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const serviceItems: CardItem[] = Array.isArray(services?.items) ? services.items : [];
	const servicesGrid =
		serviceItems.length === 0 ? null : (
			<CardGrid
				tag={services.tag}
				headline={services.headline}
				description={services.description}
				items={serviceItems}
				columns={3}
				tone="surface"
				headerAlign="left"
			/>
		);
	const clarityAndControl = t("civil/volumetric-surveys:clarityAndControl", {
		returnObjects: true,
	}) as unknown as TextContent;

	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
		const renderAt = (index: number) => {
			const section = sections[index];
			return renderSection(section.id, section.value, locale, section.key);
		};
		return (
			<div className="relative">
				<PageHead pageName="civil-volumetric-surveys" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					{renderAt(1)}
					{renderAt(2)}
					{servicesGrid}
					{renderAt(3)}
					<Deliverables ns="civil/volumetric-surveys" className="bg-surface" />
					{renderAt(4)}
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="civil-volumetric-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<IntroTextSection
					tag={maxProductivity?.tag}
					headline={maxProductivity?.headline}
					description={maxProductivity?.description}
				/>
				{precision?.headline ? (
					<SplitMedia
						data={{
							tag: precision.tag ?? null,
							headline: precision.headline,
							description: precision.description ?? null,
							image: precision.image ?? null,
						}}
						imagePosition="right"
					/>
				) : null}
				{servicesGrid}
				<IntroTextSection
					tone="surface"
					tag={clarityAndControl?.tag}
					headline={clarityAndControl?.headline}
					description={clarityAndControl?.description}
				/>
				<Deliverables ns="civil/volumetric-surveys" className="bg-surface" />
				<CtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "civil/volumetric-surveys"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("volumetric-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;