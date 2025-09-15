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

interface WelcomeEmailProps {
  userName: string;
  loginUrl: string;
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
};

const button = {
  backgroundColor: '#0070f3',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px 0',
};

export const WelcomeEmail = ({ userName, loginUrl }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to ChopTym, {userName}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img src="https://res.cloudinary.com/dtg0r122i/image/upload/v1726248918/choptym_logo_d3s3ge.png" width="170" height="50" alt="ChopTym Logo" />
          <Heading as="h2" style={{ color: '#172b4d', fontSize: '24px', fontWeight: '700', textAlign: 'center' as const }}>Welcome to ChopTym, {userName}!</Heading>
          <Text style={paragraph}>Thanks for joining ChopTym Cameroon. Explore delicious meals and get them delivered fast.</Text>
          <Button style={button} href={loginUrl}>Log in to ChopTym</Button>
          <Hr />
          <Text style={{ color: '#8898aa', fontSize: '12px', lineHeight: '16px', textAlign: 'center' as const }}>© 2025 ChopTym. All rights reserved.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
