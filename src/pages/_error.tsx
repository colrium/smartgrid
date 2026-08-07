import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import type { ReactElement } from "react";
import { ErrorPageSection } from "@/components/sections";

type ErrorPageProps = {
	statusCode: number;
	errorMessage?: string;
};

type ErrorPageWithLayout = NextPage<ErrorPageProps> & {
	getLayout?: (page: ReactElement) => ReactElement;
};

const getStatusCode = ({ res, err }: NextPageContext) => {
	if (res?.statusCode) return res.statusCode;
	if (err && "statusCode" in err && typeof err.statusCode === "number") {
		return err.statusCode;
	}
	return 500;
};

const ErrorPage: ErrorPageWithLayout = ({ statusCode, errorMessage }) => {
	const title = statusCode === 404 ? "Page not found" : "Server error";
	const description =
		statusCode === 404
			? "The page you are looking for could not be found."
			: "The application hit an error while handling this request.";

	return (
		<div className="relative">
			<Head>
				<title>{`${statusCode} | ${title}`}</title>
				<meta name="description" content={description} />
			</Head>
			<ErrorPageSection
				statusCode={statusCode}
				statusLabel={`Error ${statusCode}`}
				title={title}
				description={description}
				detail={errorMessage}
				homeLabel="Back home"
				contactLabel="Contact us"
			/>
		</div>
	);
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
	const statusCode = getStatusCode({ res, err } as NextPageContext);
	const statusMessage = res?.statusMessage;
	const errorMessage =
		err?.message || (statusCode >= 500 ? statusMessage : undefined);

	if (err) {
		console.error(err);
	}

	return {
		statusCode,
		errorMessage,
	};
};

ErrorPage.getLayout = (page: ReactElement) => page;

export default ErrorPage;
