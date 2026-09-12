import { config, fields, collection } from "@keystatic/core";

const localeText = () =>
	fields.object({
		en: fields.text({ label: "English" }),
		sw: fields.text({ label: "Swahili" }),
	});

const localeBlock = () =>
	fields.object({
		en: fields.markdoc({ label: "English" }),
		sw: fields.markdoc({ label: "Swahili" }),
	});

export default config({
	storage: {
		kind: "github", // git-backed via GitHub App — set kind: "local" for dev
		repo: { owner: "your-org", name: "smartgrid-surveying" },
	},
	collections: {
		pages: collection({
			label: "Pages",
			path: "content/pages/*",
			format: { data: "json" },
			slugField: "slug",
			schema: {
				slug: fields.slug({ name: { label: "Slug" } }),
				pageBuilder: fields.array(
					fields.conditional(
						fields.select({
							label: "Section Type",
							options: [
								{ label: "Hero — Surveying", value: "heroSurveying" },
								{ label: "Services Grid", value: "servicesGrid" },
							],
							defaultValue: "heroSurveying",
						}),
						{
							heroSurveying: fields.object({
								heading: localeText(),
								subheading: localeBlock(),
								ctaLabel: localeText(),
								ctaHref: fields.text({ label: "CTA Link" }),
							}),
							servicesGrid: fields.object({
								heading: localeText(),
								items: fields.array(
									fields.object({
										icon: fields.text({ label: "MDI Icon Slug" }),
										title: localeText(),
										description: localeBlock(),
									}),
									{ label: "Service Items", itemLabel: (p) => p.fields.title.fields.en.value }
								),
							}),
							// ...one branch per registered section
						}
					),
					{ label: "Sections" }
				),
			},
		}),
	},
});