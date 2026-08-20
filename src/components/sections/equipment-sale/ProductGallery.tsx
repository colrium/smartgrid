"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
	images: string[];
	alt: string;
	className?: string;
}

export function ProductGallery({ images, alt, className = "" }: ProductGalleryProps) {
	const [active, setActive] = useState(0);
	const count = images.length;

	const go = useCallback(
		(next: number) => {
			if (count <= 1) return;
			setActive((current) => (next + count) % count);
		},
		[count],
	);

	useEffect(() => {
		if (active >= count) setActive(0);
	}, [active, count]);

	if (count === 0) return null;

	const current = images[active] ?? images[0];

	return (
		<div className={`flex flex-col gap-4 sm:gap-5 ${className}`}>
			<div className="group relative aspect-square overflow-hidden rounded-[20px] bg-surface hairline card-shadow">
				<span
					aria-hidden
					className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary-100/70 blur-3xl"
				/>
				<span
					aria-hidden
					className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-primary-200/40 blur-3xl"
				/>

				<div className="relative z-10 h-full w-full p-6 sm:p-8">
					<Image
						src={current}
						alt={`${alt} - image ${active + 1}`}
						fill
						sizes="(min-width: 1024px) 45vw, 100vw"
						className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.03]"
						priority={active === 0}
					/>
				</div>

				{count > 1 && (
					<>
						<button
							type="button"
							aria-label="Previous image"
							onClick={() => go(active - 1)}
							className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-surface/85 text-ink shadow-md backdrop-blur transition-colors duration-300 hover:bg-primary hover:text-surface cursor-pointer"
						>
							<span className="mdi mdi-chevron-left text-2xl" />
						</button>
						<button
							type="button"
							aria-label="Next image"
							onClick={() => go(active + 1)}
							className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-surface/85 text-ink shadow-md backdrop-blur transition-colors duration-300 hover:bg-primary hover:text-surface cursor-pointer"
						>
							<span className="mdi mdi-chevron-right text-2xl" />
						</button>
					</>
				)}
			</div>

			{count > 1 && (
				<div className="grid grid-cols-5 gap-3">
					{images.map((image, index) => (
						<button
							key={image + index}
							type="button"
							aria-label={`Show image ${index + 1}`}
							onClick={() => setActive(index)}
							className={`relative aspect-square overflow-hidden rounded-xl bg-surface transition-all duration-300 cursor-pointer ${
								index === active
									? "ring-2 ring-primary border-transparent"
									: "hairline hover:border-primary/50"
							}`}
						>
							<Image
								src={image}
								alt={`${alt} thumbnail ${index + 1}`}
								fill
								sizes="120px"
								className="object-contain object-center p-1.5"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default ProductGallery;