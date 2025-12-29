import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Phone, CheckCircle } from "lucide-react";
import { useRiders } from "@/hooks/useOperationalOrders";
import { cn } from "@/lib/utils";

interface RiderAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  currentRiderId: string | null;
  onAssign: (orderId: string, riderId: string) => Promise<boolean>;
}

const statusColors: Record<string, string> = {
  available: "bg-emerald-500",
  busy: "bg-amber-500",
  offline: "bg-gray-400",
};

export const RiderAssignmentDialog = ({
  open,
  onOpenChange,
  orderId,
  currentRiderId,
  onAssign,
}: RiderAssignmentDialogProps) => {
  const { riders, loading } = useRiders();
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(currentRiderId);
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedRiderId) return;
    
    setAssigning(true);
    const success = await onAssign(orderId, selectedRiderId);
    setAssigning(false);
    
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Rider</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : riders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No riders available. Add riders first.
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {riders.map((rider) => (
              <div
                key={rider.id}
                onClick={() => setSelectedRiderId(rider.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  selectedRiderId === rider.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {rider.name}
                        {currentRiderId === rider.id && (
                          <Badge variant="secondary" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {rider.phone}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className={cn("w-2 h-2 rounded-full", statusColors[rider.current_status])} />
                      <span className="text-xs capitalize text-muted-foreground">
                        {rider.current_status}
                      </span>
                    </div>
                    {selectedRiderId === rider.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={assigning}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedRiderId || assigning || selectedRiderId === currentRiderId}
          >
            {assigning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign Rider"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
