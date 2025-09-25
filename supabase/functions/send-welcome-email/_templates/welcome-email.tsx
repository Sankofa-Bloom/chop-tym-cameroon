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
  Img,
} from 'https://esm.sh/@react-email/components@0.0.22'
import * as React from 'https://esm.sh/react@18.3.1'

interface WelcomeEmailProps {
  customerName: string
  customerEmail: string
}

export const WelcomeEmail = ({
  customerName,
  customerEmail,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to ChopTym - Your favorite local dishes delivered!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🍽️ ChopTym</Text>
            <Text style={tagline}>Authentic African Cuisine Delivered</Text>
          </Section>

          <Section style={heroSection}>
            <Heading style={h1}>Welcome to ChopTym, {customerName}! 🎉</Heading>
            <Text style={heroText}>
              We're excited to have you join our community of food lovers! Get ready to experience the best of Cameroonian and West African cuisine delivered right to your doorstep.
            </Text>
          </Section>

          <Hr style={separator} />

          <Section style={featuresSection}>
            <Heading style={h2}>What makes ChopTym special?</Heading>
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
            <Row style={featureRow}>
              <Column style={featureIcon}>💳</Column>
              <Column style={featureContent}>
                <Text style={featureTitle}>Easy Payment</Text>
                <Text style={featureText}>Secure payment options for your convenience</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={separator} />

          <Section style={ctaSection}>
            <Heading style={h2}>Ready to place your first order?</Heading>
            <Text style={ctaText}>
              Browse our amazing selection of local dishes and discover your new favorites!
            </Text>
            <Link href="https://choptym.com" style={ctaButton}>
              Start Ordering Now
            </Link>
          </Section>

          <Hr style={separator} />

          <Section style={footer}>
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

export default WelcomeEmail

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

const ctaSection = {
  padding: '40px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#fef7f0',
}

const ctaText = {
  fontSize: '16px',
  color: '#666',
  margin: '0 0 30px',
  lineHeight: '24px',
}

const ctaButton = {
  backgroundColor: chopTymOrange,
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '16px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  transition: 'background-color 0.2s ease',
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