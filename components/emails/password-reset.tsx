import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';

const PasswordResetEmail = (props) => {
    const { userEmail, resetLink, expirationTime } = props;

    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Preview>Reset your password - Action required</Preview>
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="mx-auto bg-white rounded-[8px] px-[40px] py-[40px] max-w-[600px]">
                        {/* Header */}
                        <Section className="text-center mb-[32px]">
                            <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                                Password Reset Request
                            </Heading>
                            <Text className="text-[16px] text-gray-600 m-0">
                                We received a request to reset your password
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-[32px]">
                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                                Hello,
                            </Text>
                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                                We received a request to reset the password for your account associated with{' '}
                                <strong>{userEmail}</strong>. If you made this request, please click the button below to reset your password.
                            </Text>
                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[24px]">
                                This link will expire in <strong>{expirationTime}</strong> for security reasons.
                            </Text>
                        </Section>

                        {/* Reset Button */}
                        <Section className="text-center mb-[32px]">
                            <Button
                                href={resetLink}
                                className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
                            >
                                Reset My Password
                            </Button>
                        </Section>

                        {/* Alternative Link */}
                        <Section className="mb-[32px]">
                            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[8px]">
                                If the button above doesn't work, copy and paste this link into your browser:
                            </Text>
                            <Link
                                href={resetLink}
                                className="text-blue-600 text-[14px] break-all underline"
                            >
                                {resetLink}
                            </Link>
                        </Section>

                        {/* Security Notice */}
                        <Section className="border-t border-solid border-gray-200 pt-[24px] mb-[32px]">
                            <Heading className="text-[18px] font-bold text-gray-900 mb-[12px]">
                                Security Notice
                            </Heading>
                            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[8px]">
                                • If you didn't request this password reset, please ignore this email
                            </Text>
                            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[8px]">
                                • Your password will remain unchanged until you create a new one
                            </Text>
                            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[8px]">
                                • For security, this link can only be used once
                            </Text>
                            <Text className="text-[14px] text-gray-600 leading-[20px]">
                                • If you continue to receive these emails, please contact our support team
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Section className="border-t border-solid border-gray-200 pt-[24px]">
                            <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                                This email was sent to {userEmail}
                            </Text>
                            <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                                © 2025 Your Company Name. All rights reserved.
                            </Text>
                            <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                                123 Business Street, City, State 12345 |{' '}
                                <Link href="#" className="text-gray-500 underline">
                                    Unsubscribe
                                </Link>
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

PasswordResetEmail.PreviewProps = {
    userEmail: "user@example.com",
    resetLink: "https://yourapp.com/reset-password?token=abc123xyz",
    expirationTime: "24 hours",
};

export default PasswordResetEmail;