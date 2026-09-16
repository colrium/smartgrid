import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import { Deliverables } from "@/components/sections/Deliverables";
import {
	HeroSection,
	OurServicesSection,
	OurInstrumentsSection,
	FaqSection,
} from "@/components/sections/civil/site-setting-out";

type PageProps = {
	/** Keystatic page when the `site-setting-out` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * Sections migrated to Keystatic in page order (see the `site-setting-out`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): hero (dual pills),
 * faq (icon/title/description items). Tails stay legacy: OurServicesSection
 * (`indexed`), OurInstrumentsSection (`mediaBadged`), bespoke Deliverables
 * explorer. If an edit changes the section COUNT, the route falls back to
 * legacy rather than misplacing sections — keep this in sync with the mapping.
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
					<OurServicesSection />
					<OurInstrumentsSection />
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
				<HeroSection />
				<OurServicesSection />
				<OurInstrumentsSection />
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