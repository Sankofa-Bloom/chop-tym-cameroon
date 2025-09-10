import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, Clock, Minus, Plus, MapPin } from "lucide-react";
import { Dish, useRestaurantsByDish } from "@/hooks/useRealTimeData";

interface FoodDetailProps {
  dish: Dish;
  onBack: () => void;
  onAddToCart: (dish: any, quantity: number, restaurantId: string, price: number) => void;
}

export const FoodDetail = ({ dish, onBack, onAddToCart }: FoodDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const { restaurantDishes, loading } = useRestaurantsByDish(dish.id);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} F`;
  };

  const selectedRestaurantDish = restaurantDishes.find(rd => rd.restaurant_id === selectedRestaurant);

  const handleAddToCart = () => {
    if (!selectedRestaurantDish) return;
    onAddToCart(dish, quantity, selectedRestaurantDish.restaurant_id, selectedRestaurantDish.price);
    onBack();
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

      <div className="relative mb-6">
        <img 
          src={dish.image_url} 
          alt={dish.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-gray-800">
            {dish.category}
          </Badge>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{dish.name}</h1>
          <p className="text-gray-700">{dish.description}</p>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading restaurants...</div>
        ) : (
          <>
            <div>
              <h2 className="text-lg font-semibold mb-3">Choose Restaurant</h2>
              <div className="space-y-2">
                {restaurantDishes.map((rd) => (
                  <Card 
                    key={rd.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedRestaurant === rd.restaurant_id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedRestaurant(rd.restaurant_id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={rd.restaurant.image_url} 
                            alt={rd.restaurant.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-semibold">{rd.restaurant.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
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
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(rd.price)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {selectedRestaurant && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Price per item</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(selectedRestaurantDish?.price || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Quantity</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice((selectedRestaurantDish?.price || 0) * quantity)}
                    </span>
                  </div>

                  <Button 
                    onClick={handleAddToCart}
                    className="w-full text-lg py-6"
                    size="lg"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};