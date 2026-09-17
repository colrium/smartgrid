import type { ComponentType, ReactElement } from "react";
import { IntroTextSection } from "@/components/sections/shared/IntroTextSection";
import { CtaBand } from "@/components/sections/shared/CtaBand";
import { Stats } from "@/components/sections/shared/Stats";
import { Hero } from "@/components/sections/shared/Hero";
import { CardGrid } from "@/components/sections/shared/CardGrid";
import { SplitMedia } from "@/components/sections/shared/SplitMedia";
import LegalPageSection from "@/components/sections/LegalPageSection";
import { Faq } from "@/components/sections/shared/Faq";
import { Process } from "@/components/sections/shared/Process";
import { Gallery } from "@/components/sections/shared/Gallery";
import { Pricing } from "@/components/sections/shared/Pricing";
import { Trustees } from "@/components/sections/shared/Trustees";
import { Certifications } from "@/components/sections/shared/Certifications";
import { KeyFacts } from "@/components/sections/shared/KeyFacts";
import { Metrics } from "@/components/sections/shared/Metrics";
import { WhyChooseUs } from "@/components/sections/shared/WhyChooseUs";
import { About } from "@/components/sections/shared/About";
import { SurveyingInstruments } from "@/components/sections/shared/SurveyingInstruments";
import { CoreExpertise } from "@/components/sections/shared/CoreExpertise";
import { PlanningInfographic } from "@/components/sections/shared/PlanningInfographic";
import { CoverageArea } from "@/components/sections/shared/CoverageArea";
import { SurveyCost } from "@/components/sections/shared/SurveyCost";
import type { Lang } from "../types";
import { resolveLocaleValue } from "./localize";
import { getSectionDefinition, type SectionId } from "./sectionRegistry";

/**
 * Renderer mapping for registered page-builder sections (M2).
 *
 * Keys are the single source of truth from `sectionRegistry.ts` — adding a
 * registry entry without a renderer here is a type error, and the reverse
 * coverage is enforced by `yarn check:keystatic`. Component implementations
 * live only behind this module: it is imported by pages, never by
 * `keystatic.config.ts`, so the config keeps loading in plain Node.
 *
 * Data flow per section: stored `value` → `resolveLocaleValue` (locale +
 * English fallback) → entry `normalize` (editor-optional shapes) → props.
 * Unknown ids throw `UnknownSectionError`; the M3 pipeline turns that into
 * a safe development diagnostic instead of a blank page.
 */

export const sectionRenderers = {
	introText: IntroTextSection,
	ctaBand: CtaBand,
	stats: Stats,
	hero: Hero,
	cardGrid: CardGrid,
	splitMedia: SplitMedia,
	legal: LegalPageSection,
	faq: Faq,
	process: Process,
	gallery: Gallery,
	pricing: Pricing,
	trustees: Trustees,
	certifications: Certifications,
	keyFacts: KeyFacts,
	metrics: Metrics,
	whyChooseUs: WhyChooseUs,
	about: About,
	surveyingInstruments: SurveyingInstruments,
	coreExpertise: CoreExpertise,
	planningInfographic: PlanningInfographic,
	coverageArea: CoverageArea,
	surveyCost: SurveyCost,
} satisfies Record<SectionId, ComponentType<any>>;

export function renderSection(
	id: string,
	value: unknown,
	lang: Lang,
	key: string | number
): ReactElement {
	const definition = getSectionDefinition(id);
	const resolved = (resolveLocaleValue(value, lang) ?? {}) as Record<string, any>;
	const props: any = definition.normalize(resolved);
	const Component = sectionRenderers[definition.id];
	return <Component key={key} {...props} />;
}
