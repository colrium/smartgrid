import fs from "fs";
import path from "path";
import { ProductImages, MediaImage, ProductOverviewContent, ProductCatalogueContent } from "./types";

export interface CatalogueCardPrice {
	prefix?: string | null;
	currency: string;
	amount: number;
}

export interface CatalogueCard {
	slug: string;
	category: string | null;
	icon?: string | null;
	title: string;
	description: string;
	badge?: string | null;
    image?: string | MediaImage;
    images: (string | MediaImage)[]
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
 * Builds related-product cards for a product page, derived purely from
 * products.json (not from per-product locale files). The current product is
 * excluded; same-category entries come first, then remaining registry order,
 * capped at `count`.
 */
export function getRelatedProducts(
	locale: string,
	excludeSlug: string,
	count = 4,
): Array<{ image: string | null; label: string; href: string }> {
	const effectiveLocale = fs.existsSync(
		path.join(process.cwd(), "public", "locales", locale, "products.json"),
	)
		? locale
		: "en";

	const registry = readLocaleJson(effectiveLocale, "products");
	const entries = Array.isArray(registry?.items)
		? (registry.items as { slug?: string; title?: string; category?: string }[])
		: [];

	const selfEntry = entries.find((e) => e.slug === excludeSlug);
	const category = selfEntry?.category;

	const ordered = [
		...entries.filter((e) => e.slug !== excludeSlug && e.category === category),
		...entries.filter((e) => e.slug !== excludeSlug && e.category !== category),
	];

	const items: Array<{ image: string | null; label: string; href: string }> = [];
	for (const entry of ordered) {
		if (!entry.slug) continue;
		const product = readProduct(effectiveLocale, entry.slug);
		if (!product) continue;
		const hero = (product.hero ?? {}) as { title?: unknown; image?: unknown };
		const image = typeof hero.image === "string" ? hero.image : null;
		const title =
			typeof hero.title === "string"
				? hero.title
				: typeof entry.title === "string"
					? entry.title
					: null;
		if (!title) continue;
		items.push({ image, label: title.toUpperCase(), href: `/equipment-sale/${entry.slug}` });
		if (items.length >= count) break;
	}
	return items;
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
		? (registry.items as { slug?: string; category?: string }[])
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
        
		const extra = (product.catalogue ?? {}) as ProductCatalogueContent;
        
        let productImages: (MediaImage | string)[] = (
			(product.productImages ?? { images: [] }) as ProductImages
		).images;

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
        const overview = (product.overview ?? { images: [] }) as ProductOverviewContent;
        if (extra.image) {
            productImages.unshift(extra.image);
        }

        if (productImages.length === 0 && hero.image) {
            productImages.unshift(hero.image);
        }
        if (productImages.length === 0 && overview.image) {
			productImages.unshift(overview.image);
        }
        if (overview.images?.length > 0) {
			productImages = productImages.concat(overview.images);
		}
        let productImage = productImages[0];
        productImage = productImage ? productImage : null;
		const registryEntry = entries.find((e) => e.slug === slug);
		cards.push({
			slug,
			category: typeof registryEntry?.category === "string" ? registryEntry.category : null,
			icon: typeof extra.icon === "string" ? extra.icon : null,
			title,
			description,
			badge: typeof extra.badge === "string" ? extra.badge : null,
            image: productImage,
            images: productImages,
			price: cheapest
				? {
						prefix:
							priceOptions.length > 1 ? (locale === "sw" ? "Kuanzia" : "From") : null,
						currency: cheapest.currency ?? "KES",
						amount: cheapest.amount,
					}
				: null,
			ctaPrimary: { icon: ctaIcon, label: ctaLabel, href: `/equipment-sale/${slug}` },
		});
	}
	return cards;
}
