import { ProductImages, MediaImage, ProductOverviewContent, ProductHeroContent, ProductImagesContent, ProductCatalogueContent } from "./types";

export const getProductImages = (
	data = {} as {
		overview?: ProductOverviewContent;
		hero?: ProductHeroContent;
		catalogue?: ProductCatalogueContent;
		productImages?: ProductImagesContent;
	}, target = "catalogue"
): (MediaImage | string)[] => {
    const { overview = {}, hero = {}, catalogue = {}, productImages = {} } = data;
	let images: (MediaImage | string)[] = ((productImages ?? { images: [] }) as ProductImages)
        .images;
    const targetData = typeof target === "string" ? data[target]?.images ?? [] : [];
    const includeAny = ((target in data ? (Array.isArray(targetData) ? targetData : []) : []) as (MediaImage | string)[]).length === 0;
    const includeAll = !target;
	if (catalogue.image) {
		images.unshift(catalogue.image);
	}
    if (!Array.isArray(images)) {
        images = [];
	}
	if (((images.length === 0 && includeAny) || includeAll) && hero.image) {
		images.unshift(hero.image);
	}
	if (((images.length === 0 && includeAny) || includeAll) && overview.image) {
		images.unshift(overview.image);
	}
	if (((images.length === 0 && includeAny) || includeAll) && overview.images?.length > 0) {
		images = images.concat(overview.images);
	}
	return images.filter(
        (item) => {
            const src = typeof item === 'object' ? item.url : item;
            return typeof src === "string" &&
				(src.startsWith("/") || src.startsWith("http://") || src.startsWith("http://"));
        }
	);
};