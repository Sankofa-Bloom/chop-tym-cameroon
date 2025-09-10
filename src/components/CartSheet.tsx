import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string;
}

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  total: number;
  onCheckout: () => void;
}

const cartVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 200
    }
  },
  exit: { 
    x: "100%",
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 300
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 200
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2 }
  }
};

export const CartSheet = ({ isOpen, onClose, items, setItems, total, onCheckout }: CartSheetProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const updateQuantity = (id: string, restaurantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id, restaurantId);
      return;
    }
    
    setItems(items.map(item => 
      item.id === id && item.restaurantId === restaurantId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const removeItem = (id: string, restaurantId: string) => {
    setItems(items.filter(item => !(item.id === id && item.restaurantId === restaurantId)));
  };

  const deliveryFee = 500;
  const finalTotal = total + deliveryFee;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md p-0 bg-background/95 backdrop-blur-lg border-l border-border/50"
      >
        <motion.div
          variants={cartVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col h-full"
        >
          {/* Header */}
          <SheetHeader className="p-4 sm:p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg font-heading">Your Cart</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full p-6 text-center"
              >
                <div className="p-4 bg-muted/30 rounded-full mb-4">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground text-sm">
                  Start adding some delicious dishes to get started!
                </p>
              </motion.div>
            ) : (
              <div className="p-4 sm:p-6 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.restaurantId}`}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="bg-card/50 rounded-xl p-4 border border-border/50 shadow-soft"
                    >
                      <div className="flex gap-3">
                        <motion.img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover shadow-soft"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1 text-balance">{item.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{item.restaurant}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-background rounded-lg p-1">
                                <motion.div whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.restaurantId, item.quantity - 1)}
                                    className="h-6 w-6 p-0 hover:bg-muted"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                </motion.div>
                                
                                <motion.span 
                                  key={item.quantity}
                                  initial={{ scale: 1.2 }}
                                  animate={{ scale: 1 }}
                                  className="text-sm font-medium min-w-[1.5rem] text-center"
                                >
                                  {item.quantity}
                                </motion.span>
                                
                                <motion.div whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.restaurantId, item.quantity + 1)}
                                    className="h-6 w-6 p-0 hover:bg-muted"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </motion.div>
                              </div>
                              
                              <motion.div whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id, item.restaurantId)}
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Order Summary and Action Buttons - positioned after items */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  <div className="bg-card/50 rounded-xl p-4 border border-border/50 shadow-soft">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span className="font-medium">{formatPrice(total)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery fee</span>
                        <span className="font-medium">{formatPrice(deliveryFee)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Total</span>
                        <motion.span 
                          key={finalTotal}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          className="font-bold text-xl text-primary font-heading"
                        >
                          {formatPrice(finalTotal)}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="outline"
                        onClick={onClose}
                        className="w-full h-12 text-base font-semibold border-2 hover:bg-muted/50 transition-all duration-300"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Continue Shopping
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        onClick={onCheckout}
                        className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary-dark text-primary-foreground shadow-medium hover:shadow-strong transition-all duration-300"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Proceed to Checkout
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

        </motion.div>
      </SheetContent>
    </Sheet>
  );
};