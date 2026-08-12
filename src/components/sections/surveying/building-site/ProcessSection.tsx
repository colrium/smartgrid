"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface ProcessStep {
	label: string;
	description: string;
}

interface ProcessContent {
	tag?: string | null;
	headline: string;
	image?: string | null;
	items: ProcessStep[];
}

export function ProcessSection() {
	const { t } = useTranslation(["building-site-surveys"]);
	const section = t("building-site-surveys:process", {
		returnObjects: true,
	}) as unknown as ProcessContent;
	const steps = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[26rem] h-[26rem] bg-brand-100/60 -top-20 right-0" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{steps.map((step, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.08}>
							<article className="group relative h-full overflow-hidden rounded-2xl hairline bg-paper card-shadow transition-all duration-500 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-brand-300 p-8">
								<span className="absolute -right-3 -top-6 font-light tracking-tighter text-[7rem] leading-none text-primary/[0.06] select-none pointer-events-none">
									{String(index + 1).padStart(2, "0")}
								</span>

								<div className="relative flex items-center gap-3">
									<span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-brand-50 text-primary text-sm font-semibold tabular-nums">
										{index + 1}
									</span>
									<span className="h-px flex-1 bg-ink/10" />
									<span className="mdi mdi-arrow-right text-xl text-on-surface/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
								</div>

								<h3 className="relative mt-6 text-lg sm:text-xl font-medium tracking-tight text-ink leading-snug">
									{step.label}
								</h3>
								<p className="relative mt-3 text-sm text-on-surface/60 leading-relaxed">
									{step.description}
								</p>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default ProcessSection;