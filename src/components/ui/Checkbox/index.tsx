import type { InputHTMLAttributes, ReactElement } from "react";

export type CheckboxProps = {
	color?: "primary" | "accent";
	className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

/**
 * Styled checkbox. Renders a `span` (not a label) so it can be safely
 * composed inside FormControlLabel without nested label elements.
 */
export function Checkbox({
	color = "primary",
	className = "",
	...rest
}: CheckboxProps): ReactElement {
	const checkedBorder =
		color === "accent"
			? "checked:border-accent checked:bg-accent"
			: "checked:border-primary checked:bg-primary";
	const focusRing =
		color === "accent"
			? "checked:focus-visible:shadow-[0_0_0_4px_var(--color-accent-100)]"
			: "checked:focus-visible:shadow-[0_0_0_4px_var(--color-primary-100)]";

	return (
		<span className={`relative inline-flex h-[18px] w-[18px] shrink-0 ${className}`}>
			<input type="checkbox" className="peer sr-only" {...rest} />
			<span
				aria-hidden="true"
				className={[
					"flex h-[18px] w-[18px] items-center justify-center rounded-[3px] border-2 bg-surface transition-all duration-200",
					"border-ink-soft/50 hover:border-primary",
					checkedBorder,
					focusRing,
					"peer-checked:[&>span]:opacity-100",
					rest.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
				].join(" ")}
			>
				<span className="mdi mdi-check text-[13px] leading-none text-surface opacity-0 transition-opacity duration-150" />
			</span>
		</span>
	);
}

export default Checkbox;