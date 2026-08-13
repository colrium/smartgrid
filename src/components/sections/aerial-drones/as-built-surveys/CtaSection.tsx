"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface CtaLink {
	label: string;
	href: string;
}

interface CtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: CtaLink | null;
	images?: string[];
}

export function CtaSection() {
	const { t } = useTranslation(["aerial-drones-as-built-surveys"]);
	const section = t("aerial-drones-as-built-surveys:ctaSection", {
		returnObjects: true,
	}) as unknown as CtaContent;
	const images = Array.isArray(section.images) ? section.images : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-ink">
			<span className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-300/30 blur-[90px] pointer-events-none" />
			<span className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-[90px] pointer-events-none" />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				{images.length > 0 && (
					<FadeUp>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-14 sm:mb-16">
							{images.map((src, index) => (
								<div key={index} className="relative h-52 sm:h-60 rounded-[20px] overflow-hidden">
									<Image
										src={src}
										alt=""
										fill
										sizes="(min-width: 640px) 33vw, 100vw"
										className="object-cover object-center transition-transform duration-700 hover:scale-105"
									/>
								</div>
							))}
						</div>
					</FadeUp>
				)}

				<FadeUp>
					<div className="flex flex-col items-center gap-6 text-center">
						{section.tag && (
							<SectionTag className="inline-flex items-center gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">
								{section.tag}
							</SectionTag>
						)}

						<h2 className="font-light tracking-tight leading-[1.08] text-3xl sm:text-5xl lg:text-[3.4rem] text-white max-w-3xl">
							{section.headline}
						</h2>

						{section.description && (
							<p className="text-base sm:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto">
								{section.description}
							</p>
						)}

						{section.ctaPrimary?.href && (
							<div className="mt-4">
								<Link
									href={section.ctaPrimary.href}
									className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
								>
									<span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
									{section.ctaPrimary.label}
									<span className="mdi mdi-arrow-right text-xl text-ink transition-transform duration-300 group-hover:translate-x-1" />
								</Link>
							</div>
						)}
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default CtaSection;