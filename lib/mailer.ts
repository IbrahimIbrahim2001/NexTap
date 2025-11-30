import TeamInvitationEmail from "@/components/emails/organization-invitations";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

interface SendOrganizationInvitationParams {
    email: string;
    invitedByUsername: string;
    invitedByEmail: string;
    teamName: string;
    inviteLink: string;
}

export async function sendOrganizationInvitation(params: SendOrganizationInvitationParams) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, invitedByUsername, invitedByEmail, teamName, inviteLink } = params;

    try {
        const emailHtml = await render(
            TeamInvitationEmail({
                inviterName: invitedByUsername,
                inviteeName: email,
                teamName: teamName,
                acceptUrl: inviteLink,
            })
        );

        const text = await render(
            TeamInvitationEmail({
                inviterName: invitedByUsername,
                inviteeName: email,
                teamName: teamName,
                acceptUrl: inviteLink,
            }),
            { plainText: true }
        );

        const mailOptions = {
            from: {
                name: `${invitedByUsername} NexTap`,
                address: process.env.EMAIL_USER!,
            },
            to: email,
            subject: `You've been invited to join ${teamName}`,
            html: emailHtml,
            text: text,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`Invitation email sent to ${email}:`, result.messageId);
        return result;

    } catch (error) {
        console.error("Failed to send organization invitation email:", error);
        throw new Error(`Failed to send invitation email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}