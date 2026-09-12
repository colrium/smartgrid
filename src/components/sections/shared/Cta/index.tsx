import type { ReactElement } from "react";
import { CtaBand } from "@/components/sections/shared/CtaBand";
import { FinalCta } from "@/components/sections/shared/FinalCta";
import type { CtaAction } from "@/components/sections/shared/CtaPill";export interface CtaProps {
	tag?: string | null; headline: string; description?: string | null;
	primary?: CtaAction | null; secondary?: CtaAction | null;
	layout?: "centered" | "split"; watermark?: string | null; id?: string;
}
export function Cta(props: CtaProps): ReactElement {
	return (<CtaBand tag={props.tag} headline={props.headline} description={props.description} primary={props.primary} secondary={props.secondary} layout={props.layout ?? "centered"} watermark={props.watermark} id={props.id} />);
}
export interface ClosingCtaProps extends CtaProps { note?: string | null; descriptionTone?: "muted" | "accent"; actions?: { icon?: string | null; label: string; description?: string | null; href: string }[] | null; actionsLabel?: string | null }
export function ClosingCta(props: ClosingCtaProps): ReactElement {
	if (props.actions && props.actions.length > 0) {
		return (<FinalCta id={props.id} tag={props.tag} headline={props.headline} description={props.description} descriptionTone={props.descriptionTone ?? "muted"} note={props.note} watermark={props.watermark} actions={props.actions} actionsLabel={props.actionsLabel} />);
	}
	return <Cta {...props} />;
}
export default function DefaultCta(props: CtaProps): ReactElement { return <Cta {...props} />; }
