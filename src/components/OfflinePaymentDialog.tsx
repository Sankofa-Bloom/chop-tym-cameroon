import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, ArrowLeft, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { usePaymentMethods, PaymentMethod } from "@/hooks/usePaymentMethods";

interface OfflinePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkPaid: () => void;
  orderData: {
    orderNumber: string;
    total: number;
    customerInfo: {
      fullName: string;
      phone: string;
    };
  };
}

export const OfflinePaymentDialog = ({ 
  isOpen, 
  onClose, 
  onMarkPaid, 
  orderData 
}: OfflinePaymentDialogProps) => {
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const { paymentMethods } = usePaymentMethods();
  const [offlinePaymentMethods, setOfflinePaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const offlineMethods = paymentMethods.filter(method => 
      method.category === 'offline' && method.is_active
    );
    setOfflinePaymentMethods(offlineMethods);
  }, [paymentMethods]);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const handleMarkAsPaid = async () => {
    setIsMarkingPaid(true);
    try {
      await onMarkPaid();
      setIsMarkingPaid(false);
    } catch (error) {
      setIsMarkingPaid(false);
      toast.error("Failed to mark as paid. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Complete Your Payment
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Order #{orderData.orderNumber}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {orderData.total.toLocaleString()} XAF
            </div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
          </div>

          <div className="space-y-4">
            {offlinePaymentMethods.map((method) => (
              <div key={method.id} className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  {method.name}
                </h3>
                
                {method.payment_details?.methods?.map((paymentOption, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex items-center justify-between bg-background rounded-lg p-3 border mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{paymentOption.name}</p>
                            <p className="text-xs text-muted-foreground">{paymentOption.instructions}</p>
                          </div>
                        </div>
                        
                        <div className="ml-10 space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-primary font-mono text-sm">{paymentOption.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{paymentOption.account_name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1 ml-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyText(paymentOption.phone.replace(/\s/g, ''), "Phone number")}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <p className="text-xs text-muted-foreground mt-2">{method.description}</p>
              </div>
            ))}
            
            {offlinePaymentMethods.length === 0 && (
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-muted-foreground">No offline payment methods available</p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                    Important Payment Instructions:
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Include your order number <strong>#{orderData.orderNumber}</strong> in the payment reference</li>
                    <li>• Or send a screenshot of the payment confirmation</li>
                    <li>• Click "I've Paid" below once payment is completed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button
              className="flex-1"
              onClick={handleMarkAsPaid}
              disabled={isMarkingPaid}
            >
              {isMarkingPaid ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  I've Paid
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};