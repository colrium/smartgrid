import { useTranslation } from "@/hooks";
import ContactForm from "../forms/ContactForm";
import { SectionTag } from "../SectionTag";

/**
 * Keystatic-owned content for the contact form section (M11 `contactForm`
 * unique section). When omitted, the legacy `contact:form` locale strings
 * render. Only the section chrome (tag/headline/description) plus the
 * submit/success strings become data — the interactive form widget (field
 * structure, reason options, validation, Formspree posting) keeps reading
 * locale JSON: field keys double as payload keys and query-param values,
 * so the form structure is behavior, not copy.
 */
export interface ContactFormSectionContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	submitLabel?: string | null;
	successHeading?: string | null;
	successBody?: string | null;
}

export default function ContactFormSection({ data, id }: { data?: ContactFormSectionContent | null; id?: string } = {}) {
	const { t } = useTranslation(["contact", "common"]);


	return (
		<section id={id ?? "contact-form"} className="relative pt-20 sm:pt-24 pb-24">
			<div className="max-w-295 mx-auto px-8 grid lg:grid-cols-[0.75fr_1.25fr] gap-12">
				<div>
					<SectionTag className=" mb-3">
						{data ? (data.tag ?? "") : t("contact:form.tag")}
					</SectionTag>
					<h2 className="text-5xl text-ink-soft  mb-5">
						{data ? (data.headline ?? "") : t("contact:form.headline")}
					</h2>
					<p className="text-base text-on-surface-900 leading-[1.75] font-light">
						{data ? (data.description ?? "") : t("contact:form.description")}
					</p>
				</div>
                <ContactForm
					content={
						data
							? {
									submitLabel: data.submitLabel ?? undefined,
									successHeading: data.successHeading ?? undefined,
									successBody: data.successBody ?? undefined,
								}
							: undefined
					}
				/>
			</div>
		</section>
	);
}
