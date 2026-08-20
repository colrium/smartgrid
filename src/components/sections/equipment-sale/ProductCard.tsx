import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
	image?: string | null;
	label: string;
	href: string;
	className?: string;
}

export function ProductCard({ image, label, href, className = "" }: ProductCardProps) {
	return (
		<Link
			href={href}
			className={`group block h-full rounded-[20px] bg-surface hairline card-shadow p-5 transition-all duration-500 hover:card-shadow-lift hover:border-primary ${className}`}
		>
			<div className="relative aspect-square rounded-[15px] overflow-hidden bg-primary-50/60">
				{image && (
					<Image
						src={image}
						alt={label}
						fill
						sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
						className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
					/>
				)}
				<span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/85 text-primary shadow-sm backdrop-blur transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
					<span className="mdi mdi-arrow-right text-base" />
				</span>
			</div>

			<div className="mt-5 flex items-center justify-between gap-3">
				<h3 className="text-sm font-semibold tracking-wide text-ink">{label}</h3>
				<span className="text-[11px] font-medium uppercase tracking-wider text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
					View
				</span>
			</div>
		</Link>
	);
}

export default ProductCard;