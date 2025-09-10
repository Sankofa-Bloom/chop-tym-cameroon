import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Star, Users } from "lucide-react";
import { FoodCard } from "@/components/FoodCard";
import { FoodDetail } from "@/components/FoodDetail";
import { CartSheet } from "@/components/CartSheet";
import { CheckoutForm } from "@/components/CheckoutForm";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { TownSelector } from "@/components/TownSelector";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useRestaurants, useDishes, useRestaurantDishes, Dish } from "@/hooks/useRealTimeData";

type AppState = "browsing" | "detail" | "checkout" | "confirmation";

interface CartItem {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string;
}

export default function Index() {
  const [selectedTown, setSelectedTown] = useState("Douala");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appState, setAppState] = useState<AppState>("browsing");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  // Fetch data from database
  const { restaurants, loading: restaurantsLoading } = useRestaurants();
  const { dishes, loading: dishesLoading } = useDishes();
  const { restaurantDishes, loading: restaurantDishesLoading } = useRestaurantDishes();

  // Transform data for display
  const dishesWithPricing = useMemo(() => {
    return dishes.map(dish => {
      const dishRestaurants = restaurantDishes.filter(rd => rd.dish_id === dish.id);
      const prices = dishRestaurants.map(rd => rd.price);
      const ratings = dishRestaurants.map(rd => rd.restaurant.rating);
      
      return {
        ...dish,
        minPrice: Math.min(...prices) || 0,
        maxPrice: Math.max(...prices) || 0,
        restaurantCount: dishRestaurants.length,
        avgRating: ratings.reduce((a, b) => a + b, 0) / ratings.length || 0,
      };
    }).filter(dish => dish.restaurantCount > 0);
  }, [dishes, restaurantDishes]);

  const addToCart = (dish: Dish, quantity: number, restaurantId: string, price: number) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const existingItem = cart.find(item => 
      item.id === dish.id && item.restaurantId === restaurantId
    );
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === dish.id && item.restaurantId === restaurantId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: dish.id,
        name: dish.name,
        restaurant: restaurant?.name || 'Unknown Restaurant',
        price,
        quantity,
        image: dish.image_url,
        restaurantId,
      };
      setCart([...cart, newItem]);
    }
  };

  const handleViewDetail = (dish: Dish) => {
    setSelectedDish(dish);
    setAppState("detail");
  };

  const handlePlaceOrder = async (data: any) => {
    try {
      const response = await fetch(`https://qiupqrmtxwtgipbwcvoo.supabase.co/functions/v1/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData: data })
      });

      const result = await response.json();
      
      if (result.success) {
        if (result.paymentUrl) {
          window.open(result.paymentUrl, '_blank');
        }
        
        setOrderData({
          ...data,
          orderId: result.orderId,
          orderNumber: result.orderNumber
        });
        setCart([]);
        setAppState("confirmation");
      } else {
        alert(`Error processing order: ${result.error}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleGoHome = () => {
    setAppState("browsing");
    setSelectedDish(null);
    setOrderData(null);
  };

  // Filter dishes based on search query
  const filteredDishes = searchQuery 
    ? dishesWithPricing.filter(dish => 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : dishesWithPricing;

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Render different screens based on app state
  if (appState === "detail" && selectedDish) {
    return (
      <FoodDetail
        dish={selectedDish}
        onBack={() => setAppState("browsing")}
        onAddToCart={addToCart}
      />
    );
  }

  if (appState === "checkout") {
    return (
      <CheckoutForm
        items={cart}
        total={cartTotal}
        onBack={() => setAppState("browsing")}
        onPlaceOrder={handlePlaceOrder}
      />
    );
  }

  if (appState === "confirmation" && orderData) {
    return (
      <OrderConfirmation
        orderData={orderData}
        onGoHome={handleGoHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/33b7898f-db40-4c09-88d0-be22465c7036.png" 
                alt="ChopTym"
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-xl font-bold text-primary">ChopTym</h1>
                <p className="text-xs text-muted-foreground">Right on time ⏰</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={() => document.getElementById('cart-trigger')?.click()}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>

          <TownSelector selectedTown={selectedTown} onTownChange={setSelectedTown} />
          
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Popular Restaurants */}
        <section>
          {restaurantsLoading ? (
            <div className="text-center py-8">Loading restaurants...</div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Popular Restaurants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restaurants.map((restaurant) => (
                  <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={restaurant.image_url} 
                        alt={restaurant.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{restaurant.rating}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{restaurant.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{restaurant.delivery_time}</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="text-xs">Popular</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Featured Dishes */}
        <section>
          {dishesLoading || restaurantDishesLoading ? (
            <div className="text-center py-8">Loading dishes...</div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Dishes"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDishes.map((dish) => (
                  <FoodCard
                    key={dish.id}
                    dish={dish}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>
              {filteredDishes.length === 0 && searchQuery && (
                <div className="text-center py-8 text-gray-500">
                  No dishes found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <BottomNavigation />
      
      <Sheet>
        <SheetTrigger asChild>
          <button id="cart-trigger" className="hidden" />
        </SheetTrigger>
        <CartSheet 
          isOpen={false}
          onClose={() => {}}
          items={cart}
          setItems={setCart}
          total={cartTotal}
          onCheckout={() => setAppState("checkout")}
        />
      </Sheet>
    </div>
  );
}