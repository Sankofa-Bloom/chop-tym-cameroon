import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";
import { Dish } from "@/hooks/useRealTimeData";

interface FoodCardProps {
  dish: Dish & {
    minPrice: number;
    maxPrice: number;
    restaurantCount: number;
    avgRating: number;
  };
  onViewDetail: (dish: Dish) => void;
  index?: number;
}

export const FoodCard = ({ dish, onViewDetail, index = 0 }: FoodCardProps) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} F`;
  };

  const formatPriceRange = (min: number, max: number) => {
    if (min === max) return formatPrice(min);
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group"
    >
      <Card className="overflow-hidden hover-lift cursor-pointer border-0 card-premium">
        <motion.div 
          className="relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={dish.image_url} 
            alt={dish.name}
            className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="absolute top-3 left-3 bg-primary/95 text-primary-foreground hover:bg-primary shadow-strong backdrop-blur-sm border border-primary/20">
              {dish.category}
            </Badge>
          </motion.div>

          <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-strong border border-primary/10">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-foreground">
                {dish.avgRating > 0 ? dish.avgRating.toFixed(1) : '4.5'}
              </span>
            </div>
          </div>
        </motion.div>

        <CardContent className="p-4 sm:p-6 bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div>
              <h3 className="font-heading font-semibold text-lg sm:text-xl mb-2 text-balance group-hover:text-gradient transition-all duration-300">
                {dish.name}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{dish.restaurantCount} restaurant{dish.restaurantCount > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>25-35 min</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">
              {dish.description}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-bold text-gradient font-heading">
                  {formatPriceRange(dish.minPrice, dish.maxPrice)}
                </span>
                <p className="text-xs text-muted-foreground">Starting from</p>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => onViewDetail(dish)}
                  className="gradient-prestigious text-primary-foreground shadow-strong hover:shadow-gold transition-all duration-300 border border-primary/20"
                  size="sm"
                >
                  View Details
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};