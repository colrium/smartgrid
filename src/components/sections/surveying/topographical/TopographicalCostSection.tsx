"use client";

import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight, FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface CostContent {
	tag?: string | null;
	headline: string;
	description?: string;
	factorsTitle?: string;
	factors?: string[] | null;
	priceRangeTitle?: string;
	priceRange?: string;
	priceRangeNote?: string;
	influencesTitle?: string;
	influences?: string[] | null;
}

function BulletList({ items }: { items: string[] }) {
	return (
		<ul className="grid grid-cols-1 gap-3">
			{items.map((item, index) => (
				<li key={index} className="flex items-start gap-3 text-sm text-on-surface/70 leading-relaxed">
					<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
						<span className="mdi mdi-check text-xs" />
					</span>
					{item}
				</li>
			))}
		</ul>
	);
}

export function TopographicalCostSection() {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	const section = t("surveying/topographical-surveys:cost", {
		returnObjects: true,
	}) as unknown as CostContent;
	const factors = Array.isArray(section?.factors) ? section.factors : [];
	const influences = Array.isArray(section?.influences) ? section.influences : [];

	return (
		<section className="py-20 sm:py-24 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
					{factors.length > 0 && (
						<FadeLeft className="h-full">
							<article className="h-full flex flex-col gap-6 rounded-c bg-surface hairline card-shadow p-8">
								<h3 className="text-lg font-semibold tracking-tight text-ink">
									{section.factorsTitle}
								</h3>
								<BulletList items={factors} />
							</article>
						</FadeLeft>
					)}

					{influences.length > 0 && (
						<FadeRight delay={0.08} className="h-full">
							<article className="h-full flex flex-col gap-6 rounded-c bg-surface hairline card-shadow p-8">
								<h3 className="text-lg font-semibold tracking-tight text-ink">
									{section.influencesTitle}
								</h3>
								<BulletList items={influences} />
							</article>
						</FadeRight>
					)}
				</div>

				{section.priceRange && (
					<FadeUp delay={0.1}>
						<div className="mt-8 relative rounded-c bg-surface hairline card-shadow overflow-hidden px-8 py-12 sm:px-12 text-center">
							<span className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-100/60 blur-[90px] pointer-events-none" />
							<span className="absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-primary-200/40 blur-[90px] pointer-events-none" />

							<div className="relative flex flex-col items-center gap-4">
								{section.priceRangeTitle && (
									<p className="text-[11px] uppercase tracking-widest text-primary">
										{section.priceRangeTitle}
									</p>
								)}
								<p className="font-light tracking-tight text-3xl sm:text-5xl text-ink">
									{section.priceRange}
								</p>
								{section.priceRangeNote && (
									<p className="text-sm text-on-surface/60 leading-relaxed max-w-2xl">
										{section.priceRangeNote}
									</p>
								)}
							</div>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default TopographicalCostSection;
