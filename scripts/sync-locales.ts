import { sanityClient } from "@/lib/sanity";
import fs from "fs/promises";
import path from "path";

async function run() {
	const docs = await sanityClient.fetch(`*[_type == "localeString"]`);
	const grouped: Record<string, Record<string, any>> = {};

	for (const d of docs) {
		for (const lng of ["en", "sw"]) {
			const filePath = `${lng}/${d.namespace}`;
			grouped[filePath] ??= {};
			setDeep(grouped[filePath], d.key, d[lng] || d.en);
		}
	}

	for (const [file, content] of Object.entries(grouped)) {
		const outPath = path.join("public/locales", `${file}.json`);
		await fs.mkdir(path.dirname(outPath), { recursive: true });
		await fs.writeFile(outPath, JSON.stringify(content, null, 2));
	}
}

function setDeep(obj: any, keyPath: string, val: any) {
	const parts = keyPath.split(".");
	let cur = obj;
	parts.slice(0, -1).forEach((p) => (cur = cur[p] ??= {}));
	cur[parts.at(-1)!] = val;
}

run();
