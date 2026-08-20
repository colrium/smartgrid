import Link from "next/link";

interface Crumb {
	label: string;
	href?: string;
}

interface BreadcrumbsProps {
	items: Crumb[];
	className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
	return (
		<nav
			aria-label="Breadcrumb"
			className={`flex flex-wrap items-center gap-2 text-xs sm:text-sm text-on-surface/55 ${className}`}
		>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;
				return (
					<span key={index} className="flex items-center gap-2">
						{item.href && !isLast ? (
							<Link
								href={item.href}
								className="transition-colors hover:text-primary"
							>
								{item.label}
							</Link>
						) : (
							<span className={isLast ? "text-ink font-medium" : ""}>{item.label}</span>
						)}
						{!isLast && <span className="mdi mdi-chevron-right text-on-surface/30" />}
					</span>
				);
			})}
		</nav>
	);
}

export default Breadcrumbs;