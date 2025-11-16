import { db } from "@/db/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    trustedOrigins: [process.env.NEXT_PUBLIC_CORS_ORIGIN!],
    secret: process.env.BETTER_AUTH_SECRET!,
    // trustedOrigins: [process.env.CORS_ORIGIN!, process.env.BETTER_AUTH_URL!],
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        organization()
    ]
});