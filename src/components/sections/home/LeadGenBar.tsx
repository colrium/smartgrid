"use client";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "@/hooks";
import Button from "@mui/material/Button";
import Link from "next/link";
import { SectionTag } from "@/components/SectionTag";
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
		<section className={`relative  ${className || ""}`}>
			<div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
			<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/30 rounded-full blur-2xl"></div>
			<div className={`py-20 relative z-20 my-12 bg-surface rounded-4xl overflow-hidden`}>
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex flex-col items-center gap-4">
						<SectionTag >
							{t("home:leadGenBar.tag")}
						</SectionTag>
						<h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight whitespace-pre-line max-w-3xl">
							{t("home:leadGenBar.headline")}
						</h2>
						<p className="text-md  text-center max-w-2xl font-normal leading-relaxed mb-10 sm:mb-20 whitespace-pre-line">
							{t("home:leadGenBar.description")}
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{Array.isArray(leadGenItems) &&
							leadGenItems.map((item, index) => (
								<div
									key={index}
									className="rounded-4xl gap-4 py-8 md:px-6  text-center md:text-left flex flex-col items-center h-full"
									style={{ transitionDelay: `${index * 100}ms` }}
								>
									<span
										className={`mdi mdi-${item.icon} text-3xl sm:text-7xl mb-6 text-mute`}
									/>

									<h5 className="text-xl text-center font-bold uppercase tracking-wider ">
										{item.label}
									</h5>
									<p className="text-base text-center flex-1">
										{item.description}
									</p>
									{item?.more?.href && (
										<Button
											component={Link}
											href={item.more.href}
											color="primary"
											className="rounded-full!"
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
											className="rounded-full!"
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
	);
};
export default LeadGenBar;