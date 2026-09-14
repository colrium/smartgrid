import { makeAPIRouteHandler } from "@keystatic/next/api";
import keystaticConfig from "../../../../keystatic.config";

// Backend for the Keystatic admin UI (`/keystatic`). Local-mode reads/writes
// go through here; non-development access is gated by the `src/proxy.ts` edge
// gate (HTTP Basic Auth against KEYSTATIC_ADMIN_USER/PASSWORD).
export default makeAPIRouteHandler({ config: keystaticConfig });
