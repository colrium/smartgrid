"use client";
import type { ReactElement } from "react";
import Image from "next/image";
import { FadeUp } from "@/components/animations/Fade";
import { SectionShell, type SectionShellClassesProp } from "@/components/sections/shared/SectionShell";
import { Slider } from "@/components/Slider";
export type GalleryLayout = "slider" | "masonry" | "grid" | "overlay";
export interface GalleryItem { image?: string | null; title?: string; label?: string; description?: string | null }
export interface GalleryClassesProp {
	sectionHeader?: SectionShellClassesProp["sectionHeader"];
	grid?: string;
	card?: string;
}
export interface GalleryProps {
	tag?: string | null; headline?: string; description?: string | null;
	items: (string | GalleryItem)[]; layout?: GalleryLayout;
	columns?: 2 | 3 | 4; tone?: "default" | "surface"; id?: string; classes?: GalleryClassesProp; className?: string;
}
function norm(items: (string | GalleryItem)[]): GalleryItem[] {
	return items.map((raw) => (typeof raw === "string" ? { image: raw } : raw));
}
export function Gallery(props: GalleryProps): ReactElement | null {
	const items = norm(Array.isArray(props.items) ? props.items : []);
	if (items.length === 0) return null;
	const layout = props.layout ?? "grid";
	const columns = props.columns ?? 3;
	const cols = columns === 4 ? "lg:grid-cols-4" : columns === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
	if (layout === "slider") {
		const headline = props.headline ?? "Gallery";
		return (
			<SectionShell tag={props.tag} headline={headline} description={props.description} align="center" tone={props.tone} id={props.id} className={props.className} classes={props.classes ? { sectionHeader: props.classes.sectionHeader } : undefined}>
				<div className={`mt-12 sm:mt-16 max-w-5xl mx-auto ${props.classes?.grid ?? ""}`}>
					<FadeUp delay={0.1}><Slider slides={items.map((it, i) => ({ image: it.image ?? null, alt: `${headline} ${i + 1}`, title: it.title, description: it.description ?? undefined }))} autoplay={5000} showArrows showDots /></FadeUp>
				</div>
			</SectionShell>
		);
	}
	if (layout === "masonry") {
		return (
			<SectionShell tag={props.tag} headline={props.headline ?? "Gallery"} description={props.description} align="center" tone={props.tone ?? "surface"} id={props.id} className={props.className} classes={props.classes ? { sectionHeader: props.classes.sectionHeader } : undefined}>
				<div className={`mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 ${cols} gap-5 sm:gap-6 ${props.classes?.grid ?? ""}`}>
					{items.map((it, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<figure className={`group relative aspect-[4/3] overflow-hidden rounded-c bg-primary-50/40 hairline card-shadow p-3 transition-all duration-250 hover:card-shadow-lift hover:border-primary ${props.classes?.card ?? ""}`}>
								<div className="relative h-full w-full overflow-hidden rounded-csm bg-white">
									{it.image ? (<Image src={it.image} alt={it.title ?? `Project ${index + 1}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-scale-down object-center transition-transform duration-700 group-hover:scale-[1.04]" />) : null}
								</div>
								<figcaption className="mt-3 flex items-center justify-between px-1">
									<span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface/50">{it.title ?? `Project ${index + 1}`}</span>
									<span className="h-1.5 w-1.5 rounded-full bg-primary" />
								</figcaption>
							</figure>
						</FadeUp>
					))}
				</div>
			</SectionShell>
		);
	}
	return (
		<SectionShell tag={props.tag} headline={props.headline ?? "Gallery"} description={props.description} align={props.headline ? "center" : "left"} tone={props.tone} id={props.id} className={props.className} decor={props.headline ? undefined : false} classes={props.classes ? { sectionHeader: props.classes.sectionHeader } : undefined}>
			<div className={`mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 ${cols} gap-5 sm:gap-6 ${props.classes?.grid ?? ""}`}>
				{items.map((it, index) => (
					<FadeUp key={index} delay={(index % columns) * 0.07}>
						<article className={`group relative aspect-[3/4] rounded-c overflow-hidden bg-ink hairline card-shadow ${props.classes?.card ?? ""}`}>
							{it.image ? (<Image src={it.image} alt={it.title ?? it.label ?? ""} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />) : null}
							<div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
							<div className="absolute inset-x-0 bottom-0 p-6">
								<h3 className="text-lg font-semibold tracking-tight text-surface leading-snug">{it.title ?? it.label ?? ""}</h3>
								{it.description ? (<p className="mt-1.5 text-sm text-surface/70">{it.description}</p>) : null}
							</div>
						</article>
					</FadeUp>
				))}
			</div>
		</SectionShell>
	);
}
export default Gallery;
