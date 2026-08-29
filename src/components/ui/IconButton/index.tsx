import { forwardRef } from "react";
import type {
	ButtonHTMLAttributes,
	HTMLAttributes,
	ReactElement,
	ReactNode,
	Ref,
} from "react";

export type IconButtonProps = {
	/** Renders a non-interactive span (for nesting inside buttons). Defaults to "button". */
	as?: "button" | "span";
	size?: "small" | "medium" | "large";
	color?: "inherit" | "primary" | "accent";
	/** Attach the dark ripple handler (data-ripple-dark). Defaults to true. */
	ripple?: boolean;
	className?: string;
	children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement> &
	HTMLAttributes<HTMLSpanElement>;

const sizeClasses = {
	small: "h-7 w-7 text-lg",
	medium: "h-10 w-10 text-2xl",
	large: "h-12 w-12 text-2xl",
} as const;

const colorClasses = {
	inherit: "text-inherit",
	primary: "text-primary",
	accent: "text-accent",
} as const;

export const IconButton = forwardRef<HTMLElement, IconButtonProps>(function IconButton(
	props,
	ref
): ReactElement {
	const {
		as = "button",
		size = "medium",
		color = "inherit",
		ripple = true,
		className = "",
		children,
		type,
		...rest
	} = props;

	const classes = [
		"inline-flex cursor-pointer select-none items-center justify-center overflow-hidden rounded-full bg-transparent align-middle outline-none transition-colors duration-300",
		"hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-primary",
		"disabled:pointer-events-none disabled:opacity-50",
		sizeClasses[size],
		colorClasses[color],
		className,
	].join(" ");

	const rippleProps = ripple ? { "data-ripple-dark": "true" } : {};

	if (as === "span") {
		return (
			<span
				ref={ref as Ref<HTMLSpanElement>}
				className={classes}
				{...rippleProps}
				{...(rest as HTMLAttributes<HTMLSpanElement>)}
			>
				{children}
			</span>
		);
	}

	return (
		<button
			ref={ref as Ref<HTMLButtonElement>}
			type={type ?? "button"}
			className={classes}
			{...rippleProps}
			{...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{children}
		</button>
	);
});

export default IconButton;