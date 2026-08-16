import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
		<Box>
			{items.map((item, i) => {
				if (item.excludeOnMainNav) return null;

				if (Array.isArray(item.links) && item.links.length > 0) {
					return (
						<Accordion
							key={`mobile-submenu-${i}`}
							defaultExpanded={expanded}
							disableGutters
							square
							sx={{
								background: "transparent",
								boxShadow: "none",
								"&::before": { display: "none" },
							}}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon className="text-on-surface/55" />}
								sx={{
									minHeight: 40,
									px: 1.5,
									"&.MuiAccordionSummary-root": { minHeight: 40 },
									"&.Mui-expanded": { minHeight: 40, my: 0 },
									"& .MuiAccordionSummary-content": { my: 0.5 },
								}}
								className=" hover:bg-brand-50"
							>
								<Box
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
									className=" text-ink"
								>
									{item.href && (
										<MuiLink
											component={Link}
											href={localizePath(item.href, locale)}
											locale={false}
											onClick={onNavigate}
											color="inherit"
											underline="none"
											className="no-underline py-1 px-2 hover:text-primary rounded-md"
										>
											{item.label}
										</MuiLink>
									)}
									{!item.href && item.label}
								</Box>
							</AccordionSummary>
							<AccordionDetails sx={{ p: 0.5, pl: 1 }}>
								<Box sx={{ display: "flex", flexDirection: "column" }}>
									<NavMenuMobile
										items={item.links}
										locale={locale}
										localizePath={localizePath}
										onNavigate={onNavigate}
									/>
								</Box>
							</AccordionDetails>
						</Accordion>
					);
				}

				return (
					<MuiLink
						component={Link}
						key={`mobile-item-${i}`}
						href={localizePath(item.href, locale)}
						locale={false}
						onClick={onNavigate}
						color="inherit"
						underline="none"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							py: 1,
							px: 1.5,
							my: 0.5,
							borderRadius: 1,
							"&:hover": {
								backgroundColor: "rgba(0, 0, 0, 0.05)",
							},
						}}
						className=" text-ink hover:text-primary hover:bg-brand-50"
					>
						{item.label}
					</MuiLink>
				);
			})}
		</Box>
	);
}
