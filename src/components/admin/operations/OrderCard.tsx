import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  Phone,
  User,
  Clock,
  MoreVertical,
  Bike,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { OrderStatusBadge, getStatusIcon } from "./OrderStatusBadge";
import { RiderAssignmentDialog } from "./RiderAssignmentDialog";
import { OrderDetailSheet } from "./OrderDetailSheet";
import { cn } from "@/lib/utils";
import type { OperationalOrder, OperationalOrderStatus } from "@/hooks/useOperationalOrders";

interface OrderCardProps {
  order: OperationalOrder;
  onStatusUpdate: (orderId: string, status: OperationalOrderStatus) => Promise<boolean>;
  onRiderAssign: (orderId: string, riderId: string) => Promise<boolean>;
  onArchive: (orderId: string) => Promise<boolean>;
}

const orderTypeLabels: Record<string, { label: string; emoji: string }> = {
  food: { label: "Food", emoji: "🍽️" },
  errand: { label: "Errand", emoji: "🏃" },
  parcel: { label: "Parcel", emoji: "📦" },
  custom: { label: "Custom", emoji: "✨" },
};

const orderSourceLabels: Record<string, { label: string; emoji: string }> = {
  whatsapp: { label: "WhatsApp", emoji: "📱" },
  phone_call: { label: "Phone", emoji: "📞" },
  walk_in: { label: "Walk-in", emoji: "🚶" },
  emergency: { label: "Emergency", emoji: "🚨" },
};

export const OrderCard = ({ order, onStatusUpdate, onRiderAssign, onArchive }: OrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [riderDialogOpen, setRiderDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const isDelayed = 
    (order.status === "pending" || order.status === "assigned") &&
    new Date(order.created_at).getTime() < Date.now() - 60 * 60 * 1000;

  const isException = order.status === "cancelled" || order.status === "failed";

  const statusActions: OperationalOrderStatus[] = [
    "pending",
    "assigned",
    "picked_up",
    "in_transit",
    "delivered",
    "cancelled",
    "failed",
  ];

  return (
    <>
      <Card
        className={cn(
          "transition-all hover:shadow-md",
          isDelayed && "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
          isException && "border-red-500 bg-red-50/50 dark:bg-red-950/20"
        )}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getStatusIcon(order.status)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm">{order.reference_id}</span>
                  <Badge variant="secondary" className="text-xs">
                    {orderTypeLabels[order.order_type]?.emoji} {orderTypeLabels[order.order_type]?.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                  <span className="mx-1">•</span>
                  {orderSourceLabels[order.order_source]?.emoji} {orderSourceLabels[order.order_source]?.label}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setDetailOpen(true)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRiderDialogOpen(true)}>
                    <Bike className="w-4 h-4 mr-2" />
                    Assign Rider
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {statusActions
                    .filter((s) => s !== order.status)
                    .map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => onStatusUpdate(order.id, status)}
                      >
                        {getStatusIcon(status)} Set to {status.replace("_", " ")}
                      </DropdownMenuItem>
                    ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onArchive(order.id)}
                  >
                    Archive Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          {/* Customer Info */}
          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{order.customer_phone}</span>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground">Pickup:</span>
                <p className="text-foreground">{order.pickup_location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground">Drop-off:</span>
                <p className="text-foreground">{order.dropoff_location}</p>
              </div>
            </div>
          </div>

          {/* Expandable Details */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" /> Less details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" /> More details
              </>
            )}
          </Button>

          {expanded && (
            <div className="mt-3 pt-3 border-t space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Amount:</span>
                <span className="font-medium">{order.estimated_amount.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment:</span>
                <span className="capitalize">{order.payment_method} ({order.payment_status})</span>
              </div>
              {order.rider && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rider:</span>
                  <span className="font-medium">{order.rider.name}</span>
                </div>
              )}
              {order.description && (
                <div>
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="mt-1 text-foreground">{order.description}</p>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Created: {format(new Date(order.created_at), "PPp")}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <RiderAssignmentDialog
        open={riderDialogOpen}
        onOpenChange={setRiderDialogOpen}
        orderId={order.id}
        currentRiderId={order.assigned_rider_id}
        onAssign={onRiderAssign}
      />

      <OrderDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        order={order}
        onStatusUpdate={onStatusUpdate}
        onRiderAssign={onRiderAssign}
      />
    </>
  );
};
