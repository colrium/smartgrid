"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionShell } from "@/components/sections/shared/SectionShell";
import { CardList, type CardItem } from "@/components/sections/shared/CardList";

interface ServicesContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	image?: string | null;
	items?: CardItem[] | null;
}

export interface SurveyingServicesData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	image?: string | null;
	items?: CardItem[] | null;
}

/**
 * Land-surveying landing services — centred card grid of service links with a
 * full-width framed map image below the grid (content:
 * surveying/landing:services).
 */
export function SurveyingServicesSection({ data }: { data?: SurveyingServicesData | null } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/landing"]);
	// Keystatic-owned content when `data` is provided (M11
	// `surveyingServices` unique section); legacy `surveying/landing:services`
	// locale strings otherwise. Presentation (shell tone, grid columns, the
	// framed map image below the grid) stays in the wrapper.
	const section = (data ??
		(t("surveying/landing:services", { returnObjects: true }) as unknown as ServicesContent)) as ServicesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	const hasImage = typeof section.image === "string" && section.image.startsWith("/");

	return (
		<SectionShell
			tone="surface"
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
			align="center"
		>
			<CardList
				items={items}
				columns={3}
				headerRow
				className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
			/>

			{hasImage ? (
				<FadeUp delay={0.1}>
					<div className="mt-14 relative aspect-[4/3] rounded-c overflow-hidden p-4 bg-surface hairline card-shadow">
						<Image
							src={section.image as string}
							alt={section.headline}
							fill
							sizes="(min-width: 720px) 60vw, 100vw"
							className="object-fill object-center"
						/>
					</div>
				</FadeUp>
			) : null}
		</SectionShell>
	);
}

export default SurveyingServicesSection;

