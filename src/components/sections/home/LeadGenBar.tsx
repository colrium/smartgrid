"use client";

import React from "react";
import { useTranslation } from "@/hooks";
import Button from "@mui/material/Button";
import Link from "next/link";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";
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



const LeadGenBar: React.FC<{ className?: string }> = ({ className }) => {
    
    const { t, i18n } = useTranslation(["home"]);
    const leadGenItems = t("home:leadGenBar.items", { returnObjects: true }) as unknown as LeadGenItem[];

    return (
		<FadeUp>
			<section className={`relative  ${className || ""}`}>
				<div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
				<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
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
								{t("home:leadGenBar.description")}
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
							{Array.isArray(leadGenItems) &&
								leadGenItems.map((item, index) => (
									<div
										key={index}
										className="glass rounded-xl gap-4 py-10 md:px-7 text-center md:text-left flex flex-col items-center h-full transition-all duration-500 "
										style={{ transitionDelay: `${index * 100}ms` }}
									>
										<span className="flex h-14 w-14 items-center justify-center  text-mute shadow-sm mb-6">
											<span className={`mdi mdi-${item.icon} text-7xl`} />
										</span>

										<h5 className="text-sm text-center font-semibold uppercase tracking-[0.18em] text-ink">
											{item.label}
										</h5>
										<p className="text-sm text-center text-on-surface/60 leading-relaxed flex-1">
											{item.description}
										</p>

										{item?.more?.href && (
											<Button
												component={Link}
												href={item.more.href}
												endIcon={<span className="mdi mdi-arrow-right" />}
												className="!normal-case text-accent! rounded-lg!"
											>
												{item.more.label}
											</Button>
										)}
										{item.action?.href && (
											<Button
												component={Link}
												href={item.action.href}
												variant="outlined"
												color="primary"
												className="!normal-case rounded-full!"
											>
												{item.action.label}
											</Button>
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