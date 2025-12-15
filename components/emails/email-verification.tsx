import * as React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Button,
    Hr,
    Tailwind,
} from '@react-email/components';

const EmailVerification = (props: { verificationUrl: string }) => {
    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
                        {/* Header */}
                        <Section className="text-center mb-[32px]">
                            <Text className="text-[32px] font-bold text-gray-900 m-0">
                                NexTap
                            </Text>
                            <Text className="text-[16px] text-gray-600 mt-[8px] m-0">
                                Verify your email address
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section>
                            <Text className="text-[18px] font-semibold text-gray-900 mb-[16px] m-0">
                                Welcome to NexTap!
                            </Text>

                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[24px] m-0">
                                Thank you for signing up. To complete your registration and start using NexTap, please verify your email address by clicking the button below.
                            </Text>

                            {/* Verification Button */}
                            <Section className="text-center my-[32px]">
                                <Button
                                    href={props.verificationUrl}
                                    className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border hover:bg-blue-700"
                                >
                                    Verify Email Address
                                </Button>
                            </Section>

                            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[24px] m-0">
                                If the button above doesn't work, you can also copy and paste the following link into your browser:
                            </Text>

                            <Text className="text-[14px] text-blue-600 break-all mb-[32px] m-0">
                                {props.verificationUrl}
                            </Text>

                            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[16px] m-0">
                                This verification link will expire in 24 hours for security reasons.
                            </Text>

                            <Text className="text-[14px] text-gray-600 leading-[20px] m-0">
                                If you didn't create an account with NexTap, you can safely ignore this email.
                            </Text>
                        </Section>

                        <Hr className="border-gray-200 my-[32px]" />

                        {/* Footer */}
                        <Section>
                            <Text className="text-[12px] text-gray-500 text-center leading-[16px] m-0">
                                © {new Date().getFullYear()} NexTap. All rights reserved.
                            </Text>
                            <Text className="text-[12px] text-gray-500 text-center leading-[16px] mt-[8px] m-0">
                                123 Tech Street, Digital City, DC 12345
                            </Text>
                            <Text className="text-[12px] text-gray-500 text-center leading-[16px] mt-[8px] m-0">
                                <a href="#" className="text-gray-500 underline">Unsubscribe</a> |
                                <a href="#" className="text-gray-500 underline ml-[8px]">Privacy Policy</a>
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default EmailVerification;