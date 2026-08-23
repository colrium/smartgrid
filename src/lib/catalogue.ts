import fs from "fs";
import path from "path";

export interface CatalogueCardPrice {
	prefix?: string | null;
	currency: string;
	amount: number;
}

export interface CatalogueCard {
	icon?: string | null;
	title: string;
	description: string;
	badge?: string | null;
	image?: string | null;
	price?: CatalogueCardPrice | null;
	ctaPrimary: {
		icon?: string;
		label: string;
		href: string;
	};
}

type Json = Record<string, unknown>;

function readLocaleJson(locale: string, name: string): Json | null {
	try {
		const filePath = path.join(process.cwd(), "public", "locales", locale, `${name}.json`);
		if (fs.existsSync(filePath)) {
			return JSON.parse(fs.readFileSync(filePath, "utf8")) as Json;
		}
	} catch {
		/* fall through */
	}
	return null;
}

function readProduct(locale: string, slug: string): Json | null {
	return readLocaleJson(locale, slug) ?? readLocaleJson("en", slug);
}

/**
 * Builds the equipment-catalogue cards from the products.json registry.
 * Each registry entry is enlisted automatically; card details come from
 * the product's own locale JSON (hero + optional `catalogue` block), so
 * adding a product to products.json is all that is needed to list it.
 * Ordering follows the registry order.
 */
export function getCatalogueItems(locale: string): CatalogueCard[] {
	const effectiveLocale = fs.existsSync(
		path.join(process.cwd(), "public", "locales", locale, "products.json"),
	)
		? locale
		: "en";

	const registry = readLocaleJson(effectiveLocale, "products");
	const entries = Array.isArray(registry?.items)
		? (registry.items as { slug?: string }[])
		: [];

	const catalogueNs = readLocaleJson(effectiveLocale, "equipment-catalogue");
	const categories =
		(catalogueNs?.equipmentCategories as Record<string, unknown> | undefined) ?? {};
	const ctaIcon = typeof categories.ctaIcon === "string" ? categories.ctaIcon : "launch";
	const ctaLabel =
		typeof categories.ctaLabel === "string" ? categories.ctaLabel : "View Details";

	const cards: CatalogueCard[] = [];
	for (const entry of entries) {
		const slug = entry.slug;
		if (!slug) continue;
		const product = readProduct(effectiveLocale, slug);
		if (!product) continue;

		const hero = (product.hero ?? {}) as {
			title?: unknown;
			image?: unknown;
			description?: unknown;
		};
		const extra = (product.catalogue ?? {}) as {
			icon?: unknown;
			title?: unknown;
			description?: unknown;
			badge?: unknown;
		};

		const pricing = (product.pricing ?? null) as Record<
			string,
			{ label?: string; currency?: string; amount?: number }
		> | null;
		const priceOptions = pricing
			? Object.values(pricing).filter((p): p is { currency: string; amount: number } =>
					Boolean(p && typeof p.amount === "number"),
				)
			: [];
		priceOptions.sort((a, b) => a.amount - b.amount);
		const cheapest = priceOptions[0];

		const title =
			(typeof extra.title === "string" ? extra.title : undefined) ??
			(typeof hero.title === "string" ? hero.title : undefined);
		const description =
			(typeof extra.description === "string" ? extra.description : undefined) ??
			(typeof hero.description === "string" ? hero.description : undefined);
		if (!title || !description) continue;

		cards.push({
			icon: typeof extra.icon === "string" ? extra.icon : null,
			title,
			description,
			badge: typeof extra.badge === "string" ? extra.badge : null,
			image: typeof hero.image === "string" ? hero.image : null,
			price: cheapest
				? {
						prefix: priceOptions.length > 1 ? (locale === "sw" ? "Kuanzia" : "From") : null,
						currency: cheapest.currency ?? "KES",
						amount: cheapest.amount,
					}
				: null,
			ctaPrimary: { icon: ctaIcon, label: ctaLabel, href: `/equipment-sale/${slug}` },
		});
	}
	return cards;
}
