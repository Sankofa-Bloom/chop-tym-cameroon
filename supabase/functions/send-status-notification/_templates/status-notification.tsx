import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from 'https://esm.sh/@react-email/components@0.0.22';
import * as React from 'https://esm.sh/react@18.3.1';

interface StatusNotificationEmailProps {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Array<{
    name: string;
    restaurant: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  newStatus: string;
  oldStatus?: string;
  notificationType: 'order_placed' | 'status_update' | 'delivery_complete';
  createdAt: string;
  notes?: string;
}

export const StatusNotificationEmail = ({
  orderNumber,
  customerName,
  customerPhone,
  deliveryAddress,
  items,
  subtotal,
  deliveryFee,
  total,
  newStatus,
  oldStatus,
  notificationType,
  createdAt,
  notes,
}: StatusNotificationEmailProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getNotificationTitle = () => {
    switch (notificationType) {
      case 'order_placed':
        return 'Order Confirmation';
      case 'status_update':
        return 'Order Status Update';
      case 'delivery_complete':
        return 'Order Delivered';
      default:
        return 'Order Notification';
    }
  };

  const getNotificationMessage = () => {
    switch (notificationType) {
      case 'order_placed':
        return `Thank you for your order! Your order ${orderNumber} has been placed and is being prepared.`;
      case 'status_update':
        return `Your order ${orderNumber} status has been updated to: ${newStatus.toUpperCase()}`;
      case 'delivery_complete':
        return `Great news! Your order ${orderNumber} has been delivered successfully.`;
      default:
        return `Order ${orderNumber} notification`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#f59e0b';
      case 'confirmed':
        return '#3b82f6';
      case 'preparing':
        return '#8b5cf6';
      case 'ready':
        return '#10b981';
      case 'out_for_delivery':
        return '#f97316';
      case 'delivered':
        return '#22c55e';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Html>
      <Head />
      <Preview>{getNotificationTitle()} - ChopTym</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🍽️ ChopTym</Text>
            <Text style={tagline}>Food Delivery</Text>
          </Section>
          
          <Section style={alertSection}>
            <Text style={alertIcon}>📱</Text>
            <Heading style={h1}>{getNotificationTitle()}</Heading>
            <Text style={notificationText}>{getNotificationMessage()}</Text>
          </Section>

          <Section style={orderInfoSection}>
            <Heading style={sectionHeading}>Order Information</Heading>
            <Row style={infoRow}>
              <Column style={infoColumn}>
                <Text style={infoLabel}>Order Number:</Text>
                <Text style={infoValue}>{orderNumber}</Text>
              </Column>
              <Column style={infoColumn}>
                <Text style={infoLabel}>Status:</Text>
                <Text style={{...infoValue, color: getStatusColor(newStatus)}}>{newStatus.toUpperCase()}</Text>
              </Column>
            </Row>
            
            {oldStatus && notificationType === 'status_update' && (
              <Row style={infoRow}>
                <Column>
                  <Text style={infoLabel}>Previous Status:</Text>
                  <Text style={{...infoValue, color: getStatusColor(oldStatus)}}>{oldStatus.toUpperCase()}</Text>
                </Column>
              </Row>
            )}

            <Row style={infoRow}>
              <Column style={infoColumn}>
                <Text style={infoLabel}>Order Date:</Text>
                <Text style={infoValue}>
                  {new Date(createdAt).toLocaleDateString('fr-CM', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </Column>
              <Column style={infoColumn}>
                <Text style={infoLabel}>Customer:</Text>
                <Text style={infoValue}>{customerName}</Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column>
                <Text style={infoLabel}>Phone:</Text>
                <Text style={infoValue}>{customerPhone}</Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column>
                <Text style={infoLabel}>Delivery Address:</Text>
                <Text style={infoValue}>{deliveryAddress}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={itemsSection}>
            <Heading style={sectionHeading}>Order Items</Heading>
            {items && items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={{width: '60%'}}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemRestaurant}>{item.restaurant}</Text>
                </Column>
                <Column style={{width: '20%', textAlign: 'center' as const}}>
                  <Text style={itemQuantity}>x{item.quantity}</Text>
                </Column>
                <Column style={{width: '20%', textAlign: 'right' as const}}>
                  <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={hr} />

          <Section style={totalSection}>
            <Row style={totalRow}>
              <Column style={{width: '70%'}}>
                <Text style={totalLabel}>Subtotal:</Text>
              </Column>
              <Column style={{width: '30%', textAlign: 'right' as const}}>
                <Text style={totalValue}>{formatPrice(subtotal)}</Text>
              </Column>
            </Row>
            
            <Row style={totalRow}>
              <Column style={{width: '70%'}}>
                <Text style={totalLabel}>Delivery Fee:</Text>
              </Column>
              <Column style={{width: '30%', textAlign: 'right' as const}}>
                <Text style={totalValue}>{formatPrice(deliveryFee)}</Text>
              </Column>
            </Row>
            
            <Row style={finalTotalRow}>
              <Column style={{width: '70%'}}>
                <Text style={finalTotalLabel}>Total:</Text>
              </Column>
              <Column style={{width: '30%', textAlign: 'right' as const}}>
                <Text style={finalTotalValue}>{formatPrice(total)}</Text>
              </Column>
            </Row>
          </Section>

          {notes && (
            <>
              <Hr style={hr} />
              <Section style={notesSection}>
                <Heading style={sectionHeading}>Special Instructions</Heading>
                <Text style={notesText}>{notes}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              This notification was sent from ChopTym order management system.
            </Text>
            <Text style={footerText}>
              If you have any questions, please contact us at support@choptym.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default StatusNotificationEmail;

// ChopTym Brand Colors
const chopTymOrange = 'hsl(25, 95%, 53%)';
const chopTymDark = 'hsl(20, 14.3%, 4.1%)';

const main = {
  backgroundColor: '#fef7f0',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginBottom: '64px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px -10px rgba(234, 88, 12, 0.1)',
};

const header = {
  backgroundColor: chopTymOrange,
  padding: '30px 20px',
  textAlign: 'center' as const,
};

const logo = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 5px',
};

const tagline = {
  fontSize: '14px',
  color: '#ffffff',
  margin: '0',
  opacity: '0.9',
};

const alertSection = {
  padding: '30px 20px',
  textAlign: 'center' as const,
};

const alertIcon = {
  fontSize: '32px',
  margin: '0 0 15px',
};

const h1 = {
  color: chopTymDark,
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  padding: '0',
};

const notificationText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#333',
  margin: '0 0 20px',
};

const sectionHeading = {
  color: chopTymDark,
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 15px',
  borderBottom: `2px solid ${chopTymOrange}`,
  paddingBottom: '5px',
};

const orderInfoSection = {
  padding: '0 20px',
};

const infoRow = {
  marginBottom: '10px',
};

const infoColumn = {
  width: '50%',
};

const infoLabel = {
  fontSize: '12px',
  color: '#666',
  margin: '0 0 2px',
  textTransform: 'uppercase' as const,
  fontWeight: 'bold',
};

const infoValue = {
  fontSize: '14px',
  color: '#333',
  margin: '0 0 10px',
};

const itemsSection = {
  padding: '0 20px',
};

const itemRow = {
  borderBottom: '1px solid #f0f0f0',
  paddingBottom: '10px',
  marginBottom: '10px',
};

const itemName = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 4px',
};

const itemRestaurant = {
  fontSize: '12px',
  color: '#666',
  margin: '0',
};

const itemQuantity = {
  fontSize: '14px',
  color: '#333',
  fontWeight: 'bold',
};

const itemPrice = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: chopTymOrange,
};

const totalSection = {
  backgroundColor: '#f8f9fa',
  margin: '20px 0',
  padding: '15px 20px',
  borderRadius: '6px',
};

const totalRow = {
  marginBottom: '8px',
};

const totalLabel = {
  fontSize: '14px',
  color: '#333',
};

const totalValue = {
  fontSize: '14px',
  color: '#333',
};

const finalTotalRow = {
  borderTop: '1px solid #ddd',
  paddingTop: '10px',
  marginTop: '10px',
};

const finalTotalLabel = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
};

const finalTotalValue = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: chopTymOrange,
};

const notesSection = {
  padding: '0 20px',
};

const notesText = {
  fontSize: '14px',
  color: '#333',
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '6px',
  fontStyle: 'italic',
  margin: '10px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  padding: '20px',
  textAlign: 'center' as const,
  backgroundColor: '#f8f9fa',
};

const footerText = {
  fontSize: '12px',
  color: '#8898aa',
  margin: '5px 0',
};