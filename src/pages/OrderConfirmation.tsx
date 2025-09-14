import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkPaymentStatus } from "@/utils/paymentUtils";

export const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const sessionId = searchParams.get('session_id');
  const reference = searchParams.get('reference');

  useEffect(() => {
    const checkStatus = async () => {
      if (!sessionId && !reference) {
        setPaymentStatus('failed');
        return;
      }

      try {
        const result = await checkPaymentStatus(sessionId || '', reference || undefined);
        
        if (result.success && result.data) {
          const status = result.data.status?.toLowerCase();
          
          switch (status) {
            case 'success':
            case 'completed':
            case 'paid':
              setPaymentStatus('success');
              break;
            case 'failed':
            case 'cancelled':
            case 'expired':
              setPaymentStatus('failed');
              break;
            default:
              setPaymentStatus('pending');
              break;
          }
          
          setOrderDetails(result.data);
        } else {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('failed');
      }
    };

    checkStatus();
  }, [sessionId, reference]);

  const getStatusConfig = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          description: 'Your order has been confirmed and is being prepared.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'failed':
        return {
          icon: XCircle,
          title: 'Payment Failed',
          description: 'There was an issue processing your payment. Please try again.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'pending':
        return {
          icon: Clock,
          title: 'Payment Pending',
          description: 'Your payment is being processed. Please wait a moment.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          icon: Clock,
          title: 'Checking Payment Status...',
          description: 'Please wait while we verify your payment.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className={`${config.bgColor} ${config.borderColor}`}>
          <CardHeader className="text-center pb-4">
            <div className={`w-16 h-16 mx-auto ${config.bgColor} rounded-full flex items-center justify-center mb-4`}>
              <StatusIcon className={`w-8 h-8 ${config.color}`} />
            </div>
            <CardTitle className="text-xl">{config.title}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              {config.description}
            </p>
            
            {orderDetails && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reference:</span>
                  <Badge variant="outline">{orderDetails.reference || reference}</Badge>
                </div>
                
                {orderDetails.amount && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="font-medium">{orderDetails.amount} {orderDetails.currency || 'XAF'}</span>
                  </div>
                )}
                
                {orderDetails.status && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className={config.color}>{orderDetails.status}</Badge>
                  </div>
                )}
              </div>
            )}
            
            <div className="pt-4 space-y-2">
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
                variant={paymentStatus === 'success' ? 'default' : 'outline'}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              
              {paymentStatus === 'failed' && (
                <Button 
                  onClick={() => navigate('/checkout')} 
                  className="w-full"
                  variant="default"
                >
                  Try Again
                </Button>
              )}
              
              {paymentStatus === 'pending' && (
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full"
                  variant="outline"
                >
                  Refresh Status
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {paymentStatus === 'success' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-800">
              📞 You will receive a WhatsApp message with your order details and delivery updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;