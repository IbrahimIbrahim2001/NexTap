import { db } from "@/db/drizzle";
import { getActiveOrganization } from "@/server/organizations";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins"
import { sendOrganizationInvitation } from "./mailer";
import { ac, admin, member, owner } from "./auth/permissions";
import { nextCookies } from "better-auth/next-js";

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
        organization({
            async sendInvitationEmail(data) {
                const inviteLink = `${process.env.NEXT_PUBLIC_CORS_ORIGIN}/api/accept-invitation/${data.id}`;
                await sendOrganizationInvitation({
                    email: data.email,
                    invitedByUsername: data.inviter.user.name || data.inviter.user.email,
                    invitedByEmail: data.inviter.user.email,
                    teamName: data.organization.name,
                    inviteLink,
                });
            },
            ac,
            roles: {
                owner,
                admin,
                member,
            },
        }),
        nextCookies()
    ]
});