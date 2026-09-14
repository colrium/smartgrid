"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/shared/decor";
import { ReactElement } from "react";

interface LimitationItem {
	icon?: string | null;
	title: string;
	description?: string;
}

interface LimitationsContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: LimitationItem[] | null;
	note?: string | null;
	noteIcon?: string | null;
}

const FALLBACK_ICONS = ["earth", "grid-large", "water-outline", "arrow-down-bold"];

export function GprLimitationsSection(): ReactElement {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const section = t("surveying/ground-penetrating-radar:limitations", {
		returnObjects: true,
	}) as unknown as LimitationsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (!section?.headline && items.length === 0) return <></>;

	return (
		<section
			id="limitations"
			className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden bg-surface"
		>
			<Blob className="w-[26rem] h-[26rem] bg-primary-100/60 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				{items.length > 0 && (
					<div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
						{items.map((item, index) => (
							<FadeUp key={index} delay={(index % 4) * 0.07} className="h-full">
								<article className="group h-full flex flex-col gap-3.5 rounded-[16px] bg-paper hairline card-shadow p-6 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
									<span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span
											className={`mdi mdi-${item.icon || FALLBACK_ICONS[index % FALLBACK_ICONS.length]} text-xl`}
										/>
									</span>

									<h3 className="text-sm sm:text-[15px] font-semibold tracking-tight text-ink leading-snug">
										{item.title}
									</h3>

									{item.description && (
										<p className="text-[13px] text-on-surface/60 leading-relaxed">
											{item.description}
										</p>
									)}
								</article>
							</FadeUp>
						))}
					</div>
				)}

				{section.note && (
					<FadeUp delay={0.15}>
						<div className="mt-10 mx-auto flex max-w-2xl items-start justify-center gap-3 rounded-2xl pale-panel hairline card-shadow px-6 py-5 text-sm leading-relaxed text-ink/70">
							<span
								className={`mdi mdi-${section.noteIcon || "check-decagram"} mt-0.5 shrink-0 text-lg text-primary`}
							/>
							{section.note}
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default GprLimitationsSection;
