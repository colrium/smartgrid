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
	<span className={`w-9 h-px ${dark ? "bg-primary-200/70" : "bg-primary/40"} ${className}`}></span>
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
			className={`inline-flex items-center justify-center gap-4 font-sans text-xs uppercase tracking-widest  ${
				dark ? "text-primary-200" : "text-primary"
			} ${className}`}
		>
			{startNode}
			<span className="text-center">{children}</span>
			{endNode}
		</div>
	);
}
