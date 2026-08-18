"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";

interface SpecGroup {
	tag?: string | null;
	headline: string;
	list: string[];
}

const SPEC_KEYS = [
	"measurementCapability",
	"accuracyAndPerformance",
	"dataAndInterface",
	"buildAndDurability",
	"applications",
];

function SpecCard({ sectionKey, delay }: { sectionKey: string; delay: number }) {
	const { t } = useTranslation(["total-station-dtm-152m"]);
	const group = t(`total-station-dtm-152m:${sectionKey}`, {
		returnObjects: true,
	}) as unknown as SpecGroup;
	const list = Array.isArray(group.list) ? group.list : [];

	return (
		<FadeUp delay={delay}>
			<article className="h-full flex flex-col gap-5 rounded-[20px] bg-surface hairline card-shadow p-7 sm:p-8 transition-all duration-500 hover:card-shadow-lift">
				{group.tag && <SectionTag>{group.tag}</SectionTag>}

				<h3 className="text-xl sm:text-2xl font-light tracking-tight text-primary">
					{group.headline}
				</h3>

				<ul className="space-y-3">
					{list.map((point, i) => (
						<li
							key={i}
							className="flex items-start gap-3 text-sm text-on-surface/70 leading-relaxed"
						>
							<span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary-50 text-primary flex items-center justify-center">
								<span className="mdi mdi-check text-xs" />
							</span>
							{point}
						</li>
					))}
				</ul>
			</article>
		</FadeUp>
	);
}

export function SpecificationsSection() {
	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
					{SPEC_KEYS.map((key, index) => (
						<SpecCard key={key} sectionKey={key} delay={(index % 2) * 0.07} />
					))}
				</div>
			</div>
		</section>
	);
}

export default SpecificationsSection;