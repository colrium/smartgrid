"use client";

import Link from "next/link";
import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob, ParallaxDecor } from "@/components/sections/shared/decor";

interface IntroCta {
	label: string;
	href: string;
}

interface IntroContent {
	tag?: string | null;
	headline: string;
	description: string;
	ctaPrimary?: IntroCta | null;
}

export function IntroSection(): ReactElement {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	const section = t("surveying/aerial-surveys:section1", {
		returnObjects: true,
	}) as unknown as IntroContent;

	// "Reliable. Scalable. Fast. Effective." → ["Reliable","Scalable","Fast","Effective"]
	const headlineLines = (section.headline ?? "")
		.split(".")
		.map((part) => part.trim())
		.filter(Boolean);

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob
				className="w-[26rem] h-[26rem] bg-primary-100/70 -top-24 -left-24"
				opacity={0.5}
			/>
			<ParallaxDecor speed={-0.06} className="absolute bottom-16 -right-24 z-0">
				<Blob className="w-72 h-72 bg-primary-50" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Left - editorial manifesto */}
					<FadeUp className="lg:col-span-6">
						<SectionTag>{section.tag}</SectionTag>

						<h2 className="mt-6 font-light tracking-tight leading-[1.02] text-4xl sm:text-5xl lg:text-[3.4rem] text-ink">
							{headlineLines.length > 1
								? headlineLines.map((line, index) => (
										<span key={index} className="block">
											{line}
											<span className="text-primary">.</span>
										</span>
									))
								: section.headline}
						</h2>

						
					</FadeUp>

					{/* Right - briefing card */}
					<FadeUp delay={0.12} className="lg:col-span-6">
						<div className="relative overflow-hidden rounded-c bg-surface hairline card-shadow p-8 sm:p-10">
							
							<span
								aria-hidden
								className="absolute -top-6 -right-4 mdi mdi-quadcopter text-[7rem] text-primary/[0.05] pointer-events-none select-none"
							/>

							<div className="relative flex items-center justify-between gap-4">
								<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface/30">
									<span className="h-1.5 w-1.5 rounded-full bg-primary" />
								</span>
								<span className="mdi mdi-quadcopter text-xl text-primary/50" />
							</div>

							<p className="mt-6 text-base sm:text-lg leading-relaxed text-on-surface/65 whitespace-pre-line">
								{section.description}
							</p>

							<div className="mt-8 h-px w-full bg-ink/10" />

							{section.ctaPrimary?.href && (
								<div className="mt-8">
									<Link
										href={section.ctaPrimary.href}
										className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary text-surface px-8 font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.45)]"
									>
										<span className="h-1.5 w-1.5 rounded-full bg-surface transition-transform duration-300 group-hover:scale-125" />
										<span className="flex-1">{section.ctaPrimary.label}</span>
										<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
									</Link>
								</div>
							)}
						</div>
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default IntroSection;
