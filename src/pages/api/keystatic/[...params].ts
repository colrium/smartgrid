import { makeAPIRouteHandler } from "@keystatic/next/api";
import keystaticConfig from "../../../../keystatic.config";

// Backend for the Keystatic admin UI (`/keystatic`). Local-mode reads/writes
// go through here; production access is gated by `middleware.ts` (Basic Auth).
export default makeAPIRouteHandler({ config: keystaticConfig });
