"use client";

import {
	Children,
	cloneElement,
	isValidElement,
	useId,
	useRef,
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

export type SelectProps = {
	label?: ReactNode;
	name?: string;
	value: string;
	required?: boolean;
	disabled?: boolean;
	fullWidth?: boolean;
	/** Always float the label (select always displays content). */
	displayEmpty?: boolean;
	onChange?: (event: SelectChangeEvent) => void;
	/** MenuItem elements. */
	children: ReactNode;
	className?: string;
	id?: string;
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
		const props = child.props as {
			value?: string;
			disabled?: boolean;
			children?: ReactNode;
		};
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
 * Outlined select field with a floating label and a popup list. Follows the
 * theme shape radius (20px). Renders a hidden input so the selected value is
 * included in native form submissions. `onChange` receives
 * `{ target: { name, value } }` for parity with the previous MUI Select API.
 */
export function Select({
	label,
	name,
	value,
	required = false,
	disabled = false,
	fullWidth = true,
	displayEmpty = false,
	onChange,
	children,
	className = "",
	id,
}: SelectProps): ReactElement {
	const autoId = useId();
	const fieldId = id ?? autoId;
	const fieldRef = useRef<HTMLButtonElement>(null);
	const [open, setOpen] = useState(false);
	const [focused, setFocused] = useState(false);

	const options = extractOptions(children);
	const selectedOption = options.find((option) => option.value === value);
	// With displayEmpty the placeholder option (value="") is rendered as the
	// current display, so the label stays floated.
	const displayNode = selectedOption ? selectedOption.display : null;
	const floated = focused || open || displayEmpty;

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

	const fieldClasses = [
		"flex w-full cursor-pointer items-center justify-between gap-2 rounded-[20px] border bg-surface px-4 pt-6 pb-2.5 text-left text-sm leading-5 text-ink outline-none transition-all duration-200",
		"border-ink/25 hover:border-ink/45 focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--color-ring-primary)]",
		disabled ? "cursor-not-allowed bg-ink/5 opacity-60" : "",
	].join(" ");

	const labelClasses = [
		"pointer-events-none absolute left-4 px-1 transition-all duration-200",
		floated ? "top-0 -translate-y-1/2 text-xs text-primary" : "top-1/2 -translate-y-1/2 text-sm text-ink-soft/70",
	].join(" ");

	return (
		<div className={`${fullWidth ? "w-full " : ""}relative ${className}`}>
			<div className="relative">
				<button
					ref={fieldRef}
					id={fieldId}
					type="button"
					aria-haspopup="listbox"
					aria-expanded={open}
					disabled={disabled}
					onClick={() => setOpen((current) => !current)}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					onKeyDown={handleFieldKeyDown}
					className={fieldClasses}
				>
					<span className={`truncate ${!selectedOption ? "text-ink-soft/50" : ""}`}>
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
						{label}
						{required ? <span aria-hidden="true">&nbsp;*</span> : null}
					</label>
				)}
			</div>
			<Menu
				open={open}
				anchorEl={fieldRef.current}
				onClose={() => setOpen(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
				style={{ marginTop: 8 }}
				className="max-h-60 overflow-y-auto rounded-[20px] border border-ink/10 bg-surface py-1.5 card-shadow"
				role="listbox"
			>
				{options.map((option) =>
					cloneElement(option.element, {
						key: option.value,
						selected: option.value === value,
						onClick: () => handleSelect(option.value, option.disabled),
						// placeholder item keeps its muted look via disabled
					})
				)}
			</Menu>
		</div>
	);
}

export default Select;