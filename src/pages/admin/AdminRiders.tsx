import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Plus, Loader2, User, Phone, Mail, RefreshCw, Star, MessageCircle } from "lucide-react";
import { useRiderOps, RiderOps, RiderStatus } from "@/hooks/useRiderOps";
import { RiderLiveMap } from "@/components/admin/operations/RiderLiveMap";
import { cn } from "@/lib/utils";

const riderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(9, "Phone must be at least 9 digits").max(15),
  whatsapp_number: z.string().max(15).optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

type RiderFormData = z.infer<typeof riderSchema>;

const statusColors: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  busy: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  offline: "bg-muted text-muted-foreground",
};

const RiderCard = ({
  rider,
  onUpdate,
}: {
  rider: RiderOps;
  onUpdate: (id: string, updates: Partial<RiderOps>) => Promise<boolean>;
}) => {
  const active = rider.active_orders_count ?? 0;
  const max = rider.max_active_orders ?? 3;
  const load = Math.min(100, max > 0 ? (active / max) * 100 : 0);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold truncate">{rider.name}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3" /> {rider.phone}
            </p>
            {rider.whatsapp_number && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> {rider.whatsapp_number}
              </p>
            )}
          </div>
          <Badge className={cn(statusColors[rider.current_status], "capitalize shrink-0")}>
            {rider.current_status}
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Workload</span>
            <span>
              {active}/{max} active
            </span>
          </div>
          <Progress value={load} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-bold">{rider.total_completed_orders ?? 0}</p>
            <p className="text-[11px] text-muted-foreground">Completed</p>
          </div>
          <div>
            <p className="text-lg font-bold flex items-center justify-center gap-1">
              {rider.average_rating ? Number(rider.average_rating).toFixed(1) : "—"}
              {rider.average_rating ? <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> : null}
            </p>
            <p className="text-[11px] text-muted-foreground">Rating</p>
          </div>
          <div>
            <p className="text-xs font-medium pt-1">
              {rider.last_seen
                ? formatDistanceToNow(new Date(rider.last_seen), { addSuffix: true })
                : "Never"}
            </p>
            <p className="text-[11px] text-muted-foreground">Last seen</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Switch
              checked={!!rider.auto_assign_enabled}
              onCheckedChange={(v) => onUpdate(rider.id, { auto_assign_enabled: v })}
            />
            <span className="text-xs text-muted-foreground">Auto-assign</span>
          </div>
          <Select
            value={rider.current_status}
            onValueChange={(v) => onUpdate(rider.id, { current_status: v as RiderStatus })}
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Added {format(new Date(rider.created_at), "MMM d, yyyy")}
        </p>
      </CardContent>
    </Card>
  );
};

const AdminRiders = () => {
  const { riders, locations, loading, createRider, updateRider, refetch } = useRiderOps();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RiderFormData>({
    resolver: zodResolver(riderSchema),
    defaultValues: { name: "", phone: "", whatsapp_number: "", email: "" },
  });

  const onSubmit = async (data: RiderFormData) => {
    setSubmitting(true);
    const result = await createRider({
      name: data.name,
      phone: data.phone,
      whatsapp_number: data.whatsapp_number || undefined,
      email: data.email || undefined,
    });
    setSubmitting(false);
    if (result) {
      setDialogOpen(false);
      form.reset();
    }
  };

  const availableCount = riders.filter((r) => r.current_status === "available").length;
  const busyCount = riders.filter((r) => r.current_status === "busy").length;
  const offlineCount = riders.filter((r) => r.current_status === "offline").length;
  const autoAssignCount = riders.filter((r) => r.auto_assign_enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Rider Operations</h1>
          <p className="text-muted-foreground">Live rider status, workload and positions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Rider
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Rider</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Enter rider name" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="e.g. 6XXXXXXXX" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsapp_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp Number (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Defaults to phone" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="rider@email.com" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Rider"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Available", value: availableCount, className: "text-emerald-600" },
          { label: "Busy", value: busyCount, className: "text-amber-600" },
          { label: "Offline", value: offlineCount, className: "text-muted-foreground" },
          { label: "Auto-assign on", value: autoAssignCount, className: "" },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-3xl font-bold", s.className)}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RiderLiveMap locations={locations} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : riders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No riders yet</p>
          <p className="text-sm">Add your first rider to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {riders.map((rider) => (
            <RiderCard key={rider.id} rider={rider} onUpdate={updateRider} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRiders;
