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
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PaymentNotificationEmailProps {
  orderNumber: string
  customerName: string
  total: number
  paymentStatus: 'success' | 'failed' | 'pending'
  paymentReference?: string
  paymentUrl?: string
}

export const PaymentNotificationEmail = ({
  orderNumber,
  customerName,
  total,
  paymentStatus,
  paymentReference,
  paymentUrl,
}: PaymentNotificationEmailProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '📄';
    }
  };

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      default:
        return 'Payment Update';
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Your payment has been processed successfully. Your order is being prepared!';
      case 'failed':
        return 'We encountered an issue processing your payment. Please try again or contact support.';
      case 'pending':
        return 'Your payment is being processed. You will receive another notification once it is complete.';
      default:
        return 'Your payment status has been updated.';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return '#22c55e';
      case 'failed':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <Html>
      <Head />
      <Preview>Payment {paymentStatus} - Order #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🍽️ ChopTym</Text>
          </Section>

          <Section style={statusSection}>
            <Text style={statusIcon}>{getStatusIcon()}</Text>
            <Heading style={{...h1, color: getStatusColor()}}>{getStatusTitle()}</Heading>
            <Text style={orderNumberText}>Order #{orderNumber}</Text>
            <Text style={statusMessage}>{getStatusMessage()}</Text>
          </Section>

          <Hr style={separator} />

          <Section style={detailsSection}>
            <Heading style={h2}>Payment Details</Heading>
            <Row style={detailRow}>
              <Column>
                <Text style={detailLabel}>Customer:</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={detailText}>{customerName}</Text>
              </Column>
            </Row>
            <Row style={detailRow}>
              <Column>
                <Text style={detailLabel}>Amount:</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={detailText}>{formatPrice(total)}</Text>
              </Column>
            </Row>
            <Row style={detailRow}>
              <Column>
                <Text style={detailLabel}>Status:</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={{...detailText, color: getStatusColor(), fontWeight: 'bold'}}>
                  {paymentStatus.toUpperCase()}
                </Text>
              </Column>
            </Row>
            {paymentReference && (
              <Row style={detailRow}>
                <Column>
                  <Text style={detailLabel}>Reference:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={detailText}>{paymentReference}</Text>
                </Column>
              </Row>
            )}
          </Section>

          {paymentStatus === 'failed' && paymentUrl && (
            <>
              <Hr style={separator} />
              <Section style={ctaSection}>
                <Heading style={h2}>Try Again</Heading>
                <Text style={ctaText}>
                  Don't worry! You can try your payment again using the link below.
                </Text>
                <Link href={paymentUrl} style={ctaButton}>
                  Retry Payment
                </Link>
              </Section>
            </>
          )}

          {paymentStatus === 'success' && (
            <>
              <Hr style={separator} />
              <Section style={successSection}>
                <Text style={successText}>
                  🎉 Your order is now being prepared! You'll receive updates as it progresses.
                </Text>
              </Section>
            </>
          )}

          <Hr style={separator} />

          <Section style={footer}>
            <Text style={footerText}>
              {paymentStatus === 'failed' 
                ? 'Need help? Contact our support team - we\'re here to assist you!'
                : 'Thank you for choosing ChopTym! We appreciate your business.'
              }
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

export default PaymentNotificationEmail

// ChopTym Brand Colors
const chopTymOrange = 'hsl(25, 95%, 53%)'
const chopTymDark = 'hsl(20, 14.3%, 4.1%)'

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
  padding: '30px 20px',
  textAlign: 'center' as const,
}

const logo = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
}

const statusSection = {
  padding: '40px 20px',
  textAlign: 'center' as const,
}

const statusIcon = {
  fontSize: '48px',
  margin: '0 0 20px',
}

const h1 = {
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 10px',
}

const orderNumberText = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: chopTymOrange,
  margin: '0 0 20px',
}

const statusMessage = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#666',
  margin: '0',
}

const separator = {
  borderColor: '#f0f0f0',
  margin: '0',
}

const detailsSection = {
  padding: '30px 20px',
}

const h2 = {
  color: chopTymDark,
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px',
}

const detailRow = {
  margin: '10px 0',
}

const detailLabel = {
  fontSize: '14px',
  color: '#666',
  fontWeight: '500',
}

const detailValue = {
  textAlign: 'right' as const,
}

const detailText = {
  fontSize: '14px',
  color: chopTymDark,
}

const ctaSection = {
  padding: '30px 20px',
  textAlign: 'center' as const,
}

const ctaText = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 20px',
  lineHeight: '20px',
}

const ctaButton = {
  backgroundColor: chopTymOrange,
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  display: 'inline-block',
}

const successSection = {
  padding: '20px',
  backgroundColor: '#f0fdf4',
  textAlign: 'center' as const,
}

const successText = {
  fontSize: '16px',
  color: '#15803d',
  margin: '0',
  lineHeight: '24px',
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