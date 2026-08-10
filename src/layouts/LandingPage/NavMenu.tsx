import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";

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
}

export default function NavMenu({ items, locale, localizePath, horizontal = false }: Props) {
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
							className={`text-sm mr-4 no-underline! font-medium tracking-tight text-ink hover:text-primary-500 relative transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full`}
						>
							{item.label}
						</Button>

						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={() => handleClose(i)}
							anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
							transformOrigin={{ vertical: "top", horizontal: "left" }}
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
            <MuiLink
              component={Link}
              color="textPrimary"
              className={`text-sm mr-4 no-underline! font-medium tracking-tight text-ink hover:text-primary-500 relative transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full`}
              href={localizePath(item.href, locale)}
              locale={false}
              key={`nav-${i}`}
            >
              {item.label}
            </MuiLink>
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
                                    className="no-underline py-1 px-2 hover:bg-primary-light"
                                    underline="none"
								>
									{item.label}
								</MuiLink>
							)}
							{!item.href && item.label}
						</Box>

						<ChevronRightIcon fontSize="small" />
					</MenuItem>

					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={() => handleClose(i)}
						anchorOrigin={{ vertical: "top", horizontal: "right" }}
						transformOrigin={{ vertical: "top", horizontal: "left" }}
					>
						<NavMenu items={item.links} locale={locale} localizePath={localizePath} />
					</Menu>
				</Box>
			);
		}

        return (
			<MenuItem key={`item-${i}`} onClick={() => handleClose()}>
				<MuiLink
					component={Link}
					href={localizePath(item.href, locale)}
					locale={false}
					className="no-underline"
					underline="none"
				>
					{item.label}
				</MuiLink>
			</MenuItem>
		);
      })}
    </>
  );
}
