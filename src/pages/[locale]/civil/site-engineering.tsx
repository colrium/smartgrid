import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import { Deliverables } from "@/components/sections/Deliverables";
import {
	HeroSection,
	OverviewSection,
	WhatWeDoSection,
	CtaSection,
	ExploreMoreSection,
} from "@/components/sections/civil/site-engineering";

type PageProps = {
	/** Keystatic page when the `site-engineering` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * Sections migrated to Keystatic in page order (see the `site-engineering`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): cta ctaBand only.
 * The bespoke hero (`<bold>` pseudo-markup) and `Split`-primitive overview
 * stay legacy; WhatWeDoSection is `indexed`; ExploreMoreSection uses
 * media-background cards; the deliverables explorer stays legacy. If an edit
 * changes the section COUNT, the route falls back to legacy rather than
 * misplacing sections — keep this in sync with the mapping.
 */
const KEYSTATIC_SECTION_COUNT = 1;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "site-engineering" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the CTA only when the
	// slug is allowlisted via `KEYSTATIC_PAGES` and the entry is published.
	// Otherwise the legacy locale-JSON implementation renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;

	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
		const renderAt = (index: number) => {
			const section = sections[index];
			return renderSection(section.id, section.value, locale, section.key);
		};
		return (
			<div className="relative">
				<PageHead pageName="civil-site-engineering" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					<HeroSection />
					<OverviewSection />
					<WhatWeDoSection />
					<Deliverables ns="civil/site-engineering" className="bg-surface" />
					{renderAt(0)}
					<ExploreMoreSection />
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="civil-site-engineering" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<OverviewSection />
				<WhatWeDoSection />
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