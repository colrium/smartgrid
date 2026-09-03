import React from "react";

export interface RevealCardProps {
	/** Card theme variant. Defaults to 'light'. */
	variant?: "light" | "dark";
	/** Media element (image, video, canvas, etc.) rendered at the top of the card. */
	media: React.ReactNode;
	/** Title content displayed in the section. */
	title: React.ReactNode;
	/** Main body content/description. */
	children?: React.ReactNode;
	/** Metadata tag element displayed in the card footer. */
	tag?: React.ReactNode;
	/** Primary interactive element (e.g., button) displayed in the card footer. */
	actionElement?: React.ReactNode;
	/** Optional additional CSS classes for the card container. */
	className?: string;
}

export const RevealCard: React.FC<RevealCardProps> = ({
	variant = "light",
	media,
	title,
	children,
	tag,
	actionElement,
	className = "",
}) => {
	const isDark = variant === "dark";

	return (
		<div
			className={`group relative aspect-[2/3] w-full max-w-screen overflow-hidden rounded-c  font-sans transition-colors duration-300 ${
				isDark ? " text-surface" : " text-ink"
			} ${className}`}
		>
			{/* Glassmorphism gradient overlay (z-10) */}
			<div
				className="pointer-events-none absolute bottom-0 left-0 z-10 h-[30%] w-full translate-y-0 rounded-b-c backdrop-blur-md transition-transform duration-250 group-hover:translate-y-full group-focus-within:translate-y-full [mask-image:linear-gradient(to_bottom,transparent,black_80%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_80%)] [mask-image:linear-gradient(to_bottom,transparent,black_80%)]"
				aria-hidden="true"
			/>

			{/* Media Container */}
			<div className="h-full w-full overflow-hidden rounded-c transition-[aspect-ratio] duration-250 group-hover:h-3/5 group-focus-within:h-3/5 [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:object-[50%_5%] [&_img]:transition-[object-position] [&_img]:duration-500 group-hover:[&_img]:object-[50%_10%] group-focus-within:[&_img]:object-[50%_10%]">
				{media}
			</div>

			{/* Content Section (z-20 brings title above blur overlay) */}
			<section className="relative z-20 m-4 flex h-[calc(33.3333%-1rem)] flex-col">
				{/* Title */}
				<h5
					className={`m-0 -translate-y-[200%] mb-6 text-lg font-bold transition-all duration-250 group-hover:translate-y-0 group-hover:mb-2 group-focus-within:translate-y-0 group-focus-within:mb-2 ${
						isDark
							? "text-ink-300 group-hover:text-ink-700 group-focus-within:text-ink-700"
							: "text-surface group-hover:text-surface group-focus-within:text-surface"
					}`}
				>
					{title}
				</h5>

				{/* Description / Children */}
				<div
					className={`translate-y-full text-[0.95rem] leading-[1.3] opacity-0 transition-all duration-250 delay-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
						isDark ? "text-surface/80" : "text-ink/70"
					}`}
				>
					{children}
				</div>

				{/* Card Footer */}
				<div className="flex flex-1 translate-y-full items-end justify-between opacity-0 transition-all duration-250 p-2 delay-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
					<div className={`self-center ${isDark ? "text-surface" : "text-ink"}`}>
						{tag}
					</div>
					<div>{actionElement}</div>
				</div>
			</section>
		</div>
	);
};

export default RevealCard;
