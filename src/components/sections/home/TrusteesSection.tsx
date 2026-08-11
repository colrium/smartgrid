"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "./decor";

interface TrusteeItem {
	label: string;
	logoUrl: string;
}

export function TrusteesSection() {
	const { t } = useTranslation(["home"]);
	const items = t("home:trustees.items", {
		returnObjects: true,
	}) as unknown as TrusteeItem[];

	return (
		<section id="trustees" className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-72 h-72 bg-brand-200/50 -right-16 top-10" opacity={0.4} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="mb-12 flex flex-col items-center gap-4 text-center">
						<SectionTag>
							{(t("home:trustees.tag", { defaultValue: "" }) as string) ||
								"Trusted Partners"}
						</SectionTag>
						<p className="text-3xl sm:text-4xl font-light tracking-tight text-ink leading-tight">
							{t("home:trustees.headline") as string}
						</p>
					</div>
				</FadeUp>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
					{Array.isArray(items) &&
						items.map((item, index) => (
							<FadeUp key={item.logoUrl} delay={(index % 5) * 0.08}>
								<div className="group h-20 sm:h-24 rounded-[15px] hairline bg-surface card-shadow px-6 sm:px-8 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:card-shadow-lift hover:border-primary">
									<div className="relative w-full h-full max-w-full">
										<Image
											src={item.logoUrl}
											alt={item.label}
											fill
											sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
											className="object-contain grayscale opacity-75 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
										/>
									</div>
								</div>
							</FadeUp>
						))}
				</div>
			</div>
		</section>
	);
}

export default TrusteesSection;
