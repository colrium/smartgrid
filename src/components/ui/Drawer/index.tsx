"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactElement, ReactNode } from "react";

export type DrawerProps = {
	open: boolean;
	onClose: () => void;
	anchor?: "left" | "right";
	/** Classes for the sliding panel (paper). */
	panelClassName?: string;
	/** Classes for the fixed overlay wrapper. */
	wrapperClassName?: string;
	children?: ReactNode;
};

/**
 * Slide-over drawer with a backdrop, rendered into document.body. Closes on
 * Escape and backdrop click.
 */
export function Drawer({
	open,
	onClose,
	anchor = "left",
	panelClassName = "",
	wrapperClassName = "",
	children,
}: DrawerProps): ReactElement | null {
	useEffect(() => {
		if (!open) {
			return;
		}
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onClose]);

	if (!open) {
		return null;
	}

	return createPortal(
		<div
			aria-hidden={!open}
			className={`fixed inset-0 z-[1200] ${wrapperClassName}`}
		>
			<div
				onClick={onClose}
				aria-hidden="true"
				className="absolute inset-0 bg-ink/50 opacity-100 transition-opacity duration-300"
			/>
			<aside
				role="dialog"
				aria-modal="true"
				className={[
					"absolute top-0 h-full w-[280px] max-w-[85vw] overflow-y-auto bg-surface shadow-2xl transition-transform duration-300 ease-out",
					anchor === "left" ? "left-0" : "right-0",
					open
						? "translate-x-0"
						: anchor === "left"
							? "-translate-x-full"
							: "translate-x-full",
					panelClassName,
				].join(" ")}
			>
				{children}
			</aside>
		</div>,
		document.body
	);
}

export default Drawer;