import EmailVerification from "@/components/emails/email-verification";
import TeamInvitationEmail from "@/components/emails/organization-invitations";
import PasswordResetEmail from "@/components/emails/password-reset";
import { render } from "@react-email/render";
import { User } from "better-auth";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// email verification

// email verification
export async function sendVerificationEmail({
  user,
  url,
}: {
  user: User
  url: string
}) {
  try {
    // Render the React component to HTML string
    const emailHtml = await render(
      EmailVerification({
        verificationUrl: url,
      })
    );
    const text = `Welcome to NexTap!\n\nPlease verify your email address by clicking the link below:\n\n${url}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account with NexTap, you can safely ignore this email.`;

    const info = await transporter.sendMail({
      from: `"NexTap" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your Email Address",
      html: emailHtml,
      text: text,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
interface SendOrganizationInvitationParams {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}


// invitation email
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

// reset password
export async function resetPassword({ user, url, token }: { user: User, url: string, token: string }) {
  try {
    const emailHtml = await render(
      PasswordResetEmail({
        userEmail: user.email,
        resetLink: `${url}`,
        expirationTime: "24 hours"
      })
    );
    const info = await transporter.sendMail({
      from: `"NexTap" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your Email Address",
      html: emailHtml,
    });
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}