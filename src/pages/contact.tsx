/* import { Redirect } from "@/lib/redirect";
export default Redirect; */

// to keep this root page with the defaultLocale
import Page, { getServerSideProps } from "./[locale]/contact";
export default Page;
export { getServerSideProps };
