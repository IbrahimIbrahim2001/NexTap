import { db } from "@/db/drizzle";
import { getActiveOrganization } from "@/server/organizations";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    trustedOrigins: [process.env.NEXT_PUBLIC_CORS_ORIGIN!],
    secret: process.env.BETTER_AUTH_SECRET!,
    emailAndPassword: {
        enabled: true,
    },
    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const organization = await getActiveOrganization(session.userId);
                    return {
                        data: {
                            ...session,
                            activeOrganizationId: organization?.id,
                        },
                    };
                },
            },
        },
    },
    plugins: [
        organization()
    ]
});