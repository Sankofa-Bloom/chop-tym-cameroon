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

interface OrderConfirmationEmailProps {
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
  estimatedDelivery: string
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  customerPhone,
  deliveryAddress,
  items,
  subtotal,
  deliveryFee,
  total,
  notes,
  estimatedDelivery,
}: OrderConfirmationEmailProps) => {
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
      <Preview>Order Confirmed #{orderNumber} - ChopTym</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🍽️ ChopTym</Text>
          </Section>

          <Section style={successSection}>
            <Text style={successIcon}>✅</Text>
            <Heading style={h1}>Order Confirmed!</Heading>
            <Text style={orderNumberText}>Order #{orderNumber}</Text>
            <Text style={confirmationText}>
              Thank you {customerName}! Your delicious meal is being prepared and will be delivered soon.
            </Text>
          </Section>

          <Hr style={separator} />

          <Section style={estimatedSection}>
            <Row>
              <Column style={iconColumn}>
                <Text style={timeIcon}>⏰</Text>
              </Column>
              <Column>
                <Text style={estimatedTitle}>Estimated Delivery Time</Text>
                <Text style={estimatedTime}>{estimatedDelivery}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={separator} />

          <Section style={detailsSection}>
            <Heading style={h2}>Delivery Details</Heading>
            <Text style={detailText}>
              <strong>Name:</strong> {customerName}
            </Text>
            <Text style={detailText}>
              <strong>Phone:</strong> {customerPhone}
            </Text>
            <Text style={detailText}>
              <strong>Address:</strong> {deliveryAddress}
            </Text>
          </Section>

          <Hr style={separator} />

          <Section style={itemsSection}>
            <Heading style={h2}>Your Order</Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemDetails}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={restaurantName}>from {item.restaurant}</Text>
                </Column>
                <Column style={itemQuantity}>
                  <Text style={quantityText}>×{item.quantity}</Text>
                </Column>
                <Column style={itemPrice}>
                  <Text style={priceText}>{formatPrice(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

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
            <Hr style={totalSeparator} />
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

          <Hr style={separator} />

          <Section style={trackingSection}>
            <Heading style={h2}>Track Your Order</Heading>
            <Text style={trackingText}>
              We'll send you updates as your order progresses. You can also contact us if you have any questions.
            </Text>
            <Text style={contactInfo}>
              📞 Contact: +237 XXX XXX XXX
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Thank you for choosing ChopTym! We're excited to serve you delicious local cuisine.
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

export default OrderConfirmationEmail

// ChopTym Brand Colors
const chopTymOrange = 'hsl(25, 95%, 53%)'
const chopTymOrangeLight = 'hsl(25, 95%, 65%)'
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

const successSection = {
  padding: '40px 20px',
  textAlign: 'center' as const,
}

const successIcon = {
  fontSize: '48px',
  margin: '0 0 20px',
}

const h1 = {
  color: chopTymDark,
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 10px',
}

const orderNumberText = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: chopTymOrange,
  margin: '0 0 20px',
}

const confirmationText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#666',
  margin: '0',
}

const estimatedSection = {
  padding: '20px',
  backgroundColor: '#fef7f0',
}

const iconColumn = {
  width: '50px',
}

const timeIcon = {
  fontSize: '24px',
  margin: '0',
}

const estimatedTitle = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 5px',
  fontWeight: '500',
}

const estimatedTime = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: chopTymOrange,
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
  margin: '0 0 15px',
}

const detailText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#333',
  margin: '8px 0',
}

const itemsSection = {
  padding: '30px 20px',
}

const itemRow = {
  borderBottom: '1px solid #f0f0f0',
  padding: '15px 0',
}

const itemDetails = {
  width: '60%',
}

const itemName = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: chopTymDark,
  margin: '0 0 4px',
}

const restaurantName = {
  fontSize: '14px',
  color: '#666',
  margin: '0',
  fontStyle: 'italic',
}

const itemQuantity = {
  width: '20%',
  textAlign: 'center' as const,
}

const quantityText = {
  fontSize: '14px',
  color: '#666',
}

const itemPrice = {
  width: '20%',
  textAlign: 'right' as const,
}

const priceText = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: chopTymDark,
}

const totalSection = {
  padding: '20px',
  backgroundColor: '#fef7f0',
}

const totalRow = {
  margin: '8px 0',
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

const totalSeparator = {
  borderColor: chopTymOrange,
  margin: '10px 0',
}

const grandTotalLabel = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: chopTymDark,
}

const grandTotalText = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: chopTymOrange,
}

const notesSection = {
  padding: '30px 20px',
}

const notesText = {
  fontSize: '14px',
  color: '#333',
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '8px',
  borderLeft: `4px solid ${chopTymOrange}`,
  fontStyle: 'italic',
  margin: '0',
}

const trackingSection = {
  padding: '30px 20px',
  textAlign: 'center' as const,
}

const trackingText = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 15px',
  lineHeight: '20px',
}

const contactInfo = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: chopTymOrange,
  margin: '0',
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