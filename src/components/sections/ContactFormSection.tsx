import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "@/hooks";
import SendIcon from "@mui/icons-material/Send";
import ContactForm from "../forms/ContactForm";

type Option = { value: string; label: string };
type Field = {
	label: string;
	placeholder?: string;
	required?: boolean;
	type: string;
	rows?: number;
	options?: Option[];
};

type ReasonState = {
	reason: string;
	opportunity: string;
	tier: string;
	sent: boolean;
	loading: boolean;
	error: string | null;
};

function inputClassName() {
	return "w-full rounded bg-surface border border-primary/15 px-4 py-3 text-sm text-on-surface-800 outline-none transition focus:border-primary placeholder:text-on-surface-800/35";
}

export default function ContactFormSection() {
	const { t } = useTranslation(["contact", "common"]);
	

	return (
		<section id="contact-form" className="relative pt-64 pb-24">
			<div className="max-w-295 mx-auto px-8 grid lg:grid-cols-[0.75fr_1.25fr] gap-12">
				<div>
					<span className="inline-block text-xs  uppercase text-primary opacity-80 mb-3">
						{t("contact:form.tag")}
					</span>
					<h2 className="text-5xl text-ink-soft  mb-5">
						{t("contact:form.headline")}
					</h2>
					<p className="text-base text-on-surface-900 leading-[1.75] font-light">
						{t("contact:form.description")}
					</p>
				</div>
                <ContactForm />	
			</div>
		</section>
	);
}
