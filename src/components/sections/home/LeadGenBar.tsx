"use client";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "@/hooks";
import Button from "@mui/material/Button";
import Link from "next/link";
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
		<section className={`py-12  relative z-20 my-12  overflow-hidden ${className || ""}`}>
			<div className="max-w-7xl mx-auto px-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
					{Array.isArray(leadGenItems) && leadGenItems.map((item, index) => (
						<div
							key={index}
							className="bg-primary text-surface shadow-2xl rounded-4xl gap-4 py-8 md:px-6  text-center md:text-left flex flex-col items-center h-full"
							style={{ transitionDelay: `${index * 100}ms` }}
						>
							<span className={`mdi mdi-${item.icon} text-3xl sm:text-7xl mb-6`} />

							<h6 className="text-lg text-center  uppercase tracking-wider ">
								{item.label}
							</h6>
							<p className="text-sm text-center flex-1">{item.description}</p>
							{item?.more?.href && (
								<Button component={Link} href={item.more.href} color="inherit">
									{item.more.label}
								</Button>
							)}
							{item.action?.href && (
								<Button
									component={Link}
									href={item.action.href}
									variant="outlined"
									color="inherit"
								>
									{item.action.label}
								</Button>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
export default LeadGenBar;