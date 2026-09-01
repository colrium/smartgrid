import { NextStudio } from "next-sanity/studio";
import { type ReactElement } from "react";
import config from "../../../sanity.config";
export default function StudioPage() {
	return <NextStudio config={config} />;
}
StudioPage.getLayout = (page: ReactElement) => <>{page}</>