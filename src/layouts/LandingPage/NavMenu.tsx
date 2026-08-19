import React, { useState, useEffect } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/router";

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
	horizontal?: boolean; // top-level horizontal rendering
	variant?: "light" | "dark"; // top-level (horizontal) color variant
}

export default function NavMenu({
	items,
	locale,
	localizePath,
	horizontal = false,
	variant = "light",
}: Props) {
	const router = useRouter();
	const [anchorMap, setAnchorMap] = useState<Record<number, HTMLElement | null>>({});
	const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

	const handleOpen = (index: number, el: HTMLElement | null) => {
		setAnchorMap((s) => ({ ...s, [index]: el }));
		setOpenMenuIndex(index);
	};

	const handleClose = (index?: number) => {
		if (typeof index === "number") {
			setAnchorMap((s) => ({ ...s, [index]: null }));
		} else {
			setAnchorMap({});
			setOpenMenuIndex(null);
		}
		setOpenMenuIndex(null);
	};
	useEffect(() => {
		const closeDropdown = () => {};
		router.events.on("routeChangeStart", handleClose);

		return () => {
			router.events.off("routeChangeStart", handleClose);
		};
	}, []);
	const menuClassName =
		variant === "dark" ? "bg-ink-soft/95! text-surface!" : "bg-surface/95! text-ink!";
	if (horizontal) {
		return (
			<Box className="hidden lg:flex flex-1 lg:grow lg:gap-4 lg:items-center lg:justify-end">
				{items.map((item, i) => {
					if (item.excludeOnMainNav) return null;

					if (Array.isArray(item.links) && item.links.length > 0) {
						const anchorEl = anchorMap[i] || null;

						return (
							<Box key={`nav-${i}`}>
								<Button
									onClick={(e) => handleOpen(i, e.currentTarget)}
									endIcon={<KeyboardArrowDownIcon />}
									color="inherit"
									size="small"
									variant="text"
									className={`text-sm mr-4 no-underline! capitalize! font-medium tracking-tight relative transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full ${
										variant === "dark"
											? "text-surface hover:text-primary-300 after:bg-primary-300"
											: "text-ink hover:text-primary-500 after:bg-primary"
									}`}
								>
									{item.label}
								</Button>

								<Menu
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={() => handleClose(i)}
									anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
									transformOrigin={{ vertical: "top", horizontal: "center" }}
									slotProps={{
										paper: {
											className: `rounded-xl! hairline transition-all duration-500 ${menuClassName} backdrop-blur-lg! card-shadow `,
											style: { marginTop: 10 },
											sx: { minWidth: { xs: 220, sm: 260 } },
										},
									}}
								>
									<NavMenu
										items={item.links}
										locale={locale}
										localizePath={localizePath}
									/>
								</Menu>
							</Box>
						);
					}

					return (
						<Button
							component={Link}
							color="inherit"
							size="small"
							variant="text"
							disableElevation
							className={`text-sm mr-4 no-underline! capitalize! font-medium tracking-tight relative transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full ${
								variant === "dark"
									? "text-surface hover:text-primary-300 after:bg-primary-300"
									: "text-on-surface hover:text-primary-500 after:bg-primary"
							}`}
							href={localizePath(item.href, locale)}
							locale={false}
							key={`nav-${i}`}
						>
							{item.label}
						</Button>
					);
				})}
			</Box>
		);
	}

	// Vertical/menu mode
	return (
		<>
			{items.map((item, i) => {
				if (item.excludeOnMainNav) return null;

				if (Array.isArray(item.links) && item.links.length > 0) {
					const anchorEl = anchorMap[i] || null;

					return (
						<Box key={`submenu-${i}`}>
							<MenuItem
								onMouseEnter={(e) => handleOpen(i, e.currentTarget as HTMLElement)}
								onMouseLeave={() => handleClose(i)}
								sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
								className="text-sm font-medium tracking-tight text-ink hover:bg-primary-50"
							>
								<Box
									component="span"
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
								>
									{item.href && (
										<MuiLink
											component={Link}
											href={localizePath(item.href, locale)}
											locale={false}
											onClick={() => handleClose()}
											className="no-underline py-1 px-2 hover:text-primary rounded-md"
											color="inherit"
											underline="none"
										>
											{item.label}
										</MuiLink>
									)}
									{!item.href && item.label}
								</Box>

								<ChevronRightIcon fontSize="small" className="text-primary" />
							</MenuItem>

							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={() => handleClose(i)}
								anchorOrigin={{ vertical: "top", horizontal: "right" }}
								transformOrigin={{ vertical: "top", horizontal: "left" }}
								slotProps={{
									paper: {
										className:
											"rounded-xl hairline bg-surface/95! backdrop-blur-md! card-shadow",
										style: { marginLeft: 8 },
										sx: { minWidth: 220 },
									},
								}}
							>
								<NavMenu
									items={item.links}
									locale={locale}
									localizePath={localizePath}
								/>
							</Menu>
						</Box>
					);
				}

				return (
					<MenuItem
						key={`item-${i}`}
						onClick={() => handleClose()}
						className="text-sm font-medium tracking-tight text-ink hover:bg-primary-50"
						component={Link}
						href={localizePath(item.href, locale)}
					>
						{item.label}
					</MenuItem>
				);
			})}
		</>
	);
}
