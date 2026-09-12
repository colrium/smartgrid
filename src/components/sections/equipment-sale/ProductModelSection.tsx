"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, type ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
const ModelViewer = dynamic(() => import("@/components/ui/ModelViewer"), {
	ssr: false,
	loading: () => (
		<div className="flex h-full w-full items-center justify-center bg-surface">
			<span className="mdi mdi-cube-outline animate-pulse text-4xl text-primary/50" aria-hidden />
		</div>
	),
});

interface Model3d {
	url: string;
	icon?: string;
	label?: string;
	placeholderUrl?: string;
}
interface Model3dContent {
	tag?: string | null;
	headline?: string;
	description?: string;
	models?: Model3d[] | string[] | null;
}

interface ProductModelSectionProps {
	namespace: string;
	placeholderSrc?: string | null;
}

export function ProductModelSection({
	namespace,
	placeholderSrc,
}: ProductModelSectionProps): ReactElement | null {
	const { t } = useTranslation(["common", namespace]);
	const section = t(`${namespace}:model3d`, {
		returnObjects: true,
	}) as unknown as Model3dContent;
	const models = Array.isArray(section?.models)
		? section.models.map(model => model?.src || model).filter(
				(src): src is string  => typeof src === "string" && src.startsWith("/"),
			)
		: [];

	const [active, setActive] = useState(0);
	const [viewerRequested, setViewerRequested] = useState(false);

	if (models.length === 0) return null;

	const current = models[active] ?? models[0];

	// Deferred-load teaser image: explicit prop first, else the hero image.
	const heroImage = t(`${namespace}:hero.image`) as unknown;
	const placeholder =
		typeof placeholderSrc === "string" && placeholderSrc.startsWith("/")
			? placeholderSrc
			: typeof heroImage === "string" && heroImage.startsWith("/")
				? heroImage
				: undefined;
    
    /* const dockItems = section.models.map((model, index) => ({
		icon: model?.icon || "rotate-3d",
		label: model?.label || String(index + 1).padStart(2, "0"),
		className: index === active? "text-primary": "",
		onClick: () => setActive(index),
	})); */

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 w-screen md:w-[90dvw] mx-auto px-6 sm:px-8 lg:px-12">
				<div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
					<SectionHeader
						tag={section.tag || undefined}
						headline={section.headline || undefined}
						description={section.description || undefined}
						align="center"
					/>
				</div>
				<div className="max-w-7xl  mx-auto mt-12 sm:mt-16">
					<div className="relative h-[70dvh] overflow-hidden rounded-cmd hairline bg-surface">
						{viewerRequested ? (
							<ModelViewer
								url={current}
								autoLoad={false}
								placeholderSrc={placeholder}
								className="relative h-full"
							/>
						) : (
							<div className="group relative flex h-full w-full items-center justify-center overflow-hidden">
								{placeholder && (
									<Image
										src={placeholder}
										alt="3D Model Placeholder"
										fill
										sizes="(min-width: 1024px) 80vw, 100vw"
										className="object-center  scale-110 object-contain p-12 opacity-70 blur-2xl transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-90 group-hover:blur-xl"
									/>
								)}
								<div onClick={() => setViewerRequested(true)} className="relative z-10 group flex max-w-sm flex-col items-center gap-4 px-6 text-center cursor-pointer">
									<span
										className="mdi mdi-rotate-3d text-5xl text-ink-500 group-hover:text-accent-200 transition-colors duration-300"
										aria-hidden
									/>
									<button
										type="button"										
										aria-label={t("common:misc.load3d")}
										className="inline-flex h-12 items-center gap-2.5 rounded-full bg-primary px-6 text-sm font-medium text-surface transition-colors duration-300 group-hover:bg-primary-600  cursor-pointer"
									>
										<span
											className="mdi mdi-play-circle-outline text-lg"
											aria-hidden
										/>
										{t("common:misc.load3d")}
									</button>
								</div>
							</div>
						)}
					</div>

					{models.length > 1 && (
						<div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
							{models.map((model, index) => (
								<button
									key={model + index}
									type="button"
									onClick={() => setActive(index)}
									aria-label={`View model ${index + 1}`}
									className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 cursor-pointer border ${
										index === active
											? "bg-primary border-primary text-surface"
											: "bg-surface hairline border-transparent text-on-surface/70 hover:border-primary/40"
									}`}
								>
									<span className="mdi mdi-rotate-3d-variant text-sm" />
									{String(index + 1).padStart(2, "0")}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

export default ProductModelSection;
