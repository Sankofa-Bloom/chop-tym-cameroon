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

  return React.createElement(Html, null,
    React.createElement(Head),
    React.createElement(Preview, null, getNotificationTitle()),
    React.createElement(Body, { style: main },
      React.createElement(Container, { style: container },
        React.createElement(Section, { style: header },
          React.createElement(Text, { style: logo }, "🍽️ ChopTym")
        ),

        React.createElement(Section, { style: statusSection },
          React.createElement(Heading, { style: h1 }, getNotificationTitle()),
          React.createElement(Text, { style: notificationText }, getNotificationMessage()),

          React.createElement(Section, { style: orderInfoSection },
            React.createElement(Heading, { style: sectionHeading }, "Order Information"),
            React.createElement(Row, { style: infoRow },
              React.createElement(Column, { style: infoColumn },
                React.createElement(Text, { style: infoLabel }, "Order Number:"),
                React.createElement(Text, { style: infoValue }, orderNumber)
              ),
              React.createElement(Column, { style: infoColumn },
                React.createElement(Text, { style: infoLabel }, "Status:"),
                React.createElement(Text, { style: {...infoValue, color: getStatusColor(newStatus)} }, newStatus.toUpperCase())
              )
            ),
            
            oldStatus && notificationType === 'status_update' ? React.createElement(Row, { style: infoRow },
              React.createElement(Column, null,
                React.createElement(Text, { style: infoLabel }, "Previous Status:"),
                React.createElement(Text, { style: {...infoValue, color: getStatusColor(oldStatus)} }, oldStatus.toUpperCase())
              )
            ) : null,

            React.createElement(Row, { style: infoRow },
              React.createElement(Column, { style: infoColumn },
                React.createElement(Text, { style: infoLabel }, "Order Date:"),
                React.createElement(Text, { style: infoValue }, 
                  new Date(createdAt).toLocaleDateString('fr-CM', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                )
              ),
              paymentReference ? React.createElement(Column, { style: infoColumn },
                React.createElement(Text, { style: infoLabel }, "Payment Reference:"),
                React.createElement(Text, { style: infoValue }, paymentReference)
              ) : null
            )
          ),

          React.createElement(Hr, { style: hr }),

          React.createElement(Section, { style: customerSection },
            React.createElement(Heading, { style: sectionHeading }, "Customer Information"),
            React.createElement(Text, { style: customerInfo }, `Name: ${customerName}\nPhone: ${customerPhone}\nAddress: ${deliveryAddress}`)
          ),

          React.createElement(Hr, { style: hr }),

          React.createElement(Section, { style: itemsSection },
            React.createElement(Heading, { style: sectionHeading }, "Order Items"),
            ...(items ? items.map((item: any, index: number) => 
              React.createElement(Row, { key: index, style: itemRow },
                React.createElement(Column, { style: {width: '60%'} },
                  React.createElement(Text, { style: itemName }, item.name),
                  React.createElement(Text, { style: itemRestaurant }, item.restaurant)
                ),
                React.createElement(Column, { style: {width: '20%', textAlign: 'center'} },
                  React.createElement(Text, { style: itemQuantity }, `×${item.quantity}`)
                ),
                React.createElement(Column, { style: {width: '20%', textAlign: 'right'} },
                  React.createElement(Text, { style: itemPrice }, formatPrice(item.price * item.quantity))
                )
              )
            ) : [])
          ),

          React.createElement(Hr, { style: hr }),

          React.createElement(Section, { style: totalSection },
            React.createElement(Row, { style: totalRow },
              React.createElement(Column, { style: {width: '70%'} },
                React.createElement(Text, { style: totalLabel }, "Subtotal:")
              ),
              React.createElement(Column, { style: {width: '30%', textAlign: 'right'} },
                React.createElement(Text, { style: totalValue }, formatPrice(subtotal))
              )
            ),
            
            React.createElement(Row, { style: totalRow },
              React.createElement(Column, { style: {width: '70%'} },
                React.createElement(Text, { style: totalLabel }, "Delivery Fee:")
              ),
              React.createElement(Column, { style: {width: '30%', textAlign: 'right'} },
                React.createElement(Text, { style: totalValue }, formatPrice(deliveryFee))
              )
            ),
            
            React.createElement(Row, { style: finalTotalRow },
              React.createElement(Column, { style: {width: '70%'} },
                React.createElement(Text, { style: finalTotalLabel }, "Total:")
              ),
              React.createElement(Column, { style: {width: '30%', textAlign: 'right'} },
                React.createElement(Text, { style: finalTotalValue }, formatPrice(total))
              )
            )
          ),

          notes ? React.createElement(Hr, { style: hr }) : null,
          notes ? React.createElement(Section, { style: notesSection },
            React.createElement(Heading, { style: sectionHeading }, "Notes"),
            React.createElement(Text, { style: notesText }, notes)
          ) : null,

          React.createElement(Hr, { style: hr }),
          
          React.createElement(Text, { style: footer }, 
            "ChopTym Cameroon - Food Delivery Service\nThis is an automated notification from the ChopTym admin system."
          )
        )
      )
    )
  );
};

// ChopTym Brand Colors
const chopTymOrange = 'hsl(25, 95%, 53%)'
const chopTymDark = 'hsl(20, 14.3%, 4.1%)'

// Styles
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
  margin: '0',
};

const statusSection = {
  padding: '30px 20px',
  textAlign: 'center' as const,
};

const h1 = {
  color: chopTymDark,
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  padding: '0',
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
  fontWeight: 'bold',
  color: chopTymDark,
  margin: '20px 0 15px',
  padding: '0 20px',
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
  padding: '0 20px',
};

const customerInfo = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525252',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const itemsSection = {
  padding: '0 20px',
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
  padding: '0 20px',
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
  padding: '0 20px',
};

const notesText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525252',
  margin: '0',
  fontStyle: 'italic',
};

const hr = {
  borderColor: '#f0f0f0',
  margin: '0',
};

const footer = {
  color: '#666',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  padding: '30px 20px',
  backgroundColor: '#f8f9fa',
  whiteSpace: 'pre-line' as const,
};