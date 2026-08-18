"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface IntroCta {
	icon?: string;
	label: string;
	href: string;
}

interface IntroContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: IntroCta | null;
}

export function IntroSection() {
	const { t } = useTranslation(["volumetric-surveys"]);
	const section = t("volumetric-surveys:intro", {
		returnObjects: true,
	}) as unknown as IntroContent;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="max-w-3xl mx-auto text-center">
					<FadeUp>
						<SectionHeader
							tag={section.tag || undefined}
							headline={section.headline}
							align="center"
						/>

						{section.description && (
							<p className="mt-8 text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
								{section.description}
							</p>
						)}

						{section.ctaPrimary?.href && (
							<div className="mt-10">
								<Link
									href={section.ctaPrimary.href}
									className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
								>
									<span className="h-1.5 w-1.5 rounded-full bg-surface transition-transform duration-300 group-hover:scale-125" />
									{section.ctaPrimary.label}
									{section.ctaPrimary.icon && (
										<span
											className={`mdi mdi-${section.ctaPrimary.icon} text-xl transition-transform duration-300 group-hover:translate-x-1`}
										/>
									)}
								</Link>
							</div>
						)}
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default IntroSection;