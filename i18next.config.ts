import { defineConfig } from "i18next-cli";

export default defineConfig({
	locales: ["en", "sw"],
	extract: {
		input: ["src/**/*.{ts,tsx}"],
		output: "public/locales/{{language}}/{{namespace}}.json",
	},
	types: {
		input: "public/locales/en/**/*.json",
		basePath: "public/locales/en",
		output: "@types/i18next.d.ts",
		resourcesFile: "@types/resources.json",
	},
});
