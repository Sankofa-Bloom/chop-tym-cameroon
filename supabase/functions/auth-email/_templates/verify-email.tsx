import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Img,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface VerifyEmailProps {
  userName: string;
  verifyUrl: string;
}

export const VerifyEmail = ({ userName, verifyUrl }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your ChopTym email</Preview>
    <Body style={{ backgroundColor: '#f6f9fc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif' }}>
      <Container style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px' }}>
        <Section style={{ padding: '0 48px' }}>
          <Img src="https://res.cloudinary.com/dtg0r122i/image/upload/v1726248918/choptym_logo_d3s3ge.png" width="170" height="50" alt="ChopTym Logo" />
          <Heading as="h2" style={{ color: '#172b4d', fontSize: '24px', fontWeight: 700, textAlign: 'center' as const }}>Verify your email, {userName}</Heading>
          <Text style={{ color: '#525f7f', fontSize: '16px', lineHeight: '24px' }}>Please confirm your email address to activate your account.</Text>
          <Button href={verifyUrl} style={{ backgroundColor: '#0070f3', borderRadius: '6px', color: '#fff', fontSize: '16px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' as const, display: 'block', width: '100%', padding: '12px 0' }}>Verify Email</Button>
          <Text style={{ color: '#8898aa', fontSize: '12px', marginTop: '20px' }}>If the button doesn't work, copy and paste this URL into your browser:</Text>
          <Text style={{ color: '#0070f3', fontSize: '12px', wordBreak: 'break-all' }}>{verifyUrl}</Text>
          <Hr />
          <Text style={{ color: '#8898aa', fontSize: '12px', lineHeight: '16px', textAlign: 'center' as const }}>© 2025 ChopTym. All rights reserved.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
