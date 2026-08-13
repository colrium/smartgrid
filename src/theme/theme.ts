import { createTheme } from "@mui/material/styles";

const brand = {
	50: "#e5f6f8",
	100: "#ccecef",
	200: "#99d9df",
	300: "#66c5cf",
	400: "#33b2bf",
	500: "#0097b2", // primary
	600: "#007f96",
	700: "#00677a",
	800: "#004f5e",
	900: "#003742",
};

const fontSans = 'var(--font-sans), "Inter", "Roboto", "Helvetica", "Arial", sans-serif';
const fontDisplay =
	'var(--font-display), "Inter", "Roboto", "Helvetica", "Arial", sans-serif';

const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: brand[500],
			light: brand[300],
			dark: brand[700],
			contrastText: "#ffffff",
		},
		secondary: {
			main: "#000000",
			light: "#404040",
			dark: "#000000",
			contrastText: "#ffffff",
		},

		background: {
			default: "#f0f0f0",
			paper: "#ffffff",
		},
		text: {
			primary: "#17343a",
			secondary: "#52686c",
		},
		divider: "rgba(0,151,178,0.18)",
		error: { main: "#f44336" },
		warning: { main: "#ff9800" },
		success: { main: "#66bb6a" },
		info: { main: "#29b6f6" },
	},
	typography: {
		htmlFontSize: 14,
		fontFamily: fontSans,
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 700,
		h1: {
			fontFamily: fontDisplay,
			fontSize: "3rem", // text-5xl
			lineHeight: 1,
			fontWeight: 700,
		},
		h2: {
			fontFamily: fontDisplay,
			fontSize: "2.25rem", // text-4xl
			lineHeight: "2.5rem",
			fontWeight: 700,
		},
		h3: {
			fontFamily: fontDisplay,
			fontSize: "1.875rem", // text-3xl
			lineHeight: "2.25rem",
			fontWeight: 600,
		},
		h4: {
			fontFamily: fontDisplay,
			fontSize: "1.5rem", // text-2xl
			lineHeight: "2rem",
			fontWeight: 600,
		},
		h5: {
			fontFamily: fontDisplay,
			fontSize: "1.25rem", // text-xl
			lineHeight: "1.75rem",
			fontWeight: 600,
		},
		h6: {
			fontFamily: fontDisplay,
			fontSize: "1.125rem", // text-lg
			lineHeight: "1.75rem",
			fontWeight: 600,
		},
		subtitle1: {
			fontSize: "1.125rem", // text-lg
			lineHeight: "1.75rem",
			fontWeight: 500,
		},
		subtitle2: {
			fontSize: "0.875rem", // text-sm
			lineHeight: "1.25rem",
			fontWeight: 500,
		},
		body1: {
			fontSize: "1rem", // text-base
			lineHeight: "1.5rem",
			fontWeight: 400,
		},
		body2: {
			fontSize: "0.875rem", // text-sm
			lineHeight: "1.25rem",
			fontWeight: 400,
		},
		button: {
			fontSize: "0.875rem", // text-sm
			lineHeight: "1.25rem",
			fontWeight: 500,
			textTransform: "none",
			letterSpacing: "normal",
		},
		caption: {
			fontSize: "0.75rem", // text-xs
			lineHeight: "1rem",
			fontWeight: 400,
		},
		overline: {
			fontSize: "0.75rem", // text-xs
			lineHeight: "1rem",
			fontWeight: 600,
			textTransform: "none",
		},
	},
});

export { brand };
export default theme;
