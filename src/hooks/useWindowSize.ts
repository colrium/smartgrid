import { useState, useEffect, useMemo } from "react";
type WindowSize = {
	width: number | undefined;
	height: number | undefined;
};

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

const useWindowSize = (): WindowSize => {
	const [size, setSize] = useState<WindowSize>({
		width: undefined,
		height: undefined,
	});
	useEffect(() => {
		function handleResize(): void {
			setSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		handleResize();
		window.addEventListener("resize", handleResize);
		return (): void => window.removeEventListener("resize", handleResize);
	}, []);

	return size;
};

const getBreakpoint = (width: number | undefined): Breakpoint => {
	if (width === undefined) return "xs";
	if (width <= 576) return "xs";
	if (width <= 768) return "sm";
	if (width <= 992) return "md";
	if (width <= 1200) return "lg";
	return "xl";
};

export const useBreakpoint = (): Breakpoint => {
	const { width } = useWindowSize();

	return useMemo(() => getBreakpoint(width), [width]);
};

export default useWindowSize;