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
const sizeWrapperClassNames = new Map([
	["small", "h-10 mt-2"],
	["medium", "h-14 mt-2"],
	["large", "h-16 mt-2"],
]);
const inputGeometryClasses: Record<TextFieldVariant, Record<TextFieldSize, string>> = {
	filled: {
		small: "rounded-t-lg border-0 border-b-2 px-2.5 pb-1.5 pt-4",
		medium: "rounded-t-lg border-0 border-b-2 px-2.5 pb-2.5 pt-5",
	},
	outlined: {
		small: "relative z-10 rounded-lg px-4 h-full",
		medium: "relative z-10 rounded-lg px-4 h-full",
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
		small: "start-3  left-4 top-1/2 -translate-y-1/2 z-20 leading-none peer-focus:-translate-y-[18px] peer-focus:text-[11px] peer-[&:not(:placeholder-shown)]:-translate-y-[18px] peer-[&:not(:placeholder-shown)]:text-[11px]",
		medium: "start-3 left-4 top-1/2 -translate-y-1/2 z-20 leading-none peer-focus:-translate-y-[22px] peer-focus:text-[11px] peer-[&:not(:placeholder-shown)]:-translate-y-[22px] peer-[&:not(:placeholder-shown)]:text-[11px]",
	},
	standard: {
		small: "top-3 -z-10 -translate-y-6 scale-75 peer-focus:start-0 peer-focus:-translate-y-6",
		medium: "top-3 -z-10 -translate-y-6 scale-75 peer-focus:start-0 peer-focus:-translate-y-6",
	},
};

/** Resets applied while the placeholder is shown (input empty & unfocused). */
const labelRestClasses: Record<TextFieldVariant, string> = {
	filled:
		"peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75",
	outlined: "",
	standard:
		"peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75",
};

type FieldState = { input: string; outline: string; label: string; helper: string };

function getFieldState(
	variant: TextFieldVariant,
	error: boolean,
	success: boolean
): FieldState {
	if (error) {
		return {
			input: `${variant === "filled" ? "bg-gmail/10 " : "bg-transparent "}${
				variant === "outlined" ? "" : "border-gmail focus:border-gmail"
			}`,
			outline: "border-gmail peer-focus:border-gmail",
			label: "text-gmail",
			helper: "text-gmail",
		};
	}
	if (success) {
		return {
			input: `${variant === "filled" ? "bg-whatsapp/10 " : "bg-transparent "}${
				variant === "outlined" ? "" : "border-whatsapp focus:border-whatsapp"
			}`,
			outline: "border-whatsapp peer-focus:border-whatsapp",
			label: "text-whatsapp",
			helper: "text-whatsapp",
		};
	}
	return {
		input: `${variant === "filled" ? "bg-surface-400 " : "bg-transparent "}${
			variant === "outlined" ? "" : "border-ink/30 focus:border-primary"
		}`,
		outline: "border-ink/30 peer-hover:border-ink/45 peer-focus:border-primary",
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
		"pointer-events-none absolute text-sm transition-all duration-200 transform origin-[0]",
		startIcon ? "inline-flex items-center" : "",
		labelFloatClasses[variant][size],
		labelRestClasses[variant],
		field.disabled ? "text-ink-soft/50" : state.label,
	].join(" ");

	const helperClasses = `mt-2.5 text-xs ${state.helper}`;

	// Shared label content used both for the visible floating label and the
	// invisible <legend> whose intrinsic width carves the exact notch into
	// the <fieldset> border.
	const labelContent = (
		<>
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
		</>
	);

	const outlineClasses = [
		// Fieldset wraps the field, draws the border, and (via its invisible
		// legend) produces the true clipped-notch effect with no background
		// colour tricks. aria-hidden because the <label> is the accessible name.
		"pointer-events-none absolute inset-0 z-0 m-0 rounded-lg border px-3 transition-all duration-200",
		state.outline,
		"peer-focus:border-2",
		"peer-disabled:border-ink/10",
		"[&>legend]:invisible [&>legend]:m-0 [&>legend]:py-0 [&>legend]:whitespace-nowrap [&>legend]:text-[11px] [&>legend]:leading-none [&>legend]:transition-all [&>legend]:duration-200",
		"[&>legend]:max-w-[0.01px] [&>legend]:px-0",
		"peer-focus:[&>legend]:max-w-full peer-focus:[&>legend]:px-1",
		"peer-[&:not(:placeholder-shown)]:[&>legend]:max-w-full peer-[&:not(:placeholder-shown)]:[&>legend]:px-1",
    ].join(" ");
    

	return (
		<div className={`${fullWidth ? "w-full " : ""} ${className}`}>
			<div
				className={`${variant === "standard" ? "relative z-0" : "relative"}  ${sizeWrapperClassNames.get(size) || ""}`}
			>
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
						{labelContent}
					</label>
				)}
				{variant === "outlined" && label != null && (
					<fieldset aria-hidden="true" className={outlineClasses}>
						<legend>{labelContent}</legend>
					</fieldset>
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