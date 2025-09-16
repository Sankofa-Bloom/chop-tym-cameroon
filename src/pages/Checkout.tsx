import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, MapPin, Phone, User, Loader2 } from "lucide-react";
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
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
    town: selectedTown,
    street: "",
    paymentMethod: 'swychr' as 'swychr'
  });

  const { createPaymentAndRedirect } = useAuth();

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

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `CT-${date}-${random}`;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.phone || !formData.address || !formData.town || !formData.street) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const orderId = generateOrderId();
      

      // Prepare order data for database storage (if needed later)
      const orderData = {
        items,
        customerInfo: {
          ...formData,
          selectedZone: selectedStreet?.delivery_zone?.zone_name,
          selectedStreet: selectedStreet?.name
        },
        subtotal: total,
        deliveryFee,
        total: finalTotal,
        timestamp: new Date().toISOString()
      };

      // Format phone number for gateway metadata
      let phoneNumber = formData.phone.replace(/^\+?237\s?/, '');
      if (!phoneNumber.startsWith('237')) {
        phoneNumber = '237' + phoneNumber;
      }

      const { error } = await createPaymentAndRedirect({
        orderNumber: orderId,
        amount: finalTotal,
        currency: 'XAF',
        customerEmail: undefined,
        customerName: formData.fullName,
        customerPhone: phoneNumber,
        description: `ChopTym order #${orderId}`,
        paymentMethod: formData.paymentMethod,
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

      // onSuccess likely won't run due to redirect, but keep for safety
      onSuccess({ ...orderData, orderNumber: orderId });
    } catch (error) {
      console.error('Error in checkout process:', error);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

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
            
            <div className="space-y-3">
              {/* Swychr Payment */}
              <div className="border-2 rounded-xl p-4 border-primary bg-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Card Payment (Swychr)</h3>
                    <p className="text-sm text-muted-foreground">
                      Pay securely with your debit or credit card
                    </p>
                  </div>
                </div>
              </div>
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
            ) : (
              `Place Order - ${formatPrice(finalTotal)}`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;