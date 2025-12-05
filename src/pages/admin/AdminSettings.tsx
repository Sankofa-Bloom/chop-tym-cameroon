import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CreditCard, Truck } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pricingMode, setPricingMode] = useState<'simple' | 'restaurant'>('simple');
  const [flatPrice, setFlatPrice] = useState(1000);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  
  // Payment settings
  const [paymentMode, setPaymentMode] = useState<'delivery' | 'online'>('delivery');
  const [onlinePaymentsEnabled, setOnlinePaymentsEnabled] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value');

      if (error) throw error;
      
      data?.forEach(setting => {
        if (setting.key === 'pricing_mode' && setting.value && typeof setting.value === 'object' && 'mode' in setting.value) {
          const pricingSettings = setting.value as { 
            mode: 'simple' | 'restaurant'; 
            flat_price?: number;
            availability_hours?: { start: string; end: string };
          };
          setPricingMode(pricingSettings.mode);
          setFlatPrice(pricingSettings.flat_price || 1000);
          setStartTime(pricingSettings.availability_hours?.start || '09:00');
          setEndTime(pricingSettings.availability_hours?.end || '18:00');
        }
        
        if (setting.key === 'payment_mode' && setting.value && typeof setting.value === 'object') {
          const paymentSettings = setting.value as {
            mode: 'delivery' | 'online';
            online_payments_enabled: boolean;
          };
          setPaymentMode(paymentSettings.mode);
          setOnlinePaymentsEnabled(paymentSettings.online_payments_enabled);
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePricing = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({
          value: {
            mode: pricingMode,
            flat_price: pricingMode === 'simple' ? flatPrice : undefined,
            availability_hours: {
              start: startTime,
              end: endTime
            }
          }
        })
        .eq('key', 'pricing_mode');

      if (error) throw error;
      toast.success('Pricing settings updated successfully');
    } catch (error) {
      console.error('Error saving pricing settings:', error);
      toast.error('Failed to save pricing settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayment = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({
          value: {
            mode: paymentMode,
            online_payments_enabled: onlinePaymentsEnabled
          }
        })
        .eq('key', 'payment_mode');

      if (error) throw error;
      toast.success('Payment settings updated successfully');
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast.error('Failed to save payment settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold mb-6">App Settings</h1>
      
      {/* Payment Mode Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Mode
          </CardTitle>
          <CardDescription>
            Control how customers pay for their orders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup 
            value={paymentMode} 
            onValueChange={(value: 'delivery' | 'online') => setPaymentMode(value)}
          >
            <div className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="delivery" id="delivery" />
              <div className="space-y-1 leading-none flex-1">
                <Label htmlFor="delivery" className="font-medium cursor-pointer flex items-center gap-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  Payment on Delivery
                </Label>
                <p className="text-sm text-muted-foreground">
                  Customers pay when their order is delivered. Increases trust for new customers.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="online" id="online" />
              <div className="space-y-1 leading-none flex-1">
                <Label htmlFor="online" className="font-medium cursor-pointer flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  Online Payment Required
                </Label>
                <p className="text-sm text-muted-foreground">
                  Customers must pay online before their order is processed. Reduces no-shows.
                </p>
              </div>
            </div>
          </RadioGroup>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Switch
              id="online-enabled"
              checked={onlinePaymentsEnabled}
              onCheckedChange={setOnlinePaymentsEnabled}
            />
            <Label htmlFor="online-enabled" className="cursor-pointer">
              Enable online payment option alongside delivery payment
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            When enabled with "Payment on Delivery" mode, customers can choose to pay online or on delivery.
          </p>

          <Button onClick={handleSavePayment} disabled={saving} className="w-full sm:w-auto">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Payment Settings
          </Button>
        </CardContent>
      </Card>

      {/* Pricing Mode Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Mode</CardTitle>
          <CardDescription>
            Choose how pricing works in your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={pricingMode} onValueChange={(value: 'simple' | 'restaurant') => setPricingMode(value)}>
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="simple" id="simple" />
              <div className="space-y-1 leading-none">
                <Label htmlFor="simple" className="font-medium cursor-pointer">
                  Simple Mode (Flat Pricing)
                </Label>
                <p className="text-sm text-muted-foreground">
                  All dishes display at a single flat price. Best for starting out or testing the platform.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="restaurant" id="restaurant" />
              <div className="space-y-1 leading-none">
                <Label htmlFor="restaurant" className="font-medium cursor-pointer">
                  Restaurant Mode (Individual Pricing)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Each restaurant sets their own prices. Shows multiple pricing options per dish.
                </p>
              </div>
            </div>
          </RadioGroup>

          {pricingMode === 'simple' && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="flatPrice">Flat Price (XAF)</Label>
                <Input
                  id="flatPrice"
                  type="number"
                  min="0"
                  step="100"
                  value={flatPrice}
                  onChange={(e) => setFlatPrice(parseInt(e.target.value) || 0)}
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground">
                  All dishes will be displayed at this price
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Dish Availability Hours</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Opens At</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Closes At</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Dishes will only be available for ordering during these hours
            </p>
          </div>

          <Button onClick={handleSavePricing} disabled={saving} className="w-full sm:w-auto">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Pricing Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
