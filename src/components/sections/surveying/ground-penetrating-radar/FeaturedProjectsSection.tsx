"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface FeaturedProjectItem {
	title: string;
	used: string;
	objective: string;
	result: string;
}

interface FeaturedProjectsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: FeaturedProjectItem[];
}

export function FeaturedProjectsSection() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const section = t("ground-penetrating-radar:featuredProjects", {
		returnObjects: true,
	}) as unknown as FeaturedProjectsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-20 sm:py-24 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={index * 0.08}>
							<article className="group relative flex flex-col h-full rounded-[20px] bg-surface hairline card-shadow p-7 sm:p-8 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<div className="flex items-start justify-between gap-4 mb-4">
									<span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className="mdi mdi-flag-checkered text-2xl" />
									</span>
									<span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
										Project {index + 1}
									</span>
								</div>

								<h3 className="text-xl font-semibold tracking-tight text-ink leading-snug mb-4">
									{item.title}
								</h3>

								<div className="flex flex-col gap-3 text-sm text-on-surface/65 leading-relaxed">
									<div className="flex items-start gap-3">
										<span className="text-xs font-semibold uppercase tracking-widest text-primary flex-shrink-0">Used</span>
										<p className="flex-1 leading-relaxed">{item.used}</p>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-xs font-semibold uppercase tracking-widest text-primary flex-shrink-0">Objective</span>
										<p className="flex-1 leading-relaxed">{item.objective}</p>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-xs font-semibold uppercase tracking-widest text-primary flex-shrink-0">Result</span>
										<p className="flex-1 leading-relaxed">{item.result}</p>
									</div>
								</div>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default FeaturedProjectsSection;