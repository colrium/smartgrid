"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface TechnicalLimitationsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	factors: string[];
	outputs: string[];
}

export function TechnicalLimitationsSection(): ReactElement {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	const section = t("surveying/bathymetric-surveys:technicalLimitations", {
		returnObjects: true,
	}) as unknown as TechnicalLimitationsContent;
	const factors = Array.isArray(section.factors) ? section.factors : [];
	const outputs = Array.isArray(section.outputs) ? section.outputs : [];

	if (factors.length === 0 && outputs.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Factors affecting accuracy */}
					<FadeUp className="h-full">
						<article className="relative h-full flex flex-col rounded-[20px] bg-paper hairline card-shadow p-7 sm:p-8">
							<h3 className="text-lg sm:text-xl font-semibold tracking-tight text-ink leading-snug">
								Factors Affecting Accuracy
							</h3>
							<ul className="mt-6 space-y-4">
								{factors.map((factor, index) => (
									<li key={index} className="flex items-start gap-3">
										<span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
											<span className="mdi mdi-checkbox-marked-circle-outline text-sm" />
										</span>
										<span className="text-base text-on-surface/70 leading-relaxed">
											{factor}
										</span>
									</li>
								))}
							</ul>
						</article>
					</FadeUp>

					{/* Typical outputs */}
					<FadeUp delay={0.1} className="h-full">
						<article className="relative h-full flex flex-col rounded-[20px] bg-paper hairline card-shadow p-7 sm:p-8">
							<h3 className="text-lg sm:text-xl font-semibold tracking-tight text-ink leading-snug">
								Typical Outputs
							</h3>
							<div className="mt-6 space-y-5">
								{outputs.map((output, index) => (
									<div
										key={index}
										className="group relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-xl bg-ink-soft/30 hairline transition-all duration-300 hover:bg-ink-soft/50 hover:border-primary/30"
									>
										<div className="flex items-center gap-3">
											<span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
												<span className="mdi mdi-crosshairs-gps text-lg" />
											</span>
											<p className="text-base text-ink">{output}</p>
										</div>
										<span className="mdi mdi-arrow-right text-primary group-hover:translate-x-1 transition-transform" />
									</div>
								))}
							</div>
						</article>
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default TechnicalLimitationsSection;