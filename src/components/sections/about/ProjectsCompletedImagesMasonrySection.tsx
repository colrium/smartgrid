import { useTranslation } from "@/hooks";
import { Gallery } from "@/components/sections/shared";
import type { ReactElement } from "react";

interface ProjectsCompletedMasonryContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items: string[];
}

export function ProjectsCompletedImagesMasonrySection(): ReactElement | null {
	const { t } = useTranslation(["about"]);
	const section = t("about:projectsCompletedImagesMasonry", {
		returnObjects: true,
	}) as unknown as ProjectsCompletedMasonryContent;
	const images = Array.isArray(section?.items) ? section.items : [];

	if (images.length === 0) return null;

	return (
		<Gallery
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={images}
			layout="masonry"
			columns={3}
			tone="surface"
		/>
	);
}

export default ProjectsCompletedImagesMasonrySection;
