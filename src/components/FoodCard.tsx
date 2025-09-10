import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { Dish } from "@/hooks/useRealTimeData";

interface FoodCardProps {
  dish: Dish & {
    minPrice: number;
    maxPrice: number;
    restaurantCount: number;
    avgRating: number;
  };
  onViewDetail: (dish: Dish) => void;
}

export const FoodCard = ({ dish, onViewDetail }: FoodCardProps) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} F`;
  };

  const formatPriceRange = (min: number, max: number) => {
    if (min === max) return formatPrice(min);
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative">
        <img 
          src={dish.image_url} 
          alt={dish.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-2 left-2 bg-white/90 text-gray-800 hover:bg-white">
          {dish.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">{dish.avgRating.toFixed(1)}</span>
        </div>
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
          {dish.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {dish.restaurantCount} restaurant{dish.restaurantCount > 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {dish.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPriceRange(dish.minPrice, dish.maxPrice)}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetail(dish)}
            className="group-hover:bg-primary group-hover:text-white transition-colors"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};