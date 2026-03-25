import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

/**
 * Auth catch-all route — delegates all /api/auth/* requests to Better Auth.
 *
 * Handles: sign-in, sign-up, sign-out, session, and all other auth endpoints.
 */
export const { GET, POST } = toNextJsHandler(auth.handler);
