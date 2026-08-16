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

export default function Navbar() {
	const router = useRouter();
	const { t, i18n } = useTranslation(["common", "meta"]);
	const [state, setState] = useSetState({
		drawerOpen: false,
		isWindowScrolled: false,
		languageMenuAnchor: null,
	} as {
		drawerOpen: boolean;
		isWindowScrolled: boolean;
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

	useEffect(() => {
		const handleScroll = () => {
			setState({ isWindowScrolled: window.scrollY > 48 });
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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

	return (
		<>
			<AppBar
				position="sticky"
				// 'elevation={0}' removes the default shadow for a cleaner look
				elevation={0}
				color="transparent"
				classes={{
					root: "px-4 md:px-8 bg-transparent! transition-all duration-300",
				}}
			>
				<Container
					maxWidth="lg"
					classes={{
						root: `mt-3 mb-1 rounded-3xl bg-surface/85!  backdrop-blur-lg! transition-all duration-300 ${
							state.isWindowScrolled ? "card-shadow-lift" : "card-shadow"
						}`,
					}}
				>
					<div className="hidden lg:flex items-center justify-between gap-8 px-2 pt-3.5 pb-3 text-xs text-on-surface/70 border-b border-ink/10">
						<span className="inline-flex items-center gap-2">
							<span className="mdi mdi-map-marker text-primary text-sm" />
							{t("common:contacts.address")}
						</span>

						<div className="flex items-center gap-8">
							<a
								href={`tel:${t("common:contacts.mobile").replace(/\s/g, "")}`}
								className="inline-flex items-center gap-2 hover:text-primary transition-colors duration-300"
							>
								<span className="mdi mdi-phone text-primary text-sm" />
								{t("common:contacts.mobile")}
							</a>
							<a
								href={`mailto:${t("common:contacts.Email")}`}
								className="inline-flex items-center gap-2 hover:text-primary transition-colors duration-300"
							>
								<span className="mdi mdi-email-outline text-primary text-sm" />
								{t("common:contacts.Email")}
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
								<h6 className="flex uppercase font-semibold tracking-wide text-ink no-underline">
									{t("meta:site.title")}
								</h6>
								<span className=" capitalize hidden lg:flex font-semibold text-[9px]  text-on-surface/55 no-underline">
									{t("meta:site.subtitle")}
								</span>
							</div>
						</Link>

						<NavMenu
							items={navs}
							locale={currentLocale}
							localizePath={localizePath}
							horizontal
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
					paper: "bg-white/95! backdrop-blur-lg! hairline! border-t! shadow-xl",
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
