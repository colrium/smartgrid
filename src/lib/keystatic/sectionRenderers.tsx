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
import LeadGenBar from "@/components/sections/shared/LeadGenBar";
import { ServicesSection } from "@/components/sections/shared/ServicesSection";
import HeroSection from "@/components/sections/home/HeroSection";
import { DronesSection } from "@/components/sections/home/DronesSection";
import { ContactHeroSection } from "@/components/sections/contact/ContactHeroSection";
import { OfficesSection } from "@/components/sections/contact/OfficesSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import { CurrentOpeningsSection } from "@/components/sections/careers/CurrentOpeningsSection";
import { ApplicationProcessSection } from "@/components/sections/careers/ApplicationProcessSection";
import { EqualOpportunityStatementSection } from "@/components/sections/careers/EqualOpportunityStatementSection";
import { CompanyProfileViewerSection } from "@/components/sections/company-profile/CompanyProfileViewerSection";
import { AerialSurveyingSection } from "@/components/sections/about/AerialSurveyingSection";
import { LandSurveyingSection } from "@/components/sections/about/LandSurveyingSection";
import { ImpactAcrossAfricaSection } from "@/components/sections/about/ImpactAcrossAfricaSection";
import { SurveyingServicesSection } from "@/components/sections/surveying/landing/SurveyingServicesSection";
import { SurveyingProcessSection } from "@/components/sections/surveying/landing/SurveyingProcessSection";
import { CivilHeroSection } from "@/components/sections/civil/landing/CivilHeroSection";
import { CivilProcessSection } from "@/components/sections/civil/landing/CivilProcessSection";
import { Deliverables } from "@/components/sections/Deliverables";
import { WhenYouNeedSection } from "@/components/sections/surveying/topographical/WhenYouNeedSection";
import { WhatWeOfferSection } from "@/components/sections/surveying/topographical/WhatWeOfferSection";
import { DetailedSurveysSection } from "@/components/sections/surveying/topographical/DetailedSurveysSection";
import { SampleMapSection } from "@/components/sections/surveying/topographical/SampleMapSection";
import { InstrumentsSection } from "@/components/sections/surveying/topographical/InstrumentsSection";
import { WhyConductSection } from "@/components/sections/surveying/topographical/WhyConductSection";
import { WhatIsSection } from "@/components/sections/surveying/sectional-properties/WhatIsSection";
import { ServicesDetailSection } from "@/components/sections/surveying/sectional-properties/ServicesDetailSection";
import { ProcessSection as SectionalProcessSection } from "@/components/sections/surveying/sectional-properties/ProcessSection";
import { TimelineSection } from "@/components/sections/surveying/sectional-properties/TimelineSection";
import { WhoNeedsSection } from "@/components/sections/surveying/sectional-properties/WhoNeedsSection";
import { BathymetricWorkflowSection } from "@/components/sections/surveying/bathymetric-surveys/BathymetricWorkflowSection";
import { EquipmentTechnologySection } from "@/components/sections/surveying/bathymetric-surveys/EquipmentTechnologySection";
import { TechnicalLimitationsSection } from "@/components/sections/surveying/bathymetric-surveys/TechnicalLimitationsSection";
import { DamsLakesSection } from "@/components/sections/surveying/bathymetric-surveys/DamsLakesSection";
import { ApplicationsSection as BathyApplicationsSection } from "@/components/sections/surveying/bathymetric-surveys/ApplicationsSection";
import { BathymetricBeforeAfterSection } from "@/components/sections/surveying/bathymetric-surveys/BathymetricBeforeAfterSection";
import { FinalCtaSection as BathyFinalCtaSection } from "@/components/sections/surveying/bathymetric-surveys/FinalCtaSection";
import { WhatIsResourceMappingSection } from "@/components/sections/surveying/resource-mapping/WhatIsResourceMappingSection";
import { TypesOfResourceMappingSection } from "@/components/sections/surveying/resource-mapping/TypesOfResourceMappingSection";
import { ResourceMappingWorkflowSection } from "@/components/sections/surveying/resource-mapping/ResourceMappingWorkflowSection";
import { WhoUsesResourceMappingSection } from "@/components/sections/surveying/resource-mapping/WhoUsesResourceMappingSection";
import { ResourceMappingTechStackSection } from "@/components/sections/surveying/resource-mapping/ResourceMappingTechStackSection";
import { DataAccuracySection } from "@/components/sections/surveying/resource-mapping/DataAccuracySection";
import { FinalCtaSection as RmFinalCtaSection } from "@/components/sections/surveying/resource-mapping/FinalCtaSection";
import { SectorSection } from "@/components/sections/surveying/resource-mapping/SectorSection";
import { BuildingSiteHeroSection } from "@/components/sections/surveying/building-site/BuildingSiteHeroSection";
import { BuildSmarterSection } from "@/components/sections/surveying/building-site/BuildSmarterSection";
import { SiteEngineeringSection } from "@/components/sections/surveying/building-site/SiteEngineeringSection";
import { IntroSection as AerialIntroSection } from "@/components/sections/surveying/aerial/IntroSection";
import { WhyDroneSurveysSection } from "@/components/sections/surveying/aerial/WhyDroneSurveysSection";
import { AerialServicesSection } from "@/components/sections/surveying/aerial/AerialServicesSection";
import { AerialWorkflowSection } from "@/components/sections/surveying/aerial/AerialWorkflowSection";
import { AerialSurveyingSection as AerialSurveyingGridSection } from "@/components/sections/surveying/aerial/AerialSurveyingSection";
import { AerialIndustriesSection } from "@/components/sections/surveying/aerial/AerialIndustriesSection";
import { IndustryCtaSection } from "@/components/sections/surveying/aerial/IndustryCtaSection";
import { TechStackSection as AerialTechStackSection } from "@/components/sections/surveying/aerial/TechStackSection";
import { CapabilityCtaSection } from "@/components/sections/surveying/aerial/CapabilityCtaSection";
import { AerialFinalCtaSection } from "@/components/sections/surveying/aerial/AerialFinalCtaSection";
import { ProjectsSection as AerialProjectsSection } from "@/components/sections/surveying/aerial/ProjectsSection";
import { AdditionalServicesSection as AerialAdditionalServicesSection } from "@/components/sections/surveying/aerial/AdditionalServicesSection";
import { PostHeroCtaSection } from "@/components/sections/surveying/cadastral/PostHeroCtaSection";
import { WhenYouNeedSection as CadastralWhenYouNeedSection } from "@/components/sections/surveying/cadastral/WhenYouNeedSection";
import { ProcessFlowSection } from "@/components/sections/surveying/cadastral/ProcessFlowSection";
import { ProcessCtaSection } from "@/components/sections/surveying/cadastral/ProcessCtaSection";
import { CostSection as CadastralCostSection } from "@/components/sections/surveying/cadastral/CostSection";
import { TimelineSection as CadastralTimelineSection } from "@/components/sections/surveying/cadastral/TimelineSection";
import { ComplianceSection } from "@/components/sections/surveying/cadastral/ComplianceSection";
import { CaseStudySection } from "@/components/sections/surveying/cadastral/CaseStudySection";
import { FinalCtaSection as CadastralFinalCtaSection } from "@/components/sections/surveying/cadastral/FinalCtaSection";
import { ProcessSection as BsProcessSection } from "@/components/sections/surveying/building-site/ProcessSection";
import { AccuracyMattersSection } from "@/components/sections/surveying/building-site/AccuracyMattersSection";
import { TechnologyStackSection } from "@/components/sections/surveying/building-site/TechnologyStackSection";
import { ConsultationSection } from "@/components/sections/surveying/building-site/ConsultationSection";
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
	leadGenBar: LeadGenBar,
	services: ServicesSection,
	homeHero: HeroSection,
	homeDrones: DronesSection,
	contactHero: ContactHeroSection,
	contactOffices: OfficesSection,
	contactForm: ContactFormSection,
	careersOpenings: CurrentOpeningsSection,
	careersProcess: ApplicationProcessSection,
	careersStatement: EqualOpportunityStatementSection,
	companyProfileViewer: CompanyProfileViewerSection,
	aboutAerialSurveying: AerialSurveyingSection,
	aboutLandSurveying: LandSurveyingSection,
	aboutImpact: ImpactAcrossAfricaSection,
	surveyingServices: SurveyingServicesSection,
	surveyingProcess: SurveyingProcessSection,
	civilHero: CivilHeroSection,
	civilProcess: CivilProcessSection,
	deliverables: Deliverables,
	topoWhenYouNeed: WhenYouNeedSection,
	topoWhatWeOffer: WhatWeOfferSection,
	topoDetailedSurveys: DetailedSurveysSection,
	topoSampleMap: SampleMapSection,
	topoInstruments: InstrumentsSection,
	topoWhyConduct: WhyConductSection,
	sectionalWhatIs: WhatIsSection,
	sectionalServicesDetail: ServicesDetailSection,
	sectionalWorkflow: SectionalProcessSection,
	sectionalTimeline: TimelineSection,
	sectionalWhoNeeds: WhoNeedsSection,
	bathyWorkflow: BathymetricWorkflowSection,
	bathyEquipment: EquipmentTechnologySection,
	bathyLimitations: TechnicalLimitationsSection,
	bathyDamsLakes: DamsLakesSection,
	bathyApplications: BathyApplicationsSection,
	bathyBeforeAfter: BathymetricBeforeAfterSection,
	bathyFinalCta: BathyFinalCtaSection,
	rmWhatIs: WhatIsResourceMappingSection,
	rmTypes: TypesOfResourceMappingSection,
	rmSector: SectorSection,
	rmWorkflow: ResourceMappingWorkflowSection,
	rmWhoUses: WhoUsesResourceMappingSection,
	rmTechStack: ResourceMappingTechStackSection,
	rmDataAccuracy: DataAccuracySection,
	rmFinalCta: RmFinalCtaSection,
	bsHero: BuildingSiteHeroSection,
	bsSection2: BuildSmarterSection,
	bsSiteEngineering: SiteEngineeringSection,
	bsProcess: BsProcessSection,
	bsAccuracyMatters: AccuracyMattersSection,
	bsTechnology: TechnologyStackSection,
	bsConsultation: ConsultationSection,
	aerialIntro: AerialIntroSection,
	aerialWhyDrones: WhyDroneSurveysSection,
	aerialServices: AerialServicesSection,
	aerialWorkflow: AerialWorkflowSection,
	aerialSurveyingGrid: AerialSurveyingGridSection,
	aerialIndustries: AerialIndustriesSection,
	aerialIndustryCta: IndustryCtaSection,
	aerialTechStack: AerialTechStackSection,
	aerialCapabilityCta: CapabilityCtaSection,
	aerialFinalCta: AerialFinalCtaSection,
	aerialProjects: AerialProjectsSection,
	aerialAdditionalServices: AerialAdditionalServicesSection,
	cadastralPostHeroCta: PostHeroCtaSection,
	cadastralWhenYouNeed: CadastralWhenYouNeedSection,
	cadastralProcess: ProcessFlowSection,
	cadastralProcessCta: ProcessCtaSection,
	cadastralCost: CadastralCostSection,
	cadastralTimeline: CadastralTimelineSection,
	cadastralCompliance: ComplianceSection,
	cadastralCaseStudy: CaseStudySection,
	cadastralFinalCta: CadastralFinalCtaSection,
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
