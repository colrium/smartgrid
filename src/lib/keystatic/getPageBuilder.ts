import { reader } from "./reader";

export async function getPageBuilder(slug: string) {
	const page = await reader.collections.pages.read(slug);
	return page?.pageBuilder ?? [];
}
