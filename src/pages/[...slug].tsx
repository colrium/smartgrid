// to keep this catch-all page with the defaultLocale
import Page, { getServerSideProps } from "./[locale]/[...slug]";
export default Page;
export { getServerSideProps };
