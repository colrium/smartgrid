// components/ui/SectionTag.tsx
"use client";

interface SectionTagProps {
	children: React.ReactNode;
	startElement?: React.ReactNode;
	endElement?: React.ReactNode;
	className?: string;
}
const StartElement = () => <span className="w-6 h-0.5 bg-primary"></span>;
const EndElement = () => <span className="w-6 h-0.5 bg-primary"></span>;
export function SectionTag({ children, startElement=<StartElement />, endElement=<EndElement />, className = "" }: SectionTagProps) {
	return (
			<div
				className={`inline-flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-widest font-semibold ${className}`}
			>
				{startElement}
                <span>
                    {children}
                </span>
				{endElement}
			</div>
	);
}
