import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pricingMode, setPricingMode] = useState<'simple' | 'restaurant'>('simple');
  const [flatPrice, setFlatPrice] = useState(1000);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'pricing_mode')
        .single();

      if (error) throw error;
      if (data?.value && typeof data.value === 'object' && 'mode' in data.value) {
        const settings = data.value as { 
          mode: 'simple' | 'restaurant'; 
          flat_price?: number;
          availability_hours?: { start: string; end: string };
        };
        setPricingMode(settings.mode);
        setFlatPrice(settings.flat_price || 1000);
        setStartTime(settings.availability_hours?.start || '09:00');
        setEndTime(settings.availability_hours?.end || '18:00');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
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
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
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
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">App Settings</h1>
      
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

          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
