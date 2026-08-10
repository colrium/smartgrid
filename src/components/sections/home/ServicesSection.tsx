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

const itemToIcon = (label: string) =>
	SERVICE_ICONS[label.trim().toLowerCase()] || "tools";

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
			<div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

			<div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={t("home:services.tag") as string}
					headline={t("home:services.headline") as string}
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
					{/* Selector */}
					<Box className="lg:col-span-4 lg:sticky lg:top-28">
						<Tabs
							value={activeTab}
							onChange={(_e, value: number) => setActiveTab(value)}
							orientation={isMobile ? "horizontal" : "vertical"}
							variant={isMobile ? "scrollable" : "standard"}
							scrollButtons={false}
							sx={{
								"& .MuiTabs-flexContainer": { gap: "12px" },
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
												className={`mdi mdi-${itemToIcon(
													service.label
												)} text-2xl`}
											/>
										}
										iconPosition="start"
										label={service.label}
										sx={{
											minHeight: "auto",
											padding: "18px 20px",
											borderRadius: "20px",
											border: "1px solid",
											borderColor: selected
												? "#0097b2"
												: "rgba(226, 232, 240, 0.7)",
											color: selected ? "#0097b2" : "#52686c",
											backgroundColor: selected
												? "rgba(0, 151, 178, 0.08)"
												: "#ffffff",
											boxShadow: selected
												? "0 10px 30px -12px rgba(0, 151, 178, 0.35)"
												: "none",
											textTransform: "none",
											fontWeight: 600,
											fontSize: "0.95rem",
											justifyContent: "flex-start",
											transition:
												"all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
											"& .MuiTab-iconWrapper": { marginRight: "10px" },
											"&:hover": {
												borderColor: "rgba(0, 151, 178, 0.55)",
												color: "#0097b2",
												backgroundColor: "rgba(0, 151, 178, 0.06)",
											},
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
								initial={{ opacity: 0, y: 24 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -16 }}
								transition={{ duration: 0.4, ease: PANEL_EASE }}
							>
								<div className="group relative h-56 sm:h-72 lg:h-80 rounded-3xl overflow-hidden border border-slate-200/70 bg-surface shadow-sm">
									{active.featureImg && (
										<Image
											src={active.featureImg}
											alt={active.label}
											fill
											sizes="(min-width: 1024px) 55vw, 100vw"
											className="object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/25 to-transparent" />
									<div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between gap-4">
										<div>
											<span className="inline-block text-[11px] font-mono uppercase tracking-[0.18em] text-brand-200 font-semibold mb-2">
												{t("home:services.tag") as string}
											</span>
											<h3 className="text-2xl sm:text-3xl font-bold text-surface leading-tight uppercase">
												{active.label}
											</h3>
										</div>
										<span className="hidden sm:flex w-12 h-12 shrink-0 rounded-2xl bg-surface/85 backdrop-blur-sm items-center justify-center text-primary">
											<span
												className={`mdi mdi-${itemToIcon(
													active.label
												)} text-2xl`}
											/>
										</span>
									</div>
								</div>

								<div className="mt-8 sm:mt-10">
									<p className="text-sm sm:text-base text-on-surface/70 leading-relaxed mb-8 sm:mb-10">
										{active.description}
									</p>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
										<div>
											<h4 className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-primary font-semibold mb-5">
												<span className="w-6 h-0.5 bg-primary" />
												{t("home:services.itemsLabel", { defaultValue: "What we offer" }) as string}
											</h4>
											<ul className="flex flex-col gap-3.5">
												{Array.isArray(active.items) &&
													active.items.map((s, i) => (
														<li
															key={i}
															className="flex items-start gap-3 text-sm text-on-surface/80 leading-relaxed"
														>
															<span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-brand-100 text-primary flex items-center justify-center">
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
											<h4 className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-primary font-semibold mb-5">
												<span className="w-6 h-0.5 bg-primary" />
												{t("home:services.deliverablesLabel", { defaultValue: "Deliverables" }) as string}
											</h4>
											<ul className="flex flex-col gap-3.5">
												{Array.isArray(active.deliverables) &&
													active.deliverables.map((d, i) => (
														<li
															key={i}
															className="flex items-start gap-3 text-sm text-on-surface/80 leading-relaxed"
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
		</section>
	);
}

export default ServicesSection;