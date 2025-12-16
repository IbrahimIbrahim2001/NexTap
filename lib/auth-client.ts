import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"
import { ac, admin, member, owner } from "./auth/permissions";
import { lastLoginMethodClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_CORS_ORIGIN || "http://localhost:3000",
    plugins: [
        organizationClient({
            ac,
            roles: {
                owner,
                admin,
                member,
            }
        }),
        lastLoginMethodClient()
    ]
})

export const { signIn, signUp, useSession } = authClient;