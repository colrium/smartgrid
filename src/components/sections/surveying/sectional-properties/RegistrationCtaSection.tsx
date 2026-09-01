"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";

interface CtaAction {
	label?: string;
	href?: string;
	icon?: string | null;
}

interface RegistrationCtaContent {
	tag?: string | null;
	headline?: string;
	description?: string;
	watermark?: string | null;
	primary?: CtaAction;
	secondary?: CtaAction;
}

export function RegistrationCtaSection(): ReactElement {
	const { t } = useTranslation(["sectional-properties"]);
	const section = t("sectional-properties:registrationCta", {
		returnObjects: true,
	}) as unknown as RegistrationCtaContent;

	if (!section?.headline) return <></>;

	return (
		<section className="relative overflow-hidden ink-panel py-24 sm:py-28">
			{section.watermark && (
				<span
					aria-hidden
					className={`pointer-events-none absolute -bottom-16 -right-10 select-none font-light leading-none tracking-tighter text-[16rem] sm:text-[22rem] text-surface/5 mdi mdi-${section.watermark}`}
				/>
			)}

			<div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center">
				<FadeUp>
					{section.tag && (
						<p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">
							{section.tag}
						</p>
					)}
					<h2 className="mt-5 font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-5xl text-surface">
						{section.headline}
					</h2>
					{section.description && (
						<p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-surface/65">
							{section.description}
						</p>
					)}

					<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
						{section.primary?.href && (
							<Link
								href={section.primary.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
							>
								{section.primary.icon && section.primary.icon !== "arrow-right" && (
									<span className={`mdi mdi-${section.primary.icon} text-xl text-primary`} />
								)}
								{section.primary.label}
								<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						)}
						{section.secondary?.href && (
							<Link
								href={section.secondary.href}
								target="_blank"
								rel="noopener noreferrer"
								className="group inline-flex items-center gap-3 h-14 rounded-full border border-surface/25 px-8 text-surface font-medium text-base transition-all duration-300 hover:border-primary-300 hover:bg-surface/5"
							>
								<span
									className={`mdi mdi-${section.secondary.icon ?? "chat"} text-xl text-whatsapp`}
								/>
								{section.secondary.label}
							</Link>
						)}
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default RegistrationCtaSection;