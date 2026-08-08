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
			main: brand[700],
			light: brand[300],
			dark: brand[900],
			contrastText: "#ffffff",
		},
		
		background: {
			default: "#f7f3e8",
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
		fontFamily: 'var(--font-sans), "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontWeight: 700,
			fontFamily: 'var(--font-display), "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		},
		h2: {
			fontWeight: 700,
			fontFamily: 'var(--font-display), "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		},
		h3: {
			fontWeight: 600,
			fontFamily: 'var(--font-display), "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		},
	},
});

export { brand };
export default theme;
