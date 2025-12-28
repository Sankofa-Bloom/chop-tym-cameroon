import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Users, ShoppingBag, Clock, MapPin, Store } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface InsightStats {
  totalOrders: number;
  totalRevenue: number;
  uniqueCustomers: number;
  avgDeliveryFee: number;
  ordersByTown: { name: string; value: number }[];
  ordersByHour: { hour: string; orders: number }[];
  topRestaurants: { name: string; orders: number; revenue: number }[];
  weeklyTrend: { week: string; orders: number; revenue: number }[];
}

export default function AdminInsights() {
  const [stats, setStats] = useState<InsightStats>({
    totalOrders: 0,
    totalRevenue: 0,
    uniqueCustomers: 0,
    avgDeliveryFee: 0,
    ordersByTown: [],
    ordersByHour: [],
    topRestaurants: [],
    weeklyTrend: [],
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) throw ordersError;

      // Fetch restaurants
      const { data: restaurants, error: restaurantsError } = await supabase
        .from('restaurants')
        .select('id, name');

      if (restaurantsError) throw restaurantsError;

      // Process stats
      const completedOrders = orders?.filter(o => o.payment_status === 'completed') || [];
      const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
      
      // Unique customers by phone
      const uniquePhones = new Set(orders?.map(o => o.customer_phone) || []);
      
      // Average delivery fee
      const avgDeliveryFee = orders?.length ? orders.reduce((sum, o) => sum + o.delivery_fee, 0) / orders.length : 0;

      // Orders by town
      const townMap = new Map<string, number>();
      orders?.forEach(o => {
        townMap.set(o.town, (townMap.get(o.town) || 0) + 1);
      });
      const ordersByTown = Array.from(townMap.entries()).map(([name, value]) => ({ name, value }));

      // Orders by hour
      const hourMap = new Map<number, number>();
      for (let i = 0; i < 24; i++) hourMap.set(i, 0);
      orders?.forEach(o => {
        const hour = new Date(o.created_at).getHours();
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
      });
      const ordersByHour = Array.from(hourMap.entries()).map(([hour, orders]) => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        orders,
      }));

      // Top restaurants (from order items)
      const restaurantMap = new Map<string, { orders: number; revenue: number }>();
      orders?.forEach(o => {
        if (Array.isArray(o.items)) {
          o.items.forEach((item: any) => {
            const name = item.restaurant || 'Unknown';
            const existing = restaurantMap.get(name) || { orders: 0, revenue: 0 };
            restaurantMap.set(name, {
              orders: existing.orders + 1,
              revenue: existing.revenue + (item.price * item.quantity),
            });
          });
        }
      });
      const topRestaurants = Array.from(restaurantMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Weekly trend (last 8 weeks)
      const weekMap = new Map<string, { orders: number; revenue: number }>();
      for (let i = 0; i < 8; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        const weekStr = `Week ${8 - i}`;
        weekMap.set(weekStr, { orders: 0, revenue: 0 });
      }

      completedOrders.forEach(o => {
        const orderDate = new Date(o.created_at);
        const weeksAgo = Math.floor((Date.now() - orderDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        if (weeksAgo < 8) {
          const weekStr = `Week ${8 - weeksAgo}`;
          const existing = weekMap.get(weekStr) || { orders: 0, revenue: 0 };
          weekMap.set(weekStr, {
            orders: existing.orders + 1,
            revenue: existing.revenue + o.total,
          });
        }
      });

      const weeklyTrend = Array.from(weekMap.entries()).map(([week, data]) => ({
        week,
        ...data,
      }));

      setStats({
        totalOrders: orders?.length || 0,
        totalRevenue,
        uniqueCustomers: uniquePhones.size,
        avgDeliveryFee,
        ordersByTown,
        ordersByHour,
        topRestaurants,
        weeklyTrend,
      });
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Business insights and metrics (Read-Only)</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Business insights and metrics (Read-Only)</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-violet-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Completed orders</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueCustomers}</div>
              <p className="text-xs text-muted-foreground">By phone number</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Delivery Fee</CardTitle>
              <MapPin className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.avgDeliveryFee)}</div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Revenue Trend</CardTitle>
              <CardDescription>Last 8 weeks performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number, name: string) => [
                    name === 'revenue' ? formatPrice(value) : value,
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b98133" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders by Town</CardTitle>
              <CardDescription>Geographic distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.ordersByTown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.ordersByTown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Orders by Hour
              </CardTitle>
              <CardDescription>Peak ordering times</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.ordersByHour}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" fontSize={10} interval={2} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Top Restaurants
              </CardTitle>
              <CardDescription>By revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topRestaurants.map((restaurant, index) => (
                  <div key={restaurant.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{restaurant.name}</p>
                        <p className="text-sm text-muted-foreground">{restaurant.orders} orders</p>
                      </div>
                    </div>
                    <p className="font-semibold text-emerald-600">{formatPrice(restaurant.revenue)}</p>
                  </div>
                ))}
                {stats.topRestaurants.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
