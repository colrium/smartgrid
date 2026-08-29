import type { ReactElement } from "react";

type CircularProgressProps = {
	/** Diameter in px. Defaults to 40 (MUI default). */
	size?: number;
	className?: string;
};

export function CircularProgress({ size = 40, className = "" }: CircularProgressProps): ReactElement {
	return (
		<span
			role="progressbar"
			aria-label="Loading"
			style={{ width: size, height: size }}
			className={`inline-block animate-[spin_1.4s_linear_infinite] text-primary ${className}`}
		>
			<svg viewBox="22 22 44 44" className="h-full w-full" aria-hidden="true">
				<circle
					cx="44"
					cy="44"
					r="20.2"
					fill="none"
					strokeWidth="3.6"
					stroke="currentColor"
					strokeLinecap="round"
					strokeDasharray="80 200"
					strokeDashoffset="0"
				/>
			</svg>
		</span>
	);
}

export default CircularProgress;