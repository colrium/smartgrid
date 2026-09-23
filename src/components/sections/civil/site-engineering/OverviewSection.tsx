import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Split } from "@/components/sections/shared";
import Image from "next/image";

interface OverviewContent {
	tag?: string | null;
	headline: string;
	description?: string;
	image?: string | null;
}/**
 * `data` (M11 batch 16, 2026-09-20): Keystatic-owned content for the
 * `seOverview` unique section. When provided, the locale lookup is skipped;
 * omitted = legacy `t()` render (bare callers untouched).
 */
export interface OverviewSectionProps {
	data?: OverviewContent | null;
}

export function OverviewSection({ data }: OverviewSectionProps = {}): ReactElement {
	const { t } = useTranslation(["civil/site-engineering"]);
	const section =
		data ??
		(t("civil/site-engineering:overview", {
			returnObjects: true,
		}) as unknown as OverviewContent);
	const hasImage = typeof section.image === "string" && section.image.startsWith("/");

	return (
		<Split
			tag={section.tag}
			headline={section.headline}
			description={section.description}
		>
			{hasImage && (
				<div className="relative mx-auto max-w-lg lg:max-w-none">
					<div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
					<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />

					<div className="relative bg-surface p-4 rounded-c hairline card-shadow">
						<div className="relative h-96 rounded-xl overflow-hidden bg-slate-900">
							<Image
								src={section.image as string}
								alt={section.headline}
								fill
								sizes="(min-width: 1024px) 50vw, 100vw"
								className="object-cover object-center transition-transform duration-700 hover:scale-105"
							/>
						</div>
					</div>
				</div>
			)}
		</Split>
	);
}

export default OverviewSection;