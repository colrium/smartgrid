import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';

type ErrorPageSectionProps = {
	statusCode: number;
	statusLabel: string;
	title: string;
	description: string;
	homeLabel: string;
	contactLabel: string;
	detail?: string;
};

export default function ErrorPageSection({
	statusCode,
	statusLabel,
	title,
	description,
	homeLabel,
	contactLabel,
	detail,
}: ErrorPageSectionProps) {
	return (
		<section className="relative min-h-[72vh] overflow-hidden px-6 py-24 md:px-8 md:py-32">
			<div
				className="absolute inset-0 pointer-events-none"
				
			/>
			<div className="relative z-10 mx-auto flex max-w-[980px] flex-col items-start">
				<div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-primary">
					{statusLabel}
				</div>

				<div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:gap-12">
					<p className="text-[clamp(5rem,18vw,13rem)] leading-none text-primary">
						{statusCode}
					</p>
					<div className="max-w-[620px] pb-4">
						<h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.96] tracking-tight text-onSurface-800">
							{title}
						</h1>
						<p className="mt-6 text-base font-light leading-[1.8] text-onSurface-900 md:text-lg">
							{description}
						</p>
						{detail ? (
							<pre className="mt-6 max-h-64 overflow-auto whitespace-pre-wrap rounded border border-primary/20 bg-black/40 p-4 text-xs leading-relaxed text-onSurface-900">
								{detail}
							</pre>
						) : null}
					</div>
				</div>

				<div className="mt-10 flex flex-col gap-3 sm:flex-row">
					<Link
						href="/"
						className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-6 py-3 text-sm font-medium text-surface transition-all hover:bg-transparent"
					>
						<ArrowBackIcon fontSize="small" />
						{homeLabel}
					</Link>
					<Link
						href="/contact"
						className="inline-flex items-center justify-center gap-2 rounded border border-primary/30 bg-transparent px-6 py-3 text-sm font-medium text-primary transition-all hover:border-primary hover:bg-primary/10"
					>
						<MailOutlinedIcon fontSize="small" />
						{contactLabel}
					</Link>
				</div>
			</div>
		</section>
	);
}
