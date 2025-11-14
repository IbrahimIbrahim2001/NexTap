import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_CORS_ORIGIN || "http://localhost:3000",
    plugins: [
        organizationClient()
    ]
})

export const { signIn, signUp, useSession } = authClient;