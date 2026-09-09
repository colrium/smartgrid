"use client";

import { useState, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "@/components/Link";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "./SectionHeader";
import { FadeUp } from "@/components/animations/Fade";
import { DeliverablesExplorer, type DeliverablesContent } from "@/components/sections/Deliverables";
import { SectionTag } from "@/components/SectionTag";

interface ServiceOfferItem {
	label: string;
	href?: string;
}
interface SeviceItemList {
	label: string;
	description: string;
	items: (string | ServiceOfferItem)[];
}
interface ServiceItem {
	icon: string;
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
			<div className="relative z-10 max-w-7xl mx-auto rounded-c pale-panel-soft hairline card-shadow pt-12 px-2 sm:px-3 lg:px-4">
				<span
					className={`mdi mdi-${active.icon} text-7xl md:text-[15rem] lg:text-[20rem] absolute -top-2 -right-2 z-0 text-primary-50/40`}
				/>
				<span
					className={`mdi mdi-${active.icon} text-9xl md:text-[20rem] lg:text-[30rem] absolute -bottom-8 -left-4 lg:-left-4 lg:-bottom-16 rotate-12 z-0 text-ink-50/40`}
				/>
				<FadeUp>
					<SectionHeader
						tag={t("home:services.tag") as string}
						headline={t("home:services.headline") as string}
						align="center"
					/>
				</FadeUp>

				<div className="mt-4 sm:mt-6 overflow-hidden p-6 sm:p-10 lg:p-12 relative">
					{/* Row 1 - horizontal service tabs */}
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
									className={`flex flex-col items-center justify-center gap-1.5 rounded-c cursor-pointer p-2 text-center transition-all duration-300 sm:flex-row sm:justify-start sm:gap-3.5 sm:rounded-2xl sm:p-3 sm:text-left  ${
										selected
											? "bg-primary text-surface card-shadow-lift shadow-primary!"
											: "bg-surface/70 hairline text-ink hover:bg-surface card-shadow hover:-translate-y-0.5 hover:border-primary/40 hover:card-shadow-lift"
									}`}
								>
									<span
										className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-300 ${
											selected
												? "bg-primary/25 text-primary-200"
												: "bg-primary-50 text-primary"
										}`}
									>
										<span className={`mdi mdi-${service.icon} text-xl`} />
									</span>
									<span className="text-[11px] sm:text-sm font-semibold leading-tight capitalize sm:font-medium sm:leading-snug">
										{service.label}
									</span>
									<span
										className={`hidden sm:block ml-auto text-[11px] font-semibold tabular-nums tracking-[0.14em] transition-colors duration-300 ${
											selected ? "text-surface" : "text-on-surface/30"
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
							{/* Row 2 - feature image beside description */}
							<div
								className={`mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12  items-start`}
							>
								<div>
									<h3 className="inline-flex items-center gap-3 text-2xl sm:text-3xl font-light uppercase tracking-tight text-ink leading-tight">
										<span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
											<span className={`mdi mdi-${active.icon} text-xl`} />
										</span>
										{active.label}
									</h3>
									<p className="mt-4 sm:mt-5 text-sm sm:text-base text-on-surface/65 leading-relaxed">
										{active.description}
									</p>
								</div>
								<div className="mt-2">
									<SectionTag className="mb-6">
										{active.whatWeOffer?.label || "What we offer"}
									</SectionTag>
									{active.whatWeOffer?.description && (
										<p className="my-4 text-sm text-on-surface/70 leading-relaxed">
											{active.whatWeOffer?.description}
										</p>
									)}
									<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										{active.whatWeOffer?.items &&
											active.whatWeOffer.items.map((offer, i) => {
												const item: ServiceOfferItem =
													typeof offer === "string"
														? { label: offer }
														: offer;
												return (
													<li
														key={i}
														className={`group/li flex items-start gap-3 rounded-xl bg-surface/70 hairline px-4 py-3 text-sm text-on-surface/75 leading-relaxed transition-colors duration-300 ${item.href ? "hover:border-primary/40" : ""}`}
													>
														<span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary transition-colors duration-300 group-hover/li:bg-primary group-hover/li:text-surface">
															<span
																className="mdi mdi-check text-xs"
																aria-hidden
															/>
														</span>
														{item.href ? (
															<Link
																href={item.href}
																className="group/offer flex flex-1 items-start justify-between gap-2 text-on-surface/75 transition-colors duration-300 hover:text-primary"
															>
																<span>{item.label}</span>
																<span
																	className="mdi mdi-arrow-top-right mt-0.5 text-xs opacity-0 transition-opacity duration-300 group-hover/offer:opacity-100"
																	aria-hidden
																/>
															</Link>
														) : (
															<span>{item.label}</span>
														)}
													</li>
												);
											})}
									</ul>
								</div>
							</div>
							{hasDeliverables && (
								<div key={activeTab} className="mt-6">
									<FadeUp>
										<div className="flex flex-col flex-wrap items-start justify-between gap-x-8 gap-y-3">
											<SectionTag>
												{active.label} -{" "}
												{deliverables?.label || "Deliverables"}
											</SectionTag>
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
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</section>
	);
}

export default ServicesSection;