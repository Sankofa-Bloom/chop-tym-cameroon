import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Phone, User, MessageSquare, ShoppingBag, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceType } from "./ServicesHub";

interface ServiceRequestFormProps {
  serviceType: ServiceType;
  onBack: () => void;
  selectedTown: string;
  onSuccess: () => void;
}

const serviceConfig = {
  errands: {
    title: "Errands",
    description: "Tell us what you need bought or done",
    icon: ShoppingBag,
    color: "from-orange-500 to-orange-600",
    showDropoff: false,
    pickupLabel: "Where should we go?",
    pickupPlaceholder: "e.g., Mahima Supermarket, City Pharmacy, etc.",
  },
  "package-delivery": {
    title: "Package Delivery",
    description: "Send items from one place to another",
    icon: Package,
    color: "from-blue-500 to-blue-600",
    showDropoff: true,
    pickupLabel: "Pickup Location",
    pickupPlaceholder: "Where should we pick up the package?",
  },
  "pickups-dropoffs": {
    title: "Pickups & Drop-offs",
    description: "We'll pick up and deliver for you",
    icon: Truck,
    color: "from-green-500 to-green-600",
    showDropoff: true,
    pickupLabel: "Pickup Location",
    pickupPlaceholder: "Where should we pick up from?",
  },
  "custom-request": {
    title: "Custom Request",
    description: "Tell us what you need done",
    icon: MessageSquare,
    color: "from-purple-500 to-purple-600",
    showDropoff: true,
    pickupLabel: "Pickup/Service Location",
    pickupPlaceholder: "Where should we go first?",
  },
};

export const ServiceRequestForm = ({ 
  serviceType, 
  onBack, 
  selectedTown,
  onSuccess 
}: ServiceRequestFormProps) => {
  const config = serviceConfig[serviceType];
  const Icon = config.icon;
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    pickupLocation: "",
    dropoffLocation: "",
    description: "",
    optionalMessage: "",
    paymentMethod: "delivery",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    if (field === "customerPhone") {
      if (value && !value.startsWith("+237")) {
        const cleanValue = value.replace(/^\+?237\s?/, "");
        value = "+237" + cleanValue;
      }
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Normalize phone number
      let phone = formData.customerPhone.replace(/\s+/g, "");
      if (!phone.startsWith("+")) {
        phone = "+237" + phone.replace(/^0+/, "");
      }

      const { data, error } = await supabase.functions.invoke("create-service-request", {
        body: {
          serviceType,
          customerName: formData.customerName.trim(),
          customerPhone: phone,
          pickupLocation: formData.pickupLocation.trim(),
          dropoffLocation: formData.dropoffLocation.trim() || null,
          description: formData.description.trim(),
          optionalMessage: formData.optionalMessage.trim() || null,
          paymentMethod: formData.paymentMethod,
          town: selectedTown,
        },
      });

      if (error) throw error;

      toast({
        title: "Request Submitted! 🎉",
        description: `Your ${config.title.toLowerCase()} request has been received. We'll contact you shortly.`,
      });

      onSuccess();
    } catch (error) {
      console.error("Error submitting service request:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-background pb-20"
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold font-heading">{config.title}</h1>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`border-0 shadow-xl bg-gradient-to-br ${config.color} text-white`}>
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Icon className="w-8 h-8" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
              <p className="text-white/90">{config.description}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Request Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">WhatsApp Number *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  placeholder="+237 6 XX XXX XXX"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pickupLocation">{config.pickupLabel} *</Label>
                <Textarea
                  id="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                  placeholder={config.pickupPlaceholder}
                  required
                  rows={2}
                />
              </div>
              
              {config.showDropoff && (
                <div>
                  <Label htmlFor="dropoffLocation">Drop-off/Delivery Location *</Label>
                  <Textarea
                    id="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={(e) => handleInputChange("dropoffLocation", e.target.value)}
                    placeholder="Where should we deliver to? Include landmarks"
                    required={config.showDropoff}
                    rows={2}
                  />
                </div>
              )}
              
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <strong>Service Area:</strong> {selectedTown}
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Description / Instructions *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what you need in detail. Be as specific as possible."
                  required
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="optionalMessage">Additional Notes (Optional)</Label>
                <Textarea
                  id="optionalMessage"
                  value={formData.optionalMessage}
                  onChange={(e) => handleInputChange("optionalMessage", e.target.value)}
                  placeholder="Any special instructions or preferences?"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Payment Preference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Pay on Delivery (Cash)</SelectItem>
                  <SelectItem value="momo">Mobile Money (MTN/Orange)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                We'll confirm the final price before service delivery.
              </p>
            </CardContent>
          </Card>

          {/* Pricing Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">What Happens Next:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• We'll review your request and call/WhatsApp you</li>
                <li>• Get a price quote before we proceed</li>
                <li>• Track your service in real-time</li>
                <li>• Pay only when service is complete</li>
              </ul>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-lg font-semibold"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};
