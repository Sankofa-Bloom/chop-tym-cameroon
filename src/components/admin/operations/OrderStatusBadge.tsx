import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OperationalOrderStatus } from "@/hooks/useOperationalOrders";

interface OrderStatusBadgeProps {
  status: OperationalOrderStatus;
  className?: string;
}

const statusConfig: Record<OperationalOrderStatus, { label: string; variant: string; className: string }> = {
  pending: {
    label: "Pending",
    variant: "outline",
    className: "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30",
  },
  assigned: {
    label: "Assigned",
    variant: "outline",
    className: "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30",
  },
  picked_up: {
    label: "Picked Up",
    variant: "outline",
    className: "border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30",
  },
  in_transit: {
    label: "In Transit",
    variant: "outline",
    className: "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/30",
  },
  delivered: {
    label: "Delivered",
    variant: "outline",
    className: "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
  },
  cancelled: {
    label: "Cancelled",
    variant: "outline",
    className: "border-gray-500 text-gray-600 bg-gray-50 dark:bg-gray-950/30",
  },
  failed: {
    label: "Failed",
    variant: "outline",
    className: "border-red-500 text-red-600 bg-red-50 dark:bg-red-950/30",
  },
};

export const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge
      variant="outline"
      className={cn(config.className, "font-medium", className)}
    >
      {config.label}
    </Badge>
  );
};

export const getStatusIcon = (status: OperationalOrderStatus): string => {
  const icons: Record<OperationalOrderStatus, string> = {
    pending: "⏳",
    assigned: "👤",
    picked_up: "📦",
    in_transit: "🚚",
    delivered: "✅",
    cancelled: "❌",
    failed: "⚠️",
  };
  return icons[status];
};
