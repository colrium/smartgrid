"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import NextHead from "next/head";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import {
	FaqSectionItems,
	buildFaqSchema,
	type FaqSectionItem,
} from "@/components/sections/FaqSectionItems";

interface FaqCta {
	headline?: string;
	description?: string;
	label?: string;
	href?: string;
}

interface FaqsContent {
	tag?: string | null;
	headline: string;
	items: FaqSectionItem[];
	cta?: FaqCta | null;
}

export function GprFaqSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const section = t("surveying/ground-penetrating-radar:faqs", {
		returnObjects: true,
	}) as unknown as FaqsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section id="faqs" className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden bg-surface">
			<NextHead>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(items)) }}
				/>
			</NextHead>
			<div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<FaqSectionItems items={items} className="mt-12" />

				{section.cta?.href && (
					<FadeUp delay={0.1}>
						<div className="mt-14 relative rounded-c ink-panel card-shadow overflow-hidden px-8 py-12 sm:px-12 text-center">
							<span className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-300/30 blur-[90px] pointer-events-none" />
							<span className="absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-primary/30 blur-[90px] pointer-events-none" />

							<div className="relative flex flex-col items-center gap-4">
								<h3 className="font-light tracking-tight text-2xl sm:text-3xl text-white">
									{section.cta.headline}
								</h3>

								{section.cta.description && (
									<p className="text-sm text-white/65 leading-relaxed max-w-md">
										{section.cta.description}
									</p>
								)}

								<Link
									href={section.cta.href}
									className="mt-2 inline-flex items-center gap-2.5 h-12 rounded-full bg-surface px-8 text-ink text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
								>
									{section.cta.label}
									<span className="mdi mdi-arrow-right text-lg" />
								</Link>
							</div>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default GprFaqSection;
