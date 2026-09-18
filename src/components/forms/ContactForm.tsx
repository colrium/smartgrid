import { useEffect, useMemo, type ReactElement } from "react";
import { useRouter } from "next/router";
import { useTranslation, useSetState } from "@/hooks";
import { useForm } from "@formspree/react";
import { ALL_COUNTRIES } from "@/lib/countries";
import Link from "@/components/Link";

type Country = { code?: string; name: string; flag?: string };
type Option = { value: string; label: string };
type Field = {
	label: string;
	placeholder?: string;
	required?: boolean;
	type: string;
	rows?: number;
	options?: Option[];
	label_prefix?: string;
	label_link?: string;
	label_suffix?: string;
};

type FormValues = {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	country: string;
	reason: string;
	opportunity: string;
	tier: string;
	message: string;
	consent: boolean;
	newsletter: boolean;
};

const initialValues: FormValues = {
	first_name: "",
	last_name: "",
	email: "",
	phone: "",
	country: "",
	reason: "",
	opportunity: "",
	tier: "",
	message: "",
	consent: false,
	newsletter: false,
};

const fieldShell =
	"rounded-xl border border-on-surface-200 bg-surface transition-colors duration-200 " +
	"focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15";

const fieldInput =
	"w-full bg-transparent px-4 py-3.5 text-sm text-on-surface-900 outline-none " +
	"placeholder:text-on-surface-400";

function FieldLabel({ label, required }: { label: string; required?: boolean }): ReactElement {
	return (
		<span className="mb-2 block text-xs font-semibold tracking-wide text-on-surface-700 uppercase">
			{label}
			{required && <span className="text-accent"> *</span>}
		</span>
	);
}

type TextInputFieldProps = {
	name: string;
	label: string;
	placeholder?: string;
	required?: boolean;
	type?: string;
	value: string;
	onValueChange: (value: string) => void;
};

function TextInputField({
	name,
	label,
	placeholder,
	required,
	type = "text",
	value,
	onValueChange,
}: TextInputFieldProps): ReactElement {
	return (
		<label className="block">
			<FieldLabel label={label} required={required} />
			<span className={`flex items-center ${fieldShell}`}>
				<input
					name={name}
					type={type}
					required={required}
					placeholder={placeholder}
					value={value}
					onChange={(event) => onValueChange(event.target.value)}
					className={fieldInput}
				/>
			</span>
		</label>
	);
}

type SelectFieldProps = {
	name: string;
	label: string;
	placeholder?: string;
	required?: boolean;
	value: string;
	options: { value: string; label: string }[];
	onValueChange: (value: string) => void;
};

function SelectField({
	name,
	label,
	placeholder,
	required,
	value,
	options,
	onValueChange,
}: SelectFieldProps): ReactElement {
	return (
		<label className="block">
			<FieldLabel label={label} required={required} />
			<span className={`relative flex items-center ${fieldShell}`}>
				<select
					name={name}
					required={required}
					value={value}
					onChange={(event) => onValueChange(event.target.value)}
					className={`${fieldInput} appearance-none pr-10 ${value ? "" : "text-on-surface-400"}`}
				>
					<option value="" disabled>
						{placeholder}
					</option>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<span
					className="mdi mdi-chevron-down text-on-surface-500 pointer-events-none absolute right-3 text-lg"
					aria-hidden="true"
				/>
			</span>
		</label>
	);
}

type CheckboxFieldProps = {
	name: string;
	checked: boolean;
	required?: boolean;
	onChange: (checked: boolean) => void;
	children: React.ReactNode;
};

function CheckboxField({
	name,
	checked,
	required,
	onChange,
	children,
}: CheckboxFieldProps): ReactElement {
	return (
		<label className="flex cursor-pointer items-start gap-3">
			<span className="relative mt-0.5 inline-flex shrink-0">
				<input
					name={name}
					type="checkbox"
					required={required}
					checked={checked}
					onChange={(event) => onChange(event.target.checked)}
					className="peer size-5 cursor-pointer appearance-none rounded-md border border-on-surface-300 bg-surface transition-colors duration-200 checked:border-primary checked:bg-primary focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none"
				/>
				<span
					className="mdi mdi-check text-surface pointer-events-none absolute inset-0 flex items-center justify-center text-sm opacity-0 transition-opacity peer-checked:opacity-100"
					aria-hidden="true"
				/>
			</span>
			<span className="text-sm text-on-surface-800 leading-relaxed">{children}</span>
		</label>
	);
}

type ContactFormProps = { className?: string };

/**
 * Locale-read hardening (M11 batch 1): `tObject` returns the key string
 * when a namespace is missing (and there is no i18next instance in the
 * check-script static proof), so every object/array read is coerced here —
 * a missing `contact:form` copy renders an empty form instead of
 * white-screening the page (M3 fail-safe rule). Production reads pass
 * through untouched.
 */
const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);
const asFieldMap = (value: unknown): Record<string, any> => {
	const map = typeof value === "object" && value !== null ? (value as Record<string, any>) : {};
	return new Proxy(map, {
		get: (target, prop) => (typeof prop === "string" && prop in target ? target[prop] : {}),
	});
};

/**
 * Keystatic-owned widget strings (M11 `contactForm` unique section).
 * When omitted, the legacy `contact:form` locale strings render. Field
 * structure, reason options, validation and posting stay locale-owned
 * (see `ContactFormSection`).
 */
export interface ContactFormContent {
	submitLabel?: string | null;
	successHeading?: string | null;
	successBody?: string | null;
}

export default function ContactForm({ className = "", content }: ContactFormProps & { content?: ContactFormContent | null }) {
	const { t, tObject } = useTranslation(["contact", "common"]);
	const router = useRouter();
	const formspreeFormId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
	const [formspree, handleFormspreeSubmit] = useForm(formspreeFormId);
	const { opportunity: opportunityQuery, reason: reasonQuery, tier: tierQuery } = router.query;
	const [values, setValues] = useSetState<FormValues>(initialValues);

	const reasons = asArray<Option>(
		tObject<Option[]>("contact:contact_reasons.options", {
			returnObjects: true,
		})
	);

	const fields = asFieldMap(
		tObject<Record<string, Field>>("contact:form.fields", {
			returnObjects: true,
		})
	);
	const opportunityOptions = asArray<Option>(
		tObject<Option[]>("contact:form.fields.opportunity.options", {
			returnObjects: true,
		})
	) as unknown as Option[];
	const locationCountries = asArray<Country>(
		tObject<Country[]>("common:locations.countries", {
			returnObjects: true,
		})
	);
	const officeCountries = asArray<{ country: string }>(
		tObject<{ country: string }[]>("contact:offices.items", {
			returnObjects: true,
		})
	).map((office) => office.country);

	// Full world list first, with any i18n/office countries that may be missing
	// appended (deduplicated), then sorted alphabetically for easy scanning.
	const countries = Array.from(
		new Set([...ALL_COUNTRIES, ...locationCountries.map((c) => c.name), ...officeCountries])
	).sort((a, b) => a.localeCompare(b));

	useEffect(() => {
		const reason = typeof reasonQuery === "string" ? reasonQuery : "";
		const opportunity =
			typeof opportunityQuery === "string" ? opportunityQuery : "";
		const tier = typeof tierQuery === "string" ? tierQuery : "";
		setValues((current) => ({
			reason: reason === "invest" ? "investment-enquiry" : reason || current.reason,
			opportunity: opportunity || current.opportunity,
			tier: tier || current.tier,
		}));
	}, [opportunityQuery, reasonQuery, tierQuery, setValues]);

	const tierOptions = useMemo(() => fields.investor_tier.options ?? [], [fields]);

	// Clear the form once a submission succeeds.
	useEffect(() => {
		if (formspree.succeeded) {
			setValues(initialValues);
		}
	}, [formspree.succeeded, setValues]);

	const consentPrefix = fields.consent.label_prefix ?? fields.consent.label;
	const consentSuffix = fields.consent.label_suffix ?? "";

	return (
		<form
			className={`max-w-295 mx-auto flex flex-col gap-12 rounded-lg border border-primary/20 bg-surface-200 p-6 md:p-8 ${className}`}
			onSubmit={handleFormspreeSubmit}
		>
			{formspree.succeeded && (
				<div className="mt-8 rounded-lg border border-primary/30 bg-primary/10 p-5">
					<div className="text-primary font-medium">
						{content?.successHeading || t("contact:form.success_heading")}
					</div>
					<p className="text-sm text-on-surface-800 mt-2 leading-relaxed">
						{content?.successBody || t("contact:form.success_body")}
					</p>
				</div>
			)}
			{formspree.result && !formspree.succeeded && (
				<div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-5">
					<div className="text-red-900 font-medium">
						{t("common:errors.error")}
					</div>
					<p className="text-sm text-on-surface-800 mt-2 leading-relaxed">
						{t("common:form.submissionError")}
					</p>
				</div>
			)}
			<div className="grid gap-6">
				<div className="grid gap-6 md:grid-cols-2">
					<TextInputField
						name="first_name"
						label={fields.first_name.label}
						placeholder={fields.first_name.placeholder}
						required={fields.first_name.required}
						value={values.first_name}
						onValueChange={(value) => setValues((c) => ({ ...c, first_name: value }))}
					/>
					<TextInputField
						name="last_name"
						label={fields.last_name.label}
						placeholder={fields.last_name.placeholder}
						required={fields.last_name.required}
						value={values.last_name}
						onValueChange={(value) => setValues((c) => ({ ...c, last_name: value }))}
					/>
				</div>
				<div className="grid gap-6 md:grid-cols-2">
					<TextInputField
						name="email"
						type="email"
						label={fields.email.label}
						placeholder={fields.email.placeholder}
						required={fields.email.required}
						value={values.email}
						onValueChange={(value) => setValues((c) => ({ ...c, email: value }))}
					/>
					<TextInputField
						name="phone"
						type="tel"
						label={fields.phone.label}
						placeholder={fields.phone.placeholder}
						required={fields.phone.required}
						value={values.phone}
						onValueChange={(value) => setValues((c) => ({ ...c, phone: value }))}
					/>
				</div>
				<div className="grid gap-6 md:grid-cols-2">
					<SelectField
						name="country"
						label={fields.country.label}
						placeholder={fields.country.placeholder}
						required={fields.country.required}
						value={values.country}
						options={countries.map((country) => ({ value: country, label: country }))}
						onValueChange={(value) => setValues((c) => ({ ...c, country: value }))}
					/>
					<SelectField
						name="reason"
						label={fields.reason.label}
						placeholder={fields.reason.placeholder}
						required={fields.reason.required}
						value={values.reason}
						options={reasons}
						onValueChange={(value) => setValues((c) => ({ ...c, reason: value }))}
					/>
				</div>
				{["investment-enquiry", "due-diligence", "partnership"].includes(values.reason) && (
					<SelectField
						name="opportunity"
						label={fields.opportunity.label}
						placeholder={fields.opportunity.placeholder}
						value={values.opportunity}
						options={opportunityOptions}
						onValueChange={(value) => setValues((c) => ({ ...c, opportunity: value }))}
					/>
				)}
				{values.reason === "investment-enquiry" && values.opportunity === "gold-aggregation" && (
					<SelectField
						name="investor_tier"
						label={fields.investor_tier.label}
						placeholder={fields.investor_tier.placeholder}
						value={values.tier}
						options={tierOptions}
						onValueChange={(value) => setValues((c) => ({ ...c, tier: value }))}
					/>
				)}
				<label className="block">
					<FieldLabel
						label={fields.message.label}
						required={fields.message.required}
					/>
					<span className={`block ${fieldShell}`}>
						<textarea
							name="message"
							rows={fields.message.rows ?? 5}
							required={fields.message.required}
							placeholder={fields.message.placeholder}
							value={values.message}
							onChange={(event) =>
								setValues((current) => ({ ...current, message: event.target.value }))
							}
							className={`${fieldInput} resize-y`}
						/>
					</span>
				</label>
				<div className="grid gap-4">
					<CheckboxField
						name="consent"
						checked={values.consent}
						required={fields.consent.required}
						onChange={(checked) => setValues((current) => ({ ...current, consent: checked }))}
					>
						{consentPrefix}
						{fields.consent.label_link && (
							<Link
								href="/privacy-policy"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary underline hover:text-primary-700"
							>
								{fields.consent.label_link}
							</Link>
						)}
						{consentSuffix}
					</CheckboxField>
					<CheckboxField
						name="newsletter"
						checked={values.newsletter}
						onChange={(checked) => setValues((current) => ({ ...current, newsletter: checked }))}
					>
						{fields.newsletter.label}
					</CheckboxField>
				</div>
				<button
					type="submit"
					disabled={formspree.submitting}
					className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-surface shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary/30 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
				>
					<span className="mdi mdi-send text-xl" aria-hidden="true" />
					{formspree.submitting
					? t("common:form.sending")
					: content?.submitLabel || t("contact:form.submit_label")}
				</button>
			</div>
		</form>
	);
}