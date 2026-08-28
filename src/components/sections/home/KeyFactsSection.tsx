"use client";

import { useTranslation } from "@/hooks";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";
import { ParallaxDecor, Blob } from "./decor";

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
			<ParallaxDecor speed={0.05} className="absolute top-10 right-1/4 z-0">
				<Blob className="w-72 h-72 bg-primary-200/50" opacity={0.5} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				

				<FadeUp delay={0.08}>
					<div className="relative rounded-[20px] pale-panel hairline card-shadow overflow-hidden">
						
						{/* texture + watermark */}
						<ParallaxDecor speed={0.06} className="absolute -top-16 -right-16 z-0">
							<Blob className="w-72 h-72 bg-primary-100/90" opacity={0.7} />
						</ParallaxDecor>
						<span
							className="absolute -right-2 top-1/2 -translate-y-1/2 font-light tracking-tighter text-[11rem] leading-none text-ink/[0.04] select-none pointer-events-none"
							aria-hidden
						>
							{String(Array.isArray(items) ? items.length : 0).padStart(2, "0")}
						</span>
						<div className="my-12 px-4 flex flex-col items-center gap-4 text-center">
							<SectionTag>{t("home:keyFacts.tag") as string}</SectionTag>
							<p
								className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-on-surface/60`}
							>
								{t("home:keyFacts.description") as string}
                            </p>
						</div>
						<div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6 sm:p-8 lg:p-10">
							{Array.isArray(items) &&
								items.map((item, index) => (
									<div
										key={index}
										className="group glass rounded-xl p-8 flex flex-col items-center text-center transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:card-shadow-lift"
									>
										{/* Sealed medallion */}
										<span className="relative mb-6 flex h-14 w-14 items-center justify-center">
											
											<span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface text-primary shadow-sm">
												<span
													className={`mdi mdi-${
														item.icon ||
														FACT_ICONS[index % FACT_ICONS.length]
													} text-3xl`}
												/>
											</span>
										</span>

										<h3 className="text-[15px] font-semibold text-ink uppercase tracking-wide mb-2">
											{item.label}
										</h3>
										<p className="text-sm text-ink/60 leading-relaxed">
											{item.description}
										</p>

									</div>
								))}
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default KeyFactsSection;