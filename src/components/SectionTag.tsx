// components/ui/SectionTag.tsx
"use client";

interface SectionTagProps {
	children: React.ReactNode;
	className?: string;
}

export function SectionTag({ children, className = "" }: SectionTagProps) {
	return (
		<span
			className={`inline-block text-[0.72rem] tracking-[0.14em] uppercase text-gold/85 mb-3 ${className}`}
		>
			{children}
		</span>
	);
}
