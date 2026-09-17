import React, { useCallback, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/Button";
import { Menu } from "@/components/ui/Menu";
import { MenuItem } from "@/components/ui/MenuItem";

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
	const closeTimer = useRef<number | null>(null);

	const handleOpen = (index: number, el: HTMLElement | null, replace: boolean = false) => {
		setAnchorMap((s) => (replace? { [index]: el } : { ...s, [index]: el }));
		setOpenMenuIndex(index);
	};

	const cancelClose = useCallback(() => {
		if (closeTimer.current !== null) {
			window.clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
	}, []);

	const handleClose = useCallback(
		(index?: number) => {
			cancelClose();
			if (typeof index === "number") {
				setAnchorMap((s) => ({ ...s, [index]: null }));
			} else {
				setAnchorMap({});
			}
			setOpenMenuIndex(null);
		},
		[cancelClose],
	);

	// Small grace period before closing hover-opened submenus so the pointer
	// can travel across the gap between the item and the popup.
	const scheduleClose = (index: number) => {
		cancelClose();
		closeTimer.current = window.setTimeout(() => handleClose(index), 120);
	};

	useEffect(() => {
		const closeDropdown = () => handleClose();
		router.events.on("routeChangeStart", closeDropdown);

		return () => {
			router.events.off("routeChangeStart", closeDropdown);
		};
	}, [router.events, handleClose]);
    const isDark = variant === "dark";
	const menuClassName = isDark ? "bg-primary-700/95 text-surface" : "bg-surface/95";
    const menuItemClassName = isDark
		? "hover:bg-surface/10 focus-visible:bg-surface/10 text-surface"
		: "text-ink hover:bg-primary/10 focus-visible:bg-primary/10 ";
	if (horizontal) {
		return (
			<div className="hidden lg:flex flex-1 lg:grow lg:gap-4 lg:items-center lg:justify-end">
				{items.map((item, i) => {
					if (item.excludeOnMainNav) return null;

					if (Array.isArray(item.links) && item.links.length > 0) {
						const anchorEl = anchorMap[i] || null;

						return (
							<div
								key={`nav-${i}`}
								onMouseEnter={(e) => {
									cancelClose();
									handleOpen(i, e.currentTarget, true);
								}}
								onMouseLeave={() => scheduleClose(i)}
								onFocus={(e) => {
									cancelClose();
									handleOpen(i, e.currentTarget, true);
								}}
							>
								{item.href ? (
									<Link
										href={localizePath(item.href, locale)}
										locale={false}
										onClick={() => handleClose(i)}
										className={`mr-4 inline-flex cursor-pointer select-none items-center justify-center gap-1 px-1.25 py-1 text-sm no-underline! capitalize! relative transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:transition-all after:duration-300 rounded-md hover:after:w-full ${
											variant === "dark"
												? "text-surface hover:text-primary-100 after:bg-primary-100"
												: "text-ink hover:text-primary-500 after:bg-primary"
										}`}
									>
										{item.label}
										<span className="mdi mdi-chevron-down text-xl" aria-hidden="true" />
									</Link>
								) : (
									<Button
										onClick={(e) => {
											cancelClose();
											if (openMenuIndex === i) {
												handleClose(i);
											} else {
												handleOpen(i, e.currentTarget);
											}
										}}
										endIcon={
											<span className="mdi mdi-chevron-down text-xl" aria-hidden="true" />
										}
										color="inherit"
										size="small"
										variant="text"
										className={`text-sm! mr-4 no-underline! capitalize!  relative transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:transition-all after:duration-300 rounded-md hover:after:w-full ${
											variant === "dark"
												? "text-surface hover:text-primary-300 after:bg-primary-300"
												: "text-ink hover:text-primary-500 after:bg-primary"
										}`}
										data-ripple-dark="true"
									>
										{item.label}
									</Button>
								)}

								<Menu
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={() => handleClose(i)}
									onMouseEnter={cancelClose}
									onMouseLeave={() => scheduleClose(i)}
									anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
									transformOrigin={{ vertical: "top", horizontal: "center" }}
									className={`rounded-lg border transition-[top] duration-500 ${menuClassName} backdrop-blur-lg card-shadow p-2 ${
										variant === "dark" ? "border-white/10" : "border-ink/10"
									}`}
									style={{ marginTop: 10, minWidth: 260 }}
								>
									<NavMenu
										items={item.links}
										locale={locale}
										localizePath={localizePath}
										variant={variant}
									/>
								</Menu>
							</div>
						);
					}

					return (
						<Link
							href={localizePath(item.href, locale)}
							locale={false}
							key={`nav-${i}`}
							className={`mr-4 inline-flex cursor-pointer select-none items-center justify-center px-[5px] py-1 text-sm no-underline! capitalize!  relative transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full ${
								variant === "dark"
									? "text-surface hover:text-primary-300 after:bg-primary-300"
									: "text-on-surface hover:text-primary-500 after:bg-primary"
							}`}
						>
							{item.label}
						</Link>
					);
				})}
			</div>
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
						<div key={`submenu-${i}`} className="relative">
							<MenuItem
								onMouseEnter={(e) => {
									cancelClose();
									handleOpen(i, e.currentTarget);
								}}
								onMouseLeave={() => scheduleClose(i)}
								className={`text-sm  tracking-tight hover:text-primary hover:bg-surface/10 focus-visible:bg-surface/10 ${menuItemClassName}`}
							>
								<span className="flex items-center gap-2">
									{item.href && (
										<Link
											href={localizePath(item.href, locale)}
											locale={false}
											onClick={() => handleClose()}
											className="no-underline py-1 px-2  rounded-md text-inherit"
										>
											{item.label}
										</Link>
									)}
									{!item.href && item.label}
								</span>

								<span
									className="mdi mdi-chevron-right text-xl text-inherit"
									aria-hidden="true"
								/>
							</MenuItem>

							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={() => handleClose(i)}
								anchorOrigin={{ vertical: "top", horizontal: "right" }}
								transformOrigin={{ vertical: "top", horizontal: "left" }}
								onMouseEnter={cancelClose}
								onMouseLeave={() => scheduleClose(i)}
								className="rounded-lg border border-ink/10 bg-surface/95! backdrop-blur-md! card-shadow p-2"
								style={{ marginLeft: 8, minWidth: 220 }}
							>
								<NavMenu
									items={item.links}
									locale={locale}
									localizePath={localizePath}
									variant={variant}
								/>
							</Menu>
						</div>
					);
				}

				return (
					<MenuItem
						key={`item-${i}`}
						href={localizePath(item.href, locale)}
						onClick={() => handleClose()}
						className={`text-sm ${menuItemClassName}`}
					>
						{item.label}
					</MenuItem>
				);
			})}
		</>
	);
}
