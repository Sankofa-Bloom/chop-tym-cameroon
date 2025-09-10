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
          <Heading style={h1}>🍽️ New ChopTym Order</Heading>
          
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
            <Text style={customerInfo}>
              <strong>Name:</strong> {customerName}<br />
              <strong>Phone:</strong> {customerPhone}<br />
              <strong>Delivery Address:</strong> {deliveryAddress}
            </Text>
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
                <Text style={paymentText}>
                  <strong>Payment Status:</strong> Pending
                </Text>
                <Link href={paymentUrl} style={paymentLink}>
                  View Payment Link
                </Link>
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

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#333',
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
  color: '#2563eb',
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
  padding: '0 20px',
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