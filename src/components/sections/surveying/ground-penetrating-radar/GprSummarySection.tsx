"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { ReactElement } from "react";

interface SummaryContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	chips?: string[] | null;
}

export function GprSummarySection(): ReactElement {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const section = t("surveying/ground-penetrating-radar:summary", {
		returnObjects: true,
	}) as unknown as SummaryContent;
	const chips = Array.isArray(section?.chips) ? section.chips : [];

	if (!section?.headline) return <></>;

	return (
		<section id="summary" className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden">
			<div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="relative overflow-hidden rounded-[20px] pale-panel hairline card-shadow px-8 py-12 sm:px-12 sm:py-14 text-center">
						<SectionHeader
							tag={section.tag || undefined}
							headline={section.headline}
							description={section.description || undefined}
							align="center"
						/>

						{chips.length > 0 && (
							<div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
								{chips.map((chip, index) => (
									<span
										key={index}
										className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-medium text-ink/70 hairline card-shadow"
									>
										<span className="mdi mdi-check-circle-outline text-sm text-primary" />
										{chip}
									</span>
								))}
							</div>
						)}
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default GprSummarySection;
