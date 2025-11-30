import * as React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Button,
    Link,
    Tailwind,
    Preview,
} from '@react-email/components';

const TeamInvitationEmail = (props: { inviterName: string; inviteeName: string; teamName: string; acceptUrl: string; }) => {
    const { inviterName, inviteeName, teamName, acceptUrl } = props;

    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Preview>You've been invited to join {teamName}</Preview>
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="mx-auto bg-white rounded-[16px] max-w-[600px] px-[48px] py-[48px]">
                        {/* Header */}
                        <Section className="text-center mb-[32px]">
                            <Text className="text-[32px] font-bold text-black m-0 leading-tight">
                                You're invited!
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-[32px]">
                            <Text className="text-[18px] text-black m-0 mb-[16px] leading-relaxed">
                                Hi {inviteeName},
                            </Text>

                            <Text className="text-[16px] text-gray-600 m-0 mb-[24px] leading-relaxed">
                                <strong className="text-black">{inviterName}</strong> has invited you to join <strong className="text-black">{teamName}</strong>. You'll be able to collaborate with the team and access shared resources.
                            </Text>

                            <Text className="text-[16px] text-gray-600 m-0 mb-[32px] leading-relaxed">
                                Click the button below to accept your invitation and get started.
                            </Text>
                        </Section>

                        {/* CTA Button */}
                        <Section className="text-center mb-[32px]">
                            <Button
                                href={acceptUrl}
                                className="bg-black text-white px-[32px] py-[16px] rounded-[12px] text-[16px] font-medium no-underline box-border inline-block"
                            >
                                Accept Invitation
                            </Button>
                        </Section>

                        {/* Alternative Link */}
                        <Section className="text-center mb-[40px]">
                            <Text className="text-[14px] text-gray-500 m-0 mb-[8px]">
                                Or copy and paste this link in your browser:
                            </Text>
                            <Link
                                href={acceptUrl}
                                className="text-black text-[14px] underline break-all"
                            >
                                {acceptUrl}
                            </Link>
                        </Section>

                        {/* Footer */}
                        <Section className="border-t border-gray-200 pt-[24px]">
                            <Text className="text-[12px] text-gray-400 m-0 text-center leading-relaxed">
                                This invitation was sent by {inviterName}. If you weren't expecting this invitation, you can safely ignore this email.
                            </Text>

                            <Text className="text-[12px] text-gray-400 m-0 text-center mt-[16px]">
                                © {new Date().getFullYear()} {teamName}. All rights reserved.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

TeamInvitationEmail.PreviewProps = {
    inviterName: "Sarah Johnson",
    inviteeName: "Alex Chen",
    teamName: "Design Squad",
    acceptUrl: "https://app.example.com/accept-invite?token=abc123xyz",
};

export default TeamInvitationEmail;