import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Package, CreditCard, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items: any;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_status: string;
  payment_method: string;
  payment_reference: string | null;
  notes: string | null;
  created_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      // Get the current order to send notifications
      const currentOrder = orders.find(o => o.id === orderId);
      if (!currentOrder) {
        throw new Error('Order not found');
      }
      
      const oldStatus = currentOrder.payment_status;
      
      // Update the order status in database
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Send admin notification for status change
      try {
        const { error: notificationError } = await supabase.functions.invoke('send-status-notification', {
          body: {
            orderData: {
              orderNumber: currentOrder.order_number,
              customerName: currentOrder.customer_name,
              customerPhone: currentOrder.customer_phone,
              deliveryAddress: currentOrder.delivery_address,
              items: currentOrder.items,
              subtotal: currentOrder.subtotal,
              deliveryFee: currentOrder.delivery_fee,
              total: currentOrder.total,
              paymentReference: currentOrder.payment_reference,
              createdAt: currentOrder.created_at,
              notes: currentOrder.notes,
            },
            oldStatus,
            newStatus,
            notificationType: newStatus === 'completed' ? 'success' : newStatus === 'failed' ? 'failed' : 'status_update'
          }
        });

        if (notificationError) {
          console.error('Failed to send admin notification:', notificationError);
        }
      } catch (notificationError) {
        console.error('Error sending admin notification:', notificationError);
      }

      // Send user push notification (if PWA subscription exists)
      try {
        // Get user's push subscription from localStorage (will be implemented in PWA setup)
        const pushSubscription = localStorage.getItem('pushSubscription');
        
        if (pushSubscription) {
          const { error: pushError } = await supabase.functions.invoke('send-user-notification', {
            body: {
              orderData: {
                orderNumber: currentOrder.order_number,
                customerName: currentOrder.customer_name,
                total: currentOrder.total,
              },
              newStatus,
              subscription: JSON.parse(pushSubscription)
            }
          });

          if (pushError) {
            console.error('Failed to send push notification:', pushError);
          }
        }
      } catch (pushError) {
        console.error('Error sending push notification:', pushError);
      }
      
      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
      
      fetchOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.payment_status === statusFilter
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.payment_status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.payment_status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(orders.reduce((sum, o) => sum + o.total, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.payment_method}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.payment_status}
                      onValueChange={(value) => updatePaymentStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue>
                          <Badge className={getStatusColor(order.payment_status)}>
                            {order.payment_status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.order_number}</DialogTitle>
                        </DialogHeader>
                        
                        {selectedOrder && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold">Customer Information</h4>
                                <p>{selectedOrder.customer_name}</p>
                                <p>{selectedOrder.customer_phone}</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedOrder.delivery_address}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold">Order Information</h4>
                                <p>Payment: {selectedOrder.payment_method}</p>
                                <p>Status: {selectedOrder.payment_status}</p>
                                <p>Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, index: number) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {item.restaurant} × {item.quantity}
                                      </p>
                                    </div>
                                    <p>{formatPrice(item.price * item.quantity)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="border-t pt-4">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>{formatPrice(selectedOrder.subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Delivery Fee:</span>
                                <span>{formatPrice(selectedOrder.delivery_fee)}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-lg">
                                <span>Total:</span>
                                <span>{formatPrice(selectedOrder.total)}</span>
                              </div>
                            </div>
                            
                            {selectedOrder.notes && (
                              <div>
                                <h4 className="font-semibold">Notes</h4>
                                <p className="text-sm">{selectedOrder.notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}