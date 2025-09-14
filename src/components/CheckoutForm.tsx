// This component has been replaced by the new Checkout page
// Import the new component instead:
// import { Checkout } from "@/pages/Checkout";

import { Checkout } from "@/pages/Checkout";

interface CheckoutItem {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string;
}

interface CheckoutFormProps {
  items: CheckoutItem[];
  total: number;
  selectedTown: string;
  onBack: () => void;
  onPlaceOrder: (orderData: any) => void;
}

export const CheckoutForm = ({ items, total, selectedTown, onBack, onPlaceOrder }: CheckoutFormProps) => {
  return (
    <Checkout
      items={items}
      total={total}
      selectedTown={selectedTown}
      onBack={onBack}
      onSuccess={onPlaceOrder}
    />
  );
};