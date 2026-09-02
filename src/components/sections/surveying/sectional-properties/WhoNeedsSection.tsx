"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface WhoNeedsItem {
	icon?: string | null;
	title?: string;
	description?: string;
	href?: string;
}

interface WhoNeedsContent {
	tag?: string | null;
	headline?: string;
	description?: string;
	linkLabel?: string;
	items?: WhoNeedsItem[];
}

export function WhoNeedsSection(): ReactElement {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const section = t("surveying/sectional-properties:whoNeeds", {
		returnObjects: true,
	}) as unknown as WhoNeedsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section className="ink-panel py-24 sm:py-28 relative overflow-hidden">
			<Blob
				className="w-[26rem] h-[26rem] bg-accent-400/10 -top-32 -right-32"
				opacity={0.3}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline ?? ""}
					description={section.description || undefined}
					tone="dark"
				/>

				<div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<Link
								href={item.href ?? "/contact"}
								className="group flex h-full flex-col rounded-[18px] border border-surface/10 bg-surface/5 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/40 hover:bg-surface/[0.08]"
							>
								<span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary-400/25 bg-primary-400/10 text-primary-200 transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
									<span
										className={`mdi mdi-${item.icon ?? "account-group"} text-xl`}
									/>
								</span>
								<h3 className="mt-5 text-lg font-medium tracking-tight text-surface leading-snug">
									{item.title}
								</h3>
								<p className="mt-2.5 text-sm leading-relaxed text-surface/60">
									{item.description}
								</p>
								{section.linkLabel && (
									<span className="mt-auto pt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-200">
										{section.linkLabel}
										<span className="mdi mdi-arrow-right text-sm transition-transform duration-300 group-hover:translate-x-1" />
									</span>
								)}
							</Link>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default WhoNeedsSection;