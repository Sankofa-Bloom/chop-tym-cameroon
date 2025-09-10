import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
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
  Menu, 
  ShoppingBag,
  Settings
} from "lucide-react";
import { AdminAuth } from "./AdminAuth";

const sidebarItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Restaurants", url: "/admin/restaurants", icon: Store },
  { title: "Dishes", url: "/admin/dishes", icon: ChefHat },
  { title: "Menu Management", url: "/admin/menu", icon: Menu },
  { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();

  const handleAuthStateChange = (user: User | null, session: Session | null) => {
    setUser(user);
    setSession(session);
  };

  if (!user) {
    return <AdminAuth onAuthStateChange={handleAuthStateChange} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar currentPath={location.pathname} />
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">ChopTym Admin</h1>
            </div>
          </header>

          <AdminAuth onAuthStateChange={handleAuthStateChange} />
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar({ currentPath }: { currentPath: string }) {
  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ChopTym Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
}