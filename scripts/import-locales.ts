// scripts/import-locales.ts
import { sanityClient } from "@/lib/sanity";
import fs from "fs/promises";
import path from "path";



const LOCALES_DIR = path.resolve("public/locales");
const LANGS = ["en", "sw"];
const BASE_LANG = "en"; // drives which namespaces/keys exist

// flatten nested JSON into dot-notation keys
function flatten(obj: any, prefix = "", out: Record<string, string> = {}) {
	for (const [k, v] of Object.entries(obj)) {
		const key = prefix ? `${prefix}.${k}` : k;
		if (v && typeof v === "object" && !Array.isArray(v)) {
			flatten(v, key, out);
		} else {
			out[key] = String(v);
		}
	}
	return out;
}

// recursively find all namespace json files under en/, preserving subfolders
async function findNamespaces(dir: string, base = ""): Promise<string[]> {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	let namespaces: string[] = [];
	for (const entry of entries) {
		const rel = base ? `${base}/${entry.name}` : entry.name;
		if (entry.isDirectory()) {
			namespaces = namespaces.concat(await findNamespaces(path.join(dir, entry.name), rel));
		} else if (entry.name.endsWith(".json")) {
			namespaces.push(rel.replace(/\.json$/, ""));
		}
	}
	return namespaces;
}

// deterministic id so reruns upsert instead of duplicating
function docId(namespace: string, key: string): string {
	const safe = `${namespace}__${key}`.replace(/[^a-zA-Z0-9_-]/g, "-");
	return `localeString-${safe}`;
}

async function run() {
	const namespaces = await findNamespaces(path.join(LOCALES_DIR, BASE_LANG));
	console.log(`Found ${namespaces.length} namespaces`);

	let count = 0;
	let mutations: any[] = [];

	for (const ns of namespaces) {
		const perLang: Record<string, Record<string, string>> = {};

		for (const lang of LANGS) {
			const filePath = path.join(LOCALES_DIR, lang, `${ns}.json`);
			try {
				const raw = await fs.readFile(filePath, "utf-8");
				perLang[lang] = flatten(JSON.parse(raw));
			} catch {
				perLang[lang] = {}; // missing translation file for this lang, fill blank
			}
		}

		const keys = Object.keys(perLang[BASE_LANG]);

		for (const key of keys) {
			const doc: any = {
				_id: docId(ns, key),
				_type: "localeString",
				namespace: ns,
				key,
			};
			for (const lang of LANGS) {
				doc[lang] = perLang[lang][key] ?? "";
			}
			mutations.push({ createOrReplace: doc });
			count++;
		}

		// flush in batches of 100 to avoid oversized requests
		if (mutations.length >= 100) {
			await sanityClient.mutate(mutations);
			mutations = [];
		}
	}

	if (mutations.length) await sanityClient.mutate(mutations);
	console.log(`Imported ${count} locale strings across ${namespaces.length} namespaces`);
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
