"use client";

import {
	Children,
	cloneElement,
	isValidElement,
	useId,
	useState,
} from "react";
import type {
	KeyboardEvent as ReactKeyboardEvent,
	ReactElement,
	ReactNode,
} from "react";
import { Menu } from "@/components/ui/Menu";
import { type MenuItemProps } from "@/components/ui/MenuItem";

export type SelectChangeEvent = { target: { name?: string; value: string } };

export type SelectVariant = "filled" | "outlined" | "standard";
export type SelectSize = "small" | "medium";

export type SelectProps = {
	/** Visual variant. Defaults to "outlined". */
	variant?: SelectVariant;
	/** Field size. Defaults to "medium". */
	size?: SelectSize;
	label?: ReactNode;
	/** Icon rendered inside the floating label (before the label text). */
	startIcon?: ReactNode;
	name?: string;
	value: string;
	required?: boolean;
	disabled?: boolean;
	fullWidth?: boolean;
	/** Always float the label and treat the empty state as content. */
	displayEmpty?: boolean;
	onChange?: (event: SelectChangeEvent) => void;
	/** MenuItem elements. */
	children: ReactNode;
	className?: string;
	id?: string;
	error?: boolean;
	success?: boolean;
	helperText?: ReactNode;
	/** Bold prefix rendered before helperText (e.g. "Well done!"). */
	helperTitle?: string;
};

type ExtractedOption = {
	value: string;
	disabled: boolean;
	display: ReactNode;
	element: ReactElement<MenuItemProps>;
};

function extractOptions(children: ReactNode): ExtractedOption[] {
	const options: ExtractedOption[] = [];
	Children.forEach(children, (child) => {
		if (!isValidElement<MenuItemProps>(child)) {
			return;
		}
		const props = child.props as MenuItemProps;
		options.push({
			value: props.value ?? "",
			disabled: Boolean(props.disabled),
			display: props.children,
			element: child,
		});
	});
	return options;
}

/**
 * Floating-label select (filled / outlined / standard) mirroring the
 * TextField variants. The trigger is a `peer` button: the label floats via
 * CSS only — `peer-focus` / `peer-aria-expanded` when open, and
 * `peer-data-[empty=true]` resets it to rest while no value is picked
 * (skipped with `displayEmpty`, which keeps the label floated). Colors come
 * from the globals.css tokens (danger -> gmail, success -> whatsapp).
 */
const triggerGeometryClasses: Record<SelectVariant, Record<SelectSize, string>> = {
	filled: {
		small: "rounded-t-[20px] border-0 border-b-2 px-2.5 pb-1.5 pt-4 gap-1.5",
		medium: "rounded-t-[20px] border-0 border-b-2 px-2.5 pb-2.5 pt-5 gap-1.5",
	},
	outlined: {
		small: "relative z-10 rounded-[20px] px-2.5 pb-1.5 pt-3 gap-1.5",
		medium: "relative z-10 rounded-[20px] px-2.5 pb-2.5 pt-4 gap-1.5",
	},
	standard: {
		small: "border-0 border-b-2 px-0 py-2 gap-1.5",
		medium: "border-0 border-b-2 px-0 py-2.5 gap-1.5",
	},
};

/** Floated label position (the rest state is applied via `peer-data-[empty=true]`). */
const labelFloatClasses: Record<SelectVariant, Record<SelectSize, string>> = {
	filled: {
		small:
			"top-3 start-2.5 -translate-y-3 scale-75 peer-focus:-translate-y-3 peer-aria-expanded:-translate-y-3",
		medium:
			"top-4 start-2.5 -translate-y-4 scale-75 peer-focus:-translate-y-4 peer-aria-expanded:-translate-y-4",
	},
	outlined: {
		small:
			"start-3 top-3 z-20 leading-none peer-data-[float=true]:-translate-y-[18px] peer-data-[float=true]:text-[11px]",
		medium:
			"start-3 top-4 z-20 leading-none peer-data-[float=true]:-translate-y-[22px] peer-data-[float=true]:text-[11px]",
	},
	standard: {
		small:
			"top-3 -z-10 -translate-y-6 scale-75 peer-focus:start-0 peer-focus:-translate-y-6 peer-aria-expanded:-translate-y-6",
		medium:
			"top-3 -z-10 -translate-y-6 scale-75 peer-focus:start-0 peer-focus:-translate-y-6 peer-aria-expanded:-translate-y-6",
	},
};

/** Resets while the field is empty & unfocused (only when displayEmpty is false). */
const labelRestClasses: Record<SelectVariant, string> = {
	filled:
		"peer-data-[empty=true]:translate-y-0 peer-data-[empty=true]:scale-100 peer-focus:scale-75 peer-aria-expanded:scale-75",
	outlined: "",
	standard:
		"peer-data-[empty=true]:translate-y-0 peer-data-[empty=true]:scale-100 peer-focus:scale-75 peer-aria-expanded:scale-75",
};

type FieldState = { trigger: string; outline: string; label: string; helper: string };

function getFieldState(
	variant: SelectVariant,
	error: boolean,
	success: boolean
): FieldState {
	if (error) {
		return {
			trigger: `${variant === "filled" ? "bg-gmail/10 " : "bg-transparent "}${
				variant === "outlined" ? "" : "border-gmail focus-visible:border-gmail"
			}`,
			outline: "border-gmail peer-focus:border-gmail",
			label: "text-gmail",
			helper: "text-gmail",
		};
	}
	if (success) {
		return {
			trigger: `${variant === "filled" ? "bg-whatsapp/10 " : "bg-transparent "}${
				variant === "outlined" ? "" : "border-whatsapp focus-visible:border-whatsapp"
			}`,
			outline: "border-whatsapp peer-focus:border-whatsapp",
			label: "text-whatsapp",
			helper: "text-whatsapp",
		};
	}
	return {
		trigger: `${variant === "filled" ? "bg-surface-400 " : "bg-transparent "}${
			variant === "outlined" ? "" : "border-ink/30 focus-visible:border-primary"
		}`,
		outline: "border-ink/30 peer-hover:border-ink/45 peer-focus:border-primary",
		label: "text-ink-soft peer-focus:text-primary peer-aria-expanded:text-primary",
		helper: "text-ink-soft",
	};
}

export function Select({
	variant = "outlined",
	size = "medium",
	label,
	startIcon,
	name,
	value,
	required = false,
	disabled = false,
	fullWidth = true,
	displayEmpty = false,
	error = false,
	success = false,
	helperText,
	helperTitle,
	onChange,
	children,
	className = "",
	id,
}: SelectProps): ReactElement {
	const autoId = useId();
	const fieldId = id ?? autoId;
	// anchorEl is kept in state (not a ref) so it can be read during render
	// and passed to Menu without violating React's "no refs during render" rule.
	// The callback ref on the <button> below populates it.
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [open, setOpen] = useState(false);
	const [focused, setFocused] = useState(false);

	const options = extractOptions(children);
	const selectedOption = options.find((option) => option.value === value);
	// With displayEmpty the placeholder option (value="") is rendered as the
	// current display, so the label stays floated.
	const displayNode = selectedOption ? selectedOption.display : null;
	// isEmpty: no value picked (and not displayEmpty) — only in this state can
	// the label ever rest inside the field.
	const isEmpty = !displayEmpty && !selectedOption;
	// data-empty only when the field is genuinely "at rest" (empty + closed +
	// blurred). While focused or open the label must stay floated, and since
	// Tailwind orders `data-*` after `focus`/`aria-expanded`, removing the
	// attribute is what lets the float rules win.
	const atRest = isEmpty && !open && !focused;
	// data-float=true whenever the label must stay floated: a value is picked,
	// displayEmpty keeps it floated, or the field is focused/open.
	const shouldFloat = !atRest;

	const state = getFieldState(variant, error, success);

	const handleSelect = (optionValue: string, optionDisabled: boolean) => {
		if (optionDisabled) {
			return;
		}
		onChange?.({ target: { name, value: optionValue } });
		setOpen(false);
	};

	const handleFieldKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
		if (disabled) {
			return;
		}
		if (event.key === "Enter" || event.key === " ") {
			// Button already toggles on click; prevent native scroll on space.
			if (event.key === " ") {
				event.preventDefault();
				setOpen((current) => !current);
			}
			return;
		}
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			setOpen(true);
			return;
		}
	};

	const triggerClasses = [
		"peer flex w-full cursor-pointer select-none items-center justify-between text-left text-sm leading-5 text-ink appearance-none outline-none transition-all duration-200",
		"placeholder:text-transparent disabled:cursor-not-allowed",
		triggerGeometryClasses[variant][size],
		state.trigger,
		disabled ? "opacity-60" : "",
	]
		.filter(Boolean)
		.join(" ");

	const labelClasses = [
		"pointer-events-none absolute text-sm transition-all duration-200 transform origin-[0]",
		startIcon ? "inline-flex items-center" : "",
		labelFloatClasses[variant][size],
		labelRestClasses[variant],
		disabled ? "text-ink-soft/50" : state.label,
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
			{required ? <span aria-hidden="true">&nbsp;*</span> : null}
		</>
	);

	const outlineClasses = [
		// Fieldset wraps the trigger, draws the border, and (via its invisible
		// legend) produces the true clipped-notch effect with no background
		// colour tricks. aria-hidden because the <label> is the accessible name.
		"pointer-events-none absolute inset-0 z-0 m-0 rounded-[20px] border px-3 transition-all duration-200",
		state.outline,
		"peer-focus:border-2",
		"peer-disabled:border-ink/10",
		"[&>legend]:invisible [&>legend]:m-0 [&>legend]:py-0 [&>legend]:whitespace-nowrap [&>legend]:text-[11px] [&>legend]:leading-none [&>legend]:transition-all [&>legend]:duration-200",
		"[&>legend]:max-w-[0.01px] [&>legend]:px-0",
		"peer-data-[float=true]:[&>legend]:max-w-full peer-data-[float=true]:[&>legend]:px-1",
	].join(" ");

	return (
		<div className={`${fullWidth ? "w-full " : ""}${className}`}>
			<div className={variant === "standard" ? "relative z-0" : "relative"}>
				<button
					ref={setAnchorEl}
					id={fieldId}
					type="button"
					role="combobox"
					aria-haspopup="listbox"
					aria-expanded={open}
					aria-controls={open ? `${fieldId}-listbox` : undefined}
					aria-describedby={helperText ? `${fieldId}-helper` : undefined}
					data-empty={atRest ? "true" : undefined}
					data-float={shouldFloat ? "true" : undefined}
					disabled={disabled}
					onClick={() => setOpen((current) => !current)}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					onKeyDown={handleFieldKeyDown}
					className={triggerClasses}
				>
					<span
						className={`truncate ${
							selectedOption ? "text-ink" : isEmpty ? "text-ink-soft/50" : ""
						}`}
					>
						{displayNode}
					</span>
					<span
						aria-hidden="true"
						className={`mdi mdi-chevron-down shrink-0 text-xl text-ink-soft/60 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
					/>
				</button>
				{/* Hidden input so the value participates in native form submission. */}
				<input
					type="text"
					name={name}
					value={value}
					required={required}
					className="pointer-events-none absolute inset-x-4 top-1/2 h-0 w-[calc(100%-2rem)] border-0 bg-transparent p-0 text-transparent opacity-0 focus:outline-none"
					readOnly
					tabIndex={-1}
					aria-hidden="true"
				/>
				{label != null && (
					<label htmlFor={fieldId} className={labelClasses}>
						{labelContent}
					</label>
				)}
				{variant === "outlined" && label != null && (
					<fieldset aria-hidden="true" className={outlineClasses}>
						<legend>{labelContent}</legend>
					</fieldset>
				)}
			</div>
			<Menu
				open={open}
				anchorEl={anchorEl}
				onClose={() => setOpen(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
				style={{ marginTop: 8 }}
				className="max-h-60 overflow-y-auto rounded-[20px] border border-ink/10 bg-surface py-1.5 card-shadow"
				role="listbox"
				id={`${fieldId}-listbox`}
			>
				{options.map((option) =>
					cloneElement(option.element, {
						key: option.value,
						selected: option.value === value,
						onClick: () => handleSelect(option.value, option.disabled),
					})
				)}
			</Menu>
			{helperText ? (
				<p id={`${fieldId}-helper`} className={helperClasses}>
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

export default Select;