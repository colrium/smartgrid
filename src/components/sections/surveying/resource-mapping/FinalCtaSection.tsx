"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface CtaButton {
	label: string;
	href: string;
	icon?: string;
}

interface FinalCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctas: CtaButton[];
}

export function FinalCtaSection(): ReactElement {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	const section = t("surveying/resource-mapping:finalCta", {
		returnObjects: true,
	}) as unknown as FinalCtaContent;
	const ctas = Array.isArray(section.ctas) ? section.ctas : [];

	if (ctas.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-ink">
			<Blob className="w-[32rem] h-[32rem] bg-primary-200/30 -top-24 -right-24" opacity={0.4} />
			<Blob className="w-[24rem] h-[24rem] bg-primary-300/20 -bottom-24 -left-24" opacity={0.3} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="max-w-3xl mx-auto text-center">
					<SectionHeader
						tag={section.tag || undefined}
						headline={section.headline}
						description={section.description || undefined}
						align="center"
					/>

					<div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
						{ctas.map((cta, index) => (
							<FadeUp key={index} delay={index * 0.08}>
								<Link
									href={cta.href}
									target={cta.href.startsWith("https://") || cta.href.startsWith("mailto:") ? "_blank" : undefined}
									rel={cta.href.startsWith("https://") ? "noopener noreferrer" : undefined}
									className={`group inline-flex items-center justify-center gap-2.5 h-14 rounded-full px-8 text-base font-medium transition-all duration-300 ${
										index === 0
											? "bg-surface text-ink hover:bg-surface/90 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(255,255,255,0.3)]"
											: "border-2 border-surface/30 bg-transparent text-surface hover:bg-surface/10 hover:border-primary"
									}`}
								>
									{cta.icon && (
										<span className={`mdi mdi-${cta.icon} text-xl transition-transform duration-300 group-hover:scale-110`} />
									)}
									{cta.label}
									{index === 0 && (
										<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
									)}
								</Link>
							</FadeUp>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default FinalCtaSection;