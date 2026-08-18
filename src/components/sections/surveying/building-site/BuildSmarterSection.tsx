"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface SectionCta {
	label: string;
	href: string;
}

interface BuildSmarterContent {
	tag?: string | null;
	headline: string;
	subtitle?: string;
	description: string;
	ctaPrimary?: SectionCta | null;
}

export function BuildSmarterSection() {
	const { t } = useTranslation(["building-site-surveys"]);
	const section = t("building-site-surveys:section2", {
		returnObjects: true,
	}) as unknown as BuildSmarterContent;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[26rem] h-[26rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-6">
						<SectionHeader
							tag={section.tag}
							headline={section.headline}
							description={section.description}
						/>
					</FadeUp>

					<FadeUp delay={0.1} className="lg:col-span-6">
						<div className="relative rounded-[20px] ink-panel card-shadow overflow-hidden px-8 py-10 sm:px-10 sm:py-12">
							<span className="absolute -top-20 -right-16 w-60 h-60 rounded-full bg-primary-300/30 blur-[80px] pointer-events-none" />
							<span className="absolute -bottom-16 -left-12 w-52 h-52 rounded-full bg-primary/30 blur-[80px] pointer-events-none" />

							<div className="relative">
								{section.subtitle && (
									<p className="text-primary-200 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em]">
										{section.subtitle}
									</p>
								)}

								<div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
									{section.ctaPrimary?.href && (
										<Link
											href={section.ctaPrimary.href}
											className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
										>
											<span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
											{section.ctaPrimary.label}
											<span className="mdi mdi-email-outline text-xl" />
										</Link>
									)}
								</div>
							</div>
						</div>
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default BuildSmarterSection;