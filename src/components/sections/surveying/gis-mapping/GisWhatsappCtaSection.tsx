"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface WhatsAppCta {
	label?: string;
	href?: string;
	icon?: string | null;
}

interface WhatsappCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	note?: string | null;
	cta?: WhatsAppCta | null;
}

export function GisWhatsappCtaSection(): ReactElement {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const content = t("surveying/gis-mapping:whatsappCta", {
		returnObjects: true,
	}) as unknown as WhatsappCtaContent;

	if (!content?.headline) return <></>;

	return (
		<section className="pb-14 sm:pb-16 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="relative rounded-[20px] bg-surface hairline card-shadow overflow-hidden px-8 py-10 sm:px-12 sm:py-12">
						<span
							aria-hidden
							className="pointer-events-none absolute -right-10 -bottom-14 select-none text-[11rem] leading-none text-whatsapp/[0.07] mdi mdi-whatsapp"
						/>

						<div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
							<div className="flex items-start gap-5 flex-1 min-w-0">
								<span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-whatsapp/15 text-whatsapp">
									<span className="mdi mdi-whatsapp text-3xl" />
								</span>
								<div className="min-w-0">
									{content.tag && (
										<SectionTag className="mb-3">
											{content.tag}
										</SectionTag>
									)}
									<h2 className="font-light tracking-tight leading-[1.1] text-2xl sm:text-3xl text-ink">
										{content.headline}
									</h2>
									{content.description && (
										<p className="mt-3 text-sm sm:text-base text-on-surface/60 leading-relaxed max-w-xl">
											{content.description}
										</p>
									)}
									{content.note && (
										<p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-on-surface/45">
											<span className="mdi mdi-clock-outline text-sm text-primary" />
											{content.note}
										</p>
									)}
								</div>
							</div>

							{content.cta?.href && (
								<div className="shrink-0">
									<Link
										href={content.cta.href}
										target="_blank"
										rel="noopener noreferrer"
										className="group inline-flex items-center justify-center gap-3 h-14 rounded-full bg-whatsapp px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:bg-whatsapp/90 hover:shadow-[0_18px_42px_-10px_rgba(37,211,102,0.5)]"
									>
										<span className="mdi mdi-whatsapp text-2xl transition-transform duration-300 group-hover:scale-110" />
										{content.cta.label}
									</Link>
								</div>
							)}
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default GisWhatsappCtaSection;