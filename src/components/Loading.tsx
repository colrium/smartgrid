import { CircularProgress } from "@/components/ui/CircularProgress";
import type { ReactElement } from "react";

export default function Loading({ message = "Loading..." }: { message?: string }): ReactElement {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-2">
			<CircularProgress />
			<p className="text-sm text-ink-soft/70">{message}</p>
		</div>
	);
}
