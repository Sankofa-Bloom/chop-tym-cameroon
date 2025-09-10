import { useState } from "react";
import { Utensils, MapPin, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNavigation } from "@/components/BottomNavigation";
import { TownSelector } from "@/components/TownSelector";
import { FoodCard } from "@/components/FoodCard";
import { CartSheet } from "@/components/CartSheet";
import { CheckoutForm } from "@/components/CheckoutForm";
import { OrderConfirmation } from "@/components/OrderConfirmation";

import { FoodDetail } from "@/components/FoodDetail";

// Import beautiful generated food images
import jollofRiceHero from "@/assets/jollof-rice-hero.jpg";
import ndoleStew from "@/assets/ndole-stew.jpg";
import grilledFishAttieke from "@/assets/grilled-fish-attieke.jpg";

type AppState = "browsing" | "detail" | "checkout" | "confirmation";

// Mock data for MVP
const mockRestaurants = [
  {
    id: 1,
    name: "Mama Joy's Kitchen",
    category: "Local Cuisine",
    rating: 4.8,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Limbe Fish Grill",
    category: "Seafood",
    rating: 4.6,
    deliveryTime: "30-40 min",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Sunshine Bakery",
    category: "Bakery & Snacks",
    rating: 4.7,
    deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop"
  }
];

const mockDishes = [
  {
    id: 1,
    name: "Jollof Rice with Chicken",
    restaurant: "Mama Joy's Kitchen",
    price: 2500,
    description: "Perfectly spiced jollof rice with tender grilled chicken, served with plantain",
    image: jollofRiceHero,
    category: "Main Course"
  },
  {
    id: 2,
    name: "Grilled Fish with Attieké",
    restaurant: "Limbe Fish Grill",
    price: 3000,
    description: "Fresh grilled fish served with cassava couscous and spicy tomato sauce",
    image: grilledFishAttieke,
    category: "Seafood"
  },
  {
    id: 3,
    name: "Ndolé with Plantain",
    restaurant: "Mama Joy's Kitchen",
    price: 2800,
    description: "Traditional Cameroonian ndolé stew with beef, fish, and groundnuts",
    image: ndoleStew,
    category: "Local Cuisine"
  },
  {
    id: 4,
    name: "Fresh Croissants",
    restaurant: "Sunshine Bakery",
    price: 500,
    description: "Buttery, flaky croissants baked fresh every morning",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    category: "Bakery"
  }
];

const Index = () => {
  const [selectedTown, setSelectedTown] = useState("Limbe");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [appState, setAppState] = useState<AppState>("browsing");
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);

  const addToCart = (dish: any, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === dish.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === dish.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...dish, quantity }];
    });
  };

  const handleViewDetail = (dish: any) => {
    setSelectedDish(dish);
    setAppState("detail");
  };

  const filteredDishes = mockDishes.filter(dish => 
    dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dish.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setAppState("checkout");
  };

  const handlePlaceOrder = (data: any) => {
    setOrderData(data);
    setAppState("confirmation");
    setCartItems([]); // Clear cart after successful order
  };

  const handleGoHome = () => {
    setAppState("browsing");
    setSelectedDish(null);
    setOrderData(null);
  };

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
        items={cartItems}
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-4">
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
              onClick={() => setIsCartOpen(true)}
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
              placeholder="Search for dishes or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 chop-input"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="chop-card p-6 chop-gradient text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome to {selectedTown}! 🍽️</h2>
            <p className="text-white/90 mb-4">Your favorite meals, delivered right on time</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Delivering in {selectedTown}</span>
            </div>
          </div>
        </section>

        {/* Popular Restaurants */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" />
            Popular Restaurants
          </h3>
          <div className="grid gap-4">
            {mockRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="chop-card p-4 flex items-center gap-4">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{restaurant.name}</h4>
                  <p className="text-sm text-muted-foreground">{restaurant.category}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-secondary">★ {restaurant.rating}</span>
                    <span className="text-sm text-muted-foreground">{restaurant.deliveryTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Dishes */}
        <section>
          <h3 className="text-lg font-semibold mb-4">
            {searchQuery ? `Search Results (${filteredDishes.length})` : "Featured Dishes"}
          </h3>
          <div className="grid gap-4">
            {filteredDishes.map((dish) => (
              <FoodCard
                key={dish.id}
                dish={dish}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />
      <CartSheet 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        setItems={setCartItems}
        total={cartTotal}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Index;