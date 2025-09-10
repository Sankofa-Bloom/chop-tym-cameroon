import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";

interface CustomOrderCardProps {
  onCustomOrder: () => void;
}

export function CustomOrderCard({ onCustomOrder }: CustomOrderCardProps) {
  return (
    <Card className="border-2 border-dashed border-primary/30 bg-card/50 backdrop-blur-sm p-8 text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Package className="w-8 h-8 text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Custom Food Order</h3>
        <p className="text-muted-foreground text-sm">
          Can't find what you're looking for? Order any dish from your favorite restaurant!
        </p>
      </div>
      
      <div className="space-y-3">
        <p className="text-primary font-medium">Starting from 2,000 FCFA</p>
        <Button 
          onClick={onCustomOrder}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all duration-200"
        >
          Custom Order
        </Button>
      </div>
    </Card>
  );
}