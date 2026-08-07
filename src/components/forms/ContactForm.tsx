import { ComponentPropsWithoutRef, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation, useSetState } from "@/hooks";
import SendIcon from "@mui/icons-material/Send";
import { useForm, ValidationError } from "@formspree/react";

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



const inputClassName = "w-full rounded bg-surface border border-primary/15 px-4 py-3 text-sm text-onSurface-800 outline-none transition focus:border-primary placeholder:text-onSurface-800/35";

type ContactFormProps = ComponentPropsWithoutRef<"form">;

export default function ContactForm({ className = "", ...props }: ContactFormProps) {
	const { t, tObject } = useTranslation(["contact", "operations", "common"]);
    const router = useRouter();
    const formspreeFormId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
    const [formspree, handleFormspreeSubmit] = useForm(formspreeFormId);
    const {opportunity: opportunityQuery, reason: reasonQuery, tier: tierQuery} = router.query;
	const [state, setState] = useSetState<ReasonState>({
		reason: "",
		opportunity: "",
		tier: "",
		sent: false,
		loading: false,
		error: null,
	});

	const reasons = tObject<Option[]>("contact:contact_reasons.options", {
		returnObjects: true,
	});

	const fields = tObject<Record<string, Field>>("contact:form.fields", {
		returnObjects: true,
	});
	const opportunityOptions = tObject<Option[]>("contact:form.fields.opportunity.options", {
		returnObjects: true,
	}) as unknown as Option[];
	const operationCountries = tObject<string[]>("operations:locations.countries", {
		returnObjects: true,
	});
	const officeCountries = (
		tObject<{ country: string }[]>("contact:offices.items", {
			returnObjects: true,
		}) 
	).map((office) => office.country);
	
    const countries = Array.from(new Set([...operationCountries, ...officeCountries]));

	useEffect(() => {
		const reason = typeof reasonQuery === "string" ? reasonQuery : "";
		const opportunity =
			typeof opportunityQuery === "string" ? opportunityQuery : "";
		const tier = typeof tierQuery === "string" ? tierQuery : "";
		setState((current) => ({
			reason: reason === "invest" ? "investment-enquiry" : reason || current.reason,
			opportunity: opportunity || current.opportunity,
			tier: tier || current.tier,
		}));
	}, [opportunityQuery, reasonQuery, tierQuery]);

	const tierOptions = useMemo(() => fields.investor_tier.options ?? [], [fields]);
	


	return (
		<form
			className={`max-w-295 mx-auto flex flex-col gap-12 rounded-lg border border-primary/20 bg-surface-200 p-6 md:p-8 ${className}`}
			{...props}
			onSubmit={handleFormspreeSubmit}
		>
			{formspree.succeeded && (
				<div className="mt-8 rounded-lg border border-primary/30 bg-primary/10 p-5">
					<div className="text-primary font-medium">
						{t("contact:form.success_heading")}
					</div>
					<p className="text-sm text-onSurface-800 mt-2 leading-relaxed">
						{t("contact:form.success_body")}
					</p>
				</div>
			)}
			{formspree.result && !formspree.succeeded && (
				<div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-5">
					<div className="text-red-900 font-medium">
						{t("common:errors.error")}
					</div>
					<p className="text-sm text-onSurface-800 mt-2 leading-relaxed">
						{t("common:form.submissionError")}
					</p>
				</div>
			)}
			<div className=" p-6 md:p-8 grid gap-5">
				<div className="grid md:grid-cols-2 gap-5">
					<label className="grid gap-2 text-sm text-onSurface-800">
						{fields.first_name.label}
						<input
							className={inputClassName}
							name="first_name"
							type="text"
							placeholder={fields.first_name.placeholder}
							required={fields.first_name.required}
						/>
					</label>
					<label className="grid gap-2 text-sm text-onSurface-800">
						{fields.last_name.label}
						<input
							className={inputClassName}
							name="last_name"
							type="text"
							placeholder={fields.last_name.placeholder}
							required={fields.last_name.required}
						/>
					</label>
				</div>
				<div className="grid md:grid-cols-2 gap-5">
					<label className="grid gap-2 text-sm text-onSurface-800">
						{fields.email.label}
						<input
							className={inputClassName}
							name="email"
							type="email"
							placeholder={fields.email.placeholder}
							required={fields.email.required}
						/>
					</label>
					<label className="grid gap-2 text-sm text-onSurface-800">
						{fields.phone.label}
						<input
							className={inputClassName}
							name="phone"
							type="tel"
							placeholder={fields.phone.placeholder}
						/>
					</label>
				</div>
				<div className="grid md:grid-cols-2 gap-5">
					<label className="grid gap-2 text-sm text-onSurface-800">
						{fields.country.label}
						<select
							className={inputClassName}
							name="country"
							required={fields.country.required}
							defaultValue=""
						>
							<option value="" disabled>
								{fields.country.placeholder}
							</option>
							{countries.map((country) => (
								<option key={country} value={country}>
									{country}
								</option>
							))}
						</select>
					</label>
					<label className="grid gap-2 text-sm text-onSurface-800">
						{fields.reason.label}
						<select
							className={inputClassName}
							name="reason"
							required={fields.reason.required}
							value={state.reason}
							onChange={(event) =>
								setState((current) => ({
									...current,
									reason: event.target.value,
								}))
							}
						>
							<option value="" disabled>
								{fields.reason.placeholder}
							</option>
							{reasons.map((reason) => (
								<option key={reason.value} value={reason.value}>
									{reason.label}
								</option>
							))}
						</select>
					</label>
				</div>
				{["investment-enquiry", "due-diligence", "partnership"].includes(state.reason) && (
					<label className="grid gap-2 text-sm text-onSurface-800">
						{fields.opportunity.label}
						<select
							className={inputClassName}
							name="opportunity"
							value={state.opportunity}
							onChange={(event) =>
								setState((current) => ({
									...current,
									opportunity: event.target.value,
								}))
							}
						>
							<option value="" disabled>
								{fields.opportunity.placeholder}
							</option>
							{opportunityOptions.map((opportunity) => (
								<option key={opportunity.value} value={opportunity.value}>
									{opportunity.label}
								</option>
							))}
						</select>
					</label>
				)}
				{state.reason === "investment-enquiry" &&
					state.opportunity === "gold-aggregation" && (
						<label className="grid gap-2 text-sm text-onSurface-800">
							{fields.investor_tier.label}
							<select
								className={inputClassName}
								name="investor_tier"
								value={state.tier}
								onChange={(event) =>
									setState((current) => ({
										...current,
										tier: event.target.value,
									}))
								}
							>
								<option value="" disabled>
									{fields.investor_tier.placeholder}
								</option>
								{tierOptions.map((tier) => (
									<option key={tier.value} value={tier.value}>
										{tier.label}
									</option>
								))}
							</select>
						</label>
					)}
				<label className="grid gap-2 text-sm text-onSurface-800">
					{fields.message.label}
					<textarea
						className={`${inputClassName} resize-y min-h-36`}
						name="message"
						placeholder={fields.message.placeholder}
						required={fields.message.required}
						rows={fields.message.rows ?? 5}
					/>
				</label>
				<label className="flex gap-3 text-sm text-onSurface-800 leading-relaxed">
					<input
						className="mt-1 accent-primary"
						name="consent"
						type="checkbox"
						required={fields.consent.required}
					/>
					<span>{fields.consent.label}</span>
				</label>
				<label className="flex gap-3 text-sm text-onSurface-800 leading-relaxed">
					<input className="mt-1 accent-primary" name="newsletter" type="checkbox" />
					<span>{fields.newsletter.label}</span>
				</label>
				<button
					type="submit"
					disabled={formspree.submitting}
					className="inline-flex items-center justify-center gap-2 bg-primary text-black font-medium px-7 py-3.5 rounded border border-primary hover:bg-[#E5C46A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{formspree.submitting
						? t("common:form.sending")
						: t("contact:form.submit_label")}
					<SendIcon fontSize="small" />
				</button>
			</div>
		</form>
	);
}
