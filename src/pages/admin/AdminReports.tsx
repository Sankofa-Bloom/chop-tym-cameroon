import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Calendar } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface ReportData {
  orders: any[];
  serviceRequests: any[];
  restaurants: any[];
  towns: any[];
}

export default function AdminReports() {
  const [data, setData] = useState<ReportData>({
    orders: [],
    serviceRequests: [],
    restaurants: [],
    towns: [],
  });
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<string>("orders");
  const [dateRange, setDateRange] = useState<string>("30");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      const daysAgo = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      // Fetch service requests (orders with service_type in notes)
      const serviceRequests = orders?.filter(o => 
        o.notes?.includes('Service Type:') || o.payment_method === 'pay-on-delivery-service'
      ) || [];

      // Fetch restaurants
      const { data: restaurants } = await supabase
        .from('restaurants')
        .select('*');

      // Fetch towns
      const { data: towns } = await supabase
        .from('towns')
        .select('*');

      setData({
        orders: orders || [],
        serviceRequests,
        restaurants: restaurants || [],
        towns: towns || [],
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type: string) => {
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'orders':
        csvContent = [
          ['Order #', 'Customer', 'Phone', 'Town', 'Total', 'Status', 'Payment Method', 'Date'].join(','),
          ...data.orders.map(o => [
            o.order_number,
            o.customer_name.replace(/,/g, ';'),
            o.customer_phone,
            o.town,
            o.total,
            o.payment_status,
            o.payment_method,
            new Date(o.created_at).toISOString(),
          ].join(','))
        ].join('\n');
        filename = `orders-report-${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'services':
        csvContent = [
          ['Order #', 'Customer', 'Phone', 'Total', 'Status', 'Date', 'Notes'].join(','),
          ...data.serviceRequests.map(o => [
            o.order_number,
            o.customer_name.replace(/,/g, ';'),
            o.customer_phone,
            o.total,
            o.payment_status,
            new Date(o.created_at).toISOString(),
            (o.notes || '').replace(/,/g, ';').replace(/\n/g, ' '),
          ].join(','))
        ].join('\n');
        filename = `service-requests-report-${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'restaurants':
        csvContent = [
          ['Name', 'Town', 'Rating', 'Open', 'Delivery Time'].join(','),
          ...data.restaurants.map(r => [
            r.name.replace(/,/g, ';'),
            r.town,
            r.rating,
            r.is_open_now ? 'Yes' : 'No',
            r.delivery_time,
          ].join(','))
        ].join('\n');
        filename = `restaurants-report-${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'summary':
        const totalOrders = data.orders.length;
        const completedOrders = data.orders.filter(o => o.payment_status === 'completed');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
        const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
        
        csvContent = [
          'ChopTym Summary Report',
          `Report Date,${new Date().toISOString()}`,
          `Period,Last ${dateRange} days`,
          '',
          'Metric,Value',
          `Total Orders,${totalOrders}`,
          `Completed Orders,${completedOrders.length}`,
          `Pending Orders,${data.orders.filter(o => o.payment_status === 'pending').length}`,
          `Total Revenue,${totalRevenue}`,
          `Average Order Value,${avgOrderValue.toFixed(0)}`,
          `Service Requests,${data.serviceRequests.length}`,
          `Total Restaurants,${data.restaurants.length}`,
          `Active Towns,${data.towns.filter(t => t.is_active).length}`,
        ].join('\n');
        filename = `summary-report-${new Date().toISOString().split('T')[0]}.csv`;
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate and export reports (Read-Only)</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  const completedOrders = data.orders.filter(o => o.payment_status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate and export reports (Read-Only)</p>
          </div>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Export Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-violet-600" />
                Summary Report
              </CardTitle>
              <CardDescription>Overall business metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => exportReport('summary')} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                Orders Report
              </CardTitle>
              <CardDescription>{data.orders.length} orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => exportReport('orders')} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-emerald-600" />
                Services Report
              </CardTitle>
              <CardDescription>{data.serviceRequests.length} requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => exportReport('services')} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-amber-600" />
                Restaurants
              </CardTitle>
              <CardDescription>{data.restaurants.length} restaurants</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => exportReport('restaurants')} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Period Summary (Last {dateRange} days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{data.orders.length}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-emerald-600">{completedOrders.length}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Service Requests</p>
                <p className="text-2xl font-bold text-blue-600">{data.serviceRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders Preview</CardTitle>
            <CardDescription>Latest 10 orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Town</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.orders.slice(0, 10).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>{order.town}</TableCell>
                    <TableCell>{formatPrice(order.total)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.payment_status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        order.payment_status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.payment_status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
