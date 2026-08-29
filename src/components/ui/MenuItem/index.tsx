import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactElement, ReactNode } from "react";

export type MenuItemProps = {
	/** Option value (used by Select). */
	value?: string;
	selected?: boolean;
	disabled?: boolean;
	/** Renders the item as a next/link anchor. */
	href?: string;
	className?: string;
	children?: ReactNode;
} & HTMLAttributes<HTMLDivElement> &
	AnchorHTMLAttributes<HTMLAnchorElement>;

export function MenuItem({
	selected = false,
	disabled = false,
	href,
	className = "",
	children,
	...rest
}: MenuItemProps): ReactElement {
	const classes = [
		"flex w-full cursor-pointer  select-none items-center justify-between gap-3 rounded-lg px-4 py-2 text-left text-sm outline-none transition-colors duration-200",
		disabled
			? "pointer-events-none opacity-40"
			: "hover:bg-primary/10 focus-visible:bg-primary/10",
		selected && !disabled ? "bg-primary/10" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	if (typeof href === "string") {
		return (
			<Link
				href={href}
				aria-disabled={disabled || undefined}
				className={classes}
				{...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
			>
				{children}
			</Link>
		);
	}

	return (
		<div
			role="menuitem"
			tabIndex={disabled ? -1 : 0}
			aria-disabled={disabled || undefined}
			onClick={disabled ? undefined : rest.onClick}
			className={classes}
			{...(rest as HTMLAttributes<HTMLDivElement>)}
		>
			{children}
		</div>
	);
}

export default MenuItem;