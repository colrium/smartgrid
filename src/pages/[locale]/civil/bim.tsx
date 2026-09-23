import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
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
}

/**
 * All four legacy sections are Keystatic-owned in page order (see the
 * `bim` mapping in `scripts/migrate-locale-to-keystatic.mjs`): hero
 * (secondary-only pill), bimServices (the indexed capabilities grid),
 * deliverables, cta ctaBand (M11 batch 16, 2026-09-20 — entry order IS
 * page order, so editors can add, remove, and reorder sections freely;
 * the M3 resolver taxonomy remains the only fallback). The hero/cta
 * entries keep their shared branches; `bimServices` is the batch-16
 * unique (indexed numbering + left header sit outside the shared
 * `cardGrid` contract) and `deliverables` is the shared explorer with
 * the surface tone. M13 batch 6 retired the `BimServicesSection`
 * wrapper; the legacy branch renders the shared `CardGrid` directly
 * with the wrapper's literals.
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["civil/bim"]);
	// Migration source switch (M3/M7, completed M11 batch 16): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="civil-bim" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

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
