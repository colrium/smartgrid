import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				brand: {
					50: '#e5f6f8',
					100: '#ccecef',
					200: '#99d9df',
					300: '#66c5cf',
					400: '#33b2bf',
					500: '#0097b2',
					600: '#007f96',
					700: '#00677a',
					800: '#004f5e',
					900: '#003742',
				},
				primary: '#0097b2',
				paper: '#ffffff',
				surface: '#ffffff',
			},
			fontFamily: {
				sans: ['var(--font-manrope)', 'Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
				serif: ['var(--font-montserrat)', 'Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
			},
		},
	},
};

export default config;
