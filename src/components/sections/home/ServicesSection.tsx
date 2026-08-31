"use client";

import { useState, type ReactElement } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "./SectionHeader";
import { ParallaxDecor, Blob } from "./decor";
import { FadeUp } from "@/components/animations/Fade";

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
	deliverables: SeviceItemList;
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

				<div className="mt-14 sm:mt-20 rounded-[20px] pale-panel hairline card-shadow overflow-hidden p-6 sm:p-10 lg:p-12">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
						{/* Selector - segmented control on mobile/tablet, folder list on desktop */}
						<div className="lg:col-span-4 lg:sticky lg:top-28">
							<div
								role="tablist"
								aria-label="Services"
								className="grid grid-cols-3 gap-2 sm:gap-3 lg:flex lg:flex-col lg:gap-2.5"
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
											className={`flex flex-col items-center justify-center gap-1.5 rounded-[15px] px-2 py-3.5 text-center transition-all duration-300 sm:py-4 lg:flex-row lg:justify-start lg:gap-3.5 lg:rounded-2xl lg:px-5 lg:py-4 lg:text-left ${
												selected
													? "bg-ink text-surface card-shadow lg:bg-surface lg:text-ink"
													: "bg-surface/70 hairline text-ink hover:bg-surface hover:-translate-y-0.5"
												}`}
										>
											<span
												className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-300 ${
													selected
														? "bg-primary/25 text-primary-200 lg:bg-primary-50 lg:text-primary"
														: "bg-primary-50 text-primary"
													}`}
											>
												<span
													className={`mdi mdi-${itemToIcon(service.label)} text-xl`}
												/>
											</span>
											<span className="text-[11px] sm:text-xs font-semibold leading-tight capitalize lg:text-sm lg:font-medium lg:leading-snug">
												{service.label}
											</span>
											<span
												className={`hidden lg:block ml-auto text-[11px] font-semibold tabular-nums tracking-[0.14em] transition-colors duration-300 ${
													selected ? "text-primary" : "text-on-surface/30"
												}`}
											>
												{String(index + 1).padStart(2, "0")}
											</span>
										</button>
									);
								})}
							</div>
						</div>

						{/* Panel */}
						<div className="lg:col-span-8">
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
									<FadeUp>
										<div className="group relative aspect-3/4 rounded-[15px] hairline overflow-hidden bg-surface card-shadow">
											{active.featureImg && (
												<Image
													src={active.featureImg}
													alt={active.label}
													fill
													sizes="(min-width: 1024px) 55vw, 100vw"
													className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
												/>
											)}
											{/* Survey reticle corner brackets */}
											<span aria-hidden className="pointer-events-none absolute inset-4 z-10">
												<span className="absolute left-0 top-0 h-5 w-5 rounded-tl-md border-l-2 border-t-2 border-surface/60" />
												<span className="absolute right-0 top-0 h-5 w-5 rounded-tr-md border-r-2 border-t-2 border-surface/60" />
												<span className="absolute bottom-0 left-0 h-5 w-5 rounded-bl-md border-b-2 border-l-2 border-surface/60" />
												<span className="absolute bottom-0 right-0 h-5 w-5 rounded-br-md border-b-2 border-r-2 border-surface/60" />
											</span>
											<div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

											<span className="absolute top-4 right-4 z-10 glass rounded-xl text-[11px] font-semibold tabular-nums tracking-[0.14em] text-ink px-3 py-1.5">
												{String(activeTab + 1).padStart(2, "0")}
											</span>

											<div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 flex items-end justify-between gap-4">
												<div>
													<h3 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-surface leading-tight">
														{active.label}
													</h3>
												</div>
												<span className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-lg glass text-primary">
													<span
														className={`mdi mdi-${itemToIcon(active.label)} text-xl`}
													/>
												</span>
											</div>
										</div>
									</FadeUp>
									<FadeUp>
										<div className="mt-8 sm:mt-10">
											<p className="text-sm sm:text-base text-on-surface/65 leading-relaxed mb-8 sm:mb-10">
												{active.description}
											</p>

											<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
												<div>
													<h4 className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-6">
														<span className="h-px w-6 bg-primary/60" />
														{active.whatWeOffer?.label || "What we offer"}
													</h4>
													{active.whatWeOffer?.description && (
														<p className="my-4 text-sm text-on-surface/70 leading-relaxed">
															{active.whatWeOffer?.description}
														</p>
													)}
													<ul className="flex flex-col gap-3">
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

												<div>
													<h4 className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-6">
														<span className="h-px w-6 bg-primary/60" />
														{active.deliverables?.label || "Deliverables"}
													</h4>
													{active.deliverables?.description && (
														<p className="my-4 text-sm text-on-surface/70 leading-relaxed">
															{active.deliverables?.description}
														</p>
													)}
													<ul className="flex flex-col gap-3">
														{active.deliverables?.items &&
															active.deliverables.items.map((d, i) => (
																<li
																	key={i}
																	className="group/li flex items-start gap-3 rounded-xl bg-surface/70 hairline px-4 py-3 text-sm text-on-surface/75 leading-relaxed transition-colors duration-300 hover:border-primary/40"
																>
																	<span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary transition-colors duration-300 group-hover/li:bg-primary group-hover/li:text-surface">
																		<span
																			className="mdi mdi-file-document-check-outline text-xs"
																			aria-hidden
																		/>
																	</span>
																	<span>{d}</span>
																</li>
															))}
													</ul>
												</div>
											</div>
										</div>
									</FadeUp>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default ServicesSection;