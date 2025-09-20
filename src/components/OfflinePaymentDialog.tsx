import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

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

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.success("Phone number copied!");
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
      <DialogContent className="max-w-md mx-auto">
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
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Payment Instructions:</h3>
              <div className="space-y-2 text-sm">
                <p>Send mobile money payment to:</p>
                
                <div className="flex items-center justify-between bg-background rounded p-2 border">
                  <div>
                    <p className="font-medium">MTN Mobile Money</p>
                    <p className="text-primary font-mono">677 123 456</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyNumber("677123456")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between bg-background rounded p-2 border">
                  <div>
                    <p className="font-medium">Orange Money</p>
                    <p className="text-primary font-mono">691 123 456</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyNumber("691123456")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Important:</strong> Please include your order number <strong>#{orderData.orderNumber}</strong> 
                in the payment reference or send a screenshot to confirm payment.
              </p>
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