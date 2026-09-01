import { defineType, defineField } from "sanity";

export default defineType({
	name: "localeString",
	title: "Locale String",
	type: "document",
	fields: [
		defineField({ name: "namespace", type: "string" }), // e.g. "surveying/as-built-surveys"
		defineField({ name: "key", type: "string" }), // e.g. "hero.title"
		defineField({ name: "en", type: "text" }),
		defineField({ name: "sw", type: "text" }),
	],
	preview: { select: { title: "key", subtitle: "namespace" } },
});
