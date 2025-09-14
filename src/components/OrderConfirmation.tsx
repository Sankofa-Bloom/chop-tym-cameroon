import { CheckCircle, Home, Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface OrderData {
  items: Array<{
    id: number;
    name: string;
    restaurant: string;
    price: number;
    quantity: number;
  }>;
  customerInfo: {
    fullName: string;
    phone: string;
    address: string;
    notes?: string;
  };
  total: number;
  deliveryFee: number;
  subtotal: number;
  timestamp: string;
}

interface OrderConfirmationProps {
  orderData: OrderData;
  onGoHome: () => void;
}

export const OrderConfirmation = ({ orderData, onGoHome }: OrderConfirmationProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const estimatedDeliveryTime = new Date(Date.now() + 35 * 60 * 1000); // 35 minutes from now
  const orderNumber = `CHT${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-secondary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully! 🎉</h1>
          <p className="text-muted-foreground">
            Your delicious meal is being prepared
          </p>
        </div>

        {/* Order Details Card */}
        <div className="chop-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Order #{orderNumber}</h2>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(orderData.timestamp).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(orderData.total)}
              </div>
              <p className="text-sm text-muted-foreground">Total paid</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Delivery Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    {estimatedDeliveryTime.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} (25-35 mins)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-sm text-muted-foreground">{orderData.customerInfo.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.customerInfo.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold">Order Items</h3>
            {orderData.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.restaurant} • Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            
            <Separator className="my-3" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{formatPrice(orderData.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(orderData.total)}</span>
              </div>
            </div>
          </div>

          {orderData.customerInfo.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Special Instructions</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {orderData.customerInfo.notes}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Payment Status */}
        <div className="chop-card p-4 mb-6 bg-secondary/10 border border-secondary/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-secondary" />
            <div>
              <p className="font-medium text-secondary">Payment Successful</p>
              <p className="text-sm text-muted-foreground">
                Paid via Mobile Money (Swychr)
              </p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="chop-card p-6 mb-6">
          <h3 className="font-semibold mb-4">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">1</span>
              </div>
              <span className="text-sm">Restaurant confirms your order</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">2</span>
              </div>
              <span className="text-sm">Your meal is prepared with love</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">3</span>
              </div>
              <span className="text-sm">Driver picks up and delivers to you</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={onGoHome} className="w-full chop-btn-primary">
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            We'll send you updates via WhatsApp to {orderData.customerInfo.phone}
          </p>
        </div>
      </div>
    </div>
  );
};