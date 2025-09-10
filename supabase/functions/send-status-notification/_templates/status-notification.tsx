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
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface StatusNotificationEmailProps {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  oldStatus?: string;
  newStatus: string;
  notificationType: 'success' | 'failed' | 'pending_long' | 'status_update';
  paymentReference?: string;
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
  oldStatus,
  newStatus,
  notificationType,
  paymentReference,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#16a34a';
      case 'pending':
        return '#eab308';
      case 'failed':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getNotificationTitle = () => {
    switch (notificationType) {
      case 'success':
        return `✅ Payment Successful - Order ${orderNumber}`;
      case 'failed':
        return `❌ Payment Failed - Order ${orderNumber}`;
      case 'pending_long':
        return `⏰ Order Pending Too Long - Order ${orderNumber}`;
      case 'status_update':
        return `📋 Order Status Updated - Order ${orderNumber}`;
      default:
        return `📦 Order Update - Order ${orderNumber}`;
    }
  };

  const getNotificationMessage = () => {
    switch (notificationType) {
      case 'success':
        return 'The payment for this order has been completed successfully.';
      case 'failed':
        return 'The payment for this order has failed. Please follow up with the customer.';
      case 'pending_long':
        return 'This order has been pending for more than 30 minutes. Please check the payment status.';
      case 'status_update':
        return `Order status has been updated from "${oldStatus}" to "${newStatus}".`;
      default:
        return 'Order status has been updated.';
    }
  };

  return (
    <Html>
      <Head />
      <Preview>{getNotificationTitle()}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{getNotificationTitle()}</Heading>
          
          <Text style={notificationText}>
            {getNotificationMessage()}
          </Text>

          <Section style={orderInfoSection}>
            <Heading style={sectionHeading}>Order Information</Heading>
            <Row style={infoRow}>
              <Column style={infoColumn}>
                <Text style={infoLabel}>Order Number:</Text>
                <Text style={infoValue}>{orderNumber}</Text>
              </Column>
              <Column style={infoColumn}>
                <Text style={infoLabel}>Status:</Text>
                <Text style={{...infoValue, color: getStatusColor(newStatus)}}>
                  {newStatus.toUpperCase()}
                </Text>
              </Column>
            </Row>
            
            {oldStatus && notificationType === 'status_update' && (
              <Row style={infoRow}>
                <Column>
                  <Text style={infoLabel}>Previous Status:</Text>
                  <Text style={{...infoValue, color: getStatusColor(oldStatus)}}>
                    {oldStatus.toUpperCase()}
                  </Text>
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
                    minute: '2-digit',
                  })}
                </Text>
              </Column>
              {paymentReference && (
                <Column style={infoColumn}>
                  <Text style={infoLabel}>Payment Reference:</Text>
                  <Text style={infoValue}>{paymentReference}</Text>
                </Column>
              )}
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={customerSection}>
            <Heading style={sectionHeading}>Customer Information</Heading>
            <Text style={customerInfo}>
              <strong>Name:</strong> {customerName}<br />
              <strong>Phone:</strong> {customerPhone}<br />
              <strong>Address:</strong> {deliveryAddress}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={itemsSection}>
            <Heading style={sectionHeading}>Order Items</Heading>
            {items && items.map((item: any, index: number) => (
              <Row key={index} style={itemRow}>
                <Column style={{width: '60%'}}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemRestaurant}>{item.restaurant}</Text>
                </Column>
                <Column style={{width: '20%', textAlign: 'center'}}>
                  <Text style={itemQuantity}>×{item.quantity}</Text>
                </Column>
                <Column style={{width: '20%', textAlign: 'right'}}>
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
              <Column style={{width: '30%', textAlign: 'right'}}>
                <Text style={totalValue}>{formatPrice(subtotal)}</Text>
              </Column>
            </Row>
            
            <Row style={totalRow}>
              <Column style={{width: '70%'}}>
                <Text style={totalLabel}>Delivery Fee:</Text>
              </Column>
              <Column style={{width: '30%', textAlign: 'right'}}>
                <Text style={totalValue}>{formatPrice(deliveryFee)}</Text>
              </Column>
            </Row>
            
            <Row style={finalTotalRow}>
              <Column style={{width: '70%'}}>
                <Text style={finalTotalLabel}>Total:</Text>
              </Column>
              <Column style={{width: '30%', textAlign: 'right'}}>
                <Text style={finalTotalValue}>{formatPrice(total)}</Text>
              </Column>
            </Row>
          </Section>

          {notes && (
            <>
              <Hr style={hr} />
              <Section style={notesSection}>
                <Heading style={sectionHeading}>Notes</Heading>
                <Text style={notesText}>{notes}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />
          
          <Text style={footer}>
            ChopTym Cameroon - Food Delivery Service<br />
            This is an automated notification from the ChopTym admin system.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
  padding: '17px 0 0',
  textAlign: 'center' as const,
};

const notificationText = {
  margin: '0 auto',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525252',
  textAlign: 'center' as const,
  padding: '0 40px',
  marginBottom: '30px',
};

const sectionHeading = {
  fontSize: '20px',
  lineHeight: '28px',
  fontWeight: '700',
  color: '#374151',
  margin: '30px 0 15px',
  padding: '0 40px',
};

const orderInfoSection = {
  padding: '0 40px',
};

const infoRow = {
  marginBottom: '10px',
};

const infoColumn = {
  width: '50%',
};

const infoLabel = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
  fontWeight: '600',
};

const infoValue = {
  fontSize: '16px',
  color: '#111827',
  margin: '4px 0 0',
  fontWeight: '400',
};

const customerSection = {
  padding: '0 40px',
};

const customerInfo = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525252',
  margin: '0',
};

const itemsSection = {
  padding: '0 40px',
};

const itemRow = {
  borderBottom: '1px solid #e5e7eb',
  paddingBottom: '8px',
  marginBottom: '8px',
};

const itemName = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
  margin: '0',
};

const itemRestaurant = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '4px 0 0',
};

const itemQuantity = {
  fontSize: '16px',
  color: '#111827',
  margin: '0',
};

const itemPrice = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
  margin: '0',
};

const totalSection = {
  padding: '0 40px',
};

const totalRow = {
  marginBottom: '8px',
};

const totalLabel = {
  fontSize: '16px',
  color: '#6b7280',
  margin: '0',
};

const totalValue = {
  fontSize: '16px',
  color: '#111827',
  margin: '0',
};

const finalTotalRow = {
  borderTop: '2px solid #111827',
  paddingTop: '8px',
  marginTop: '8px',
};

const finalTotalLabel = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#111827',
  margin: '0',
};

const finalTotalValue = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#111827',
  margin: '0',
};

const notesSection = {
  padding: '0 40px',
};

const notesText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525252',
  margin: '0',
  fontStyle: 'italic',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  padding: '0 40px',
};