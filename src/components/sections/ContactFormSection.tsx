import { useTranslation } from "@/hooks";
import ContactForm from "../forms/ContactForm";
import { SectionTag } from "../SectionTag";

export default function ContactFormSection() {
	const { t } = useTranslation(["contact", "common"]);
	

	return (
		<section id="contact-form" className="relative pt-20 sm:pt-24 pb-24">
			<div className="max-w-295 mx-auto px-8 grid lg:grid-cols-[0.75fr_1.25fr] gap-12">
				<div>
					<SectionTag className=" mb-3">
						{t("contact:form.tag")}
					</SectionTag>
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
