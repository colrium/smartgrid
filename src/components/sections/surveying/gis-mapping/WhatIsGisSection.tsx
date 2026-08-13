"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface WhatIsGisCta {
	label: string;
	href: string;
}

interface WhatIsGisContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: WhatIsGisCta | null;
}

export function WhatIsGisSection() {
	const { t } = useTranslation(["gis-mapping"]);
	const section = t("gis-mapping:whatIsGis", {
		returnObjects: true,
	}) as unknown as WhatIsGisContent;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-brand-100/60 -top-24 -right-24" opacity={0.5} />
			<Blob className="w-[22rem] h-[22rem] bg-brand-200/40 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp className="max-w-4xl mx-auto">
					<SectionHeader
						tag={section.tag}
						headline={section.headline}
						description={section.description}
						align="center"
					/>

					{section.ctaPrimary?.href && (
						<div className="mt-10 flex justify-center">
							<Link
								href={section.ctaPrimary.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-white font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(0,151,178,0.55)]"
							>
								<span className="h-1.5 w-1.5 rounded-full bg-white/70 transition-transform duration-300 group-hover:scale-125" />
								{section.ctaPrimary.label}
								<span className="mdi mdi-arrow-right text-xl text-white transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</div>
					)}
				</FadeUp>
			</div>
		</section>
	);
}

export default WhatIsGisSection;