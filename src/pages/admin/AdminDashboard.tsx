import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, ChefHat, ShoppingBag, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalRestaurants: number;
  totalDishes: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRestaurants: 0,
    totalDishes: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch restaurants count
        const { count: restaurantsCount } = await supabase
          .from('restaurants')
          .select('*', { count: 'exact', head: true });

        // Fetch dishes count
        const { count: dishesCount } = await supabase
          .from('dishes')
          .select('*', { count: 'exact', head: true });

        // Fetch orders count and total revenue
        const { data: orders, count: ordersCount } = await supabase
          .from('orders')
          .select('total', { count: 'exact' });

        const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

        setStats({
          totalRestaurants: restaurantsCount || 0,
          totalDishes: dishesCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue: totalRevenue / 100, // Convert from cents to dollars
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Restaurants",
      value: stats.totalRestaurants,
      icon: Store,
      color: "text-blue-600",
    },
    {
      title: "Total Dishes",
      value: stats.totalDishes,
      icon: ChefHat,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your ChopTym platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                Total {card.title.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">
                Manage your restaurant platform from this central dashboard.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Add new restaurants and dishes</li>
                <li>• Manage menu items and pricing</li>
                <li>• Track orders and revenue</li>
                <li>• Monitor platform performance</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Recent platform activity will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}