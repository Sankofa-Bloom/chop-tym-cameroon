import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
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
import AdminComplements from "./pages/admin/AdminComplements";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import LoadingScreen from "@/components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Show loading screen for at least 2.5 seconds to let animations complete
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return (
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
            <Route path="/admin/complements" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminComplements /></AdminLayout>
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
};

export default App;
