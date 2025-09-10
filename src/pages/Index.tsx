import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { CustomOrderCard } from "@/components/CustomOrderCard";
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
  const [activeTab, setActiveTab] = useState("home");
  const [showSearch, setShowSearch] = useState(false);

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "search") {
      setShowSearch(true);
      // Focus search input after a short delay
      setTimeout(() => {
        document.getElementById('main-search-input')?.focus();
      }, 100);
    } else if (tab === "home") {
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleCartClick = () => {
    document.getElementById('cart-trigger')?.click();
  };

  const handleSearchClick = () => {
    setShowSearch(true);
    setTimeout(() => {
      document.getElementById('main-search-input')?.focus();
    }, 100);
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
              
              {/* Conditional Search Bar */}
              <AnimatePresence>
                {showSearch && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="main-search-input"
                        placeholder="Search for dishes, restaurants, or cuisines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-base border-2 focus:border-primary/50 rounded-xl bg-background/95 backdrop-blur-sm"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
            {/* Hero Section - Welcome CTA */}
            <motion.section 
              className="mb-8 sm:mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-repeat opacity-30" style={{
                    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#ffffff" fill-opacity="0.1"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>')}")`
                  }} />
                </div>
                
                <CardContent className="relative z-10 p-6 sm:p-8 lg:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center max-w-2xl mx-auto"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                    >
                      <MapPin className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4 text-white text-balance"
                    >
                      Welcome to <span className="text-yellow-300">{selectedTown}</span>
                    </motion.h2>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-white/90 mb-8 text-lg sm:text-xl text-pretty leading-relaxed"
                    >
                      Experience culinary excellence delivered to your doorstep. 
                      Premium quality meals from the finest restaurants in {selectedTown}.
                    </motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
                    >
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                        <Clock className="w-5 h-5 text-yellow-300" />
                        <span className="text-white font-medium">Fast Delivery</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                        <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                        <span className="text-white font-medium">Premium Quality</span>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0 }}
                    >
                      <Button 
                        size="lg" 
                        className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold px-8 py-4 text-lg rounded-full border-2 border-white/20"
                        onClick={() => handleSearchClick()}
                      >
                        Start Ordering Now
                      </Button>
                    </motion.div>
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
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">Admin Panel</Link>
                </Button>
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

          <BottomNavigation 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onCartClick={handleCartClick}
            cartItemCount={cartItemCount}
            onSearchClick={handleSearchClick}
          />
          
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