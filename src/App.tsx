import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import HowItWorks from "./pages/HowItWorks";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import OrderConfirmation from "./pages/OrderConfirmation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { RestaurantManagement } from "@/components/admin/RestaurantManagement";
import { DeliveryManagement } from "@/components/admin/DeliveryManagement";
import { OrdersManagement } from "@/components/admin/OrdersManagement";
import { ServiceRequestsManagement } from "@/components/admin/ServiceRequestsManagement";
import AdminComplements from "./pages/admin/AdminComplements";
import AdminPaymentMethods from "./pages/admin/AdminPaymentMethods";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminFinance from "./pages/admin/AdminFinance";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminInsights from "./pages/admin/AdminInsights";
import AdminReports from "./pages/admin/AdminReports";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCustomerDetail from "./pages/admin/AdminCustomerDetail";
import AdminWhatsApp from "./pages/admin/AdminWhatsApp";
import AdminRiders from "./pages/admin/AdminRiders";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { AIChatAssistant } from "@/components/AIChatAssistant";
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
        <AIChatAssistant />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/order" element={<Index />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/resources" element={<Resources />} />
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
            <Route path="/admin/payment-methods" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminPaymentMethods /></AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedAdminRoute>
                <AdminLayout><OrdersManagement /></AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/services" element={
              <ProtectedAdminRoute>
                <AdminLayout><ServiceRequestsManagement /></AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminSettings /></AdminLayout>
              </ProtectedAdminRoute>
            } />
            
            {/* Finance Zone Routes */}
            <Route path="/admin/finance" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminFinance /></AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/transactions" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminTransactions /></AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/revenue" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminRevenue /></AdminLayout>
              </ProtectedAdminRoute>
            } />
            
            {/* Insights Zone Routes */}
            <Route path="/admin/insights" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminInsights /></AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminReports /></AdminLayout>
              </ProtectedAdminRoute>
            } />

            {/* Customer & WhatsApp Operations */}
            <Route path="/admin/customers" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminCustomers /></AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/customers/:id" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminCustomerDetail /></AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/riders" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminRiders /></AdminLayout>
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/whatsapp" element={
              <ProtectedAdminRoute>
                <AdminLayout><AdminWhatsApp /></AdminLayout>
              </ProtectedAdminRoute>
            } />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
