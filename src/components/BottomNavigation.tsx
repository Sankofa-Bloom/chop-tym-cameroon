import { Home, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onCartClick?: () => void;
  cartItemCount?: number;
  onSearchClick?: () => void;
}

export const BottomNavigation = ({ 
  activeTab = "home", 
  onTabChange, 
  onCartClick,
  cartItemCount = 0,
  onSearchClick
}: BottomNavigationProps) => {
  const tabs = [
    { 
      id: "home", 
      label: "Home", 
      icon: Home,
      onClick: () => onTabChange?.("home")
    },
    { 
      id: "search", 
      label: "Search", 
      icon: Search,
      onClick: () => {
        onTabChange?.("search");
        onSearchClick?.();
      }
    },
    { 
      id: "cart", 
      label: "Cart", 
      icon: ShoppingCart,
      onClick: () => {
        onTabChange?.("cart");
        onCartClick?.();
      }
    },
    { 
      id: "profile", 
      label: "Profile", 
      icon: User,
      onClick: () => onTabChange?.("profile")
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={tab.onClick}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 relative",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                {tab.id === "cart" && cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};