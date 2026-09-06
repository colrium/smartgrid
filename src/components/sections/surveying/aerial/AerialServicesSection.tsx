"use client";

import { useEffect, useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob, ParallaxDecor } from "@/components/sections/home/decor";

interface AerialServiceItem {
	title: string;
	description: string;
	popupContent?: string;
}

interface AerialServicesContent {
	tag?: string | null;
	headline: string;
	items: AerialServiceItem[];
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

export function AerialServicesSection(): ReactElement {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	const section = t("surveying/aerial-surveys:whatWeOffer", {
		returnObjects: true,
	}) as unknown as AerialServicesContent;
	const items = Array.isArray(section.items) ? section.items : [];
	const [active, setActive] = useState<AerialServiceItem | null>(null);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setActive(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -right-24"
				opacity={0.5}
			/>
			<ParallaxDecor speed={-0.06} className="absolute bottom-16 -left-24 z-0">
				<Blob className="w-72 h-72 bg-primary-100/80" opacity={0.6} />
			</ParallaxDecor>
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader tag={section.tag} headline={section.headline} align="center" />

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 auto-rows-fr">
					{items.map((item, index) => {
						const featured = index === 0;
						const span = featured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : "";

						return (
							<FadeUp
								key={index}
								delay={(index % 3) * 0.08}
								className={`h-full ${span}`}
							>
								<article
									className={`group relative h-full overflow-hidden rounded-c hairline card-shadow transition-all duration-250hover:card-shadow-lift hover:border-primary ${
										featured
											? "bg-gradient-to-br from-primary-50/80 via-paper to-paper"
											: "bg-paper"
									}`}
								>
									{/* Supersize index watermark */}
									<span
										aria-hidden
										className={`absolute right-1 -top-2 font-light tracking-tighter leading-none text-primary/[0.05] select-none pointer-events-none ${
											featured ? "text-[9rem]" : "text-[6rem]"
										}`}
									>
										{String(index + 1).padStart(2, "0")}
									</span>

									<div
										className={`relative flex h-full flex-col ${
											featured ? "p-8 sm:p-10 gap-5" : "p-7 gap-0"
										}`}
									>
										<div
											className={`flex items-start ${featured ? "gap-5" : "justify-between gap-4"}`}
										>
											<span
												className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-surface ${
													featured ? "h-14 w-14 rounded-2xl" : "h-11 w-11"
												}`}
											>
												<span
													className={`mdi mdi-${FALLBACK_ICONS[index % FALLBACK_ICONS.length]} ${
														featured ? "text-2xl" : "text-xl"
													}`}
												/>
											</span>
											<span className="inline-flex items-center gap-1.5  text-ink-soft">
												
												{String(index + 1).padStart(2, "0")}
											</span>
										</div>

										<h3
											className={`mt-6 font-medium tracking-tight text-ink leading-snug ${
												featured
													? "text-2xl sm:text-3xl"
													: "text-lg sm:text-xl"
											}`}
										>
											{item.title}
										</h3>

										<p
											className={`text-sm text-on-surface/60 leading-relaxed ${
												featured
													? "mt-3 text-base sm:text-lg"
													: "mt-3 flex-1"
											}`}
										>
											{item.description}
										</p>
										{featured && item.popupContent && (
											<p className="mt-5 text-xs  text-on-surface/70 leading-relaxed">
												{item.popupContent}
											</p>
										)}
										{!featured && item.popupContent && (
											<button
												type="button"
												onClick={() => setActive(item)}
												className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-primary cursor-pointer transition-colors duration-300 hover:text-accent-600"
											>
												<span className="uppercase tracking-[0.14em] text-xs">
													Learn more
												</span>
												<span className="mdi mdi-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
											</button>
										)}
									</div>
								</article>
							</FadeUp>
						);
					})}
				</div>
			</div>
			{/* Detail popup */}
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
							role="dialog"
							aria-modal="true"
							aria-label={active.title}
							className="relative w-full max-w-xl overflow-hidden rounded-c bg-surface p-8 sm:p-10 card-shadow-lift"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								aria-label="Close"
								onClick={() => setActive(null)}
								className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full border border-ink/15 text-on-surface/60 flex items-center justify-center transition-colors duration-300 hover:border-primary hover:text-primary cursor-pointer"
							>
								<span className="mdi mdi-close text-lg" />
							</button>

							<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
								<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
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

export default AerialServicesSection;
