"use client";

import {
	createContext,
	useContext,
	useState,
} from "react";
import type {
	KeyboardEvent as ReactKeyboardEvent,
	MouseEvent as ReactMouseEvent,
	ReactElement,
	ReactNode,
} from "react";

interface AccordionContextValue {
	open: boolean;
	toggle: () => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordion = (): AccordionContextValue => {
	const context = useContext(AccordionContext);
	if (!context) {
		throw new Error("Accordion subcomponents must be used within an Accordion.");
	}
	return context;
};

export type AccordionProps = {
	defaultExpanded?: boolean;
	expanded?: boolean;
	/** Accepted for API parity with the previous Accordion. */
	disableGutters?: boolean;
	/** Removes the theme radius when true. */
	square?: boolean;
	className?: string;
	children?: ReactNode;
};

export function Accordion({
	defaultExpanded = false,
	expanded,
	square = false,
	className = "",
	children,
}: AccordionProps): ReactElement {
	const [openState, setOpenState] = useState(defaultExpanded);
	const open = expanded ?? openState;

	const toggle = () => {
		setOpenState((current) => !current);
	};

	return (
		<AccordionContext.Provider value={{ open, toggle }}>
			<div
				className={[
					"overflow-hidden rounded-[20px] bg-surface shadow-sm",
					square ? "rounded-none!" : "",
					className,
				]
					.filter(Boolean)
					.join(" ")}
			>
				{children}
			</div>
		</AccordionContext.Provider>
	);
}

export type AccordionSummaryProps = {
	expandIcon?: ReactNode;
	className?: string;
	children?: ReactNode;
	onClick?: (event: ReactMouseEvent<HTMLDivElement>) => void;
};

export function AccordionSummary({
	expandIcon,
	className = "",
	children,
	onClick,
}: AccordionSummaryProps): ReactElement {
	const { open, toggle } = useAccordion();

	const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
		onClick?.(event);
		toggle();
	};

	const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			toggle();
		}
	};

	return (
		<div
			role="button"
			tabIndex={0}
			aria-expanded={open}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={[
				"flex min-h-10 cursor-pointer select-none items-center justify-between gap-2 px-3 text-left outline-none transition-colors duration-300",
				"focus-visible:bg-primary-50",
				className,
			].join(" ")}
		>
			{children}
			{expandIcon != null && (
				<span
					aria-hidden="true"
					className={`inline-flex shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
				>
					{expandIcon}
				</span>
			)}
		</div>
	);
}

export type AccordionDetailsProps = {
	className?: string;
	children?: ReactNode;
};

export function AccordionDetails({
	className = "",
	children,
}: AccordionDetailsProps): ReactElement {
	const { open } = useAccordion();

	return (
		<div
			className={`grid transition-all duration-300 ease-out ${
				open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
			}`}
		>
			<div className="overflow-hidden">
				<div className={className}>{children}</div>
			</div>
		</div>
	);
}

export default Accordion;