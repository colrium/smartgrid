import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation, useSetState } from "@/hooks";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useForm } from "@formspree/react";

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

type ContactFormProps = { className?: string };

export default function ContactForm({ className = "" }: ContactFormProps) {
	const { t, tObject } = useTranslation(["contact", "common"]);
	const router = useRouter();
	const formspreeFormId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
	const [formspree, handleFormspreeSubmit] = useForm(formspreeFormId);
	const { opportunity: opportunityQuery, reason: reasonQuery, tier: tierQuery } = router.query;
	const [values, setValues] = useSetState<FormValues>(initialValues);

	const reasons = tObject<Option[]>("contact:contact_reasons.options", {
		returnObjects: true,
	});

	const fields = tObject<Record<string, Field>>("contact:form.fields", {
		returnObjects: true,
	});
	const opportunityOptions = tObject<Option[]>("contact:form.fields.opportunity.options", {
		returnObjects: true,
	}) as unknown as Option[];
	const locationCountries = tObject<Country[]>("common:locations.countries", {
		returnObjects: true,
	});
	const officeCountries = (
		tObject<{ country: string }[]>("contact:offices.items", {
			returnObjects: true,
		})
	).map((office) => office.country);

	const countries = Array.from(
		new Set([...locationCountries.map((c) => c.name), ...officeCountries])
	);

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
	}, [opportunityQuery, reasonQuery, tierQuery]);

	const tierOptions = useMemo(() => fields.investor_tier.options ?? [], [fields]);

	// Clear the form once a submission succeeds.
	useEffect(() => {
		if (formspree.succeeded) {
			setValues(initialValues);
		}
	}, [formspree.succeeded]);

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
						{t("contact:form.success_heading")}
					</div>
					<p className="text-sm text-on-surface-800 mt-2 leading-relaxed">
						{t("contact:form.success_body")}
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
			<div className=" p-6 md:p-8 grid gap-5">
				<div className="grid md:grid-cols-2 gap-5">
					<TextField
						fullWidth
						variant="outlined"
						name="first_name"
						label={fields.first_name.label}
						placeholder={fields.first_name.placeholder}
						required={fields.first_name.required}
						value={values.first_name}
						onChange={(event) =>
							setValues((current) => ({ ...current, first_name: event.target.value }))
						}
					/>
					<TextField
						fullWidth
						variant="outlined"
						name="last_name"
						label={fields.last_name.label}
						placeholder={fields.last_name.placeholder}
						required={fields.last_name.required}
						value={values.last_name}
						onChange={(event) =>
							setValues((current) => ({ ...current, last_name: event.target.value }))
						}
					/>
				</div>
				<div className="grid md:grid-cols-2 gap-5">
					<TextField
						fullWidth
						variant="outlined"
						name="email"
						type="email"
						label={fields.email.label}
						placeholder={fields.email.placeholder}
						required={fields.email.required}
						value={values.email}
						onChange={(event) =>
							setValues((current) => ({ ...current, email: event.target.value }))
						}
					/>
					<TextField
						fullWidth
						variant="outlined"
						name="phone"
						type="tel"
						label={fields.phone.label}
						placeholder={fields.phone.placeholder}
						required={fields.phone.required}
						value={values.phone}
						onChange={(event) =>
							setValues((current) => ({ ...current, phone: event.target.value }))
						}
					/>
				</div>
				<div className="grid md:grid-cols-2 gap-5">
					<FormControl fullWidth>
						<InputLabel>{fields.country.label}</InputLabel>
						<Select
							label={fields.country.label}
							name="country"
							required={fields.country.required}
							value={values.country}
							onChange={(event) =>
								setValues((current) => ({ ...current, country: event.target.value }))
							}
							displayEmpty
						>
							<MenuItem value="" disabled>
								{fields.country.placeholder}
							</MenuItem>
							{countries.map((country) => (
								<MenuItem key={country} value={country}>
									{country}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl fullWidth>
						<InputLabel>{fields.reason.label}</InputLabel>
						<Select
							label={fields.reason.label}
							name="reason"
							required={fields.reason.required}
							value={values.reason}
							onChange={(event) =>
								setValues((current) => ({ ...current, reason: event.target.value }))
							}
							displayEmpty
						>
							<MenuItem value="" disabled>
								{fields.reason.placeholder}
							</MenuItem>
							{reasons.map((reason) => (
								<MenuItem key={reason.value} value={reason.value}>
									{reason.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				{["investment-enquiry", "due-diligence", "partnership"].includes(values.reason) && (
					<FormControl fullWidth>
						<InputLabel>{fields.opportunity.label}</InputLabel>
						<Select
							label={fields.opportunity.label}
							name="opportunity"
							value={values.opportunity}
							onChange={(event) =>
								setValues((current) => ({ ...current, opportunity: event.target.value }))
							}
							displayEmpty
						>
							<MenuItem value="" disabled>
								{fields.opportunity.placeholder}
							</MenuItem>
							{opportunityOptions.map((opportunity) => (
								<MenuItem key={opportunity.value} value={opportunity.value}>
									{opportunity.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
				{values.reason === "investment-enquiry" &&
					values.opportunity === "gold-aggregation" && (
						<FormControl fullWidth>
							<InputLabel>{fields.investor_tier.label}</InputLabel>
							<Select
								label={fields.investor_tier.label}
								name="investor_tier"
								value={values.tier}
								onChange={(event) =>
									setValues((current) => ({ ...current, tier: event.target.value }))
								}
								displayEmpty
							>
								<MenuItem value="" disabled>
									{fields.investor_tier.placeholder}
								</MenuItem>
								{tierOptions.map((tier) => (
									<MenuItem key={tier.value} value={tier.value}>
										{tier.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
				<TextField
					fullWidth
					variant="outlined"
					name="message"
					multiline
					rows={fields.message.rows ?? 5}
					label={fields.message.label}
					placeholder={fields.message.placeholder}
					required={fields.message.required}
					value={values.message}
					onChange={(event) =>
						setValues((current) => ({ ...current, message: event.target.value }))
					}
				/>
				<FormControlLabel
					control={
						<Checkbox
							name="consent"
							required={fields.consent.required}
							checked={values.consent}
							onChange={(event) =>
								setValues((current) => ({ ...current, consent: event.target.checked }))
							}
						/>
					}
					label={
						<span className="text-sm text-on-surface-800 leading-relaxed">
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
						</span>
					}
				/>
				<FormControlLabel
					control={
						<Checkbox
							name="newsletter"
							checked={values.newsletter}
							onChange={(event) =>
								setValues((current) => ({ ...current, newsletter: event.target.checked }))
							}
						/>
					}
					label={<span className="text-sm text-on-surface-800">{fields.newsletter.label}</span>}
				/>
				<button
					type="submit"
					disabled={formspree.submitting}
					className="inline-flex items-center justify-center gap-2 bg-primary text-surface font-medium px-7 py-3.5 rounded-full border border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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