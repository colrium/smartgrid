"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export interface SliderSlide {
	image?: string | null;
	title?: string;
	description?: string;
	alt?: string;
}

interface SliderProps {
	slides: SliderSlide[];
	autoplay?: number;
	showArrows?: boolean;
	showDots?: boolean;
	className?: string;
}

const SLIDE_VARIANTS = {
	enter: (direction: number) => ({
		x: direction > 0 ? 64 : -64,
		opacity: 0,
		scale: 0.98,
	}),
	center: { x: 0, opacity: 1, scale: 1 },
	exit: (direction: number) => ({
		x: direction > 0 ? -64 : 64,
		opacity: 0,
		scale: 0.98,
	}),
};

export function Slider({
	slides,
	autoplay = 0,
	showArrows = true,
	showDots = true,
	className = "",
}: SliderProps) {
	const count = slides.length;
	const [index, setIndex] = useState(0);
	const [direction, setDirection] = useState(1);
	const [paused, setPaused] = useState(false);
	const touchStartX = useRef<number | null>(null);

	const go = useCallback(
		(next: number, dir: number) => {
			if (count <= 1) return;
			setDirection(dir);
			setIndex((current) => (next + count) % count);
		},
		[count],
	);

	const next = useCallback(() => go(index + 1, 1), [go, index]);
	const prev = useCallback(() => go(index - 1, -1), [go, index]);

	useEffect(() => {
		if (autoplay <= 0 || paused) return;
		const timer = setInterval(() => {
			setDirection(1);
			setIndex((current) => (current + 1) % count);
		}, autoplay);
		return () => clearInterval(timer);
	}, [autoplay, paused, count]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") next();
			if (e.key === "ArrowLeft") prev();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [next, prev]);

	if (count === 0) return null;

	const slide = slides[index];
	const hasImage = typeof slide.image === "string" && slide.image.startsWith("/");

	return (
		<div
			className={`relative select-none ${className}`}
			onMouseEnter={() => autoplay > 0 && setPaused(true)}
			onMouseLeave={() => autoplay > 0 && setPaused(false)}
			onTouchStart={(e) => {
				touchStartX.current = e.touches[0].clientX;
			}}
			onTouchEnd={(e) => {
				if (touchStartX.current === null) return;
				const delta = e.changedTouches[0].clientX - touchStartX.current;
				if (Math.abs(delta) > 48) {
					if (delta < 0) next();
					else prev();
				}
				touchStartX.current = null;
			}}
		>
			<div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[21/10] overflow-hidden rounded-[20px] hairline card-shadow bg-surface">
				<AnimatePresence initial={false} custom={direction} mode="popLayout">
					<motion.div
						key={index}
						custom={direction}
						variants={SLIDE_VARIANTS}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
						className="absolute inset-0"
					>
						{hasImage ? (
							<Image
								src={slide.image as string}
								alt={slide.alt || slide.title || `Slide ${index + 1}`}
								fill
								sizes="(min-width: 1024px) 80vw, 100vw"
								className="object-cover object-center"
							/>
						) : (
							<div className="absolute inset-0 ink-panel" />
						)}
						<div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

						{(slide.title || slide.description) && (
							<div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
								{slide.title && (
									<h3 className="text-lg sm:text-2xl font-medium tracking-tight text-white">
										{slide.title}
									</h3>
								)}
								{slide.description && (
									<p className="mt-2 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">
										{slide.description}
									</p>
								)}
							</div>
						)}
					</motion.div>
				</AnimatePresence>

				{showArrows && count > 1 && (
					<>
						<button
							type="button"
							aria-label="Previous slide"
							onClick={prev}
							className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-surface/85 backdrop-blur text-ink flex items-center justify-center shadow-lg transition-colors duration-300 hover:bg-primary hover:text-white cursor-pointer"
						>
							<span className="mdi mdi-chevron-left text-2xl" />
						</button>
						<button
							type="button"
							aria-label="Next slide"
							onClick={next}
							className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-surface/85 backdrop-blur text-ink flex items-center justify-center shadow-lg transition-colors duration-300 hover:bg-primary hover:text-white cursor-pointer"
						>
							<span className="mdi mdi-chevron-right text-2xl" />
						</button>
					</>
				)}
			</div>

			{showDots && count > 1 && (
				<div className="mt-6 flex items-center justify-center gap-2.5">
					{slides.map((_, dotIndex) => (
						<button
							key={dotIndex}
							type="button"
							aria-label={`Go to slide ${dotIndex + 1}`}
							onClick={() => go(dotIndex, dotIndex > index ? 1 : -1)}
							className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
								dotIndex === index
									? "w-8 bg-primary"
									: "w-2 bg-ink/15 hover:bg-ink/30"
							}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default Slider;