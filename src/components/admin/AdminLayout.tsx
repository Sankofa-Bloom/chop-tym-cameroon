import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Store, 
  ChefHat, 
  ShoppingBag,
  MapPin,
  Zap,
  Settings,
  CreditCard,
  DollarSign,
  TrendingUp,
  BarChart3,
  FileText,
  Receipt,
  ChevronDown,
  Cog,
  Eye,
  LogOut,
  Users,
  MessageCircle
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminZones, AdminZone } from "@/hooks/useAdminZones";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const zoneConfig: Record<AdminZone, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  operations: {
    label: "Operations",
    icon: Cog,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  finance: {
    label: "Finance",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  insights: {
    label: "Insights",
    icon: Eye,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
};

const sidebarItems: Record<AdminZone, Array<{ title: string; url: string; icon: React.ElementType }>> = {
  operations: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
    { title: "Customers", url: "/admin/customers", icon: Users },
    { title: "WhatsApp Ops", url: "/admin/whatsapp", icon: MessageCircle },
    { title: "Service Requests", url: "/admin/services", icon: Zap },
    { title: "Restaurants", url: "/admin/restaurants", icon: Store },
    { title: "Dishes & Complements", url: "/admin/complements", icon: ChefHat },
    { title: "Delivery Zones", url: "/admin/delivery", icon: MapPin },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ],
  finance: [
    { title: "Finance Overview", url: "/admin/finance", icon: DollarSign },
    { title: "Transactions", url: "/admin/finance/transactions", icon: Receipt },
    { title: "Payment Methods", url: "/admin/payment-methods", icon: CreditCard },
    { title: "Revenue", url: "/admin/finance/revenue", icon: TrendingUp },
  ],
  insights: [
    { title: "Analytics", url: "/admin/insights", icon: BarChart3 },
    { title: "Reports", url: "/admin/insights/reports", icon: FileText },
  ],
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading: authLoading, signOut } = useAdminAuth();
  const { 
    currentZone, 
    setCurrentZone, 
    availableZones, 
    loading: zonesLoading,
    isSuperAdmin,
    canAccessOperations,
    canAccessFinance,
    canAccessInsights,
  } = useAdminZones();
  const location = useLocation();
  const navigate = useNavigate();

  const loading = authLoading || zonesLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has any admin access
  const hasAnyAdminAccess = canAccessOperations || canAccessFinance || canAccessInsights;

  if (!user || !hasAnyAdminAccess) {
    navigate("/admin/login", { replace: true });
    return null;
  }

  const currentZoneConfig = zoneConfig[currentZone];
  const currentSidebarItems = sidebarItems[currentZone];

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          currentPath={location.pathname} 
          currentZone={currentZone}
          items={currentSidebarItems}
          zoneConfig={currentZoneConfig}
          onSignOut={handleSignOut}
        />
        
        <SidebarInset className="flex-1">
          <header className={cn(
            "flex h-16 shrink-0 items-center gap-2 border-b px-4",
            currentZoneConfig.bgColor,
            currentZoneConfig.borderColor
          )}>
            <SidebarTrigger className="-ml-1" />
            
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-lg font-semibold">ChopTym Admin</h1>
              
              {/* Zone Switcher Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "gap-2",
                      currentZoneConfig.bgColor,
                      currentZoneConfig.borderColor,
                      currentZoneConfig.color
                    )}
                  >
                    <currentZoneConfig.icon className="h-4 w-4" />
                    {currentZoneConfig.label}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {availableZones.map((zone) => {
                    const config = zoneConfig[zone];
                    return (
                      <DropdownMenuItem 
                        key={zone}
                        onClick={() => {
                          setCurrentZone(zone);
                          // Navigate to the first item of the new zone
                          navigate(sidebarItems[zone][0].url);
                        }}
                        className={cn(
                          "gap-2 cursor-pointer",
                          currentZone === zone && config.bgColor
                        )}
                      >
                        <config.icon className={cn("h-4 w-4", config.color)} />
                        <span>{config.label}</span>
                        {currentZone === zone && (
                          <span className="ml-auto text-xs text-muted-foreground">Active</span>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isSuperAdmin && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                Super Admin
              </span>
            )}
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

interface AppSidebarProps {
  currentPath: string;
  currentZone: AdminZone;
  items: Array<{ title: string; url: string; icon: React.ElementType }>;
  zoneConfig: {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
  };
  onSignOut: () => void;
}

function AppSidebar({ currentPath, currentZone, items, zoneConfig, onSignOut }: AppSidebarProps) {
  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn("flex items-center gap-2", zoneConfig.color)}>
            <zoneConfig.icon className="h-4 w-4" />
            {zoneConfig.label} Zone
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sign Out at bottom */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSignOut} className="text-destructive hover:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
