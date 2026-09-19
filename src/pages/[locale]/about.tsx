import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
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
 * All ten legacy sections are Keystatic-owned in page order (see the `about`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): hero, ourStory,
 * aboutAerialSurveying, servicesByImages, dronePhotographyimageSlider,
 * aboutLandSurveying, landSurveyingImages, aboutImpact, whyChooseSmartGrid,
 * projectsCompletedImagesMasonry (M11 batch 4; converted to
 * `PageBuilderDocument` in M12 batch 10, 2026-09-19 — entry order IS page
 * order, so editors can add, remove, and reorder sections freely; the M3
 * resolver taxonomy remains the only fallback).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 4, flexible since
	// M12 batch 10): Keystatic owns the whole page when the slug is
	// allowlisted via `KEYSTATIC_PAGES` and the entry is published.
	// Otherwise the legacy locale-JSON implementation renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="about" />
				<PageBuilderDocument page={keystaticPage} />
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
