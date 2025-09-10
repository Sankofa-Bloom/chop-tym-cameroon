import { Plus, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FoodCardProps {
  dish: {
    id: number;
    name: string;
    restaurant: string;
    price: number;
    description: string;
    image: string;
    category: string;
  };
  onViewDetail: (dish: any) => void;
}

export const FoodCard = ({ dish, onViewDetail }: FoodCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="chop-card overflow-hidden cursor-pointer" onClick={() => onViewDetail(dish)}>
      <div className="aspect-[16/10] relative overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
            {dish.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">4.8</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{dish.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{dish.restaurant}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{dish.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">{formatPrice(dish.price)}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>25-35 min</span>
            </div>
          </div>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(dish);
            }}
            size="sm"
            className="chop-btn-primary px-4 py-2 gap-2"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};