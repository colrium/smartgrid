"use client";

import React from "react";
import { useTranslation } from "@/hooks";
import Link from "next/link";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";
import { Trans } from "react-i18next";
interface LeadGenItemLink {
	href: string;
	label: string;
}
interface LeadGenItem {
	icon: string;
	label: string;
	description: string;
    more?: LeadGenItemLink;
    action?: LeadGenItemLink;
}

// Soft radial falloff used instead of an expensive CSS blur filter.
const GLOW_MASK =
	"radial-gradient(closest-side, black 30%, transparent 72%)";

const LeadGenBar: React.FC<{ className?: string }> = ({ className }) => {
    
    const { t, i18n } = useTranslation(["home"]);
    const leadGenItems = t("home:leadGenBar.items", { returnObjects: true }) as unknown as LeadGenItem[];

    return (
		<FadeUp >
			<section className={`relative  ${className || ""}`}>
				<div
					className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full pointer-events-none"
					style={{ WebkitMaskImage: GLOW_MASK, maskImage: GLOW_MASK }}
				/>
				<div
					className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full pointer-events-none"
					style={{ WebkitMaskImage: GLOW_MASK, maskImage: GLOW_MASK }}
				/>
				<div
					className={`py-14 sm:py-20 relative z-20 my-12 rounded-[20px] pale-panel-soft hairline card-shadow overflow-hidden`}
				>
					<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
						<div className="flex flex-col items-center gap-4">
							<SectionTag>{t("home:leadGenBar.tag")}</SectionTag>
							<h2 className="text-3xl sm:text-5xl font-light tracking-tight text-ink leading-tight whitespace-pre-line max-w-3xl">
								{t("home:leadGenBar.headline")}
							</h2>

							<p className="text-md text-center text-on-surface/60 max-w-2xl font-normal leading-relaxed mb-10 sm:mb-16 whitespace-pre-line">
								<Trans
									// @ts-expect-error
									i18nKey={["home:leadGenBar.description"]}
									defaults=""
									components={{
										accent: <span className="text-accent" />,
										primary: <span className="text-primary" />,
										bold: <b />,
									}}
								/>
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
							{Array.isArray(leadGenItems) &&
								leadGenItems.map((item, index) => (
									<div
										key={index}
										className="glass rounded-xl gap-4 py-10 md:px-7 text-center md:text-left flex flex-col items-center h-full"
									>
										<span className="flex h-14 w-14 items-center justify-center text-mute mb-6">
											<span className={`mdi mdi-${item.icon} text-7xl`} />
										</span>

										<h5 className="text-sm text-center font-semibold uppercase tracking-[0.18em] text-ink">
											{item.label}
										</h5>
										<p className="text-sm text-center text-on-surface/60 leading-relaxed flex-1">
											{item.description}
										</p>

										{item?.more?.href && (
											<Link
												href={item.more.href}
												className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent/10"
											>
												{item.more.label}
												<span className="mdi mdi-arrow-right text-lg" aria-hidden />
											</Link>
										)}
										{item.action?.href && (
											<Link
												href={item.action.href}
												className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-primary/50 px-4 py-2 text-sm font-medium text-primary transition-colors duration-300 hover:bg-primary/5"
											>
												{item.action.label}
											</Link>
										)}
									</div>
								))}
						</div>
					</div>
				</div>
			</section>
		</FadeUp>
	);
};
export default LeadGenBar;