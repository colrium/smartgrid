import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MuiLink from "@mui/material/Link";
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

    const localeCodes =  locales.map((locale) => locale.code);
    
    const localeObj = locales.find((l) => l.code === router.locale) || locales.find((l) => l.code === i18n.language) || { code: 'en', label: 'English', flag: '/flags/en.svg' };

	const navs = t("common:nav.links", { returnObjects: true }) as {
		label: string;
		href: string;
		excludeOnMainNav?: boolean;
	}[];

const stripLocalePrefix = (path: string) => {
		const localePattern = new RegExp(`^/(${localeCodes.join("|")})(?:/|$)`);
		const strippedPath = path.replace(localePattern, "/");
		return strippedPath === "" ? "/" : strippedPath;
	};

	const localizePath = (path: string, locale: string) => {
		if (!path.startsWith("/") || path.startsWith("//")) {
			return path;
		}

		const [pathAndQuery, hash] = path.split("#");
		const [pathname, query] = pathAndQuery.split("?");
		const cleanPathname = stripLocalePrefix(pathname);
		const localizedPathname =
			cleanPathname === "/" ? `/${locale}` : `/${locale}${cleanPathname}`;

		return `${localizedPathname}${query ? `?${query}` : ""}${
			hash ? `#${hash}` : ""
		}`;
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
					root: `transition-all duration-300 ${
						state.isWindowScrolled
							? "bg-surface/70! bg-opacity-90! backdrop-blur-lg! border-b shadow-xl border-primary/20"
							: "bg-surface!"
					}`,
				}}
			>
				<Container maxWidth="xl">
					<Toolbar disableGutters className={`bg-transparent!`}>
						<IconButton
							onClick={handleDrawerToggle}
							classes={{ root: "lg:hidden! mr-4!" }}
							sx={{ color: "inherit" }}
						>
							<MenuIcon />
						</IconButton>

						<Link href="/" className="flex items-center gap-2">
							<Image
								className="hidden lg:flex lg:mr-1"
								src={t("common:nav.logo")}
								alt={t("common:nav.logo_alt")}
								width={32}
								height={32}
							/>
							<Typography
								variant="h5"
								noWrap
								className="mr-2 flex font-mono font-bold text-primary-500  text-inherit no-underline"
							>
								{t("meta:site.title")}
							</Typography>
						</Link>

						<Box className="hidden lg:flex flex-1 lg:grow lg:gap-4 lg:items-center lg:justify-end">
							{Array.isArray(navs) &&
								navs.map(
									({ label, href, excludeOnMainNav }, i) =>
										!excludeOnMainNav && (
											<MuiLink
												component={Link}
												color="textPrimary"
												className={`text-xs mr-4 no-underline! font-light tracking-[0.03em] text-onSurface-800  hover:text-primary-500 transition-colors`}
												href={localizePath(href, currentLocale)}
												locale={false}
												key={`nav-${i}`}
											>
												{label}
											</MuiLink>
										)
								)}
						</Box>

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
					paper: "bg-surface-900/70! bg-opacity-90! backdrop-blur-lg! border-b shadow-xl",
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
					<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
						{Array.isArray(navs) &&
							navs.map(
								({ excludeOnMainNav, label, href }, i) =>
									!excludeOnMainNav && (
										<MuiLink
											component={Link}
											key={`mobile-nav-${i}`}
											href={localizePath(href, currentLocale)}
											locale={false}
											onClick={handleDrawerToggle}
											sx={{
												py: 1,
												px: 2,
												borderRadius: 1,
												"&:hover": {
													backgroundColor: "rgba(0, 0, 0, 0.05)",
												},
											}}
											className="no-underline py-1 px-2 hover:bg-primary-light"
										>
											{label}
										</MuiLink>
									)
							)}
					</Box>
				</Box>
			</Drawer>
		</>
	);
}
