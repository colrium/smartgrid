"use client";

import {
	createPortal,
} from "react-dom";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import type {
	CSSProperties,
	MouseEventHandler,
	ReactElement,
	ReactNode,
} from "react";

export type MenuOrigin = {
	vertical?: "top" | "bottom" | "center" | number;
	horizontal?: "left" | "right" | "center" | number;
};

export type MenuProps = {
	open: boolean;
	anchorEl: HTMLElement | null;
	onClose: () => void;
	anchorOrigin?: MenuOrigin;
	transformOrigin?: MenuOrigin;
	className?: string;
	style?: CSSProperties;
	/** ARIA role for the popup container. Defaults to "menu". */
	role?: string;
	children?: ReactNode;
	onMouseEnter?: MouseEventHandler<HTMLDivElement>;
	onMouseLeave?: MouseEventHandler<HTMLDivElement>;
};

const useIsoLayoutEffect: typeof useLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect;

type MenuPosition = { top: number; left: number; transform: string; anchorWidth: number };

/**
 * Anchored dropdown menu. Renders into document.body with fixed positioning
 * (portalling avoids clipping/containing-block issues from ancestors with
 * backdrop filters). Closes on outside mousedown and Escape, and repositions
 * on scroll and resize.
 */
export function Menu({
	open,
	anchorEl,
	onClose,
	anchorOrigin,
	transformOrigin,
	className = "",
	style,
	role = "menu",
	children,
	onMouseEnter,
	onMouseLeave,
}: MenuProps): ReactElement | null {
	const menuRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState<MenuPosition | null>(null);

	const updatePosition = useCallback(() => {
		if (!anchorEl) {
			return;
		}
		const rect = anchorEl.getBoundingClientRect();
		const ao = { vertical: "bottom", horizontal: "left", ...anchorOrigin } as Required<MenuOrigin>;
		const to = { vertical: "top", horizontal: "left", ...transformOrigin } as Required<MenuOrigin>;

		const top =
			ao.vertical === "bottom"
				? rect.bottom
				: ao.vertical === "center"
					? rect.top + rect.height / 2
					: typeof ao.vertical === "number"
						? rect.top + ao.vertical
						: rect.top;
		const left =
			ao.horizontal === "right"
				? rect.right
				: ao.horizontal === "center"
					? rect.left + rect.width / 2
					: typeof ao.horizontal === "number"
						? rect.left + ao.horizontal
						: rect.left;
		const ty = to.vertical === "bottom" ? "-100%" : to.vertical === "center" ? "-50%" : "0%";
		const tx = to.horizontal === "right" ? "-100%" : to.horizontal === "center" ? "-50%" : "0%";

		setPosition({ top, left, transform: `translate(${tx}, ${ty})`, anchorWidth: rect.width });
	}, [anchorEl, anchorOrigin, transformOrigin]);

	useIsoLayoutEffect(() => {
		if (!open || !anchorEl) {
			return;
		}
		updatePosition();

		const handleDocumentMouseDown = (event: MouseEvent) => {
			const target = event.target as Node | null;
			if (!target) {
				return;
			}
			// Ignore clicks inside the menu or on the anchor (toggling is
			// handled by the anchor's own click handler).
			if (menuRef.current?.contains(target) || anchorEl.contains(target)) {
				return;
			}
			onClose();
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleDocumentMouseDown);
		document.addEventListener("keydown", handleKeyDown);
		window.addEventListener("scroll", updatePosition, true);
		window.addEventListener("resize", updatePosition);

		return () => {
			document.removeEventListener("mousedown", handleDocumentMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("scroll", updatePosition, true);
			window.removeEventListener("resize", updatePosition);
		};
	}, [open, anchorEl, onClose, updatePosition]);

	if (!open || !anchorEl) {
		return null;
	}

	return createPortal(
		<div
			ref={menuRef}
			role={role}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			style={
				{
					position: "fixed",
					top: position?.top,
					left: position?.left,
					transform: position?.transform,
					zIndex: 1300,
					minWidth: position ? Math.max(position.anchorWidth, 0) : undefined,
					...style,
				} as CSSProperties
			}
			className={`outline-none ${className}`}
		>
			{children}
		</div>,
		document.body
	);
}

export default Menu;