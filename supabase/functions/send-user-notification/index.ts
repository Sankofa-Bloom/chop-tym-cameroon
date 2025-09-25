import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderData, newStatus, subscription } = await req.json();
    
    if (!subscription) {
      console.log('No push subscription provided, skipping notification');
      return new Response(JSON.stringify({
        success: true,
        message: 'No subscription provided, notification skipped'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Sending push notification for order: ${orderData.orderNumber}, status: ${newStatus}`);

    // Create notification payload based on order status
    let notificationPayload: PushNotificationPayload;
    
    switch (newStatus) {
      case 'completed':
        notificationPayload = {
          title: '✅ Payment Confirmed!',
          body: `Your order ${orderData.orderNumber} payment has been confirmed. We're preparing your food!`,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          data: {
            orderNumber: orderData.orderNumber,
            status: newStatus,
            url: `/orders/${orderData.orderNumber}`
          },
          actions: [
            {
              action: 'view',
              title: 'View Order'
            }
          ]
        };
        break;
        
      case 'failed':
        notificationPayload = {
          title: '❌ Payment Issue',
          body: `There was an issue with your payment for order ${orderData.orderNumber}. Please try again.`,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          data: {
            orderNumber: orderData.orderNumber,
            status: newStatus,
            url: `/orders/${orderData.orderNumber}`
          },
          actions: [
            {
              action: 'retry',
              title: 'Retry Payment'
            },
            {
              action: 'view',
              title: 'View Order'
            }
          ]
        };
        break;
        
      case 'preparing':
        notificationPayload = {
          title: '👨‍🍳 Order Being Prepared',
          body: `Your order ${orderData.orderNumber} is now being prepared by the restaurant!`,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          data: {
            orderNumber: orderData.orderNumber,
            status: newStatus,
            url: `/orders/${orderData.orderNumber}`
          },
          actions: [
            {
              action: 'view',
              title: 'Track Order'
            }
          ]
        };
        break;
        
      case 'ready':
        notificationPayload = {
          title: '🍽️ Order Ready!',
          body: `Your order ${orderData.orderNumber} is ready for pickup/delivery!`,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          data: {
            orderNumber: orderData.orderNumber,
            status: newStatus,
            url: `/orders/${orderData.orderNumber}`
          },
          actions: [
            {
              action: 'view',
              title: 'View Details'
            }
          ]
        };
        break;
        
      case 'delivered':
        notificationPayload = {
          title: '🎉 Order Delivered!',
          body: `Your order ${orderData.orderNumber} has been delivered. Enjoy your meal!`,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          data: {
            orderNumber: orderData.orderNumber,
            status: newStatus,
            url: `/orders/${orderData.orderNumber}`
          },
          actions: [
            {
              action: 'rate',
              title: 'Rate Order'
            }
          ]
        };
        break;
        
      default:
        notificationPayload = {
          title: '📦 Order Update',
          body: `Your order ${orderData.orderNumber} status has been updated to ${newStatus}.`,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          data: {
            orderNumber: orderData.orderNumber,
            status: newStatus,
            url: `/orders/${orderData.orderNumber}`
          },
          actions: [
            {
              action: 'view',
              title: 'View Order'
            }
          ]
        };
    }

    // Send push notification
    const pushResponse = await fetch('https://web-push-libs.appspot.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: subscription,
        payload: JSON.stringify(notificationPayload),
        options: {
          TTL: 86400, // 24 hours
          urgency: 'high'
        }
      })
    });

    if (!pushResponse.ok) {
      const errorText = await pushResponse.text();
      console.error('Failed to send push notification:', errorText);
      throw new Error(`Push notification failed: ${pushResponse.status} ${errorText}`);
    }

    console.log('Push notification sent successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Push notification sent successfully',
      orderNumber: orderData.orderNumber,
      status: newStatus
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-user-notification function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as Error)?.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});