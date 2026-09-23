import * as React from "react";
import { useTranslation } from "@/hooks";
import { motion, useMotionValue, useTransform, HTMLMotionProps } from "framer-motion";
import { useLenis } from "lenis/react";
interface Props extends HTMLMotionProps<"button"> {
	children?: React.ReactElement<unknown>;
	querySelector?: string;
	anchorRef?: React.RefObject<HTMLDivElement | null>;
	threshold?: number; //scroll ratio
}

const ScrollTop = ({
	children,
	querySelector,
	anchorRef,
	threshold = 0.2,
	style = {},
	className = "",
	...rest
}: Props) => {
	const { t } = useTranslation("common");
	const thresholdReached = useMotionValue(0);
    const lenis = useLenis();
	useLenis(
		({ scroll, limit }) => {
			const show = scroll / limit >= threshold ? 1 : 0;
			const showing = thresholdReached.get();
			if (showing !== show) {
				thresholdReached.set(show);
			}
		},
		[threshold]
	);
	const scale = useTransform(thresholdReached, [0, 1], [0, 1]);

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        
		let anchorElem = anchorRef?.current;
        if (!anchorElem && querySelector) {
			anchorElem = ((event.target as HTMLElement).ownerDocument || document).querySelector(
							querySelector
						);
		}
		if (lenis && anchorElem) {
			// 3. Trigger the smooth animation
			lenis.scrollTo(anchorElem, {
				duration: 1.5, // Animation duration in seconds
				offset: 0, // Offset from the top (useful for sticky headers)
				easing: (t) => 1 - Math.pow(1 - t, 4), // Custom easing function (EaseOutQuart)
				immediate: false, // Set to true to bypass animation entirely
			});
		}
        else if (anchorElem) {
			anchorElem.scrollIntoView({
				block: "center",
				behavior: "smooth",
				inline: "nearest",
			});
		}
	}, [anchorRef, lenis, querySelector]);

	return (
		<motion.button
			data-ripple-dark="true"
			className={` h-10 max-h-[40px] w-10 max-w-[40px] rounded-full bg-ink p-1 border border-transparent text-center text-md text-surface hover:text-surface transition-all shadow-sm  hover:shadow-lg focus:shadow-none  hover:bg-primary active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none cursor-pointer ${className}`}
			type="button"
			onClick={handleClick}
			style={{ ...style, scale: scale }}
			aria-label={t("common:chat.scrollTopLabel", {
				defaultValue: "Scroll back to top",
			})}
			{...rest}
		>
			{children ?? <span className="mdi mdi-chevron-up text-inherit" />}
		</motion.button>
	);
};

export default ScrollTop;
