import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, Phone, User, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CustomOrderFormProps {
  onBack: () => void;
  selectedTown: string;
}

const getLocalExamples = (town: string) => {
  const examples = {
    'Douala': [
      'Buy 2kg rice from Santa Lucia supermarket',
      'Pick up documents from MTN office at Bonanjo',
      'Order shawarma from any good restaurant in Akwa'
    ],
    'Yaoundé': [
      'Buy groceries from Mahima supermarket at Bastos',
      'Pick up documents from Orange office at Centre Ville',
      'Order pizza from any restaurant in Essos'
    ],
    'Limbe': [
      'Buy fresh fish from Down Beach market',
      'Pick up package from Post Office at Mile 1',
      'Order grilled chicken from any restaurant in town'
    ],
    'Bafoussam': [
      'Buy coffee beans from local market',
      'Pick up documents from bank at Commercial Avenue',
      'Order local dishes from any restaurant in town'
    ],
    'Bamenda': [
      'Buy vegetables from Nkwen market',
      'Pick up documents from government office',
      'Order achu from any restaurant in Commercial Avenue'
    ]
  };
  
  return examples[town] || [
    'Buy groceries from local supermarket',
    'Pick up documents from office',
    'Order food from any restaurant in town'
  ];
};

export const CustomOrderForm = ({ onBack, selectedTown }: CustomOrderFormProps) => {
  const localExamples = getLocalExamples(selectedTown);
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    orderDescription: "",
    urgency: "normal",
    estimatedValue: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    if (field === 'customerPhone') {
      // Auto-append +237 if not present and user starts typing
      if (value && !value.startsWith('+237')) {
        // Remove any existing +237 if user tries to add it manually
        const cleanValue = value.replace(/^\+?237\s?/, '');
        value = '+237' + cleanValue;
      }
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare order data for custom order
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        deliveryAddress: formData.deliveryAddress,
        town: selectedTown,
        items: [{
          name: "Custom Order Request",
          restaurant: "ChopTym Custom Delivery",
          price: parseInt(formData.estimatedValue) || 1000,
          quantity: 1,
        }],
        subtotal: parseInt(formData.estimatedValue) || 1000,
        deliveryFee: 0, // No delivery fee shown in cart
        total: parseInt(formData.estimatedValue) || 1000,
        notes: `CUSTOM ORDER REQUEST:\n\nDescription: ${formData.orderDescription}\n\nUrgency: ${formData.urgency}\n\nEstimated Value: ${formData.estimatedValue || "Not specified"} XAF`,
        paymentMethod: "swychr",
      };

      const response = await fetch(`https://qiupqrmtxwtgipbwcvoo.supabase.co/functions/v1/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Custom Order Submitted! 🎉",
          description: `Order #${result.orderNumber} received. We'll contact you shortly to confirm details.`,
        });

        if (result.paymentUrl) {
          window.open(result.paymentUrl, '_blank');
        }

        // Reset form
        setFormData({
          customerName: "",
          customerPhone: "",
          deliveryAddress: "",
          orderDescription: "",
          urgency: "normal",
          estimatedValue: "",
        });
        
        onBack();
      } else {
        throw new Error(result.error || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting custom order:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your custom order. Please try again.",
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
      className="min-h-screen bg-gradient-subtle pb-20"
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
              <h1 className="text-xl font-bold font-heading">Custom Order</h1>
              <p className="text-sm text-muted-foreground">Tell us what you need delivered</p>
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
          <Card className="border-0 shadow-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Package className="w-8 h-8" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Anything. Anywhere. Anytime.</h2>
              <p className="text-white/90">
                Need something specific? We'll get it for you! From groceries to documents, 
                personal items to restaurant orders from anywhere - just tell us what you need.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Form */}
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
                Personal Information
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

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                  placeholder="Provide detailed delivery address including landmarks"
                  required
                  rows={3}
                />
              </div>
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <strong>Delivering to:</strong> {selectedTown}
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                What Do You Need?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orderDescription">Describe Your Request *</Label>
                <Textarea
                  id="orderDescription"
                  value={formData.orderDescription}
                  onChange={(e) => handleInputChange("orderDescription", e.target.value)}
                  placeholder="Tell us exactly what you need. Be as detailed as possible - what items, from where, any special instructions..."
                  required
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Examples: "{localExamples[0]}", "{localExamples[1]}", 
                  "{localExamples[2]}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Normal (1-2 hours)
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          Urgent (30-60 mins)
                        </div>
                      </SelectItem>
                      <SelectItem value="asap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-500" />
                          ASAP (as fast as possible)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estimatedValue">Estimated Item Cost (XAF)</Label>
                  <Input
                    id="estimatedValue"
                    value={formData.estimatedValue}
                    onChange={(e) => handleInputChange("estimatedValue", e.target.value)}
                    placeholder="e.g., 5000"
                    type="number"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: Helps us prepare for payment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">How It Works:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Service fee: 1,000 XAF + item cost</li>
                <li>• We'll contact you to confirm details and final price</li>
                <li>• Payment after confirmation via mobile money</li>
                <li>• Real-time delivery tracking</li>
              </ul>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-6 text-lg font-semibold"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Custom Order"}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};