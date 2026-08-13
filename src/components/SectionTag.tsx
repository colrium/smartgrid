// components/ui/SectionTag.tsx
"use client";

interface SectionTagProps {
	children: React.ReactNode;
	startOrnament?: React.ReactNode;
	endOrnament?: React.ReactNode;
	className?: string;
	dark?: boolean | undefined | null;
}
interface OrnamentProps {
	className?: string;
	dark?: boolean | undefined | null;
}
const StartOrnament = ({ dark = false, className = "" }: OrnamentProps) => (
	<span className={`w-9 h-px ${dark ? "bg-brand-200/70" : "bg-primary/40"} ${className}`}></span>
);
const EndOrnament = StartOrnament;
export function SectionTag({
	children,
	startOrnament,
	endOrnament,
	className = "",
	dark = false,
}: SectionTagProps) {
    const startNode = startOrnament ?? <StartOrnament dark={dark} />;
    const endNode = endOrnament ?? <EndOrnament dark={dark} />;
	return (
		<div
			className={`inline-flex items-center gap-4 font-mono text-xs uppercase tracking-widest font-semibold ${
				dark ? "text-brand-200" : "text-primary"
			} ${className}`}
		>
			{startNode}
			<span>{children}</span>
			{endNode}
		</div>
	);
}
