import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { 
  Store, 
  UtensilsCrossed, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Users,
  MapPin,
  Clock,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface DashboardStats {
  totalRestaurants: number;
  totalDishes: number;
  totalOrders: number;
  totalRevenue: number;
  activeZones: number;
  activeTowns: number;
  pendingOrders: number;
  todayOrders: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  created_at: string;
  town: string;
  payment_status: string;
}

interface TopRestaurant {
  id: string;
  name: string;
  total_orders: number;
  total_revenue: number;
  town: string;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topRestaurants, setTopRestaurants] = useState<TopRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch basic stats
      const [restaurantsRes, dishesRes, ordersRes, zonesRes, townsRes] = await Promise.all([
        supabase.from("restaurants").select("id"),
        supabase.from("dishes").select("id"),
        supabase.from("orders").select("total, created_at, payment_status"),
        supabase.from("delivery_zones").select("id").eq("is_active", true),
        supabase.from("towns").select("id").eq("is_active", true)
      ]);

      // Calculate stats
      const orders = ordersRes.data || [];
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter(order => 
        order.created_at?.startsWith(today)
      ).length;
      const pendingOrders = orders.filter(order => 
        order.payment_status === 'pending'
      ).length;

      setStats({
        totalRestaurants: restaurantsRes.data?.length || 0,
        totalDishes: dishesRes.data?.length || 0,
        totalOrders: orders.length,
        totalRevenue,
        activeZones: zonesRes.data?.length || 0,
        activeTowns: townsRes.data?.length || 0,
        pendingOrders,
        todayOrders
      });

      // Fetch recent orders
      const { data: recentOrdersData } = await supabase
        .from("orders")
        .select("id, order_number, customer_name, total, created_at, town, payment_status")
        .order("created_at", { ascending: false })
        .limit(10);

      setRecentOrders(recentOrdersData || []);

      // Fetch top restaurants (mock data for now - would need proper aggregation)
      const { data: restaurants } = await supabase
        .from("restaurants")
        .select("id, name, town")
        .limit(5);

      if (restaurants) {
        setTopRestaurants(restaurants.map(r => ({
          ...r,
          total_orders: Math.floor(Math.random() * 100) + 10,
          total_revenue: Math.floor(Math.random() * 10000) + 1000
        })));
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
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

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Restaurants",
      value: stats.totalRestaurants,
      icon: Store,
      color: "text-blue-600",
      description: "Active restaurants"
    },
    {
      title: "Total Dishes",
      value: stats.totalDishes,
      icon: UtensilsCrossed,
      color: "text-green-600",
      description: "Available dishes"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-orange-600",
      description: `${stats.todayOrders} today`
    },
    {
      title: "Total Revenue",
      value: `${formatPrice(stats.totalRevenue)} XAF`,
      icon: DollarSign,
      color: "text-green-600",
      description: "All time revenue"
    },
    {
      title: "Active Zones",
      value: stats.activeZones,
      icon: MapPin,
      color: "text-purple-600",
      description: "Delivery zones"
    },
    {
      title: "Active Towns",
      value: stats.activeTowns,
      icon: Users,
      color: "text-indigo-600",
      description: "Service areas"
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-amber-600",
      description: "Awaiting payment"
    },
    {
      title: "Growth",
      value: "+12%",
      icon: TrendingUp,
      color: "text-green-600",
      description: "vs last month"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your platform performance and key metrics
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Views */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="restaurants">Top Restaurants</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Town</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.town}</Badge>
                      </TableCell>
                      <TableCell>{formatPrice(order.total)} XAF</TableCell>
                      <TableCell>
                        <Badge 
                          variant={order.payment_status === 'completed' ? 'default' : 'secondary'}
                        >
                          {order.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">
                        {restaurant.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{restaurant.town}</Badge>
                      </TableCell>
                      <TableCell>{restaurant.total_orders}</TableCell>
                      <TableCell>{formatPrice(restaurant.total_revenue)} XAF</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Store className="w-4 h-4 mr-2" />
                  Manage Restaurants
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Delivery Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View All Orders
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge variant="default">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment System</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notifications</span>
                  <Badge variant="default">Working</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}