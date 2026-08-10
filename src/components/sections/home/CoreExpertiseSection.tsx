"use client";

import { useTranslation } from "@/hooks";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";

interface ExpertiseItem {
	icon?: string | null;
	label: string;
	description: string;
}

const EXPERTISE_ICONS: Record<string, string> = {
	"topographical & engineering surveys": "terrain",
	"drone mapping & photogrammetry": "quadcopter",
	"construction & site control": "hard-hat",
	"infrastructure support": "bridge",
};

const DEFAULT_ICONS = ["terrain", "quadcopter", "hard-hat", "bridge"];

const expertiseIcon = (label: string, index: number) =>
	EXPERTISE_ICONS[label.trim().toLowerCase()] || DEFAULT_ICONS[index % DEFAULT_ICONS.length];

export function CoreExpertiseSection() {
	const { t } = useTranslation(["home"]);
	const items = t("home:coreExpertise.items", {
		returnObjects: true,
	}) as unknown as ExpertiseItem[];

	return (
		<section id="core-expertise" className="py-24 sm:py-28 relative overflow-hidden">
			<div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

			<div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="mt-4 mb-12 flex flex-col items-center gap-4 text-center">
						<SectionTag>{t("home:coreExpertise.tag") as string}</SectionTag>
					</div>
				</FadeUp>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{Array.isArray(items) &&
						items.map((item, index) => (
							<FadeUp key={index} delay={index * 0.1}>
								<div className="group h-full relative rounded-3xl bg-surface border border-slate-200/70 shadow-sm hover:shadow-lg p-7 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
									<span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-200 via-primary to-brand-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

									<span className="absolute -bottom-8 -right-8 w-28 h-28 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-300" />

									<div className="relative flex flex-col h-full">
										<span className="w-13 h-13 p-3 rounded-2xl bg-brand-100 text-primary flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
											<span
												className={`mdi mdi-${item.icon || expertiseIcon(item.label, index)} text-2xl`}
											/>
										</span>

										<h3 className="text-lg font-bold text-on-surface leading-snug mb-3">
											{item.label}
										</h3>
										<p className="text-sm text-on-surface/70 leading-relaxed flex-1">
											{item.description}
										</p>

										<span className="inline-flex items-center gap-1.5 mt-6 text-primary font-semibold text-sm opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
											{t("home:coreExpertise.label", {
												defaultValue: "Core capability",
											}) as string}
											<span className="mdi mdi-arrow-right text-lg" />
										</span>
									</div>
								</div>
							</FadeUp>
						))}
				</div>
			</div>
		</section>
	);
}

export default CoreExpertiseSection;