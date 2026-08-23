import Image from "next/image";
import Link from "next/link";

interface Crumb {
	label: string;
	href?: string;
}

interface BreadcrumbsProps {
	items: Crumb[];
	className?: string;
	/** Optional image rendered as a cover-fit backdrop behind the crumbs */
	image?: string;
}

export function Breadcrumbs({ items, className = "", image }: BreadcrumbsProps) {
	const hasImage = typeof image === "string" && image.startsWith("/");

	return (
		<nav
			aria-label="Breadcrumb"
			className={[
				"relative flex flex-wrap items-end gap-2 text-xs sm:text-sm",
				hasImage
					? " min-h-64 overflow-hidden text-surface/85 card-shadow md:min-h-120"
					: "text-on-surface/55",
				className,
			].join(" ")}
		>
			{hasImage && (
				<>
					<Image
						src={image}
						alt=""
						fill
						sizes="(min-width: 1280px) 80rem, 100vw"
						className="object-cover object-center"
					/>
					<span
						aria-hidden
						className="absolute inset-0 bg-linear-to-r from-ink/80 via-ink/50 to-ink/15"
					/>
				</>
			)}
			<div className="w-3xl max-w-3xl md:w-7xl md:max-w-7xl mx-auto py-5 pb-8 px-4 md:px-8">
				<span
					className={`relative z-10 flex flex-wrap items-center gap-2 ${
						hasImage ? "[text-shadow:0_1px_2px_rgb(0_0_0/0.45)]" : ""
					}`}
				>
					{items.map((item, index) => {
						const isLast = index === items.length - 1;
						return (
							<span key={index} className="flex items-center gap-2">
								{item.href && !isLast ? (
									<Link
										href={item.href}
										className={`transition-colors ${
											hasImage ? "hover:text-white" : "hover:text-primary"
										}`}
									>
										{item.label}
									</Link>
								) : (
									<span
										className={
											isLast
												? `font-medium ${hasImage ? "text-white" : "text-ink"}`
												: ""
										}
									>
										{item.label}
									</span>
								)}
								{!isLast && (
									<span
										className={`mdi mdi-chevron-right ${
											hasImage ? "text-surface/60" : "text-on-surface/30"
										}`}
									/>
								)}
							</span>
						);
					})}
				</span>
			</div>
		</nav>
	);
}

export default Breadcrumbs;
