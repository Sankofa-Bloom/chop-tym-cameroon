import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface FinanceStats {
  totalRevenue: number;
  completedOrders: number;
  pendingPayments: number;
  averageOrderValue: number;
  revenueChange: number;
  orderChange: number;
}

export default function AdminFinance() {
  const [stats, setStats] = useState<FinanceStats>({
    totalRevenue: 0,
    completedOrders: 0,
    pendingPayments: 0,
    averageOrderValue: 0,
    revenueChange: 0,
    orderChange: 0,
  });
  const [loading, setLoading] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    fetchFinanceStats();
  }, []);

  const fetchFinanceStats = async () => {
    try {
      // Fetch all orders
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total, payment_status, created_at');

      if (error) throw error;

      const now = new Date();
      const thisMonth = now.getMonth();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const thisYear = now.getFullYear();
      const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

      const thisMonthOrders = orders?.filter(o => {
        const date = new Date(o.created_at);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }) || [];

      const lastMonthOrders = orders?.filter(o => {
        const date = new Date(o.created_at);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      }) || [];

      const completedOrders = orders?.filter(o => o.payment_status === 'completed') || [];
      const pendingOrders = orders?.filter(o => o.payment_status === 'pending') || [];

      const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
      const pendingPayments = pendingOrders.reduce((sum, o) => sum + o.total, 0);
      
      const thisMonthRevenue = thisMonthOrders
        .filter(o => o.payment_status === 'completed')
        .reduce((sum, o) => sum + o.total, 0);
      
      const lastMonthRevenue = lastMonthOrders
        .filter(o => o.payment_status === 'completed')
        .reduce((sum, o) => sum + o.total, 0);

      const revenueChange = lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      const orderChange = lastMonthOrders.length > 0
        ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
        : 0;

      setStats({
        totalRevenue,
        completedOrders: completedOrders.length,
        pendingPayments,
        averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
        revenueChange,
        orderChange,
      });
    } catch (error) {
      console.error('Error fetching finance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Finance Overview</h1>
            <p className="text-muted-foreground">Financial metrics and performance</p>
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
          <h1 className="text-3xl font-bold">Finance Overview</h1>
          <p className="text-muted-foreground">Financial metrics and performance</p>
        </div>

        {/* Main Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stats.revenueChange >= 0 ? (
                  <>
                    <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-500">+{stats.revenueChange.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500">{stats.revenueChange.toFixed(1)}%</span>
                  </>
                )}
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedOrders}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stats.orderChange >= 0 ? (
                  <>
                    <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-500">+{stats.orderChange.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500">{stats.orderChange.toFixed(1)}%</span>
                  </>
                )}
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <TrendingDown className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.pendingPayments)}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-violet-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <CreditCard className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground mt-1">Per completed order</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/finance/transactions'}>
            <CardHeader>
              <CardTitle className="text-lg">Transaction History</CardTitle>
              <CardDescription>View and manage all financial transactions</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/payment-methods'}>
            <CardHeader>
              <CardTitle className="text-lg">Payment Methods</CardTitle>
              <CardDescription>Configure available payment options</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/finance/revenue'}>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Reports</CardTitle>
              <CardDescription>Detailed revenue analysis and trends</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
