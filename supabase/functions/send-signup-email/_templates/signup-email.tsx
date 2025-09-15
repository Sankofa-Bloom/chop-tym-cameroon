import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface SignupEmailProps {
  userName: string
  userEmail: string
  confirmationUrl: string
}

export const SignupEmail = ({
  userName,
  userEmail,
  confirmationUrl,
}: SignupEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to ChopTym! Please confirm your email to get started</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🍽️ ChopTym</Text>
            <Text style={tagline}>Authentic African Cuisine Delivered</Text>
          </Section>

          <Section style={heroSection}>
            <Heading style={h1}>Welcome to ChopTym, {userName}! 🎉</Heading>
            <Text style={heroText}>
              We're thrilled to have you join our community of food lovers! Before you can start exploring our amazing selection of authentic Cameroonian and West African dishes, we need to confirm your email address.
            </Text>
          </Section>

          <Hr style={separator} />

          <Section style={confirmationSection}>
            <Heading style={h2}>Confirm Your Email Address</Heading>
            <Text style={confirmationText}>
              Click the button below to verify your email and activate your ChopTym account:
            </Text>
            <Button href={confirmationUrl} style={confirmButton}>
              Confirm Email Address
            </Button>
            <Text style={linkText}>
              Or copy and paste this link in your browser:
            </Text>
            <Link href={confirmationUrl} style={confirmLink}>
              {confirmationUrl}
            </Link>
          </Section>

          <Hr style={separator} />

          <Section style={featuresSection}>
            <Heading style={h2}>What awaits you at ChopTym?</Heading>
            <Row style={featureRow}>
              <Column style={featureIcon}>🥘</Column>
              <Column style={featureContent}>
                <Text style={featureTitle}>Authentic Dishes</Text>
                <Text style={featureText}>Ndolé, Jollof Rice, Grilled Fish & Attieké, and more!</Text>
              </Column>
            </Row>
            <Row style={featureRow}>
              <Column style={featureIcon}>🏠</Column>
              <Column style={featureContent}>
                <Text style={featureTitle}>Local Restaurants</Text>
                <Text style={featureText}>Supporting local businesses in your community</Text>
              </Column>
            </Row>
            <Row style={featureRow}>
              <Column style={featureIcon}>🚚</Column>
              <Column style={featureContent}>
                <Text style={featureTitle}>Fast Delivery</Text>
                <Text style={featureText}>Hot, fresh meals delivered in 30-45 minutes</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={separator} />

          <Section style={footer}>
            <Text style={footerText}>
              If you didn't create an account with ChopTym, please ignore this email.
            </Text>
            <Text style={footerText}>
              Questions? We're here to help! Contact us anytime.
            </Text>
            <Text style={footerText}>
              ChopTym - Bringing you closer to home through food 🏡
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default SignupEmail

// ChopTym Brand Colors (HSL values from design system)
const chopTymOrange = 'hsl(25, 95%, 53%)' // Primary orange
const chopTymOrangeLight = 'hsl(25, 95%, 65%)' // Lighter orange
const chopTymDark = 'hsl(20, 14.3%, 4.1%)' // Dark text
const chopTymWarm = 'hsl(24, 9.8%, 10%)' // Warm dark

const main = {
  backgroundColor: '#fef7f0',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginBottom: '64px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px -10px rgba(234, 88, 12, 0.1)',
}

const header = {
  backgroundColor: chopTymOrange,
  padding: '40px 20px',
  textAlign: 'center' as const,
}

const logo = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 8px',
}

const tagline = {
  fontSize: '16px',
  color: '#ffffff',
  margin: '0',
  opacity: '0.9',
}

const heroSection = {
  padding: '40px 20px',
  textAlign: 'center' as const,
}

const h1 = {
  color: chopTymDark,
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  lineHeight: '1.3',
}

const h2 = {
  color: chopTymDark,
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 20px',
}

const heroText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#666',
  margin: '0',
}

const separator = {
  borderColor: '#f0f0f0',
  margin: '0',
}

const confirmationSection = {
  padding: '40px 20px',
  textAlign: 'center' as const,
}

const confirmationText = {
  fontSize: '16px',
  color: '#666',
  margin: '0 0 30px',
  lineHeight: '24px',
}

const confirmButton = {
  backgroundColor: chopTymOrange,
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '16px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  margin: '0 0 20px',
}

const linkText = {
  fontSize: '14px',
  color: '#888',
  margin: '20px 0 10px',
}

const confirmLink = {
  color: chopTymOrange,
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
}

const featuresSection = {
  padding: '40px 20px',
}

const featureRow = {
  margin: '20px 0',
}

const featureIcon = {
  width: '50px',
  fontSize: '24px',
  textAlign: 'center' as const,
  verticalAlign: 'top',
  paddingTop: '4px',
}

const featureContent = {
  verticalAlign: 'top',
  paddingLeft: '10px',
}

const featureTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: chopTymDark,
  margin: '0 0 4px',
}

const featureText = {
  fontSize: '14px',
  color: '#666',
  margin: '0',
  lineHeight: '20px',
}

const footer = {
  padding: '30px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#f8f9fa',
}

const footerText = {
  fontSize: '14px',
  color: '#666',
  margin: '8px 0',
  lineHeight: '20px',
}