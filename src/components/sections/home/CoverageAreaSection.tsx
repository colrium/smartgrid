"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "../shared/SectionHeader";
import { FadeUp } from "@/components/animations/Fade";
import { CountUp } from "@/components/animations/ScrollReveal";
import DeferredMount from "@/components/ui/DeferredMount";
import dynamic from "next/dynamic";

const ProjectsGlobe = dynamic(() => import("@/components/ui/ProjectsGlobe"), {
	ssr: false,
	loading: () => (
		<div className="text-center flex items-center text-primary justify-center w-80 h-80 md:w-100 md:h-100 lg:w-130 lg:h-130">
			<div role="status" aria-label="Loading coverage map">
				<svg
					className="h-5 w-5 animate-spin"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			</div>
		</div>
	),
});

interface CoverageStat {
	icon: string;
	value: number;
	suffix: string;
	label: string;
}

interface CoverageGroup {
	icon: string;
	label: string;
	description: string;
	items: string[];
}

interface CoverageAreaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	hqPin?: string;
	stats?: CoverageStat[];
	groups?: CoverageGroup[];
	note?: string;
}

export function CoverageAreaSection(): ReactElement | null {
	const { t } = useTranslation(["home"]);
	const content = t("home:coverageArea", {
		returnObjects: true,
	}) as unknown as CoverageAreaContent;

	const groups = Array.isArray(content?.groups) ? content.groups : [];
	const stats = Array.isArray(content?.stats) ? content.stats : [];

	if (groups.length === 0) return null;

	return (
		<section id="coverage-area" className="py-24 sm:py-28 relative overflow-hidden ">
			{/* SmartGrid survey-grid motif - a subtle wink at the name */}
			{/* <span
				aria-hidden
				className="absolute inset-0 pointer-events-none"
				style={{
					backgroundImage:
						"linear-gradient(rgba(1, 55, 61, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(1, 55, 61, 0.05) 1px, transparent 1px)",
					backgroundSize: "44px 44px",
					WebkitMaskImage:
						"radial-gradient(ellipse 85% 75% at 50% 35%, black 25%, transparent 78%)",
					maskImage:
						"radial-gradient(ellipse 85% 75% at 50% 35%, black 25%, transparent 78%)",
				}}
			/> */}
			

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader
						tag={(content.tag || undefined) as string | undefined}
						headline={content.headline}
						description={(content.description || undefined) as string | undefined}
						align="center"
					/>
				</FadeUp>
				<div className="pale-panel mt-8 hairline card-shadow p-6 rounded-c">
					<div className="w-full block relative ">
						<div className="mx-auto w-100 aspect-square">
							{/* react-globe.gl pulls a second three.js copy — keep it
							    out of the tree (and its chunk unfetched) until the
							    section is near the viewport. */}
							<DeferredMount
								fallback={
									<div className="flex h-full w-full items-center justify-center">
										<div role="status" aria-label="Loading coverage map">
											<svg
												className="h-5 w-5 animate-spin text-primary"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
										</div>
									</div>
								}
							>
								<ProjectsGlobe globeImageUrl="/img/earth/earth-light.jpg" />
							</DeferredMount>
						</div>
					</div>

					{/* Pulsing HQ pin */}
					{content.hqPin && (
						<FadeUp delay={0.1} className="-mt-2 ">
							<div className="flex justify-center">
								<div className="inline-flex items-center gap-3 rounded-full  px-6 py-3">
									<span className="relative flex h-3 w-3">
										<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
										<span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
									</span>
									<span className="text-sm font-medium text-ink">
										{content.hqPin}
									</span>
								</div>
							</div>
						</FadeUp>
					)}

					{/* Operational scale stats */}
					{stats.length > 0 && (
						<div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
							{stats.map((stat, index) => (
								<FadeUp key={stat.label} delay={0.08 * index}>
									<div className="flex items-center gap-4 rounded-cmd px-6 py-5">
										<span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full  text-primary">
											<span className={`mdi mdi-${stat.icon} text-3xl`} />
										</span>
										<div className="flex flex-col">
											<span className="flex items-baseline gap-1">
												<span className="text-3xl font-light text-ink tabular-nums leading-none">
													<CountUp to={stat.value} duration={1.6} />
												</span>
												<span className="text-xl font-light text-primary leading-none">
													{stat.suffix}
												</span>
											</span>
											<span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface/50">
												{stat.label}
											</span>
										</div>
									</div>
								</FadeUp>
							))}
						</div>
					)}
				</div>

				{/* Location groups */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
					{groups.map((group, index) => (
						<FadeUp key={group.label} delay={0.08 * index} className="h-full">
							<article className="group h-full flex flex-col gap-4 rounded-c bg-surface hairline card-shadow p-7 transition-[box-shadow,border-color,transform] duration-250 hover:card-shadow-lift hover:border-primary hover:-translate-y-1">
								<span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
									<span className={`mdi mdi-${group.icon} text-2xl`} />
								</span>
								<div>
									<h3 className="text-lg font-medium tracking-tight text-ink leading-snug">
										{group.label}
									</h3>
									<p className="mt-1.5 text-sm text-on-surface/60 leading-relaxed">
										{group.description}
									</p>
								</div>
								<ul className="mt-auto flex flex-wrap gap-2 pt-2">
									{Array.isArray(group.items) &&
										group.items.map((location) => (
											<li
												key={location}
												className="inline-flex items-center gap-1.5 rounded-full hairline bg-surface px-3.5 py-1.5 text-xs font-medium text-ink/75 transition-colors duration-300 group-hover:border-primary/40"
											>
												<span className="mdi mdi-map-marker text-primary text-sm" />
												{location}
											</li>
										))}
								</ul>
							</article>
						</FadeUp>
					))}
				</div>

				{content.note && (
					<FadeUp delay={0.15}>
						<p className="mt-12 flex items-center justify-center gap-3 text-center text-sm text-on-surface/55">
							<span className="mdi mdi-radar text-lg text-primary" aria-hidden />
							{content.note}
						</p>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default CoverageAreaSection;