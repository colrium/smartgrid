"use client";

import Link from "next/link";
import { Accordion, AccordionDetails, AccordionSummary } from "@/components/ui/Accordion";

export interface NavBarLink {
	label: string;
	href: string;
	excludeOnMainNav?: boolean;
	links?: NavBarLink[];
}

interface Props {
	items: NavBarLink[];
	locale: string;
	localizePath: (path: string, locale: string) => string;
	onNavigate?: () => void;
	expanded?: boolean;
}

export default function NavMenuMobile({
	items,
	locale,
	localizePath,
	onNavigate,
	expanded = false,
}: Props) {
	return (
		<div>
			{items.map((item, i) => {
				if (item.excludeOnMainNav) return null;

				if (Array.isArray(item.links) && item.links.length > 0) {
					return (
						<Accordion
							key={`mobile-submenu-${i}`}
							defaultExpanded={expanded}
							square
							className="bg-transparent! shadow-none!"
						>
							<AccordionSummary
								expandIcon={
									<span
										className="mdi mdi-chevron-down text-xl text-on-surface/55"
										aria-hidden="true"
									/>
								}
								className="min-h-10 px-3 hover:bg-primary-50"
							>
								<span className="flex items-center gap-2 text-ink">
									{item.href && (
										<Link
											href={localizePath(item.href, locale)}
											locale={false}
											onClick={onNavigate}
											className="no-underline py-1 px-2 hover:text-primary rounded-md text-inherit"
										>
											{item.label}
										</Link>
									)}
									{!item.href && item.label}
								</span>
							</AccordionSummary>
							<AccordionDetails className="p-1 pl-2">
								<div className="flex flex-col">
									<NavMenuMobile
										items={item.links}
										locale={locale}
										localizePath={localizePath}
										onNavigate={onNavigate}
									/>
								</div>
							</AccordionDetails>
						</Accordion>
					);
				}

				return (
					<Link
						key={`mobile-item-${i}`}
						href={localizePath(item.href, locale)}
						locale={false}
						onClick={onNavigate}
						className="flex items-center gap-2 rounded-md py-2 px-3 my-1 text-ink no-underline transition-colors duration-200 hover:text-primary hover:bg-primary-50"
					>
						{item.label}
					</Link>
				);
			})}
		</div>
	);
}