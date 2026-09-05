"use client";

import { useState, type ReactElement } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "./SectionHeader";
import { ParallaxDecor, Blob } from "./decor";
import { FadeUp } from "@/components/animations/Fade";
import { DeliverablesExplorer, type DeliverablesContent } from "@/components/sections/Deliverables";

interface SeviceItemList {
	label: string;
	description: string;
	items: string[];
}
interface ServiceItem {
	featureImg: string;
	label: string;
	description: string;
	whatWeOffer: SeviceItemList;
	deliverables: DeliverablesContent & { label?: string };
}

const SERVICE_ICONS: Record<string, string> = {
	"land surveying": "land-fields",
	"aerial surveys": "quadcopter",
	"civil engineering": "hard-hat",
};

const itemToIcon = (label: string) => SERVICE_ICONS[label.trim().toLowerCase()] || "tools";

const PANEL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ServicesSection(): ReactElement | null {
	const { t } = useTranslation(["home"]);
	const items = t("home:services.items", { returnObjects: true }) as unknown as ServiceItem[];
	const [activeTab, setActiveTab] = useState(0);

	if (!Array.isArray(items) || items.length === 0) return null;

	const active = items[Math.min(activeTab, items.length - 1)];
	const deliverables = active?.deliverables;
	const hasDeliverables = Array.isArray(deliverables?.items) && deliverables.items.length > 0;

	return (
		<section id="services" className="py-24 sm:py-28 relative overflow-hidden">
			<Blob
				className="w-[26rem] h-[26rem] bg-primary-200/40 -top-24 left-1/4"
				opacity={0.5}
			/>
			<ParallaxDecor speed={0.06} className="absolute bottom-16 -right-16 z-0">
				<Blob className="w-80 h-80 bg-primary-100/80" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader
						tag={t("home:services.tag") as string}
						headline={t("home:services.headline") as string}
					/>
				</FadeUp>

				<div className="mt-14 sm:mt-20 rounded-c pale-panel-soft hairline card-shadow overflow-hidden p-6 sm:p-10 lg:p-12">
					{/* Row 1 — horizontal service tabs */}
					<div
						role="tablist"
						aria-label="Services"
						className="grid grid-cols-3 gap-2 sm:gap-3"
					>
						{items.map((service, index) => {
							const selected = activeTab === index;
							return (
								<button
									key={index}
									type="button"
									role="tab"
									id={`service-tab-${index}`}
									aria-selected={selected}
									aria-controls="service-panel"
									onClick={() => setActiveTab(index)}
									className={`flex flex-col items-center justify-center gap-1.5 rounded-[15px] px-2 py-3.5 text-center transition-all duration-300 sm:flex-row sm:justify-start sm:gap-3.5 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-left ${
										selected
											? "bg-ink text-surface card-shadow"
											: "bg-surface/70 hairline text-ink hover:bg-surface hover:-translate-y-0.5"
									}`}
								>
									<span
										className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-300 ${
											selected
												? "bg-primary/25 text-primary-200"
												: "bg-primary-50 text-primary"
										}`}
									>
										<span
											className={`mdi mdi-${itemToIcon(service.label)} text-xl`}
										/>
									</span>
									<span className="text-[11px] sm:text-sm font-semibold leading-tight capitalize sm:font-medium sm:leading-snug">
										{service.label}
									</span>
									<span
										className={`hidden sm:block ml-auto text-[11px] font-semibold tabular-nums tracking-[0.14em] transition-colors duration-300 ${
											selected ? "text-primary" : "text-on-surface/30"
										}`}
									>
										{String(index + 1).padStart(2, "0")}
									</span>
								</button>
							);
						})}
					</div>

					{/* Panel */}
					<AnimatePresence mode="wait">
						<motion.div
							key={activeTab}
							id="service-panel"
							role="tabpanel"
							aria-labelledby={`service-tab-${activeTab}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -12 }}
							transition={{ duration: 0.4, ease: PANEL_EASE }}
						>
							{/* Row 2 — feature image beside description */}
							<div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
								<FadeUp>
									<figure className="group relative aspect-4/5 rounded-cmd hairline overflow-hidden bg-surface card-shadow">
										{active.featureImg && (
											<Image
												src={active.featureImg}
												alt={active.label}
												fill
												sizes="(min-width: 1024px) 50vw, 100vw"
												className="object-fill object-center transition-transform duration-700 ease-out group-hover:scale-105"
											/>
										)}
										{/* Survey reticle corner brackets */}
										<span
											aria-hidden
											className="pointer-events-none absolute inset-4 z-10"
										>
											<span className="absolute left-0 top-0 h-5 w-5 rounded-tl-md border-l-2 border-t-2 border-surface/60" />
											<span className="absolute right-0 top-0 h-5 w-5 rounded-tr-md border-r-2 border-t-2 border-surface/60" />
											<span className="absolute bottom-0 left-0 h-5 w-5 rounded-bl-md border-b-2 border-l-2 border-surface/60" />
											<span className="absolute bottom-0 right-0 h-5 w-5 rounded-br-md border-b-2 border-r-2 border-surface/60" />
										</span>
										<span className="absolute top-4 right-4 z-10 glass rounded-xl text-[11px] font-semibold tabular-nums tracking-[0.14em] text-ink px-3 py-1.5">
											{String(activeTab + 1).padStart(2, "0")}
										</span>
									</figure>
								</FadeUp>
								<FadeUp>
									<div>
										<h3 className="inline-flex items-center gap-3 text-2xl sm:text-3xl font-light uppercase tracking-tight text-ink leading-tight">
											<span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
												<span
													className={`mdi mdi-${itemToIcon(active.label)} text-xl`}
												/>
											</span>
											{active.label}
										</h3>
										<p className="mt-4 sm:mt-5 text-sm sm:text-base text-on-surface/65 leading-relaxed">
											{active.description}
										</p>
									</div>
								</FadeUp>
							</div>

							{/* Row 3 — service deliverables: reusable interactive explorer (components/sections/Deliverables) */}
							{hasDeliverables && (
								<div key={activeTab} className="mt-12 sm:mt-16">
									<FadeUp>
										<div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
											<h3 className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
												<span
													className="h-px w-6 bg-primary/60"
													aria-hidden
												/>
												{active.label} —{" "}
												{deliverables?.label || "Deliverables"}
											</h3>
											{deliverables?.description && (
												<p className="max-w-xl text-sm text-on-surface/60 leading-relaxed">
													{deliverables.description}
												</p>
											)}
										</div>
									</FadeUp>
									<div className="mt-8 sm:mt-10">
										<DeliverablesExplorer
											content={deliverables}
											// className="flex! flex-col! flex-col-reverse!"
										/>
									</div>
								</div>
							)}

							{/* Row 4 — what we offer */}
							<div className="mt-12 sm:mt-16">
								<h4 className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-6">
									<span className="h-px w-6 bg-primary/60" />
									{active.whatWeOffer?.label || "What we offer"}
								</h4>
								{active.whatWeOffer?.description && (
									<p className="my-4 text-sm text-on-surface/70 leading-relaxed">
										{active.whatWeOffer?.description}
									</p>
								)}
								<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{active.whatWeOffer?.items &&
										active.whatWeOffer.items.map((d, i) => (
											<li
												key={i}
												className="group/li flex items-start gap-3 rounded-xl bg-surface/70 hairline px-4 py-3 text-sm text-on-surface/75 leading-relaxed transition-colors duration-300 hover:border-primary/40"
											>
												<span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary transition-colors duration-300 group-hover/li:bg-primary group-hover/li:text-surface">
													<span
														className="mdi mdi-check text-xs"
														aria-hidden
													/>
												</span>
												<span>{d}</span>
											</li>
										))}
								</ul>
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</section>
	);
}

export default ServicesSection;