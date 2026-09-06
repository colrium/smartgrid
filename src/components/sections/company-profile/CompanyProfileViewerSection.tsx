"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";
import DeferredMount from "@/components/ui/DeferredMount";

interface ProfileViewContent {
	tag?: string | null;
	headline: string;
	description?: string;
	pdfLink?: string;
	downloadLabel?: string;
	viewerTitle?: string;
}

export function CompanyProfileViewerSection() {
	const { t } = useTranslation(["company-profile"]);
	const section = t("company-profile:companyProfileView", {
		returnObjects: true,
	}) as unknown as ProfileViewContent;

	if (!section?.pdfLink) return null;

	return (
		<section id="profile-viewer" className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/50 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<FadeUp delay={0.05}>
					<div className="mt-12 sm:mt-16 rounded-c bg-surface hairline card-shadow p-3 sm:p-4">
						<div className="relative rounded-[15px] overflow-hidden bg-primary-50/40 hairline">
							<DeferredMount
								fallback={<div className="h-[70vh] bg-primary-50/50 sm:h-[80vh]" />}
							>
								<iframe
									src={section.pdfLink}
									title={section.viewerTitle || section.headline}
									className="block h-[70vh] w-full sm:h-[80vh]"
									allow="autoplay"
									loading="lazy"
								/>
							</DeferredMount>
						</div>

						{section.downloadLabel && (
							<div className="flex justify-center py-4">
								<Link
									href={section.pdfLink.replace("/preview", "/view")}
									target="_blank"
									rel="noopener noreferrer"
									className="group inline-flex items-center gap-3 h-13 rounded-full bg-ink px-8 text-surface font-medium text-sm transition-all duration-300 hover:bg-primary"
								>
									<span className="mdi mdi-cloud-download text-lg" />
									{section.downloadLabel}
									<span className="mdi mdi-open-in-new text-base opacity-60" />
								</Link>
							</div>
						)}
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default CompanyProfileViewerSection;
