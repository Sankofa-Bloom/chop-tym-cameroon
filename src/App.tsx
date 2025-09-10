import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRestaurants from "./pages/admin/AdminRestaurants";
import AdminDishes from "./pages/admin/AdminDishes";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminTowns from "./pages/AdminTowns";
import AdminZones from "./pages/admin/AdminZones";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/restaurants" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminRestaurants /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/dishes" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminDishes /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/menu" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminMenu /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminOrders /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/towns" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminTowns /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/zones" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminZones /></AdminLayout>
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
