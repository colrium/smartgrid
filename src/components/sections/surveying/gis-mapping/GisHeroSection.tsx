"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface HeroCta {
	label: string;
	href: string;
}

interface GisHeroContent {
	headline: string;
	title: string;
	description?: string;
	footnoteItems?: string[] | null;
	image?: string | null;
	ctaPrimary?: HeroCta | null;
}

/** Render "\n\n"-separated paragraphs with inline <bold> segments (dark background). */
function renderDescription(text: string): ReactNode[] {
	const paragraphs = text.split(/\n+/).filter(Boolean);

	return paragraphs.map((paragraph, pIndex) => {
		const parts = paragraph.split(/(<bold>|<\/bold>)/g);
		let bold = false;
		const nodes: ReactNode[] = [];

		for (const part of parts) {
			if (part === "<bold>") {
				bold = true;
				continue;
			}
			if (part === "</bold>") {
				bold = false;
				continue;
			}
			nodes.push(
				bold ? (
					<strong key={nodes.length} className="font-semibold text-surface">
						{part}
					</strong>
				) : (
					part
				),
			);
		}

		return (
			<span key={pIndex} className={pIndex > 0 ? "mt-4 block" : "block"}>
				{nodes}
			</span>
		);
	});
}

export function GisHeroSection() {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const hero = t("surveying/gis-mapping:hero", {
		returnObjects: true,
	}) as unknown as GisHeroContent;
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");
	const footnoteItems = Array.isArray(hero.footnoteItems) ? hero.footnoteItems : [];

	return (
		<section className="relative min-h-[86dvh] flex items-end overflow-hidden pb-14 sm:pb-20">
			{hasImage ? (
				<Image
					src={hero.image as string}
					alt={hero.headline || hero.title}
					fill
					priority
					fetchPriority="high"
					sizes="100vw"
					className="object-cover object-center"
				/>
			) : (
				<div className="absolute inset-0 bg-ink" />
			)}
			<div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
			<div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />

			<div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionTag dark>
						{hero.headline}
					</SectionTag>

					<h1 className="mt-5 max-w-4xl font-light tracking-tight leading-[1.08] text-3xl sm:text-5xl lg:text-6xl text-surface">
						{hero.title}
					</h1>

					{hero.description && (
						<p className="mt-6 max-w-2xl text-base sm:text-lg text-surface/70 leading-relaxed">
							{renderDescription(hero.description)}
						</p>
					)}

					{footnoteItems.length > 0 && (
						<div className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full bg-surface/10 hairline-dark px-5 py-3 backdrop-blur-sm">
							{footnoteItems.map((item, index) => (
								<span key={index} className="inline-flex items-center gap-3">
									{index > 0 && (
										<span
											aria-hidden
											className="mdi mdi-arrow-right text-base text-primary-200"
										/>
									)}
									<span className="text-xs sm:text-sm font-medium tracking-wide text-surface/80">
										{item}
									</span>
								</span>
							))}
						</div>
					)}

					{hero.ctaPrimary?.href && (
						<div className="mt-10">
							<Link
								href={hero.ctaPrimary.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
							>
								<span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
								{hero.ctaPrimary.label}
								<span className="mdi mdi-arrow-right text-xl text-ink transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</div>
					)}
				</FadeUp>
			</div>
		</section>
	);
}

export default GisHeroSection;