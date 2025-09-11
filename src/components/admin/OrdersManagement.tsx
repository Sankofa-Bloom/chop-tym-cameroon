import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Filter,
  DollarSign,
  MapPin,
  Phone,
  User,
  Package
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  town: string;
  items: any;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  payment_reference: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface OrderStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  todayOrders: number;
  totalRevenue: number;
}

const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "processing", label: "Processing", color: "bg-blue-500" },
  { value: "completed", label: "Completed", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" }
];

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTown, setFilterTown] = useState<string>("all");
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    todayOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.payment_status === 'pending').length,
      completed: orders.filter(o => o.payment_status === 'completed').length,
      cancelled: orders.filter(o => o.payment_status === 'cancelled').length,
      todayOrders: orders.filter(o => o.created_at.startsWith(today)).length,
      totalRevenue: orders
        .filter(o => o.payment_status === 'completed')
        .reduce((sum, o) => sum + o.total, 0)
    };
    
    setStats(stats);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: status })
        .eq("id", orderId);

      if (error) throw error;
      
      toast.success("Order status updated successfully");
      fetchOrders();
      
      // Update selected order if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, payment_status: status });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0];
    return (
      <Badge 
        variant={status === 'completed' ? 'default' : 'secondary'}
        className={status === 'completed' ? 'bg-green-500' : 
                  status === 'pending' ? 'bg-yellow-500' : 
                  status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'}
      >
        {statusConfig.label}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => {
    const statusMatch = filterStatus === "all" || order.payment_status === filterStatus;
    const townMatch = filterTown === "all" || order.town === filterTown;
    return statusMatch && townMatch;
  });

  const uniqueTowns = [...new Set(orders.map(order => order.town))];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage customer orders
          </p>
        </div>
        <Button onClick={fetchOrders} variant="outline">
          <Package className="w-4 h-4 mr-2" />
          Refresh Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayOrders} today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              awaiting payment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              successfully paid
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">
              cancelled orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              XAF total revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="town-filter">Town</Label>
              <Select value={filterTown} onValueChange={setFilterTown}>
                <SelectTrigger>
                  <SelectValue placeholder="All towns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Towns</SelectItem>
                  {uniqueTowns.map((town) => (
                    <SelectItem key={town} value={town}>
                      {town}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Town</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.order_number}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">{order.customer_name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.customer_phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {order.town}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {order.items?.length || 0} items
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      {formatPrice(order.total)} XAF
                    </div>
                    <div className="text-xs text-muted-foreground">
                      + {formatPrice(order.delivery_fee)} delivery
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.payment_status)}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setOrderDetailOpen(true);
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Select
                        value={order.payment_status}
                        onValueChange={(status) => updateOrderStatus(order.id, status)}
                      >
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetail order={selectedOrder} onStatusUpdate={updateOrderStatus} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderDetail({ order, onStatusUpdate }: { order: Order, onStatusUpdate: (id: string, status: string) => void }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Name</Label>
              <p className="font-semibold">{order.customer_name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
              <p className="font-semibold">{order.customer_phone}</p>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Delivery Address</Label>
            <p className="font-semibold">{order.delivery_address}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Town</Label>
            <Badge variant="outline">{order.town}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatPrice(item.price * item.quantity)} XAF</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Subtotal</Label>
              <p className="font-semibold">{formatPrice(order.subtotal)} XAF</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Delivery Fee</Label>
              <p className="font-semibold">{formatPrice(order.delivery_fee)} XAF</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Total</Label>
              <p className="text-xl font-bold">{formatPrice(order.total)} XAF</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
              <p className="font-semibold capitalize">{order.payment_method}</p>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={order.payment_status === 'completed' ? 'default' : 'secondary'}
                className={order.payment_status === 'completed' ? 'bg-green-500' : 
                          order.payment_status === 'pending' ? 'bg-yellow-500' : 
                          order.payment_status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'}
              >
                {order.payment_status}
              </Badge>
              <Select
                value={order.payment_status}
                onValueChange={(status) => onStatusUpdate(order.id, status)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {order.payment_reference && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Reference</Label>
              <p className="font-semibold">{order.payment_reference}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(order.created_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated</span>
              <span>{new Date(order.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}