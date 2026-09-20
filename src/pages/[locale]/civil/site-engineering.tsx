import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Deliverables } from "@/components/sections/Deliverables";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";
import {
	HeroSection,
	OverviewSection,
	CtaSection,
	ExploreMoreSection,
} from "@/components/sections/civil/site-engineering";

type PageProps = {
	/** Keystatic page when the `site-engineering` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface WhatWeDoContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

/**
 * All six legacy sections are Keystatic-owned in page order (see the
 * `site-engineering` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * seHero (bespoke image-floor hero with `<bold>` parsing), seOverview
 * (`Split`-primitive framed card), seWhatWeDo (the indexed grid),
 * deliverables (surface), cta ctaBand, seExploreMore (media-background
 * cards) — M11 batch 16, 2026-09-20. Entry order IS page order, so editors
 * can add, remove, and reorder sections freely; the M3 resolver taxonomy
 * remains the only fallback. The bespoke hero (`<bold>` pseudo-markup
 * parsed from data), the `Split`-primitive overview and the
 * media-background explore grid have no shared-contract home, so they stay
 * page-scoped uniques; `seWhatWeDo` is the batch-16 unique (indexed
 * numbering + left header sit outside the shared `cardGrid` contract).
 * M13 batch 6 retired the `WhatWeDoSection` wrapper; the legacy branch
 * renders the shared `CardGrid` directly with the wrapper's literals.
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["civil/site-engineering"]);
	// Migration source switch (M3/M7, completed M11 batch 16): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="civil-site-engineering" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const whatWeDo = t("civil/site-engineering:WhatWeDo", {
		returnObjects: true,
	}) as unknown as WhatWeDoContent;
	const whatWeDoItems: CardItem[] = Array.isArray(whatWeDo?.items) ? whatWeDo.items : [];
	const whatWeDoGrid =
		whatWeDoItems.length === 0 ? null : (
			<CardGrid
				tag={whatWeDo.tag}
				headline={whatWeDo.headline}
				description={whatWeDo.description}
				items={whatWeDoItems}
				columns={3}
				tone="surface"
				headerAlign="left"
				indexed
			/>
		);

	return (
		<div className="relative">
			<PageHead pageName="civil-site-engineering" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<OverviewSection />
				{whatWeDoGrid}
				<Deliverables ns="civil/site-engineering" className="bg-surface" />
				<CtaSection />
				<ExploreMoreSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "civil/site-engineering"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("site-engineering", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
