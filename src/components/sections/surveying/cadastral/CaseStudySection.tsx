"use client";

import type { ReactElement } from "react";
import Image from "next/image";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/shared/decor";

interface CaseImage {
	src: string;
	alt?: string;
}

interface MethodStep {
	title: string;
	points?: string[] | null;
}

interface ImpactItem {
	icon?: string | null;
	text: string;
}

interface TechRow {
	component: string;
	specification: string;
}

export interface CadastralCaseStudyData {
	tag?: string | null;
	headline: string;
	subtitle?: string | null;
	overview?: {
		label: string;
		paragraphs?: string[] | null;
		criticalTitle?: string | null;
		critical?: string[] | null;
		deployNote?: string | null;
		deployIcon?: string | null;
	} | null;
	challenge?: {
		label: string;
		intro?: string | null;
		items?: string[] | null;
		images?: CaseImage[] | null;
	} | null;
	methodology?: {
		label: string;
		intro?: string | null;
		steps?: MethodStep[] | null;
		images?: CaseImage[] | null;
	} | null;
	outcome?: {
		label: string;
		intro?: string | null;
		deliverablesTitle?: string | null;
		deliverables?: string[] | null;
	} | null;
	impact?: {
		label: string;
		items?: ImpactItem[] | null;
	} | null;
	techSummary?: {
		label: string;
		componentHeader?: string | null;
		specHeader?: string | null;
		rows?: TechRow[] | null;
	} | null;
	engineeringNote?: {
		label: string;
		text: string;
	} | null;
}

function BlockLabel({ label }: { label: string }): ReactElement {
	return (
		<div className="flex items-center gap-4">
			<span className="inline-flex h-8 shrink-0 items-center rounded-full bg-primary-50 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
				{label}
			</span>
			<span aria-hidden className="h-px flex-1 bg-ink/10" />
		</div>
	);
}

function CaseFigure({
	image,
	className = "aspect-[4/3]",
	sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
	image: CaseImage;
	className?: string;
	sizes?: string;
}): ReactElement {
	return (
		<figure
			className={`group relative overflow-hidden rounded-[16px] bg-slate-900 hairline card-shadow ${className}`}
		>
			<Image
				src={image.src}
				alt={image.alt || ""}
				fill
				sizes={sizes}
				className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
			/>
		</figure>
	);
}

export function CaseStudySection({ data, id }: { data?: CadastralCaseStudyData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `cadastralCaseStudy`
	// unique section); legacy locale strings otherwise. Positional spans
	// (first challenge image, wide last method step) stay in the renderer.
	const section = (data ??
		(t("surveying/cadastral-surveys:caseStudy", {
			returnObjects: true,
		}) as unknown as CadastralCaseStudyData)) as CadastralCaseStudyData;

	if (!section?.headline) return <></>;

	const overview = section.overview;
	const challenge = section.challenge;
	const methodology = section.methodology;
	const outcome = section.outcome;
	const impact = section.impact;
	const techSummary = section.techSummary;
	const engineeringNote = section.engineeringNote;

	return (
		<section id={id} className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/50 -top-32 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="flex flex-col items-start gap-4 max-w-3xl">
						{section.tag && (
							<SectionTag>
								{section.tag}
							</SectionTag>
						)}
						<h2 className="font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-[2.85rem] text-ink">
							{section.headline}
						</h2>
						{section.subtitle && (
							<p className="text-base sm:text-lg font-medium text-accent-600 leading-relaxed">
								{section.subtitle}
							</p>
						)}
					</div>
				</FadeUp>

				<div className="mt-16 sm:mt-20 space-y-16 sm:space-y-20">
					{overview && (
						<FadeUp>
							<BlockLabel label={overview.label} />
							<div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
								<div className="lg:col-span-7 flex flex-col gap-5">
									{(overview.paragraphs ?? []).map((paragraph, index) => (
										<p
											key={index}
											className="text-base sm:text-lg leading-relaxed text-on-surface/70"
										>
											{paragraph}
										</p>
									))}
									{overview.deployNote && (
										<div className="mt-2 flex items-start gap-4 rounded-2xl bg-primary-50/70 hairline p-6">
											<span
												className={`mdi mdi-${overview.deployIcon || "satellite-variant"} text-2xl text-primary shrink-0`}
											/>
											<p className="text-sm sm:text-base text-ink/80 leading-relaxed">
												{overview.deployNote}
											</p>
										</div>
									)}
								</div>

								{(overview.critical ?? []).length > 0 && (
									<div className="lg:col-span-5">
										<div className="h-full rounded-c bg-paper hairline card-shadow p-7">
											{overview.criticalTitle && (
												<p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">
													{overview.criticalTitle}
												</p>
											)}
											<ul className="mt-5 grid gap-4">
												{(overview.critical ?? []).map((item, index) => (
													<li
														key={index}
														className="flex items-start gap-3 text-sm text-ink/80 leading-snug"
													>
														<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-surface">
															<span className="mdi mdi-check text-xs" />
														</span>
														{item}
													</li>
												))}
											</ul>
										</div>
									</div>
								)}
							</div>
						</FadeUp>
					)}

					{challenge && (
						<FadeUp>
							<BlockLabel label={challenge.label} />
							<div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
								<div className="lg:col-span-5">
									{challenge.intro && (
										<p className="text-sm font-semibold text-ink/70">{challenge.intro}</p>
									)}
									<ul className="mt-5 space-y-3">
										{(challenge.items ?? []).map((item, index) => (
											<li
												key={index}
												className="flex items-center gap-3 rounded-xl bg-accent-50 p-4 text-sm text-ink/80 leading-snug"
											>
												<span className="mdi mdi-alert-circle text-base text-accent-400 shrink-0 mt-0.5" />
												{item}
											</li>
										))}
									</ul>
								</div>

								{(challenge.images ?? []).length > 0 && (
									<div className="lg:col-span-7">
										<div className="grid grid-cols-2 gap-4">
											{(challenge.images ?? []).map((image, index) => (
												<CaseFigure
													key={index}
													image={image}
													className={index === 0 ? "col-span-2 aspect-4/3" : "aspect-square"}
													sizes="(min-width: 1024px) 55vw, 100vw"
												/>
											))}
										</div>
									</div>
								)}
							</div>
						</FadeUp>
					)}

					{methodology && (
						<FadeUp>
							<BlockLabel label={methodology.label} />
							{methodology.intro && (
								<p className="mt-6 text-base sm:text-lg leading-relaxed text-on-surface/70 max-w-3xl">
									{methodology.intro}
								</p>
							)}
							{(methodology.steps ?? []).length > 0 && (
								<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
									{(methodology.steps ?? []).map((step, index) => {
										const points = step.points ?? [];
										const isWide = index === (methodology.steps as MethodStep[]).length - 1;

										return (
											<article
												key={index}
												className={`rounded-c bg-paper hairline card-shadow p-7 transition-all duration-250 hover:card-shadow-lift ${
													isWide ? "sm:col-span-2" : ""
												}`}
											>
												<div className="flex items-center gap-4">
													<span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-surface text-sm font-semibold tabular-nums">
														{index + 1}
													</span>
													<h3 className="text-base sm:text-lg font-semibold tracking-tight text-ink leading-snug">
														{step.title}
													</h3>
												</div>
												{points.length > 0 && (
													<ul
														className={`mt-5 grid gap-2.5 ${isWide ? "sm:grid-cols-3" : ""}`}
													>
														{points.map((point, pointIndex) => (
															<li
																key={pointIndex}
																className="flex items-start gap-2 text-sm text-on-surface/65 leading-snug"
															>
																<span className="mdi mdi-chevron-right text-primary text-base shrink-0 mt-0.5" />
																{point}
															</li>
														))}
													</ul>
												)}
											</article>
										);
									})}
								</div>
							)}
							{(methodology.images ?? []).length > 0 && (
								<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
									{(methodology.images ?? []).map((image, index) => (
										<CaseFigure
											key={index}
											image={image}
											className="aspect-[16/9]"
											sizes="(min-width: 640px) 50vw, 100vw"
										/>
									))}
								</div>
							)}
						</FadeUp>
					)}

					{outcome && (
						<FadeUp>
							<BlockLabel label={outcome.label} />
							<div className="mt-8 rounded-c bg-primary-50/60 hairline card-shadow p-7 sm:p-9">
								{outcome.intro && (
									<p className="text-base sm:text-lg text-ink/80 leading-relaxed max-w-3xl">
										{outcome.intro}
									</p>
								)}
								{(outcome.deliverables ?? []).length > 0 && (
									<>
										{outcome.deliverablesTitle && (
											<p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
												{outcome.deliverablesTitle}
											</p>
										)}
										<ul className="mt-4 grid sm:grid-cols-2 gap-3.5">
											{(outcome.deliverables ?? []).map((item, index) => (
												<li
													key={index}
													className="flex items-start gap-3 rounded-xl bg-surface/80 p-4 text-sm text-ink/80 leading-snug card-shadow"
												>
													<span className="mdi mdi-check-circle text-primary text-lg shrink-0 mt-0.5" />
													{item}
												</li>
											))}
										</ul>
									</>
								)}
							</div>
						</FadeUp>
					)}

					{impact && (
						<FadeUp>
							<BlockLabel label={impact.label} />
							<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{(impact.items ?? []).map((item, index) => (
									<article
										key={index}
										className="flex items-start gap-3.5 rounded-2xl bg-paper hairline card-shadow p-5 transition-all duration-250 hover:card-shadow-lift"
									>
										<span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
											<span className={`mdi mdi-${item.icon || "check-circle"} text-lg`} />
										</span>
										<p className="text-sm text-ink/80 leading-snug">{item.text}</p>
									</article>
								))}
							</div>
						</FadeUp>
					)}

					{techSummary && (techSummary.rows ?? []).length > 0 && (
						<FadeUp>
							<BlockLabel label={techSummary.label} />
							<div className="mt-8 overflow-x-auto rounded-c hairline card-shadow bg-paper">
								<table className="w-full min-w-[34rem] border-collapse text-left">
									<thead>
										<tr className="bg-ink text-surface">
											<th scope="col" className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em]">
												{techSummary.componentHeader || "Component"}
											</th>
											<th scope="col" className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em]">
												{techSummary.specHeader || "Specification"}
											</th>
										</tr>
									</thead>
									<tbody>
										{(techSummary.rows ?? []).map((row, index) => (
											<tr
												key={index}
												className="border-t border-ink/10 transition-colors duration-300 hover:bg-primary-50/40"
											>
												<td className="px-6 py-4 text-sm font-semibold text-ink">{row.component}</td>
												<td className="px-6 py-4 text-sm text-on-surface/70">{row.specification}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</FadeUp>
					)}

					{engineeringNote && (
						<FadeUp>
							<div className="group/band relative overflow-hidden rounded-c pale-panel card-shadow p-8 sm:p-10 shimmer-t shimmer-gold-200">
								<span
									aria-hidden
									className="mdi mdi-format-quote-close absolute -right-4 -top-8 text-[12rem] leading-none text-primary-100 select-none pointer-events-none"
								/>
								{engineeringNote.label && (
									<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-500">
										{engineeringNote.label}
									</p>
								)}
								<p className="relative mt-4 text-base sm:text-lg leading-relaxed text-ink-soft">
									{engineeringNote.text}
								</p>
							</div>
						</FadeUp>
					)}
				</div>
			</div>
		</section>
	);
}

export default CaseStudySection;