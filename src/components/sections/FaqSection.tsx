"use client";
import { ComponentPropsWithoutRef, useState } from "react";
import { useTranslation } from "@/hooks";
type FaqItem = { q: string; a: string };

// @ts-ignore
export default function FaqSection({className, ...props}: ComponentPropsWithoutRef) {
	const { t } = useTranslation(["faq" ]);
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const items = t("faq:items", { returnObjects: true }) as unknown as FaqItem[];

	return (
		<section id="faq" className={`py-28 bg-surface-900/70 ${className || ""}`} {...props}>
			<div className="max-w-[1180px] mx-auto px-8">
				<div className="text-center max-w-[540px] mx-auto mb-14">
					<span className="inline-block text-xs tracking-[0.14em] uppercase text-primary opacity-80 mb-3">
						{t("faq:tag")}
					</span>
					<h2 className="text-[clamp(2rem,3.5vw,2.9rem)] tracking-tight text-onSurface-800">
						{t("faq:headline")}
					</h2>
				</div>
				<div className="max-w-[720px] mx-auto flex flex-col">
					{items.map((item, i) => (
						<div key={i} className="border-b border-primary/10">
							<button
								className="w-full flex justify-between items-center py-6 text-left text-sm text-onSurface-800 bg-transparent border-none cursor-pointer"
								onClick={() => setOpenIndex(openIndex === i ? null : i)}
							>
								<span className={openIndex === i ? "text-primary" : ""}>
									{item.q}
								</span>
								<span
									className="w-8 h-8 shrink-0 border border-primary/15 rounded-full flex items-center justify-center leading-none text-primary text-md leading-[inherit] transition-transform"
									style={{
										transform: openIndex === i ? "rotate(45deg)" : "none",
									}}
								>
									+
								</span>
							</button>
							<div
								className="overflow-hidden text-sm text-onSurface-700 leading-[1.75] transition-all"
								style={{
									maxHeight: openIndex === i ? "200px" : "0",
									paddingBottom: openIndex === i ? "1.5rem" : "0",
								}}
							>
								{item.a}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
