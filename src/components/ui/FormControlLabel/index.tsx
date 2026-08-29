import type { ReactElement, ReactNode } from "react";

type FormControlLabelProps = {
	/** The control element, e.g. <Checkbox />. */
	control: ReactElement;
	label: ReactNode;
	className?: string;
};

export function FormControlLabel({
	control,
	label,
	className = "",
}: FormControlLabelProps): ReactElement {
	return (
		<label
			className={`inline-flex cursor-pointer select-none items-center gap-2 ${className}`}
		>
			{control}
			<span className="text-sm text-ink">{label}</span>
		</label>
	);
}

export default FormControlLabel;