"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "./SectionHeader";
import { ParallaxDecor, Blob } from "./decor";

interface ServiceItem {
	featureImg: string;
	label: string;
	description: string;
	items: string[];
	deliverables: string[];
}

const SERVICE_ICONS: Record<string, string> = {
	"land surveying": "land-fields",
	"aerial surveys": "quadcopter",
	"civil engineering": "hard-hat",
};

const itemToIcon = (label: string) => SERVICE_ICONS[label.trim().toLowerCase()] || "tools";

const PANEL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ServicesSection() {
	const { t } = useTranslation(["home"]);
	const items = t("home:services.items", { returnObjects: true }) as unknown as ServiceItem[];
	const [activeTab, setActiveTab] = useState(0);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	if (!Array.isArray(items) || items.length === 0) return null;

	const active = items[Math.min(activeTab, items.length - 1)];

	return (
		<section id="services" className="py-24 sm:py-28 relative overflow-hidden">
			{/* Soft institutional background shapes */}
			<Blob className="w-[26rem] h-[26rem] bg-brand-200/40 -top-24 left-1/4" opacity={0.5} />
			<ParallaxDecor speed={0.06} className="absolute bottom-16 -right-16 z-0">
				<Blob className="w-80 h-80 bg-brand-100/80" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={t("home:services.tag") as string}
					headline={t("home:services.headline") as string}
				/>

				<div className="mt-14 sm:mt-20 rounded-[20px] pale-panel hairline card-shadow overflow-hidden p-6 sm:p-10 lg:p-12">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
						{/* Selector */}
						<Box className="lg:col-span-4 lg:sticky lg:top-28">
							<Tabs
								value={activeTab}
								onChange={(_e, value: number) => setActiveTab(value)}
								orientation={isMobile ? "horizontal" : "vertical"}
								variant={isMobile ? "scrollable" : "standard"}
								scrollButtons={false}
								sx={{
									"& .MuiTabs-flexContainer": { gap: "10px" },
									"& .MuiTabs-indicator": { display: "none" },
								}}
							>
								{items.map((service, index) => {
									const selected = activeTab === index;
									return (
										<Tab
											key={index}
											value={index}
											disableRipple
											icon={
												<span
													className={`mdi mdi-${itemToIcon(service.label)} text-xl`}
												/>
											}
											iconPosition="start"
											label={service.label}
                                            sx={{
                                                mb: 2,
												minHeight: "auto",
												padding: "16px 20px",
												borderRadius: "10px",
												border: "1px solid",
												borderColor: selected
													? "#01373d"
													: "rgba(1, 55, 61, 0.12)",
												color: selected ? "#ffffff" : "#345a60",
												backgroundColor: selected ? "#01373d" : "transparent",
												boxShadow: selected
													? "0 14px 34px -14px rgba(1, 55, 61, 0.55)"
													: "none",
												textTransform: "none",
												fontWeight: 500,
												fontSize: "0.95rem",
												justifyContent: "flex-start",
												transition:
													"all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
												"& .MuiTab-iconWrapper": { marginRight: "10px" },
												"&:hover": {
													borderColor: "#0097b2",
													color: selected ? "#ffffff" : "#0097b2",
													backgroundColor: selected
														? "#01373d"
														: "rgba(0, 151, 178, 0.06)",
												},
												"&:active": { transform: "scale(0.985)" },
											}}
										/>
									);
								})}
							</Tabs>
						</Box>

						{/* Panel */}
						<Box className="lg:col-span-8">
							<AnimatePresence mode="wait">
								<motion.div
									key={activeTab}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -12 }}
									transition={{ duration: 0.4, ease: PANEL_EASE }}
								>
									<div className="group relative h-56 sm:h-72 lg:h-80 rounded-[15px] hairline overflow-hidden bg-surface card-shadow">
										{active.featureImg && (
											<Image
												src={active.featureImg}
												alt={active.label}
												fill
												sizes="(min-width: 1024px) 55vw, 100vw"
												className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
											/>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />

										<span className="absolute top-4 left-4 inline-flex items-center gap-2 glass rounded-lg text-[11px] font-semibold uppercase tracking-[0.18em] text-ink px-3 py-1.5">
											<span className="mdi mdi-circle-small text-primary" />
											{t("home:services.tag") as string}
										</span>
										<span className="absolute top-4 right-4 glass rounded-lg text-[11px] font-semibold tabular-nums tracking-[0.14em] text-ink px-3 py-1.5">
											{String(activeTab + 1).padStart(2, "0")}
										</span>

										<div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between gap-4">
											<div>
												<h3 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-white leading-tight">
													{active.label}
												</h3>
											</div>
											<span className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-lg glass text-primary">
												<span
													className={`mdi mdi-${itemToIcon(
														active.label
													)} text-xl`}
												/>
											</span>
										</div>
									</div>

									<div className="mt-8 sm:mt-10">
										<p className="text-sm sm:text-base text-on-surface/65 leading-relaxed mb-8 sm:mb-10">
											{active.description}
										</p>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12">
											<div>
												<h4 className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-6">
													<span className="h-px w-6 bg-primary/60" />
													{t("home:services.itemsLabel", {
														defaultValue: "What we offer",
													}) as string}
												</h4>
												<ul className="flex flex-col gap-4">
													{Array.isArray(active.items) &&
														active.items.map((s, i) => (
															<li
																key={i}
																className="group/li flex items-start gap-3 text-sm text-on-surface/75 leading-relaxed"
															>
																<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-50 text-primary transition-all duration-300 group-hover/li:bg-primary group-hover/li:text-white">
																	<span
																		className="mdi mdi-check text-sm"
																		aria-hidden
																	/>
																</span>
																<span>{s}</span>
															</li>
														))}
												</ul>
											</div>

											<div>
												<h4 className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-6">
													<span className="h-px w-6 bg-primary/60" />
													{t("home:services.deliverablesLabel", {
														defaultValue: "Deliverables",
													}) as string}
												</h4>
												<ul className="flex flex-col gap-4">
													{Array.isArray(active.deliverables) &&
														active.deliverables.map((d, i) => (
															<li
																key={i}
																className="group/li flex items-start gap-3 text-sm text-on-surface/75 leading-relaxed"
															>
																<span className="mt-0.5 text-primary/70">
																	<span
																		className="mdi mdi-file-document-check-outline text-base"
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
								</motion.div>
							</AnimatePresence>
						</Box>
					</div>
				</div>
			</div>
		</section>
	);
}

export default ServicesSection;