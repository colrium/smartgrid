interface EnquiryCta {
	icon?: string;
	label: string;
	href: string;
}

interface EnquiryButtonsProps {
	primary?: EnquiryCta | null;
	secondary?: EnquiryCta | null;
	className?: string;
}

const isExternal = (href: string) =>
	href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel") || href.startsWith("wa.me");

export function EnquiryButtons({
	primary,
	secondary,
	className = "",
}: EnquiryButtonsProps) {
	if (!primary?.href && !secondary?.href) return null;

	return (
		<div className={`flex flex-wrap items-center gap-4 ${className}`}>
			{primary?.href && (
				<a
					href={primary.href}
					{...(isExternal(primary.href)
						? { target: "_blank", rel: "noopener noreferrer" }
						: {})}
					className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(0,151,178,0.6)]"
				>
					{primary.icon && (
						<span className={`mdi mdi-${primary.icon} text-xl`} />
					)}
					{primary.label}
					<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
				</a>
			)}

			{secondary?.href && (
				<a
					href={secondary.href}
					{...(isExternal(secondary.href)
						? { target: "_blank", rel: "noopener noreferrer" }
						: {})}
					className="group inline-flex items-center gap-3 h-14 rounded-full border border-ink/15 px-8 text-ink font-medium text-base transition-all duration-300 hover:border-primary hover:text-primary"
				>
					{secondary.icon && (
						<span className={`mdi mdi-${secondary.icon} text-xl`} />
					)}
					{secondary.label}
				</a>
			)}
		</div>
	);
}

export default EnquiryButtons;