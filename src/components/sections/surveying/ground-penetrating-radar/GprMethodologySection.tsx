"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/shared/decor";

interface MethodItem {
	title: string;
	points?: string[] | null;
}

interface MethodologyContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items: MethodItem[];
}

export interface GprMethodologyData {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items: MethodItem[];
}

const METHOD_ICONS = ["clipboard-text-search-outline", "radar", "chart-timeline-variant"];

export function GprMethodologySection({ data, id }: { data?: GprMethodologyData | null; id?: string } = {}) {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	// Keystatic-owned content when `data` is provided (M11 `gprMethodology`
	// unique section); legacy locale strings otherwise. Positional method
	// icons + hardcoded `Step N` labels stay in the renderer.
	const section = (data ??
		(t("surveying/ground-penetrating-radar:methodology", {
			returnObjects: true,
		}) as unknown as MethodologyContent)) as MethodologyContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section id={id ?? "methodology"} className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden bg-surface">
			<Blob className="w-[26rem] h-[26rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
					<div className="lg:col-span-4">
						<FadeUp>
							<SectionHeader
								tag={section.tag || undefined}
								headline={section.headline}
								description={section.description || undefined}
							/>
						</FadeUp>
					</div>

					<div className="lg:col-span-8">
						<ol className="relative space-y-6">
							<span
								aria-hidden
								className="absolute left-[23px] top-4 bottom-4 w-px border-l-2 border-dashed border-primary/25"
							/>

							{items.map((item, index) => {
								const points = Array.isArray(item.points) ? item.points : [];

								return (
									<li key={index} className="relative flex items-start gap-5 sm:gap-6">
										<span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-surface card-shadow ring-4 ring-surface">
											<span className={`mdi mdi-${METHOD_ICONS[index % METHOD_ICONS.length]} text-xl`} />
										</span>

										<FadeUp delay={index * 0.06} className="flex-1 min-w-0">
											<article className="group relative overflow-hidden rounded-c bg-paper hairline card-shadow p-6 sm:p-7 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
												<span
													aria-hidden
													className="absolute -right-3 -top-6 font-light tracking-tighter text-[6rem] leading-none text-primary/[0.05] select-none pointer-events-none"
												>
													{String(index + 1).padStart(2, "0")}
												</span>

												<div className="relative">
													<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
														Step {String(index + 1).padStart(2, "0")}
													</p>
													<h3 className="mt-2 text-lg sm:text-xl font-medium tracking-tight text-ink leading-snug">
														{item.title}
													</h3>

													{points.length > 0 && (
														<ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
															{points.map((point, pointIndex) => (
																<li
																	key={pointIndex}
																	className="flex items-start gap-2.5 rounded-xl bg-primary-50/60 px-3.5 py-2.5 text-[13px] text-ink/75 leading-snug"
																>
																	<span className="mdi mdi-check text-primary text-base shrink-0 mt-0.5" />
																	{point}
																</li>
															))}
														</ul>
													)}
												</div>
											</article>
										</FadeUp>
									</li>
								);
							})}
						</ol>
					</div>
				</div>
			</div>
		</section>
	);
}

export default GprMethodologySection;
