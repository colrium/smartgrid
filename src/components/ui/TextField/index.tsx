"use client";

import { useId } from "react";
import type {
	ChangeEvent,
	FocusEvent,
	ReactElement,
	ReactNode,
} from "react";

export type TextFieldVariant = "filled" | "outlined" | "standard";
export type TextFieldSize = "small" | "medium";

export type TextFieldProps = {
	/** Visual variant. Defaults to "outlined". */
	variant?: TextFieldVariant;
	/** Field size. Defaults to "medium". */
	size?: TextFieldSize;
	label?: ReactNode;
	/** Icon rendered inside the floating label (before the label text). */
	startIcon?: ReactNode;
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
	success?: boolean;
	helperText?: ReactNode;
	/** Bold prefix rendered before helperText (e.g. "Well done!"). */
	helperTitle?: string;
	className?: string;
	inputClassName?: string;
	onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

/**
 * Floating-label text field (filled / outlined / standard) driven purely by
 * the CSS `peer` state machine: the input is the peer and always carries a
 * `placeholder=" "` so `peer-placeholder-shown`/`peer-focus` float the label
 * without any React state. Colors come from the globals.css tokens:
 * brand -> primary, heading -> ink, body -> ink-soft, danger -> gmail,
 * success -> whatsapp, neutral fill -> surface-400.
 */
const inputBaseClasses = [
	"block w-full text-sm text-ink appearance-none focus:outline-none focus:ring-0",
	// The peer trick needs a placeholder present; keep real placeholders for
	// focus only so they never clash with the resting label.
	"peer placeholder:text-transparent focus:placeholder:text-ink-soft/50",
	"disabled:cursor-not-allowed",
].join(" ");

const inputGeometryClasses: Record<TextFieldVariant, Record<TextFieldSize, string>> = {
	filled: {
		small: "rounded-t-[20px] border-0 border-b-2 px-2.5 pb-1.5 pt-4",
		medium: "rounded-t-[20px] border-0 border-b-2 px-2.5 pb-2.5 pt-5",
	},
	outlined: {
		small: "rounded-[20px] border px-2.5 pb-1.5 pt-3",
		medium: "rounded-[20px] border px-2.5 pb-2.5 pt-4",
	},
	standard: {
		small: "border-0 border-b-2 px-0 py-2",
		medium: "border-0 border-b-2 px-0 py-2.5",
	},
};

/** Floated label position per variant/size (the resting state is applied via
 * `peer-placeholder-shown` overrides below). */
const labelFloatClasses: Record<TextFieldVariant, Record<TextFieldSize, string>> = {
	filled: {
		small: "top-3 start-2.5 -translate-y-3 scale-75 peer-focus:-translate-y-3",
		medium: "top-4 start-2.5 -translate-y-4 scale-75 peer-focus:-translate-y-4",
	},
	outlined: {
		small:
			"top-1 start-1 -translate-y-3 scale-75 bg-surface px-2 peer-focus:px-2 peer-focus:top-1 peer-focus:-translate-y-3",
		medium:
			"top-2 start-1 -translate-y-4 scale-75 bg-surface px-2 peer-focus:px-2 peer-focus:top-2 peer-focus:-translate-y-4",
	},
	standard: {
		small:
			"top-3 -z-10 -translate-y-6 scale-75 peer-focus:start-0 peer-focus:-translate-y-6",
		medium:
			"top-3 -z-10 -translate-y-6 scale-75 peer-focus:start-0 peer-focus:-translate-y-6",
	},
};

/** Resets applied while the placeholder is shown (input empty & unfocused). */
const labelRestClasses: Record<TextFieldVariant, string> = {
	filled:
		"peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75",
	outlined:
		"peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:scale-75",
	standard:
		"peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75",
};

type FieldState = { input: string; label: string; helper: string };

function getFieldState(
	variant: TextFieldVariant,
	error: boolean,
	success: boolean
): FieldState {
	if (error) {
		return {
			input: `${variant === "filled" ? "bg-gmail/10 " : ""}border-gmail focus:border-gmail`,
			label: "text-gmail",
			helper: "text-gmail",
		};
	}
	if (success) {
		return {
			input: `${variant === "filled" ? "bg-whatsapp/10 " : ""}border-whatsapp focus:border-whatsapp`,
			label: "text-whatsapp",
			helper: "text-whatsapp",
		};
	}
	return {
		input: `${variant === "filled" ? "bg-surface-400 " : "bg-transparent "}border-ink/30 focus:border-primary`,
		label: "text-ink-soft peer-focus:text-primary",
		helper: "text-ink-soft",
	};
}
export function TextField(props: TextFieldProps): ReactElement {
	const {
		variant = "outlined",
		size = "medium",
		label,
		startIcon,
		fullWidth = true,
		multiline = false,
		rows = 4,
		type = "text",
		autoComplete,
		error = false,
		success = false,
		helperText,
		helperTitle,
		className = "",
		inputClassName = "",
		...field
	} = props;

	const autoId = useId();
	const id = field.id ?? autoId;
	const helperId = helperText ? `${id}-helper` : undefined;

	const state = getFieldState(variant, error, success);

	const inputClasses = [
		inputBaseClasses,
		inputGeometryClasses[variant][size],
		state.input,
		multiline ? "resize-none" : "",
		field.disabled ? "cursor-not-allowed" : "",
		inputClassName,
	]
		.filter(Boolean)
		.join(" ");

	const labelClasses = [
		"pointer-events-none absolute text-sm duration-300 transform origin-[0]",
		startIcon ? "inline-flex items-center" : "",
		labelFloatClasses[variant][size],
		labelRestClasses[variant],
		field.disabled ? "text-ink-soft/50" : state.label,
	].join(" ");

	const helperClasses = `mt-2.5 text-xs ${state.helper}`;

	return (
		<div className={`${fullWidth ? "w-full " : ""}${className}`}>
			<div className={variant === "standard" ? "relative z-0" : "relative"}>
				{multiline ? (
					<textarea
						id={id}
						name={field.name}
						rows={rows}
						required={field.required}
						disabled={field.disabled}
						value={field.value}
						placeholder={field.placeholder || " "}
						onFocus={(event) => field.onFocus?.(event)}
						onBlur={(event) => field.onBlur?.(event)}
						onChange={field.onChange}
						aria-invalid={error || undefined}
						aria-describedby={helperId}
						className={inputClasses}
					/>
				) : (
					<input
						id={id}
						name={field.name}
						type={type}
						autoComplete={autoComplete}
						required={field.required}
						disabled={field.disabled}
						value={field.value}
						placeholder={field.placeholder || " "}
						onFocus={(event) => field.onFocus?.(event)}
						onBlur={(event) => field.onBlur?.(event)}
						onChange={field.onChange}
						aria-invalid={error || undefined}
						aria-describedby={helperId}
						className={inputClasses}
					/>
				)}
				{label != null && (
					<label htmlFor={id} className={labelClasses}>
						{startIcon != null && (
							<span
								aria-hidden="true"
								className="me-1.5 inline-flex h-4 w-4 items-center justify-center text-base leading-none"
							>
								{startIcon}
							</span>
						)}
						{label}
						{field.required ? <span aria-hidden="true">&nbsp;*</span> : null}
					</label>
				)}
			</div>
			{helperText ? (
				<p id={helperId} className={helperClasses}>
					{helperTitle ? (
						<>
							<span className="font-medium">{helperTitle}</span>{" "}
						</>
					) : null}
					{helperText}
				</p>
			) : null}
		</div>
	);
}

export default TextField;