import { locales } from "./i18n";



export type Lang = typeof locales[number];

export interface EnquiryCtaContent {
	icon?: string;
	label: string;
	href: string;
}

export interface QuickFactContent {
	icon?: string;
	label: string;
	value: string;
}

export interface PriceOption {
	label: string;
	currency: string;
	amount: number;
}

export interface Category {
	name: string;
	label: string;
	href: string;
}

export interface ProductImagesContent {
	images?: string[] | null;
}
export interface ProductCatalogueContent {
	icon?: string;
	title?: string;
	image?: MediaImage | string;
	description?: string;
	badge?: string;
}
export interface CtaContent {
	ctaSecondary?: EnquiryCtaContent | null;
}
export interface MediaImage {
	url?: string;
	icon?: string;
	label?: string;
	description?: string;
}
export interface ProductOverviewContent {
	tag?: string;
	headline?: string;
	image?: MediaImage | string;
	images?: (MediaImage | string)[];
	description?: string;
}
export interface ProductImages {
	images: (MediaImage | string)[];
}

export interface ProductHeroContent {
	tag?: string | null;
	headline?: string;
	title?: string;
	description?: string;
	image?: MediaImage | string | null;
	ctaPrimary?: EnquiryCtaContent | null;
}

export interface BreadcrumbContent {
	home: string;
	section: string;
	sectionHref: string;
}
