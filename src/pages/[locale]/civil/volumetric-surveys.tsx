import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
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
}

/**
 * All seven legacy sections are Keystatic-owned in page order (see the
 * `volumetric-surveys` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * hero, maxProductivityMinGuesswork introText, precisionVolumetricAnalysis
 * splitMedia, vsServices (the surface + left-header grid),
 * clarityAndControl introText, deliverables (surface), cta ctaBand — M11
 * batch 16, 2026-09-20. Entry order IS page order, so editors can add,
 * remove, and reorder sections freely; the M3 resolver taxonomy remains the
 * only fallback. The hero/introText/splitMedia/cta entries keep their
 * shared branches; `vsServices` is the batch-16 unique (the left header on
 * a surface grid sits outside the shared `cardGrid` contract — a plain
 * cardGrid would centre it). M13 batch 6 retired the `ServicesSection`
 * wrapper; the legacy branch renders the shared `CardGrid` directly with
 * the wrapper's literals, and the shaping `CtaSection` stays per the M13
 * rule (conditional link shaping).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["civil/volumetric-surveys"]);
	// Migration source switch (M3/M7, completed M11 batch 16): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="civil-volumetric-surveys" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

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
