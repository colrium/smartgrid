"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface SpecSubsection {
	title: string;
	list: string[];
}

interface SpecGroup {
	tag?: string | null;
	headline: string;
	list: string[];
	subsection?: SpecSubsection | null;
}

interface SpecsHeading {
	tag?: string | null;
	headline: string;
	description?: string;
}

interface ProductSpecsSectionProps {
	namespace: string;
	groupKeys: string[];
}

export function ProductSpecsSection({ namespace, groupKeys }: ProductSpecsSectionProps) {
	const { t } = useTranslation([namespace]);
	const heading = t(`${namespace}:specs`, {
		returnObjects: true,
	}) as unknown as SpecsHeading;

	const groups = groupKeys
		.map((key) =>
			t(`${namespace}:${key}`, { returnObjects: true }),
		)
		.filter((group): group is SpecGroup => Boolean(group) && typeof group === "object");

	const [active, setActive] = useState(0);
	const current = groups[active] ?? groups[0];

	if (groups.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={heading.tag || undefined}
					headline={heading.headline}
					description={heading.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-[0.42fr_0.58fr] gap-6 items-start">
					<FadeUp className="lg:sticky lg:top-28">
						<div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0">
							{groups.map((group, index) => (
								<button
									key={group.headline}
									type="button"
									onClick={() => setActive(index)}
									className={`shrink-0 text-left flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-medium transition-all duration-300 cursor-pointer border ${
										index === active
											? "bg-primary border-primary text-surface card-shadow"
											: "bg-surface hairline border-transparent text-on-surface/70 hover:border-primary/40"
									}`}
								>
									<span
										className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs ${
											index === active ? "bg-surface text-primary" : "bg-primary-50 text-primary"
										}`}
									>
										{String(index + 1).padStart(2, "0")}
									</span>
									{group.headline}
								</button>
							))}
						</div>
					</FadeUp>

					<FadeUp delay={0.05}>
						{current && (
							<article className="rounded-[20px] bg-surface hairline card-shadow p-7 sm:p-10">
								<div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-6">
									<h3 className="text-xl sm:text-2xl tracking-tight text-ink">
										{current.headline}
									</h3>
									<span className="mdi mdi-format-list-bulleted text-2xl text-primary" />
								</div>

								<ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
									{(Array.isArray(current.list) ? current.list : []).map((point, i) => (
										<li
											key={i}
											className="flex items-start gap-3 text-sm text-on-surface/70 leading-relaxed"
										>
											<span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary-50 text-primary flex items-center justify-center">
												<span className="mdi mdi-check text-xs" />
											</span>
											{point}
										</li>
									))}
								</ul>

								{current.subsection && (
									<div className="mt-8 border-t border-ink/10 pt-6">
										<h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
											{current.subsection.title}
										</h4>
										<ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
											{(Array.isArray(current.subsection.list)
												? current.subsection.list
												: []
											).map((point, i) => (
												<li
													key={i}
													className="flex items-start gap-3 text-sm text-on-surface/70 leading-relaxed"
												>
													<span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
														<span className="mdi mdi-check text-xs" />
													</span>
													{point}
												</li>
											))}
										</ul>
									</div>
								)}
							</article>
						)}
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default ProductSpecsSection;