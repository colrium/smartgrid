"use client";

import { useTranslation } from "@/hooks";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";
import { ParallaxDecor, Blob } from "./decor";

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
			{/* Soft institutional background shapes */}
			<Blob className="w-[24rem] h-[24rem] bg-brand-200/40 -top-24 right-10" opacity={0.5} />
			<ParallaxDecor speed={-0.05} className="absolute bottom-10 -left-16 z-0">
				<Blob className="w-72 h-72 bg-brand-100/70" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="mb-12 flex flex-col items-center gap-4 text-center">
						<SectionTag>{t("home:coreExpertise.tag") as string}</SectionTag>
						
					</div>
				</FadeUp>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{Array.isArray(items) &&
						items.map((item, index) => (
							<FadeUp
								key={index}
								delay={(index % 4) * 0.08}
								className={index % 2 === 1 ? "lg:translate-y-8" : ""}
							>
								<article className="group relative h-full flex flex-col rounded-[15px] border-t-2 border-ink/10 bg-surface card-shadow p-7 transition-all duration-500 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-t-primary overflow-hidden">
									{/* watermark index */}
									<span
										className="absolute right-4 top-2 font-light text-5xl tracking-tight text-ink/[0.05] select-none pointer-events-none"
										aria-hidden
									>
										{String(index + 1).padStart(2, "0")}
									</span>

									<div className="flex items-center justify-between mb-8">
										<span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
											<span
												className={`mdi mdi-${
													item.icon || expertiseIcon(item.label, index)
												} text-2xl`}
											/>
										</span>
										<span className="mdi mdi-arrow-up-right text-xl text-on-surface/25 -translate-x-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-primary" />
									</div>

									<h3 className="text-lg font-medium leading-snug text-ink mb-3">
										{item.label}
									</h3>
									<p className="text-sm text-on-surface/60 leading-relaxed flex-1">
										{item.description}
									</p>

									<span className="mt-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
										<span className="h-px w-6 bg-primary/50" />
										{t("home:coreExpertise.label", {
											defaultValue: "Core capability",
										}) as string}
									</span>
								</article>
							</FadeUp>
						))}
				</div>
			</div>
		</section>
	);
}

export default CoreExpertiseSection;