"use client";

import type { ReactElement } from "react";
// import { motion } from "framer-motion";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface CtaCard {
	icon?: string | null;
	label: string;
	description?: string;
	href: string;
}

interface FinalCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	actionsLabel?: string | null;
	actions?: CtaCard[] | null;
}

export function AerialFinalCtaSection(): ReactElement {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	const section = t("surveying/aerial-surveys:finalCta", {
		returnObjects: true,
	}) as unknown as FinalCtaContent;
	const actions = Array.isArray(section?.actions) ? section.actions : [];

	if (!section?.headline) return <></>;

	return (
		<section className="relative overflow-hidden ink-panel py-24 sm:py-28">
			<span
				aria-hidden
				className="pointer-events-none absolute -bottom-20 -right-8 select-none font-light leading-none tracking-tighter text-[18rem] sm:text-[24rem] text-surface/5 mdi mdi-drone"
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-primary/25 blur-[100px]"
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="flex flex-col items-center text-center">
						{section.tag && (
							<SectionTag dark>
								{section.tag}
							</SectionTag>
						)}
						<h2 className="mt-5 font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-5xl text-surface max-w-3xl">
							{section.headline}
						</h2>
						{section.description && (
							<p className="mt-5 text-base sm:text-lg text-surface/65 leading-relaxed max-w-2xl">
								{section.description}
							</p>
						)}
					</div>
				</FadeUp>

				{actions.length > 0 && (
					<FadeUp delay={0.12}>
						<div className="mt-12">
							{section.actionsLabel && (
								<p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">
									{section.actionsLabel}
								</p>
							)}

							<div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
								{actions.map((action, index) => (
									<Link
										key={index}
										href={action.href}
										className="group flex flex-col items-center gap-4 rounded-c bg-surface/[0.05] hairline-dark p-7 text-center transition-all duration-500 hover:-translate-y-1.5 hover:bg-surface/10 hover:border-primary-300/50"
									>
										{/* <motion.span
											animate={{ y: [0, -12, 0] }}
											transition={{
												duration: 3.5 + index * 0.7,
												repeat: Infinity,
												ease: "easeInOut",
												delay: index * 0.6,
											}}
											className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/15 text-primary-200 transition-colors duration-300 group-hover:bg-primary group-hover:text-surface"
										>
											<span className={`mdi mdi-${action.icon || "arrow-right"} text-[2.5rem]`} />
										</motion.span> */}

                                        <span
											className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/15 text-surface transition-colors duration-300 group-hover:bg-primary group-hover:text-surface"
										>
											<span className={`mdi mdi-${action.icon || "arrow-right"} text-[2.5rem]`} />
										</span>
										<span className="text-base font-semibold tracking-tight text-surface leading-snug">
											{action.label}
										</span>
										{action.description && (
											<span className="text-sm text-surface/55 leading-relaxed">
												{action.description}
											</span>
										)}
										<span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium text-primary-200">
											<span className="mdi mdi-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
										</span>
									</Link>
								))}
							</div>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default AerialFinalCtaSection;