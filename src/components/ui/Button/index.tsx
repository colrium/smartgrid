import { forwardRef } from "react";
import type {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	ReactElement,
	ReactNode,
	Ref,
} from "react";

export type ButtonVariant = "contained" | "outlined" | "text";
export type ButtonColor = "inherit" | "primary" | "secondary" | "accent" | "success" | "error";
export type ButtonSize = "small" | "medium" | "large";

export type ButtonProps = {
	/** Visual style of the button. Defaults to "text". */
	variant?: ButtonVariant;
	/** Color token (from globals.css). Defaults to "primary". */
	color?: ButtonColor;
	size?: ButtonSize;
	fullWidth?: boolean;
	/** "default" follows the theme shape radius (20px), "full" renders a pill. */
	rounded?: "default" | "full";
	startIcon?: ReactNode;
	endIcon?: ReactNode;
	disableElevation?: boolean;
	className?: string;
	children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement> &
	AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Ripple side. Contained colored surfaces get a light (white) ripple,
 * everything on light surfaces gets a dark (ink) ripple.
 */
const rippleAttribute = (variant: ButtonVariant, color: ButtonColor): Record<string, "true"> => {
	if (variant === "contained" && color !== "inherit") {
		return { "data-ripple-light": "true" };
	}
	return { "data-ripple-dark": "true" };
};

const variantClasses: Record<ButtonVariant, Record<ButtonColor, string>> = {
	contained: {
		primary: "border border-primary bg-primary text-surface shadow-sm hover:bg-primary-600 hover:shadow-md",
		secondary: "border border-secondary bg-secondary text-surface shadow-sm hover:bg-secondary/85 hover:shadow-md",
		accent: "border border-accent bg-accent text-surface shadow-sm hover:bg-accent-600 hover:shadow-md",
		inherit: "border border-ink bg-ink text-surface shadow-sm hover:bg-ink-soft hover:shadow-md",
		success: "border border-whatsapp bg-whatsapp text-surface shadow-sm hover:shadow-md",
		error: "border border-gmail bg-gmail text-surface shadow-sm hover:shadow-md",
	},
	outlined: {
		primary: "border border-primary/40 bg-transparent text-primary hover:border-primary hover:bg-primary-50",
		secondary: "border border-ink/30 bg-transparent text-ink hover:border-ink hover:bg-ink/5",
		accent: "border border-accent/40 bg-transparent text-accent hover:border-accent hover:bg-accent-50",
		inherit: "border border-current bg-transparent text-inherit hover:bg-ink/5",
		success: "border border-whatsapp/60 bg-transparent text-whatsapp hover:bg-whatsapp/10",
		error: "border border-gmail/60 bg-transparent text-gmail hover:bg-gmail/10",
	},
	text: {
		primary: "bg-transparent text-primary hover:bg-primary-50",
		secondary: "bg-transparent text-ink hover:bg-ink/5",
		accent: "bg-transparent text-accent hover:bg-accent-50",
		inherit: "bg-transparent text-inherit hover:bg-ink/5",
		success: "bg-transparent text-whatsapp hover:bg-whatsapp/10",
		error: "bg-transparent text-gmail hover:bg-gmail/10",
	},
};

/** Padding/scale per size — mirrors the MUI text/contained paddings. */
const sizeClasses: Record<ButtonVariant, Record<ButtonSize, string>> = {
	text: {
		small: "px-[5px] py-1 text-xs",
		medium: "px-2 py-2 text-sm",
		large: "px-[11px] py-2 text-base",
	},
	contained: {
		small: "px-2.5 py-1 text-xs",
		medium: "px-[22px] py-2 text-sm",
		large: "px-[22px] py-2.5 text-base",
	},
	outlined: {
		small: "px-2.5 py-1 text-xs",
		medium: "px-[22px] py-2 text-sm",
		large: "px-[22px] py-2.5 text-base",
	},
};

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(props, ref): ReactElement {
	const {
		variant = "text",
		color = "primary",
		size = "medium",
		fullWidth = false,
		rounded = "default",
		startIcon,
		endIcon,
		disableElevation = false,
		className = "",
		children,
		href,
		type,
		...rest
	} = props;

	const classes = [
		"relative inline-flex select-none items-center justify-center gap-2 overflow-hidden font-medium normal-case tracking-normal no-underline outline-none transition-all duration-300 cursor-pointer",
		"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
		"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
		variantClasses[variant][color],
		sizeClasses[variant][size],
		rounded === "full" ? "rounded-full" : "rounded-c",
		fullWidth ? "w-full" : "",
		disableElevation ? "shadow-none! hover:shadow-none!" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const ripple = rippleAttribute(variant, color);

	if (typeof href === "string" && href.length > 0) {
		return (
			<a
				ref={ref as Ref<HTMLAnchorElement>}
				href={href}
				className={classes}
				{...ripple}
				{...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
			>
				{startIcon}
				{children}
				{endIcon}
			</a>
		);
	}

	return (
		<button
			ref={ref as Ref<HTMLButtonElement>}
			type={type ?? "button"}
			className={classes}
			{...ripple}
			{...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{startIcon}
			{children}
			{endIcon}
		</button>
	);
});

export default Button;