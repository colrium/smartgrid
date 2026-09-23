import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { useTranslation } from "@/hooks";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { SplitMedia, type SplitMediaContent } from "@/components/sections/shared/SplitMedia";
import { type CardItem } from "@/components/sections/shared/CardGrid";
import { Process } from "@/components/sections/shared/Process";

type PageProps = {
	/** Keystatic page when the `agricultural-ndvi-mapping` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface ProcessContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

interface WhyUseContent extends SplitMediaContent {
	items?: CardItem[] | null;
}

/**
 * M11 batch 19 (2026-09-20): all three sections (hero, why-use-drones
 * split + card row, process grid) are Keystatic-owned in page order, so
 * the whole page renders from one `PageBuilderDocument` when the slug is
 * allowlisted via `KEYSTATIC_PAGES` and the entry is published. Otherwise
 * the legacy locale-JSON implementation renders unchanged.
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	if (keystaticPage) {
		return <PageBuilderDocument page={keystaticPage} />;
	}

	return (
		<div className="relative">
			<PageHead pageName="agricultural-ndvi-mapping" />
			<div className="flex flex-col min-h-screen">
				<AgriculturalNdviLegacy />
			</div>
		</div>
	);
};

function AgriculturalNdviLegacy() {
	const NS = "aerial-drones/agricultural-ndvi-mapping";
	const { t } = useTranslation([NS]);
	const heroData = t(`${NS}:hero`, { returnObjects: true }) as unknown as HeroContent;
	const whyUseDrones = t(`${NS}:whyUseDronesInAgriculture`, {
		returnObjects: true,
	}) as unknown as WhyUseContent;
	const whyUseItems = Array.isArray(whyUseDrones?.items) ? whyUseDrones.items : [];
	const whyUseGrid =
		!whyUseDrones?.headline ? null : (
			<SplitMedia
				data={whyUseDrones}
				tone="surface"
				columns={4}
				items={whyUseItems}
				align="left"
				card={{ density: "comfortable", iconShape: "xl", iconSize: "sm" }}
			/>
		);
	const process = t(`${NS}:process`, {
		returnObjects: true,
	}) as unknown as ProcessContent;
	const processItems = Array.isArray(process?.items) ? process.items : [];
	const processGrid =
		processItems.length === 0 ? null : (
			<Process
				tag={process.tag}
				headline={process.headline}
				description={process.description}
				items={processItems}
				layout="grid"
				columns={3}
			/>
		);

	return (
		<>
			<Hero data={heroData} />
			{whyUseGrid}
			{processGrid}
		</>
	);
}
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "aerial-drones/agricultural-ndvi-mapping"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("agricultural-ndvi-mapping", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
