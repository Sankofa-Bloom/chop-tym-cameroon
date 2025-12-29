import { useState } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Phone,
  User,
  Clock,
  Bike,
  MessageSquare,
  Send,
  Loader2,
  History,
} from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { RiderAssignmentDialog } from "./RiderAssignmentDialog";
import {
  useOrderActivityLog,
  useOrderNotes,
  OperationalOrder,
  OperationalOrderStatus,
} from "@/hooks/useOperationalOrders";

interface OrderDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OperationalOrder;
  onStatusUpdate: (orderId: string, status: OperationalOrderStatus) => Promise<boolean>;
  onRiderAssign: (orderId: string, riderId: string) => Promise<boolean>;
}

const actionTypeLabels: Record<string, { label: string; icon: string }> = {
  order_created: { label: "Order Created", icon: "📝" },
  status_change: { label: "Status Changed", icon: "🔄" },
  rider_assignment: { label: "Rider Assigned", icon: "🏍️" },
  payment_status_change: { label: "Payment Updated", icon: "💰" },
  note_added: { label: "Note Added", icon: "📌" },
};

export const OrderDetailSheet = ({
  open,
  onOpenChange,
  order,
  onStatusUpdate,
  onRiderAssign,
}: OrderDetailSheetProps) => {
  const [riderDialogOpen, setRiderDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  
  const { activities, loading: activitiesLoading } = useOrderActivityLog(order.id);
  const { notes, addNote, loading: notesLoading } = useOrderNotes(order.id);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setAddingNote(true);
    const success = await addNote(newNote.trim());
    if (success) {
      setNewNote("");
    }
    setAddingNote(false);
  };

  const statusFlow: OperationalOrderStatus[] = [
    "pending",
    "assigned",
    "picked_up",
    "in_transit",
    "delivered",
  ];

  const currentStatusIndex = statusFlow.indexOf(order.status);
  const nextStatus = currentStatusIndex >= 0 && currentStatusIndex < statusFlow.length - 1
    ? statusFlow[currentStatusIndex + 1]
    : null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span className="font-mono">{order.reference_id}</span>
              <OrderStatusBadge status={order.status} />
            </SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4 space-y-4">
              {/* Quick Actions */}
              <div className="flex gap-2">
                {nextStatus && (
                  <Button
                    onClick={() => onStatusUpdate(order.id, nextStatus)}
                    className="flex-1"
                  >
                    Mark as {nextStatus.replace("_", " ")}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setRiderDialogOpen(true)}
                >
                  <Bike className="w-4 h-4 mr-2" />
                  {order.rider ? "Change Rider" : "Assign Rider"}
                </Button>
              </div>

              <Separator />

              {/* Customer Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">Customer</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{order.customer_phone}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Locations */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">Locations</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500 mt-0.5" />
                    <div>
                      <span className="text-xs text-muted-foreground">Pickup</span>
                      <p>{order.pickup_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <span className="text-xs text-muted-foreground">Drop-off</span>
                      <p>{order.dropoff_location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">Order Info</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="capitalize font-medium">{order.order_type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Source:</span>
                    <p className="capitalize font-medium">{order.order_source.replace("_", " ")}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <p className="font-medium">{order.estimated_amount.toLocaleString()} XAF</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payment:</span>
                    <p className="capitalize font-medium">{order.payment_method}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Town:</span>
                    <p className="font-medium">{order.town}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rider:</span>
                    <p className="font-medium">{order.rider?.name || "Not assigned"}</p>
                  </div>
                </div>
              </div>

              {order.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Description</h4>
                    <p className="text-sm">{order.description}</p>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <div className="space-y-4">
                {/* Add Note Form */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note about this order..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || addingNote}
                    className="w-full"
                  >
                    {addingNote ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Add Note
                  </Button>
                </div>

                <Separator />

                {/* Notes List */}
                <ScrollArea className="h-[300px]">
                  {notesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No notes yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 rounded-lg bg-muted/50 space-y-1"
                        >
                          <p className="text-sm">{note.note}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(note.created_at), "PPp")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <ScrollArea className="h-[400px]">
                {activitiesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No activity yet</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-4">
                      {activities.map((activity) => {
                        const config = actionTypeLabels[activity.action_type] || {
                          label: activity.action_type,
                          icon: "📋",
                        };
                        return (
                          <div key={activity.id} className="relative pl-10">
                            <div className="absolute left-2 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs">
                              {config.icon}
                            </div>
                            <div className="bg-muted/30 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{config.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(activity.created_at), "PPp")}
                                </span>
                              </div>
                              {activity.notes && (
                                <p className="text-sm text-muted-foreground">{activity.notes}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <RiderAssignmentDialog
        open={riderDialogOpen}
        onOpenChange={setRiderDialogOpen}
        orderId={order.id}
        currentRiderId={order.assigned_rider_id}
        onAssign={onRiderAssign}
      />
    </>
  );
};
