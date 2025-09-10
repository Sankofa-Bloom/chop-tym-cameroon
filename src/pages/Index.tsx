import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, ShoppingCart, Star, Users, MapPin, Clock } from "lucide-react";
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

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween" as const,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
  duration: 0.4
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

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
  return (
    <AnimatePresence mode="wait" initial={false}>
      {appState === "detail" && selectedDish ? (
        <FoodDetail
          key="detail"
          dish={selectedDish}
          onBack={() => setAppState("browsing")}
          onAddToCart={addToCart}
        />
      ) : appState === "checkout" ? (
        <motion.div
          key="checkout"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <CheckoutForm
            items={cart}
            total={cartTotal}
            onBack={() => setAppState("browsing")}
            onPlaceOrder={handlePlaceOrder}
          />
        </motion.div>
      ) : appState === "confirmation" && orderData ? (
        <motion.div
          key="confirmation"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <OrderConfirmation
            orderData={orderData}
            onGoHome={handleGoHome}
          />
        </motion.div>
      ) : (
        <motion.div
          key="browsing"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-screen bg-transparent pb-20 relative"
        >
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="sticky top-0 z-40 header-prestigious"
          >
            <div className="container mx-auto px-4 py-4 max-w-7xl">
              <div className="flex items-center justify-between mb-6">
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <img 
                    src="/lovable-uploads/33b7898f-db40-4c09-88d0-be22465c7036.png" 
                    alt="ChopTym"
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold font-heading text-primary">ChopTym</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">Right on time ⏰</p>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative hover:bg-primary/5 hover:border-primary/30"
                    onClick={() => document.getElementById('cart-trigger')?.click()}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <AnimatePresence>
                      {cartItemCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                        >
                          {cartItemCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TownSelector selectedTown={selectedTown} onTownChange={setSelectedTown} />
              </motion.div>
              
              <motion.div 
                className="relative mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search for dishes or cuisine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-300"
                />
              </motion.div>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
            {/* Welcome Section */}
            <motion.section 
              className="mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="overflow-hidden border-0 shadow-strong card-premium">
                <CardContent className="p-6 sm:p-8 gradient-prestigious text-primary-foreground relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative z-10"
                  >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading mb-3 text-balance">
                      Welcome to {selectedTown}! 🍽️
                    </h2>
                    <p className="text-primary-foreground/90 mb-4 text-lg text-pretty">
                      Your favorite meals, delivered with prestige
                    </p>
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Premium delivery in {selectedTown}</span>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Popular Restaurants */}
            <motion.section 
              className="mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold font-heading">Popular Restaurants</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>
              
              {restaurantsLoading ? (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="bg-muted/30 rounded-xl h-32"
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {restaurants.map((restaurant, index) => (
                    <motion.div
                      key={restaurant.id}
                      variants={{
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 }
                      }}
                      whileHover={{ 
                        y: -4,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                    >
                      <Card className="overflow-hidden hover:shadow-strong transition-all duration-300 cursor-pointer border-0 card-interactive">
                        <div className="relative overflow-hidden">
                          <img 
                            src={restaurant.image_url} 
                            alt={restaurant.name}
                            className="w-full h-32 sm:h-40 object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-soft">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{restaurant.rating}</span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 text-balance">{restaurant.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-pretty">
                            {restaurant.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{restaurant.delivery_time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-primary" />
                              <span className="text-primary font-medium">Popular</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.section>

            {/* Featured Dishes */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold font-heading">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Dishes"}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>
              
              {dishesLoading || restaurantDishesLoading ? (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      className="bg-muted/30 rounded-xl h-80"
                    />
                  ))}
                </motion.div>
              ) : (
                <>
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {filteredDishes.map((dish, index) => (
                      <FoodCard
                        key={dish.id}
                        dish={dish}
                        onViewDetail={handleViewDetail}
                        index={index}
                      />
                    ))}
                  </motion.div>
                  
                  {filteredDishes.length === 0 && searchQuery && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-semibold mb-2">No dishes found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search terms or browse our featured dishes
                        </p>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </motion.section>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}