import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, RefreshCw, Clock, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { ManualOrderForm } from "@/components/admin/operations/ManualOrderForm";
import { OrderCard } from "@/components/admin/operations/OrderCard";
import { useOperationalOrders, OperationalOrderStatus } from "@/hooks/useOperationalOrders";

type ViewFilter = "all" | "today" | "pending" | "delayed" | "delivered" | "cancelled" | "failed";

const AdminOperations = () => {
  const [activeView, setActiveView] = useState<ViewFilter>("today");
  const [searchQuery, setSearchQuery] = useState("");

  const statusFilter = activeView === "all" || activeView === "today" || activeView === "delayed"
    ? activeView
    : activeView as OperationalOrderStatus;

  const { orders, loading, refetch, updateOrderStatus, assignRider, softDeleteOrder } = 
    useOperationalOrders(statusFilter);

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.reference_id.toLowerCase().includes(query) ||
      order.customer_name.toLowerCase().includes(query) ||
      order.customer_phone.includes(query)
    );
  });

  // Stats for header
  const todayOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const delayedOrders = orders.filter(
    (o) =>
      (o.status === "pending" || o.status === "assigned") &&
      new Date(o.created_at).getTime() < Date.now() - 60 * 60 * 1000
  ).length;

  const viewTabs: { value: ViewFilter; label: string; icon: React.ReactNode }[] = [
    { value: "today", label: "Today", icon: <Clock className="w-4 h-4" /> },
    { value: "pending", label: "Pending", icon: <Package className="w-4 h-4" /> },
    { value: "delayed", label: "Delayed", icon: <AlertTriangle className="w-4 h-4" /> },
    { value: "delivered", label: "Completed", icon: <CheckCircle className="w-4 h-4" /> },
    { value: "all", label: "All Orders", icon: null },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Operations Dashboard</h1>
          <p className="text-muted-foreground">Manage orders, assign riders, track deliveries</p>
        </div>
        <ManualOrderForm onSuccess={refetch} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card className={delayedOrders > 0 ? "border-red-500 bg-red-50 dark:bg-red-950/20" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {delayedOrders > 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
              Delayed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${delayedOrders > 0 ? "text-red-600" : ""}`}>
              {delayedOrders}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID, name, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={refetch} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as ViewFilter)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {viewTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeView} className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm">
                {searchQuery
                  ? "Try a different search term"
                  : "Create a new order to get started"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={updateOrderStatus}
                  onRiderAssign={assignRider}
                  onArchive={softDeleteOrder}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOperations;
