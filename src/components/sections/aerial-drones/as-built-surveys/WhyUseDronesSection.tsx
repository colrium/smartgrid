"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface WhyDroneItem {
	title: string;
	description: string;
	popupContent?: string;
}

interface WhyDronesContent {
	tag?: string | null;
	headline: string;
	items: WhyDroneItem[];
}

const FALLBACK_ICONS = ["vector-triangle", "speedometer", "leaf", "layers-triple"];

export function WhyUseDronesSection() {
	const { t } = useTranslation(["aerial-drones-as-built-surveys"]);
	const section = t("aerial-drones-as-built-surveys:whyUseDrones", {
		returnObjects: true,
	}) as unknown as WhyDronesContent;
	const items = Array.isArray(section.items) ? section.items : [];
	const [active, setActive] = useState<WhyDroneItem | null>(null);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setActive(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader tag={section.tag} headline={section.headline} align="center" />

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 2) * 0.08}>
							<article className="group relative h-full flex flex-col p-8 rounded-[20px] bg-surface hairline card-shadow transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<span className="p-3 rounded-xl bg-primary-50 text-mute transition-colors duration-300   self-center">
									<span
										className={`mdi mdi-${
											FALLBACK_ICONS[index % FALLBACK_ICONS.length]
										} text-3xl group-hover:text-primary`}
									/>
								</span>

								<h3 className="mt-6 text-lg sm:text-xl font-medium tracking-tight text-ink leading-snug text-center">
									{item.title}
								</h3>
								<p className="mt-3 flex-1  text-on-surface/60 leading-relaxed text-center">
									{item.description}
								</p>

								{item.popupContent && (
									<button
										type="button"
										onClick={() => setActive(item)}
										className="mt-6 mx-auto inline-flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer"
									>
										<span className="uppercase tracking-[0.14em] text-xs">
											Learn more
										</span>
										<span className="mdi mdi-arrow-right ml-1 transition-transform duration-300 group-hover:translate-x-1" />
									</button>
								)}
							</article>
						</FadeUp>
					))}
				</div>
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
							className="relative w-full max-w-xl rounded-[20px] bg-surface p-8 sm:p-10 card-shadow-lift"
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
								{section.headline}
							</span>
							<h3 className="mt-4 text-2xl sm:text-3xl font-light tracking-tight text-ink leading-tight">
								{active.title}
							</h3>
							<div className="mt-5 h-px w-full bg-ink/10" />
							<p className="mt-5 text-sm sm:text-[15px] text-on-surface/70 leading-relaxed">
								{active.popupContent}
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}

export default WhyUseDronesSection;