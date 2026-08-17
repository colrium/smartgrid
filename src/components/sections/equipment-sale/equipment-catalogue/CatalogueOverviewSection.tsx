"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";

interface CatalogueOverviewContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

export function CatalogueOverviewSection() {
	const { t } = useTranslation(["equipment-catalogue"]);
	const section = t("equipment-catalogue:catalogueOverview", {
		returnObjects: true,
	}) as unknown as CatalogueOverviewContent;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader
						tag={section.tag ?? undefined}
						headline={section.headline}
						description={section.description}
						align="center"
					/>
				</FadeUp>
			</div>
		</section>
	);
}

export default CatalogueOverviewSection;