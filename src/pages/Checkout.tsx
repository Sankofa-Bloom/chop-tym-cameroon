// Optimized checkout component for processing orders
import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, MapPin, Phone, User, Loader2, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTowns } from "@/hooks/useTowns";
import { useStreets } from "@/hooks/useStreets";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useAppSettings } from "@/hooks/useAppSettings";
import { validateOrderData, optimizeOrderData, normalizePhoneNumber } from "@/utils/checkoutOptimization";

interface CheckoutItem {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string;
}

interface CheckoutProps {
  items: CheckoutItem[];
  total: number;
  selectedTown: string;
  onBack: () => void;
  onSuccess: (orderData: any) => void;
}

export const Checkout = ({ items, total, selectedTown, onBack, onSuccess }: CheckoutProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
    town: selectedTown,
    street: "",
    paymentMethod: 'delivery' as string
  });

  const { createPaymentAndRedirect } = useAuth();
  const { paymentMethods, loading: paymentMethodsLoading } = usePaymentMethods();
  const { paymentMode, loading: settingsLoading } = useAppSettings();
  
  // Filter to only online payment methods
  const onlinePaymentMethods = paymentMethods.filter(method => method.category === 'online');

  const { towns } = useTowns();
  const { streets } = useStreets(formData.town);
  const [selectedStreet, setSelectedStreet] = useState<any>(null);
  const [selectedTownData, setSelectedTownData] = useState<any>(null);
  
  // Calculate delivery fee based on town's free delivery setting and selected street's zone
  const deliveryFee = selectedTownData?.free_delivery ? 0 : (selectedStreet?.delivery_zone?.delivery_fee || 500);
  const finalTotal = total + deliveryFee;

  // Update selected street when street changes
  useEffect(() => {
    if (formData.street && streets.length > 0) {
      const street = streets.find(s => s.id === formData.street);
      setSelectedStreet(street);
    }
  }, [formData.street, streets]);

  // Update selected town data when town changes
  useEffect(() => {
    if (formData.town && towns.length > 0) {
      const town = towns.find(t => t.name === formData.town);
      setSelectedTownData(town);
    }
  }, [formData.town, towns]);

  // Set default payment method based on settings
  useEffect(() => {
    if (!settingsLoading) {
      if (paymentMode.mode === 'delivery') {
        setFormData(prev => ({
          ...prev,
          paymentMethod: 'delivery'
        }));
      } else if (onlinePaymentMethods.length > 0) {
        setFormData(prev => ({
          ...prev,
          paymentMethod: onlinePaymentMethods[0].code
        }));
      }
    }
  }, [paymentMode, settingsLoading, onlinePaymentMethods.length]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      // Auto-append +237 if not present and user starts typing
      if (value && !value.startsWith('+237')) {
        const cleanValue = value.replace(/^\+?237\s?/, '');
        value = '+237' + cleanValue;
      }
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateTownOrderId = async (town: string) => {
    try {
      const { data, error } = await supabase.rpc('generate_town_order_number', {
        order_town: town
      });
      
      if (error) {
        console.error('Error generating town order ID:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to generate town order ID:', error);
      // Fallback to generic order ID if database function fails
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      return `CT-${date}-${random}`;
    }
  };

  const handleDeliveryPayment = async () => {
    setLoading(true);

    try {
      // Validate required fields quickly
      const validation = validateOrderData(formData);
      if (!validation.isValid) {
        toast.error(validation.errors[0]);
        setLoading(false);
        return;
      }

      const orderId = await generateTownOrderId(formData.town);
      const phoneNumber = normalizePhoneNumber(formData.phone);

      const orderData = {
        order_number: orderId,
        customer_name: formData.fullName,
        customer_phone: phoneNumber,
        delivery_address: `${formData.address}, ${selectedStreet?.name}, ${formData.town}`,
        town: formData.town,
        items,
        subtotal: total,
        delivery_fee: deliveryFee,
        total: finalTotal,
        notes: formData.notes
      };

      const { data, error } = await supabase.functions.invoke('create-delivery-order', {
        body: { orderData }
      });

      if (error || !data?.success) {
        toast.error(data?.error || 'Failed to place order');
        setLoading(false);
        return;
      }

      // Navigate to confirmation page
      navigate('/order-confirmation', {
        state: {
          orderNumber: data.order_number,
          orderData: {
            ...orderData,
            payment_method: 'delivery',
            payment_status: 'pending_delivery'
          }
        }
      });

      onSuccess({ ...orderData, orderNumber: data.order_number });
    } catch (error) {
      console.error('Error in delivery checkout:', error);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    setLoading(true);

    try {
      // Validate required fields quickly
      const validation = validateOrderData(formData);
      if (!validation.isValid) {
        toast.error(validation.errors[0]);
        setLoading(false);
        return;
      }

      const orderId = await generateTownOrderId(formData.town);
      const phoneNumber = normalizePhoneNumber(formData.phone);

      const { error } = await createPaymentAndRedirect({
        orderNumber: orderId,
        amount: finalTotal,
        currency: 'XAF',
        customerEmail: undefined,
        customerName: formData.fullName,
        customerPhone: phoneNumber,
        description: `ChopTym order #${orderId}`,
        paymentMethod: formData.paymentMethod as 'swychr' | 'offline',
        metadata: {
          town: formData.town,
          street: formData.street,
          selectedStreet: selectedStreet?.name,
          selectedZone: selectedStreet?.delivery_zone?.zone_name,
          items,
          subtotal: total,
          deliveryFee,
          total: finalTotal,
          orderData: {
            order_number: orderId,
            customer_name: formData.fullName,
            customer_phone: phoneNumber,
            delivery_address: `${formData.address}, ${selectedStreet?.name}, ${formData.town}`,
            town: formData.town,
            items,
            subtotal: total,
            delivery_fee: deliveryFee,
            total: finalTotal,
            notes: formData.notes,
            payment_method: formData.paymentMethod
          }
        }
      });

      setLoading(false);

      if (error) {
        toast.error(error.message);
        return;
      }
    } catch (error) {
      console.error('Error in online checkout:', error);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.paymentMethod === 'delivery') {
      await handleDeliveryPayment();
    } else {
      await handleOnlinePayment();
    }
  };

  // Determine which payment options to show
  const showDeliveryOption = paymentMode.mode === 'delivery';
  const showOnlineOptions = paymentMode.mode === 'online' || paymentMode.online_payments_enabled;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} disabled={loading}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Checkout</h1>
            <p className="text-sm text-muted-foreground">Complete your order</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Order Summary */}
        <div className="chop-card p-4 mb-6">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.restaurantId}`} className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">x{item.quantity}</span>
                  <p className="text-xs text-muted-foreground">{item.restaurant}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <Separator className="my-3" />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className={selectedTownData?.free_delivery ? "text-green-600 font-medium" : ""}>
                {selectedTownData?.free_delivery ? "Free" : formatPrice(deliveryFee)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information Form */}
        <form onSubmit={handleCheckout} className="space-y-6">
          <div className="chop-card p-4">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Delivery Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="town">Select Town *</Label>
                <Select 
                  value={formData.town} 
                  onValueChange={(value) => {
                    handleInputChange("town", value);
                    handleInputChange("street", "");
                    setSelectedStreet(null);
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className="chop-input mt-1">
                    <SelectValue placeholder="Choose your town" />
                  </SelectTrigger>
                  <SelectContent>
                    {towns.filter(town => town.is_active).map((town) => (
                      <SelectItem key={town.id} value={town.name}>
                        {town.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.town && (
                <div>
                  <Label htmlFor="street">Street *</Label>
                  <Select 
                    value={formData.street} 
                    onValueChange={(value) => handleInputChange("street", value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="chop-input mt-1">
                      <SelectValue placeholder="Choose your street" />
                    </SelectTrigger>
                    <SelectContent>
                      {streets.map((street) => (
                        <SelectItem key={street.id} value={street.id}>
                          {street.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedStreet && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Delivery fee: {selectedTownData?.free_delivery ? "Free" : formatPrice(selectedStreet.delivery_zone.delivery_fee)}
                      {selectedTownData?.free_delivery && (
                        <span className="text-green-600 font-medium ml-2">✓ Free delivery in this town</span>
                      )}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="chop-input mt-1"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="phone">WhatsApp Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+237 6 XX XXX XXX"
                  className="chop-input mt-1"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your complete delivery address"
                  className="chop-input mt-1 min-h-[80px]"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any special instructions for the delivery..."
                  className="chop-input mt-1 min-h-[60px]"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="chop-card p-4">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Payment Method
            </h2>
            
            <div className="space-y-4">
              {(paymentMethodsLoading || settingsLoading) ? (
                <div className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Loading payment methods...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Payment on Delivery Option */}
                  {showDeliveryOption && (
                    <div 
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                        formData.paymentMethod === 'delivery' 
                          ? 'border-green-500 bg-green-500/10' 
                          : 'border-border hover:border-green-500/50'
                      }`}
                      onClick={() => handleInputChange('paymentMethod', 'delivery')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                          {formData.paymentMethod === 'delivery' && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium flex items-center gap-2">
                            <Truck className="h-4 w-4 text-green-600" />
                            Payment on Delivery
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Pay cash when your order arrives
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <p className="text-xs text-green-600 font-medium">
                              No upfront payment required
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Online Payment Options */}
                  {showOnlineOptions && onlinePaymentMethods.length > 0 && (
                    <>
                      {showDeliveryOption && (
                        <div className="relative py-2">
                          <Separator />
                          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                            or pay online
                          </span>
                        </div>
                      )}
                      {onlinePaymentMethods.map((method) => (
                        <div 
                          key={method.code}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                            formData.paymentMethod === method.code 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleInputChange('paymentMethod', method.code)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                              {formData.paymentMethod === method.code && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{method.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {method.description}
                              </p>
                              {method.fees && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Fees: {method.fees}
                                </p>
                              )}
                              {method.processing_time && (
                                <p className="text-xs text-primary font-medium">
                                  {method.processing_time}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {!showDeliveryOption && !showOnlineOptions && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No payment methods available at the moment.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full chop-btn-primary py-4 text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : formData.paymentMethod === 'delivery' ? (
              `Place Order - Pay ${formatPrice(finalTotal)} on Delivery`
            ) : (
              `Pay Now - ${formatPrice(finalTotal)}`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
