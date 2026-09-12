import { useEffect, useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/hooks";
import { SectionShell } from "@/components/sections/shared";
import { FadeUp } from "@/components/animations/Fade";
import { Card } from "@/components/ui/Card";

interface AerialSurveyingItem {
	title: string;
	description: string;
	popupContent?: string;
}

interface AerialSurveyingContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: AerialSurveyingItem[];
}

const FALLBACK_ICONS = [
	"map-outline",
	"clipboard-pulse-outline",
	"leaf",
	"sprout",
	"cube-outline",
	"road-variant",
	"terrain",
	"vector-triangle",
	"alert-octagon-outline",
];

export function AerialSurveyingSection(): ReactElement | null {
	const { t } = useTranslation(["about"]);
	const section = t("about:aerialSurveying", {
		returnObjects: true,
	}) as unknown as AerialSurveyingContent;
	const items = Array.isArray(section?.items) ? section.items : [];
	const [active, setActive] = useState<AerialSurveyingItem | null>(null);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setActive(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	if (items.length === 0) return null;

	return (
		<SectionShell
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			align="center"
			tone="surface"
		>
			<div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
				{items.map((item, index) => (
					<FadeUp key={index} delay={(index % 3) * 0.08} className="h-full">
						<Card
							align="center"
							header={item.title}
							headerIcon={FALLBACK_ICONS[index % FALLBACK_ICONS.length]}
							body={item.description}
							footer={
								item.popupContent ? (
									<button
										type="button"
										onClick={() => setActive(item)}
										className="mt-2 mx-auto inline-flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer"
									>
										<span className="uppercase tracking-[0.14em] text-xs">Learn more</span>
										<span className="mdi mdi-arrow-right ml-1 transition-transform duration-300 group-hover:translate-x-1" />
									</button>
								) : undefined
							}
						/>
					</FadeUp>
				))}
			</div>

			<AnimatePresence>
				{active && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[90] flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm"
						onClick={() => setActive(null)}
					>
						<motion.div
							initial={{ opacity: 0, y: 24, scale: 0.97 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 24, scale: 0.97 }}
							transition={{ duration: 0.25 }}
							className="relative w-full max-w-xl rounded-c bg-surface p-8 sm:p-10 card-shadow-lift"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								aria-label="Close"
								onClick={() => setActive(null)}
								className="absolute top-4 right-4 h-9 w-9 rounded-full border border-ink/15 text-on-surface/60 flex items-center justify-center transition-colors duration-300 hover:border-primary hover:text-primary cursor-pointer"
							>
								<span className="mdi mdi-close text-lg" />
							</button>

							<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
								<span className="h-1.5 w-1.5 rounded-full bg-primary" />
								{active.title}
							</span>

							<h3 className="mt-4 text-2xl sm:text-3xl font-light tracking-tight text-ink">
								{active.title}
							</h3>

							<p className="mt-5 text-base text-on-surface/70 leading-relaxed whitespace-pre-line">
								{active.popupContent}
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</SectionShell>
	);
}

export default AerialSurveyingSection;