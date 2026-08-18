import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "@/hooks";
import { useLenis } from "lenis/react";
import { useRouter } from "next/router";
import useSetState from "@/hooks/useSetState";
import { Avatar } from "@mui/material";
import NavMenu from "./NavMenu";
import NavMenuMobile from "./NavMenuMobile";

interface NavBarLink {
	label: string;
	href: string;
	excludeOnMainNav?: boolean;
	links?: NavBarLink[];
}

export interface NavbarProps {
	/** Base color variant of the navbar. Defaults to "light". */
	variant?: "light" | "dark";
	/**
	 * Optional scroll-triggered switch: once the window is scrolled past this
	 * percentage (0–100) of the page height, the navbar automatically uses the
	 * "dark" variant. Omit or pass 0 to disable the trigger.
	 */
	scrollVariantPercent?: number;
	scrollVariant?: "light" | "dark";
}

export default function Navbar({ variant = "light", scrollVariantPercent = 20, scrollVariant = "dark"}: NavbarProps) {
	const router = useRouter();
	const { t, i18n } = useTranslation(["common", "meta"]);
	const [state, setState] = useSetState({
		drawerOpen: false,
		isWindowScrolled: false,
		scrollVariantToggled: false,
		languageMenuAnchor: null,
	} as {
		drawerOpen: boolean;
		isWindowScrolled: boolean;
		scrollVariantToggled: boolean;
		languageMenuAnchor: null | HTMLElement;
	});

	const locales = t("common:locales", { returnObjects: true }) as {
		code: string;
		label: string;
		flag: string;
	}[];

	const localeCodes = locales.map((locale) => locale.code);

	const localeObj = locales.find((l) => l.code === router.locale) ||
		locales.find((l) => l.code === i18n.language) || {
			code: "en",
			label: "English",
			flag: "/flags/en.svg",
		};

	const navs = t("common:nav.links", { returnObjects: true }) as NavBarLink[];

	const stripLocalePrefix = (path: string) => {
		const localePattern = new RegExp(`^/(${localeCodes.join("|")})(?:/|$)`);
		const strippedPath = path.replace(localePattern, "/");
		return strippedPath === "" ? "/" : strippedPath;
	};

	const localizePath = (path: string, locale: string) => {
		if (!path) {
			return "/";
		}
		if (!path.startsWith("/") || path.startsWith("//")) {
			return path;
		}

		const [pathAndQuery, hash] = path.split("#");
		const [pathname, query] = pathAndQuery.split("?");
		const cleanPathname = stripLocalePrefix(pathname);
		const localizedPathname =
			cleanPathname === "/" ? `/${locale}` : `/${locale}${cleanPathname}`;

		return `${localizedPathname}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
	};

	const onToggleLanguageClick = async (newLocale: string) => {
		if (newLocale === router.locale) {
			return;
		}
		const localizedPath = localizePath(router.asPath, newLocale);

		document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
		await i18n.changeLanguage(newLocale);
		await router.replace(localizedPath, undefined, { locale: false });
	};

	useLenis(
		({ scroll, limit }) => {
            const progress = (scroll / limit) * 100;
            const isWindowScrolled = progress >= 2;
            if (isWindowScrolled !== state.isWindowScrolled) {
				setState((prev) => ({
					isWindowScrolled: !prev.isWindowScrolled,
				}));
			}
			if (!scrollVariantPercent || scrollVariantPercent == 0) {
				return;
			}

			const scrollVariantToggled = progress >= scrollVariantPercent;
			if (scrollVariantToggled !== state.scrollVariantToggled) {
				setState((prev) => ({
					scrollVariantToggled: !prev.scrollVariantToggled,
				}));
			}
		},
		[scrollVariantPercent, scrollVariant, state.scrollVariantToggled, state.isWindowScrolled]
	);
	

	const handleDrawerToggle = () => {
		setState({ drawerOpen: !state.drawerOpen });
	};

	const handleLanguageChange = (newLocale: string) => {
		void onToggleLanguageClick(newLocale);
	};

	const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setState({ languageMenuAnchor: event.currentTarget });
	};

	const handleLanguageMenuClose = () => {
		setState({ languageMenuAnchor: null });
	};

	const handleLanguageSelect = (locale: string) => {
		handleLanguageMenuClose();
		handleLanguageChange(locale);
	};

	const currentLocale = router.locale ?? i18n.language ?? "en";

	const isDark =
		typeof scrollVariantPercent !== "number"? variant === "dark" :
		(variant === "light" && state.scrollVariantToggled) || (variant === "dark" && !state.scrollVariantToggled);

	const iconColor = isDark ? "text-primary-300" : "text-primary";
	const accentColor = isDark ? "text-surface" : "text-accent";
	const hoverColor = isDark ? "hover:text-primary-300" : "hover:text-primary";

	return (
		<>
			<AppBar
				position="sticky"
				// 'elevation={0}' removes the default shadow for a cleaner look
				elevation={0}
				color="transparent"
				classes={{
					root: "px-4 md:px-8 bg-transparent! transition-all duration-500",
				}}
			>
				<Container
					maxWidth="lg"
					classes={{
						root: `mt-3 mb-1 rounded-3xl backdrop-blur-lg! transition-all duration-500 ${
							isDark ? "bg-black/85! text-surface!" : "bg-surface/85! text-ink!"
						} ${state.isWindowScrolled ? "card-shadow-lift" : "card-shadow"}`,
					}}
				>
					<div
						className={`hidden lg:flex items-center justify-between gap-8 px-2 pt-3.5 pb-3 text-xs font-semibold transition-all duration-500 ${
							isDark
								? "text-surface/70 border-b border-surface/10"
								: "text-on-surface/70 border-b border-ink/10"
						}`}
					>
						<span className="inline-flex items-center gap-2">
							<span className={`mdi mdi-map-marker text-sm ${iconColor}`} />
							<span className={accentColor}>{t("common:contacts.address")}</span>
						</span>

						<div className="flex items-center gap-8">
							<a
								href={`tel:${t("common:contacts.mobile").replace(/\s/g, "")}`}
								className={`inline-flex items-center gap-2 transition-colors duration-300 ${hoverColor}`}
							>
								<span className={`mdi mdi-phone text-sm ${iconColor}`} />
								<span className={accentColor}>{t("common:contacts.mobile")}</span>
							</a>
							<a
								href={`mailto:${t("common:contacts.Email")}`}
								className={`inline-flex items-center gap-2 transition-colors duration-300 ${hoverColor}`}
							>
								<span className={`mdi mdi-email-outline text-sm ${iconColor}`} />
								<span className={accentColor}>{t("common:contacts.Email")}</span>
							</a>
						</div>
					</div>

					<Toolbar disableGutters className={`bg-transparent! `}>
						<IconButton
							onClick={handleDrawerToggle}
							classes={{ root: "lg:hidden! mr-4!" }}
							sx={{ color: "inherit" }}
						>
							<MenuIcon />
						</IconButton>

						<Link href="/" className="flex items-center gap-2">
							<Image
								className="flex lg:mr-1"
								src={t("common:nav.logo")}
								alt={t("common:nav.logo_alt")}
								width={32}
								height={32}
							/>
							<div className="flex flex-col mr-2 leading-tight">
								<h6
									className={`flex uppercase font-semibold tracking-wide  no-underline transition-all duration-500 ${
										isDark ? "text-surface" : "text-ink"
									}`}
								>
									{t("meta:site.title")}
								</h6>
								<span
									className={`capitalize hidden lg:flex font-semibold text-[9px] no-underline transition-all duration-500 ${
										isDark ? "text-surface/55" : "text-on-surface/55"
									}`}
								>
									{t("meta:site.subtitle")}
								</span>
							</div>
						</Link>

						<NavMenu
							items={navs}
							locale={currentLocale}
							localizePath={localizePath}
							horizontal
							variant={isDark ? "dark" : "light"}
						/>

						<Box className="lg:hidden grow" />
						<Box className="flex items-center gap-2">
							<Avatar
								onClick={handleLanguageMenuOpen}
								className="mx-4  cursor-pointer"
								sx={{ width: 24, height: 24 }}
								src={localeObj.flag}
								alt={localeObj.label}
								title={t("common:misc.changeLanguage")}
							/>
							<Menu
								anchorEl={state.languageMenuAnchor}
								open={Boolean(state.languageMenuAnchor)}
								onClose={handleLanguageMenuClose}
							>
								{Array.isArray(locales) &&
									locales.map((locale) => (
										<MenuItem
											key={locale.code}
											onClick={() => handleLanguageSelect(locale.code)}
											selected={router.locale === locale.code}
											disabled={router.locale === locale.code}
										>
											<Image
												className="mr-2"
												width={14}
												height={10}
												src={locale.flag}
												alt={locale.label}
											/>
											{locale.label}
										</MenuItem>
									))}
							</Menu>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			{/* Mobile Drawer */}
			<Drawer
				anchor="left"
				open={state.drawerOpen}
				className="block lg:hidden"
				onClose={handleDrawerToggle}
				classes={{
					paper: "bg-surface/95! backdrop-blur-lg! hairline! border-t! shadow-xl",
				}}
			>
				<Box
					sx={{
						width: 280,
						p: 2,
					}}
				>
					{/* Close Button */}
					<IconButton
						onClick={handleDrawerToggle}
						sx={{
							minWidth: "auto",
							p: 0,
							mb: 2,
							color: "inherit",
						}}
					>
						<CloseIcon />
					</IconButton>

					{/* Mobile Navigation Links */}
					<NavMenuMobile
						items={navs}
						locale={currentLocale}
						localizePath={localizePath}
						onNavigate={handleDrawerToggle}
					/>
				</Box>
			</Drawer>
		</>
	);
}
