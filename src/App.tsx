import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OrderConfirmation from "./pages/OrderConfirmation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { RestaurantManagement } from "@/components/admin/RestaurantManagement";
import { DeliveryManagement } from "@/components/admin/DeliveryManagement";
import { OrdersManagement } from "@/components/admin/OrdersManagement";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAInstallPrompt />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/payment-callback" element={<OrderConfirmation />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout><DashboardOverview /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/restaurants" element={
            <ProtectedAdminRoute>
              <AdminLayout><RestaurantManagement /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/delivery" element={
            <ProtectedAdminRoute>
              <AdminLayout><DeliveryManagement /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedAdminRoute>
              <AdminLayout><OrdersManagement /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
