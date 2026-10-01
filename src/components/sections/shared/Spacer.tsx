import type { ReactElement } from "react";

/**
 * Shared vertical spacer section (M14).
 *
 * Editors insert this block anywhere in a page's section order to add
 * explicit whitespace between sections. The height is a fixed preset
 * (inline style, never `className` in content per the M12 chrome rule), so
 * the gap is identical in both locales with zero translation burden.
 * Pure static render — no hooks, no browser APIs, SSR-safe.
 */

export type SpacerSize = "xs" | "sm" | "md" | "lg" | "xl";

/** Preset gap heights in pixels. */
export const SPACER_HEIGHTS: Record<SpacerSize, number> = {
	xs: 16,
	sm: 32,
	md: 64,
	lg: 96,
	xl: 128,
};

export interface SpacerProps {
	/** Anchor id for deep links. */
	id?: string;
	/** Preset gap height. Unknown/absent values fall back to `md`. */
	size?: SpacerSize | null;
}

export function Spacer(props: SpacerProps): ReactElement {
	const size: SpacerSize =
		props.size && props.size in SPACER_HEIGHTS ? props.size : "md";
	return (
		<section aria-hidden="true" id={props.id || undefined} data-spacer={size}>
			<div style={{ height: SPACER_HEIGHTS[size] }} />
		</section>
	);
}
