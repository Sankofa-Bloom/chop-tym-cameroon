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
} from 'https://esm.sh/@react-email/components@0.0.22'
import * as React from 'https://esm.sh/react@18.3.1'

interface OrderNotificationEmailProps {
  orderNumber: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  items: Array<{
    name: string
    restaurant: string
    quantity: number
    price: number
  }>
  subtotal: number
  deliveryFee: number
  total: number
  notes?: string
  paymentUrl?: string
}

export const OrderNotificationEmail = ({
  orderNumber,
  customerName,
  customerPhone,
  deliveryAddress,
  items,
  subtotal,
  deliveryFee,
  total,
  notes,
  paymentUrl,
}: OrderNotificationEmailProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Html>
      <Head />
      <Preview>New ChopTym Order: {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🍽️ ChopTym</Text>
            <Text style={tagline}>Admin Order Notification</Text>
          </Section>
          
          <Section style={alertSection}>
            <Text style={alertIcon}>🔔</Text>
            <Heading style={h1}>New Order Received!</Heading>
          </Section>
          
          <Section style={orderHeader}>
            <Text style={orderNumberText}>Order #{orderNumber}</Text>
            <Text style={timestampText}>{new Date().toLocaleString('en-US', { 
              timeZone: 'Africa/Douala',
              dateStyle: 'medium',
              timeStyle: 'short'
            })}</Text>
          </Section>

          <Hr style={separator} />

          <Section style={customerSection}>
            <Heading style={h2}>Customer Information</Heading>
            <Text style={customerInfo}><strong>Name:</strong> {customerName}</Text>
            <Text style={customerInfo}><strong>Phone:</strong> {customerPhone}</Text>
            <Text style={customerInfo}><strong>Delivery Address:</strong> {deliveryAddress}</Text>
          </Section>

          <Hr style={separator} />

          <Section style={itemsSection}>
            <Heading style={h2}>Order Items</Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemDetails}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={restaurantName}>from {item.restaurant}</Text>
                </Column>
                <Column style={itemQuantity}>
                  <Text style={quantityText}>x{item.quantity}</Text>
                </Column>
                <Column style={itemPrice}>
                  <Text style={priceText}>{formatPrice(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={separator} />

          <Section style={totalSection}>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Subtotal:</Text>
              </Column>
              <Column style={totalValue}>
                <Text style={totalText}>{formatPrice(subtotal)}</Text>
              </Column>
            </Row>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Delivery Fee:</Text>
              </Column>
              <Column style={totalValue}>
                <Text style={totalText}>{formatPrice(deliveryFee)}</Text>
              </Column>
            </Row>
            <Row style={totalRow}>
              <Column>
                <Text style={grandTotalLabel}>Total:</Text>
              </Column>
              <Column style={totalValue}>
                <Text style={grandTotalText}>{formatPrice(total)}</Text>
              </Column>
            </Row>
          </Section>

          {notes && (
            <>
              <Hr style={separator} />
              <Section style={notesSection}>
                <Heading style={h2}>Special Instructions</Heading>
                <Text style={notesText}>{notes}</Text>
              </Section>
            </>
          )}

          {paymentUrl && (
            <>
              <Hr style={separator} />
              <Section style={paymentSection}>
                <Heading style={h2}>Payment Information</Heading>
                <Text style={paymentText}>
                  <strong>Payment Status:</strong> Pending (Online Payment)
                </Text>
                <Link href={paymentUrl} style={paymentLink}>
                  View Payment Link
                </Link>
              </Section>
            </>
          )}

          {!paymentUrl && (
            <>
              <Hr style={separator} />
              <Section style={paymentSection}>
                <Heading style={h2}>Payment Information</Heading>
                <Text style={paymentText}>
                  <strong>Payment Method:</strong> Offline Payment (Mobile Money)
                </Text>
                <Text style={offlinePaymentDetails}>
                  Customer should transfer <strong>{formatPrice(total)}</strong> to:
                </Text>
                <Text style={offlinePaymentDetails}>
                  <strong>MTN: 670 416 449 (Mpah Ngwese)</strong>
                </Text>
                <Text style={offlinePaymentDetails}>
                  Reference: <strong>{orderNumber}</strong>
                </Text>
              </Section>
            </>
          )}

          <Hr style={separator} />

          <Section style={footer}>
            <Text style={footerText}>
              This notification was sent from ChopTym order management system.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderNotificationEmail

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
  margin: '0 0 5px',
}

const tagline = {
  fontSize: '14px',
  color: '#ffffff',
  margin: '0',
  opacity: '0.9',
}

const alertSection = {
  padding: '30px 20px',
  textAlign: 'center' as const,
}

const alertIcon = {
  fontSize: '32px',
  margin: '0 0 15px',
}

const h1 = {
  color: chopTymDark,
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  padding: '0',
}

const h2 = {
  color: chopTymDark,
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
}

const orderHeader = {
  textAlign: 'center' as const,
  margin: '20px 0',
}

const orderNumberText = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: chopTymOrange,
  margin: '0 0 5px',
}

const timestampText = {
  fontSize: '14px',
  color: '#666',
  margin: '0',
}

const separator = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const customerSection = {
  padding: '0 20px',
}

const customerInfo = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#333',
}

const itemsSection = {
  padding: '0 20px',
}

const itemRow = {
  borderBottom: '1px solid #f0f0f0',
  padding: '10px 0',
}

const itemDetails = {
  width: '60%',
}

const itemName = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 4px',
}

const restaurantName = {
  fontSize: '12px',
  color: '#666',
  margin: '0',
}

const itemQuantity = {
  width: '20%',
  textAlign: 'center' as const,
}

const quantityText = {
  fontSize: '14px',
  color: '#333',
}

const itemPrice = {
  width: '20%',
  textAlign: 'right' as const,
}

const priceText = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
}

const totalSection = {
  backgroundColor: '#f8f9fa',
  margin: '20px 0',
  padding: '15px 20px',
}

const totalRow = {
  margin: '5px 0',
}

const totalLabel = {
  fontSize: '14px',
  color: '#333',
}

const totalText = {
  fontSize: '14px',
  color: '#333',
}

const totalValue = {
  textAlign: 'right' as const,
}

const grandTotalLabel = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
}

const grandTotalText = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2563eb',
}

const notesSection = {
  padding: '0 20px',
}

const notesText = {
  fontSize: '14px',
  color: '#333',
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '6px',
  fontStyle: 'italic',
}

const paymentSection = {
  padding: '0 20px',
  textAlign: 'center' as const,
}

const paymentText = {
  fontSize: '14px',
  color: '#333',
  margin: '10px 0',
}

const paymentLink = {
  color: '#2563eb',
  textDecoration: 'underline',
  fontSize: '14px',
}

const footer = {
  padding: '0 20px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '12px',
  color: '#8898aa',
}

const offlinePaymentDetails = {
  fontSize: '14px',
  color: '#333',
  backgroundColor: '#fff3cd',
  padding: '15px',
  borderRadius: '6px',
  border: '1px solid #ffeaa7',
  margin: '10px 0',
  lineHeight: '1.5',
}