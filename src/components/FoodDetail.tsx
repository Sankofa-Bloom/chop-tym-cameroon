import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Star, Clock, Minus, Plus, MapPin, Check } from "lucide-react";
import { Dish, useRestaurantsByDish } from "@/hooks/useRealTimeData";
import { useDishComplements, DishComplement } from "@/hooks/useComplements";

interface FoodDetailProps {
  dish: Dish;
  onBack: () => void;
  onAddToCart: (dish: any, quantity: number, restaurantId: string, price: number, complements?: SelectedComplement[]) => void;
}

interface SelectedComplement {
  complement_id: string;
  name: string;
  price: number;
  quantity: number;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: 300
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: -300
  }
};

const pageTransition = {
  type: "tween" as const,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
  duration: 0.5
};

export const FoodDetail = ({ dish, onBack, onAddToCart }: FoodDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [selectedComplements, setSelectedComplements] = useState<Record<string, number>>({});
  const { restaurantDishes, loading } = useRestaurantsByDish(dish.id);
  const { dishComplements, loading: complementsLoading } = useDishComplements(dish.id);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} F`;
  };

  const selectedRestaurantDish = restaurantDishes.find(rd => rd.restaurant_id === selectedRestaurant);
  
  // Calculate complement prices
  const complementsTotal = dishComplements.reduce((total, dishComplement) => {
    const selectedQuantity = selectedComplements[dishComplement.complement_id] || 0;
    return total + (dishComplement.complement.price * selectedQuantity);
  }, 0);
  
  const totalPrice = ((selectedRestaurantDish?.price || 0) + complementsTotal) * quantity;

  const handleComplementQuantityChange = (complementId: string, newQuantity: number, maxQuantity: number) => {
    const clampedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
    setSelectedComplements(prev => ({
      ...prev,
      [complementId]: clampedQuantity
    }));
  };

  const handleAddToCart = () => {
    if (!selectedRestaurantDish) return;
    
    // Check if all required complements are selected
    const requiredComplements = dishComplements.filter(dc => dc.is_required);
    const missingRequired = requiredComplements.some(dc => 
      !selectedComplements[dc.complement_id] || selectedComplements[dc.complement_id] === 0
    );
    
    if (missingRequired) {
      alert("Please select all required complements");
      return;
    }
    
    // Format selected complements for cart
    const selectedComplementsForCart: SelectedComplement[] = dishComplements
      .filter(dc => selectedComplements[dc.complement_id] > 0)
      .map(dc => ({
        complement_id: dc.complement_id,
        name: dc.complement.name,
        price: dc.complement.price,
        quantity: selectedComplements[dc.complement_id]
      }));
    
    onAddToCart(dish, quantity, selectedRestaurantDish.restaurant_id, selectedRestaurantDish.price, selectedComplementsForCart);
    onBack();
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background"
    >
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-soft"
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>
          <h1 className="font-heading font-semibold text-lg">Dish Details</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto">
        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative h-64 sm:h-80 lg:h-96 overflow-hidden"
        >
          <img 
            src={dish.image_url} 
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-6 left-6 right-6"
          >
            <Badge className="mb-4 bg-primary/90 text-primary-foreground hover:bg-primary shadow-soft backdrop-blur-sm">
              {dish.category}
            </Badge>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-2 text-balance">
              {dish.name}
            </h1>
            <p className="text-white/90 text-pretty max-w-2xl">
              {dish.description}
            </p>
          </motion.div>
        </motion.div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Restaurant Selection */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-heading font-semibold text-xl sm:text-2xl mb-4 sm:mb-6">
              Choose Your Restaurant
            </h2>
            
            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="bg-muted/30 rounded-xl h-20"
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                  {restaurantDishes.map((rd, index) => (
                    <motion.div
                      key={rd.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 hover:shadow-medium border-2 ${
                          selectedRestaurant === rd.restaurant_id 
                            ? 'border-primary bg-primary/5 shadow-medium' 
                            : 'border-border hover:border-primary/30 bg-card/50'
                        }`}
                        onClick={() => setSelectedRestaurant(rd.restaurant_id)}
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img 
                                  src={rd.restaurant.image_url} 
                                  alt={rd.restaurant.name}
                                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover shadow-soft"
                                />
                                {selectedRestaurant === rd.restaurant_id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1"
                                  >
                                    <Check className="h-3 w-3" />
                                  </motion.div>
                                )}
                              </div>
                              
                              <div className="space-y-1">
                                <h3 className="font-semibold text-base sm:text-lg">{rd.restaurant.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{rd.restaurant.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{rd.restaurant.delivery_time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-lg sm:text-xl font-bold text-primary font-heading">
                                {formatPrice(rd.price)}
                              </span>
                              <p className="text-xs text-muted-foreground">per item</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.section>

          {/* Quantity & Total */}
          <AnimatePresence>
            {selectedRestaurant && (
              <motion.section
                initial={{ opacity: 0, y: 30, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -30, height: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-medium">
                  <CardContent className="p-6 sm:p-8">
                    <div className="space-y-6">
                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Quantity</h3>
                          <p className="text-sm text-muted-foreground">How many would you like?</p>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-background rounded-xl p-2 shadow-soft">
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              disabled={quantity <= 1}
                              className="h-10 w-10 p-0 hover:bg-muted"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          
                          <motion.span 
                            key={quantity}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-lg font-bold min-w-[3rem] text-center"
                          >
                            {quantity}
                          </motion.span>
                          
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQuantity(quantity + 1)}
                              className="h-10 w-10 p-0 hover:bg-muted"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>

                      {/* Complements Section */}
                      {dishComplements.length > 0 && (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">Complements</h3>
                            <p className="text-sm text-muted-foreground">Customize your order</p>
                          </div>
                          
                          <div className="space-y-3">
                            {dishComplements.map((dishComplement) => (
                              <div 
                                key={dishComplement.id}
                                className={`bg-background/70 rounded-lg p-4 border ${
                                  dishComplement.is_required ? 'border-destructive/30 bg-destructive/5' : 'border-border'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium">{dishComplement.complement.name}</h4>
                                      {dishComplement.is_required && (
                                        <Badge variant="destructive" className="text-xs">Required</Badge>
                                      )}
                                    </div>
                                    {dishComplement.complement.description && (
                                      <p className="text-sm text-muted-foreground">
                                        {dishComplement.complement.description}
                                      </p>
                                    )}
                                    <p className="text-sm font-medium text-primary mt-1">
                                      +{formatPrice(dishComplement.complement.price)} each
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 bg-background rounded-lg p-1 shadow-soft">
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleComplementQuantityChange(
                                          dishComplement.complement_id, 
                                          (selectedComplements[dishComplement.complement_id] || 0) - 1,
                                          dishComplement.max_quantity
                                        )}
                                        disabled={(selectedComplements[dishComplement.complement_id] || 0) <= 0}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                    </motion.div>
                                    
                                    <span className="text-sm font-medium min-w-[2rem] text-center">
                                      {selectedComplements[dishComplement.complement_id] || 0}
                                    </span>
                                    
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleComplementQuantityChange(
                                          dishComplement.complement_id,
                                          (selectedComplements[dishComplement.complement_id] || 0) + 1,
                                          dishComplement.max_quantity
                                        )}
                                        disabled={(selectedComplements[dishComplement.complement_id] || 0) >= dishComplement.max_quantity}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </motion.div>
                                  </div>
                                </div>
                                
                                {dishComplement.max_quantity > 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    Max: {dishComplement.max_quantity}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Price Summary */}
                        <div className="bg-background/50 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Price per item</span>
                            <span className="font-medium">{formatPrice(selectedRestaurantDish?.price || 0)}</span>
                          </div>
                          {complementsTotal > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Complements</span>
                              <span className="font-medium">{formatPrice(complementsTotal)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span>Quantity</span>
                            <span className="font-medium">×{quantity}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">Total</span>
                            <motion.span 
                              key={totalPrice}
                              initial={{ scale: 1.1 }}
                              animate={{ scale: 1 }}
                              className="text-2xl font-bold text-primary font-heading"
                            >
                              {formatPrice(totalPrice)}
                            </motion.span>
                          </div>
                        </div>

                      {/* Add to Cart Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={handleAddToCart}
                          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary-dark text-primary-foreground shadow-medium hover:shadow-strong transition-all duration-300"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add {quantity} to Cart
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};