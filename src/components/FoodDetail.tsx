import { ArrowLeft, Plus, Minus, Clock, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FoodDetailProps {
  dish: {
    id: number;
    name: string;
    restaurant: string;
    price: number;
    description: string;
    image: string;
    category: string;
  };
  onBack: () => void;
  onAddToCart: (dish: any, quantity: number) => void;
}

export const FoodDetail = ({ dish, onBack, onAddToCart }: FoodDetailProps) => {
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    onAddToCart(dish, quantity);
    onBack(); // Return to home after adding
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-semibold text-lg">Details</h1>
        </div>
      </div>

      {/* Food Image */}
      <div className="aspect-[16/10] relative">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary/90 text-primary-foreground text-sm px-3 py-1 rounded-full font-medium">
            {dish.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{dish.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>{dish.restaurant}</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">{dish.description}</p>
        </div>

        {/* Delivery Info */}
        <div className="chop-card p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Delivery Time</p>
              <p className="text-sm text-muted-foreground">25-35 minutes</p>
            </div>
          </div>
        </div>

        {/* Price & Quantity */}
        <div className="chop-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Price per item</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(dish.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg min-w-[3rem] text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(dish.price * quantity)}
              </span>
            </div>
            
            <Button
              onClick={handleAddToCart}
              className="w-full chop-btn-primary h-12 text-base font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add {quantity} to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};