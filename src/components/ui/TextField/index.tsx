"use client";

import { useId, useState } from "react";
import type {
	ChangeEvent,
	FocusEvent,
	ReactElement,
	ReactNode,
} from "react";

export type TextFieldProps = {
	/** Kept for API parity; only "outlined" is supported. */
	variant?: "outlined";
	label?: ReactNode;
	fullWidth?: boolean;
	multiline?: boolean;
	rows?: number;
	type?: string;
	autoComplete?: string;
	name?: string;
	value?: string | number;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	id?: string;
	error?: boolean;
	helperText?: ReactNode;
	className?: string;
	inputClassName?: string;
	onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

/**
 * Outlined text field with a floating label, following the theme shape
 * radius (20px). Colors come from the globals.css tokens.
 */
export function TextField(props: TextFieldProps): ReactElement {
	const {
		variant: _variant,
		label,
		fullWidth = true,
		multiline = false,
		rows = 4,
		type = "text",
		autoComplete,
		error = false,
		helperText,
		className = "",
		inputClassName = "",
		...field
	} = props;

	const autoId = useId();
	const id = field.id ?? autoId;
	const helperId = helperText ? `${id}-helper` : undefined;

	const [focused, setFocused] = useState(false);
	const hasValue = field.value !== undefined && String(field.value).length > 0;
	const floated = focused || hasValue;

	const fieldClasses = [
		"w-full rounded-[20px] border bg-surface px-4 pt-6 pb-2.5 text-sm leading-5 text-ink outline-none transition-all duration-200",
		error
			? "border-gmail focus:border-gmail focus:shadow-[inset_0_0_0_1px_var(--color-gmail)]"
			: "border-ink/25 hover:border-ink/45 focus:border-primary focus:shadow-[inset_0_0_0_1px_var(--color-ring-primary)]",
		multiline ? "min-h-[96px] resize-none" : "h-14",
		field.disabled ? "cursor-not-allowed bg-ink/5 opacity-60" : "",
		inputClassName,
	]
		.filter(Boolean)
		.join(" ");

	const labelClasses = [
		"pointer-events-none absolute left-4 px-1 transition-all duration-200",
		floated ? "top-0 -translate-y-1/2 text-xs" : "top-1/2 -translate-y-1/2 text-sm",
		error ? "text-gmail" : floated ? "text-primary" : "text-ink-soft/70",
	].join(" ");

	return (
		<div className={`${fullWidth ? "w-full " : ""}relative ${className}`}>
			<div className="relative">
				{multiline ? (
					<textarea
						id={id}
						rows={rows}
						placeholder={floated ? field.placeholder : undefined}
						onFocus={(event) => {
							setFocused(true);
							field.onFocus?.(event);
						}}
						onBlur={(event) => {
							setFocused(false);
							field.onBlur?.(event);
						}}
						aria-invalid={error || undefined}
						aria-describedby={helperId}
						className={fieldClasses}
						{...field}
					/>
				) : (
					<input
						id={id}
						type={type}
						autoComplete={autoComplete}
						placeholder={floated ? field.placeholder : undefined}
						onFocus={(event) => {
							setFocused(true);
							field.onFocus?.(event);
						}}
						onBlur={(event) => {
							setFocused(false);
							field.onBlur?.(event);
						}}
						aria-invalid={error || undefined}
						aria-describedby={helperId}
						className={fieldClasses}
						{...field}
					/>
				)}
				{label != null && (
					<label htmlFor={id} className={labelClasses}>
						{label}
						{field.required ? <span aria-hidden="true">&nbsp;*</span> : null}
					</label>
				)}
			</div>
			{helperText ? (
				<p id={helperId} className="mt-1 px-4 text-xs text-gmail">
					{helperText}
				</p>
			) : null}
		</div>
	);
}

export default TextField;