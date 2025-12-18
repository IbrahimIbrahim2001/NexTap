import { db } from "@/db/drizzle";
import { getActiveOrganization } from "@/server/organizations";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins"
import { resetPassword, sendOrganizationInvitation, sendVerificationEmail } from "./mailer";
import { ac, admin, member, owner } from "./auth/permissions";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod } from "better-auth/plugins"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    trustedOrigins: [process.env.NEXT_PUBLIC_CORS_ORIGIN!],
    secret: process.env.BETTER_AUTH_SECRET!,
    user: {
        deleteUser: {
            enabled: true
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }) => {
            resetPassword({ user, url, token })
        },
        onPasswordReset: async ({ user }) => {
            console.log(`Password for user ${user.email} has been reset.`);
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            void sendVerificationEmail({
                user,
                url
            });
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
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
        nextCookies(),
        lastLoginMethod()
    ]
});