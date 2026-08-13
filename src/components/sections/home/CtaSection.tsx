"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface CtaLink {
	label: string;
	href: string;
	icon?: string;
}

export function CtaSection() {
	const { t } = useTranslation(["home"]);
	const primary = t("home:cta.primary", { returnObjects: true }) as CtaLink;
	const secondary = t("home:cta.secondary", { returnObjects: true }) as CtaLink;

	return (
		<section id="cta" className="pb-24 sm:pb-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="relative rounded-[20px] ink-panel card-shadow overflow-hidden px-8 py-16 sm:px-12 sm:py-24 text-center">
						{/* authoritative glows + watermark */}
						<span className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-300/30 blur-[90px] pointer-events-none" />
						<span className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-[90px] pointer-events-none" />
						<span
							className="absolute -bottom-10 right-4 font-light tracking-tighter text-[11rem] leading-none text-white/[0.03] select-none pointer-events-none hidden sm:block"
							aria-hidden
						>
							↗
						</span>
						<span
							className="absolute inset-3 rounded-[15px] hairline-dark pointer-events-none"
							aria-hidden
						/>

						<div className="relative flex flex-col items-center gap-6">
							{/* kicker */}
							<span className="inline-flex items-center gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">
								<span className="inline-block h-px w-9 bg-brand-200/70" />
								{t("home:cta.tag") as string}
								<span className="inline-block h-px w-9 bg-brand-200/70" />
							</span>

							<h2 className="font-light tracking-tight leading-[1.08] text-3xl sm:text-5xl lg:text-[3.4rem] text-white max-w-3xl">
								{t("home:cta.headline") as string}
							</h2>

							<p className="text-base sm:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto">
								{t("home:cta.description") as string}
							</p>

							<div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
								{primary?.href && (
									<Link
										href={primary.href}
										className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
									>
										<span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
										{primary.label}
										{primary.icon && (
											<span
												className={`mdi mdi-${primary.icon} text-xl text-ink transition-transform duration-300 group-hover:translate-x-1`}
											/>
										)}
									</Link>
								)}
								{secondary?.href && (
									<Link
										href={secondary.href}
										className="inline-flex items-center gap-2.5 h-14 rounded-full border border-white/30 px-8 text-white text-base transition-all duration-300 hover:border-white hover:bg-surface/10"
									>
										{secondary.icon ? (
											<span
												className={`mdi mdi-${secondary.icon} text-lg text-brand-200`}
											/>
										) : (
											<span className="h-1.5 w-1.5 rounded-full bg-brand-200" />
										)}
										{secondary.label}
									</Link>
								)}
							</div>
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default CtaSection;