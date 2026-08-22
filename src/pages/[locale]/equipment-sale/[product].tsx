import fs from "fs";
import path from "path";
import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import { ProductHeroSection } from "@/components/sections/equipment-sale/ProductHeroSection";
import { ProductOverviewSection } from "@/components/sections/equipment-sale/ProductOverviewSection";
import { ProductModelSection } from "@/components/sections/equipment-sale/ProductModelSection";
import { ProductFeaturesSection } from "@/components/sections/equipment-sale/ProductFeaturesSection";
import { ProductSpecsSection } from "@/components/sections/equipment-sale/ProductSpecsSection";
import { IncludedInPackageSection } from "@/components/sections/equipment-sale/IncludedInPackageSection";
import { ProductCtaSection } from "@/components/sections/equipment-sale/ProductCtaSection";
import { ProductRelatedSection } from "@/components/sections/equipment-sale/ProductRelatedSection";

/** Top-level keys of a product namespace that are NOT spec groups. */
const RESERVED_SECTION_KEYS = new Set([
	"hero",
	"breadcrumb",
	"pricing",
	"categories",
	"quickFacts",
	"productImages",
	"productOverview",
	"model3d",
	"keyFeatures",
	"specs",
	"includedInPackage",
	"cta",
	"relatedProducts",
]);

interface SectionManifest {
	model: boolean;
	overview: boolean;
	features: boolean;
	includedInPackage: boolean;
	specGroups: string[];
}

interface PageProps {
	product: string;
	manifest: SectionManifest;
}

function readLocaleJson(locale: string, name: string): Record<string, unknown> | null {
	for (const dir of [locale, "en"]) {
		try {
			const filePath = path.join(process.cwd(), "public", "locales", dir, `${name}.json`);
			if (fs.existsSync(filePath)) {
				return JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
			}
		} catch {
			continue;
		}
	}
	return null;
}

function deriveManifest(productJson: Record<string, unknown>): SectionManifest {
	const hasItems = (value: unknown): boolean => {
		const items = (value as { items?: unknown[] } | undefined)?.items;
		return Array.isArray(items) && items.length > 0;
	};
	const hasModels = (value: unknown): boolean => {
		const models = (value as { models?: unknown[] } | undefined)?.models;
		return Array.isArray(models) && models.length > 0;
	};

	const specGroups = Object.entries(productJson)
		.filter(([key, value]) => {
			if (RESERVED_SECTION_KEYS.has(key)) return false;
			return Boolean(
				value && typeof value === "object" && Array.isArray((value as { list?: unknown }).list),
			);
		})
		.map(([key]) => key);

	return {
		model: hasModels(productJson.model3d),
		overview: Boolean(productJson.productOverview),
		features: hasItems(productJson.keyFeatures),
		includedInPackage: hasItems(productJson.includedInPackage),
		specGroups,
	};
}

const Page: NextPage<PageProps> = ({ product, manifest }) => {
	return (
		<div className="relative">
			<PageHead pageName={product} />
			<div className="flex flex-col min-h-screen">
				<ProductHeroSection namespace={product} />
				{manifest.model && <ProductModelSection namespace={product} />}
				{manifest.overview && <ProductOverviewSection namespace={product} />}
				{manifest.features && <ProductFeaturesSection namespace={product} />}
				{manifest.includedInPackage && <IncludedInPackageSection namespace={product} />}
				{manifest.specGroups.length > 0 && (
					<ProductSpecsSection namespace={product} groupKeys={manifest.specGroups} />
				)}
				<ProductCtaSection namespace={product} />
				<ProductRelatedSection namespace={product} />
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
	const { locale, product } = context.params ?? {};

	if (typeof product !== "string") return { notFound: true };

	// Validate the slug against the products registry.
	const registry = readLocaleJson(typeof locale === "string" ? locale : "en", "products");
	const items = Array.isArray(registry?.items) ? (registry.items as { slug?: string }[]) : [];
	if (!items.some((item) => item.slug === product)) return { notFound: true };

	const productJson = readLocaleJson(typeof locale === "string" ? locale : "en", product);
	if (!productJson) return { notFound: true };

	const i18nProps = await getI18nProps(context, ["common", "meta", product]);
	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps, product, manifest: deriveManifest(productJson) } };
};

export default Page;
