"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface SaleBannerContent {
	images?: string[] | null;
}

export function SaleBannerSection() {
	const { t } = useTranslation(["total-station-dtm-152m"]);
	const section = t("total-station-dtm-152m:saleBanner", {
		returnObjects: true,
	}) as unknown as SaleBannerContent;
	const images = Array.isArray(section.images) ? section.images : [];

	if (images.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 overflow-hidden">
					{images.map((image, index) => (
						<FadeUp key={index} delay={(index % 2) * 0.07}>
							<div className="relative h-140 sm:h-152 w-156 sm:w-172 shrink-0 rounded-[20px] bg-surface hairline card-shadow p-4 sm:p-5">
								<div className="relative h-full w-full overflow-hidden rounded-[15px] bg-primary-50/60">
									<Image
										src={image}
										alt=""
										fill
										sizes="(min-width: 640px) 18rem, 14rem"
										className="object-contain object-center"
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

export default SaleBannerSection;
