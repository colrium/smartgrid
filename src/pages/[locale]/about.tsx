import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import {
	HeroSection,
	OurStorySection,
	AerialSurveyingSection,
	ServicesByImagesSection,
	DronePhotographyImageSliderSection,
	LandSurveyingSection,
	LandSurveyingImagesSection,
	ImpactAcrossAfricaSection,
	WhyChooseSmartGridSection,
	ProjectsCompletedImagesMasonrySection,
} from "@/components/sections/about";

type PageProps = {
	/** Keystatic page when the `about` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * Sections migrated to Keystatic in page order (see the `about` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, ourStory, servicesByImages,
 * dronePhotographyimageSlider, landSurveyingImages, whyChooseSmartGrid,
 * projectsCompletedImagesMasonry. Legacy tails (aerialSurveying, landSurveying,
 * impactAcrossAfrica) sit at fixed positions between them, so the route renders
 * each Keystatic section by index instead of one whole PageBuilderDocument.
 * Stored order is respected within the Keystatic slots; if an edit changes the
 * section COUNT (add/remove), the route falls back to legacy rather than
 * silently dropping or misplacing sections — keep this in sync with the mapping.
 */
const KEYSTATIC_SECTION_COUNT = 7;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "about" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the seven migrated
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
				<PageHead pageName="about" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					{renderAt(1)}
					<AerialSurveyingSection />
					{renderAt(2)}
					{renderAt(3)}
					<LandSurveyingSection />
					{renderAt(4)}
					<ImpactAcrossAfricaSection />
					{renderAt(5)}
					{renderAt(6)}
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="about" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<OurStorySection />
				<AerialSurveyingSection />
				<ServicesByImagesSection />
				<DronePhotographyImageSliderSection />
				<LandSurveyingSection />
				<LandSurveyingImagesSection />
				<ImpactAcrossAfricaSection />
				<WhyChooseSmartGridSection />
				<ProjectsCompletedImagesMasonrySection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "about"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("about", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
