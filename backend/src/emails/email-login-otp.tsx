import * as React from 'react'
import { Tailwind, Section, Text, Hr, Container, Head } from '@react-email/components'

export default function EmailLoginOTPEmail({ otp }: { otp: string | number }) {
    return (
        <Tailwind>
            <Head>
                <title>Login Verification Code</title>
            </Head>
            <Container className="font-sans">
                <Section className="bg-white border border-gray-200 rounded-lg px-8 py-6 max-w-md mx-auto my-8">
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                        Tetsu Login Verification
                    </Text>
                    <Hr className="border-gray-200 my-4" />
                    <Text className="text-gray-700 mb-4">
                        Please use the following verification code to complete your login:
                    </Text>
                    <Section className="bg-gray-50 rounded-md py-4 px-6 mb-4">
                        <Text className="text-4xl font-bold tracking-wide text-gray-800">{otp}</Text>
                    </Section>
                    <Text className="text-gray-600 text-sm mb-4">
                        This verification code will expire in 10 minutes for security purposes.
                    </Text>
                    <Hr className="border-gray-200 my-4" />
                    <Text className="text-gray-500 text-xs">
                        If you did not request this code, please disregard this email or contact support.
                    </Text>
                    <Text className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} Tetsu. All rights reserved.
                    </Text>
                </Section>
            </Container>
        </Tailwind>
    )
}

EmailLoginOTPEmail.PreviewProps = {
    otp: 123456
}