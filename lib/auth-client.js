import { createAuthClient } from "better-auth/dist/client/index.mjs";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: `${process.env.BETTER_AUTH_URL}/auth`
})
