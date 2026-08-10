"use client";

import { useTranslation } from "@/hooks";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";

interface KeyFactItem {
	icon?: string | null;
	label: string;
	description: string;
}

const FACT_ICONS = [
	"map-marker-radius",
	"satellite-variant",
	"clock-check-outline",
	"shield-check-outline",
];

export function KeyFactsSection() {
	const { t } = useTranslation(["home"]);
	const items = t("home:keyFacts.items", { returnObjects: true }) as unknown as KeyFactItem[];

	return (
		<section id="key-facts" className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="mt-4 mb-12 flex flex-col items-center gap-4 text-center">
						<SectionTag>{t("home:keyFacts.tag") as string}</SectionTag>
					</div>
				</FadeUp>

				<FadeUp delay={0.08}>
					<div className="relative rounded-4xl bg-surface border border-slate-200/70 shadow-xl overflow-hidden">
						<div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-200 via-primary to-brand-200" />
						<div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

						<div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x divide-slate-200/70">
							{Array.isArray(items) &&
								items.map((item, index) => (
									<div
										key={index}
										className="group flex flex-col items-center text-center gap-4 p-8 sm:p-10 transition-colors duration-300 hover:bg-brand-100/60"
									>
										<span className="relative w-14 h-14 flex items-center justify-center">
											<span className="absolute inset-0 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300" />
											<span
												className={`relative mdi mdi-${
													item.icon || FACT_ICONS[index % FACT_ICONS.length]
												} text-2xl text-primary`}
											/>
										</span>
										<div>
											<h3 className="text-base font-bold text-on-surface uppercase tracking-wide mb-2">
												{item.label}
											</h3>
											<p className="text-sm text-on-surface/70 leading-relaxed">
												{item.description}
											</p>
										</div>
										<span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-primary/70">
											<FACT_INDEX index={index} />
										</span>
									</div>
								))}
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

function FACT_INDEX({ index }: { index: number }) {
	return (
		<>
			<span className="mdi mdi-circle-small" />
			{String(index + 1).padStart(2, "0")}
		</>
	);
}

export default KeyFactsSection;