import type { GetServerSideProps, NextPage } from "next";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import PageHead from "@/components/Head";
import { ContactFormSection } from "@/components/sections";
import {
	ContactHeroSection,
	TalkToUsSection,
	OfficesSection,
} from "@/components/sections/contact";

type PageProps = {
	/** Keystatic page when the `contact` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 1): Keystatic owns
	// the whole page in page order — `contactHero`, `talkToUs` cardGrid,
	// `contactOffices`, `contactForm` — when the slug is allowlisted via
	// `KEYSTATIC_PAGES` and the entry is published. Otherwise the legacy
	// locale-JSON implementation renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="contact" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="contact" />
			<ContactHeroSection />
			<TalkToUsSection />
			<OfficesSection />
			<ContactFormSection />
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
        "meta",
        "contact"
	]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("contact", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
