import Link from "next/link";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import GavelIcon from "@mui/icons-material/Gavel";

type LegalSection = {
	title: string;
	content: string[] | string;
};

type LegalPageSectionProps = {
	label: string;
	title: string;
	description: string;
	lastUpdated: string;
	sections: LegalSection[];
	contactHref?: string;
    note?: string;
	contactLabel?: string;
};

export default function LegalPageSection({
	label,
	title,
	description,
	lastUpdated,
	sections,
	contactHref = "/contact",
    contactLabel = "Contact Us",
    note = "",
}: LegalPageSectionProps) {
	return (
		<section className="relative overflow-hidden pt-24 pb-20 md:pt-48 md:pb-28">
			
			<div className="relative z-10 max-w-[980px] mx-auto px-6 md:px-8">
				<div className="mb-12">
					<span className="inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-primary mb-4">
						<GavelIcon fontSize="small" />
						{label}
					</span>
					<h1 className="text-[clamp(2.7rem,6vw,5.4rem)] leading-[0.96] tracking-tight text-on-surface-800 max-w-[820px]">
						{title}
					</h1>
					<p className="mt-7 text-base md:text-lg text-on-surface-800 font-light leading-[1.8] max-w-[740px]">
						{description}
					</p>
					<div className="mt-7 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-primary">
						{lastUpdated}
					</div>
				</div>

				<div className="rounded-lg  bg-surface ">
					{sections.map((section, index) => (
						<article
							key={section.title}
							className={`p-6 md:p-8 ${
								index > 0 ? "border-t border-surface-900/10" : ""
							}`}
						>
							<h2 className="text-2xl md:text-3xl text-on-surface-800">
								{section.title}
							</h2>
							<div className="mt-4 space-y-4">
								{Array.isArray(section.content) ? (
									section.content.map((paragraph, j) => (
										<p
											key={`content-${index}-${j}`}
											className="text-sm md:text-base text-on-surface-800 font-light leading-[1.8]"
										>
											{paragraph}
									</p>
								))) : (
                                    <p className="text-sm md:text-base text-on-surface-800 font-light leading-[1.8]" key={`content-${index}`}>
                                        {section.content}
                                    </p>
                                )}
							</div>
						</article>
					))}
				</div>

				<div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-lg border border-primary/20 bg-surface-900 p-6">
					<p className="text-sm text-on-surface-800 leading-relaxed max-w-[620px]">
						{note || ""}
					</p>
					<Link
						href={contactHref}
						className="inline-flex items-center justify-center gap-2 rounded border border-primary bg-primary px-6 py-3 text-sm font-medium text-surface hover:bg-primary transition-all"
					>
						{contactLabel}
						<ArrowOutwardIcon fontSize="small" />
					</Link>
				</div>
			</div>
		</section>
	);
}
