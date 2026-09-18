"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface StatementContent {
	subtitle?: string | null;
	description?: string | null;
}

export interface EqualOpportunityStatementData {
	subtitle?: string | null;
	description?: string | null;
}

export function EqualOpportunityStatementSection({ data, id }: { data?: EqualOpportunityStatementData | null; id?: string } = {}) {
	const { t } = useTranslation(["careers"]);
	// Keystatic-owned content when `data` is provided (M11
	// `careersStatement` unique section); legacy `careers:statement`
	// locale strings otherwise.
	const section = (data ??
		(t("careers:statement", {
			returnObjects: true,
		}) as unknown as StatementContent)) as StatementContent;

	if (!section.subtitle && !section.description) return null;

	return (
		<section id={id} className="py-32 sm:py-48 relative overflow-hidden ">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="rounded-c bg-surface hairline card-shadow p-8 sm:p-10 lg:p-12">
						<div className="flex items-start gap-5">
							<span className="hidden sm:inline-flex h-12 w-12 shrink-0 rounded-2xl bg-primary-50 text-primary items-center justify-center">
								<span className="mdi mdi-scale-balance text-2xl" />
							</span>

							<div className="flex flex-col gap-4">
								{section.subtitle && (
									<h2 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-tight text-ink">
										{section.subtitle}
									</h2>
								)}

								{section.description && (
									<p className="text-base text-on-surface/65 leading-relaxed max-w-4xl whitespace-pre-line">
										{section.description}
									</p>
								)}
							</div>
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default EqualOpportunityStatementSection;