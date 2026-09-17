// components/ScrollIndicator.tsx
import React, { ComponentProps } from "react";

interface ScrollIndicatorProps extends ComponentProps<"button"> {
	className?: string;
	color?: string;
	onClick?: () => void;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ className = "", color = "accent" }) => {
	return (
		<div className={`flex items-center gap-5 ${className}`}>
			<div
				className={`relative flex h-[3.25rem] w-8 justify-center rounded-full border-[2.5px] border-${color}`}
			>
				<span
					className={`mt-2 h-3 w-[2.5px] animate-scroll-line rounded-full bg-${color}`}
				/>
			</div>
		</div>
	);
};

export default ScrollIndicator;
