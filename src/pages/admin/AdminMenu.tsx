import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Restaurant, Dish } from "@/hooks/useRealTimeData";

interface RestaurantDish {
  id: string;
  restaurant_id: string;
  dish_id: string;
  price: number;
  is_available: boolean;
  restaurant: Restaurant;
  dish: Dish;
}

export default function AdminMenu() {
  const [restaurantDishes, setRestaurantDishes] = useState<RestaurantDish[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RestaurantDish | null>(null);
  const [formData, setFormData] = useState({
    restaurant_id: "",
    dish_id: "",
    price: 0,
    is_available: true,
  });
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all data
      const [restaurantDishesRes, restaurantsRes, dishesRes] = await Promise.all([
        supabase
          .from('restaurant_dishes')
          .select(`
            *,
            restaurant:restaurants(*),
            dish:dishes(*)
          `)
          .order('created_at', { ascending: false }),
        supabase.from('restaurants').select('*').order('name'),
        supabase.from('dishes').select('*').order('name'),
      ]);

      if (restaurantDishesRes.error) throw restaurantDishesRes.error;
      if (restaurantsRes.error) throw restaurantsRes.error;
      if (dishesRes.error) throw dishesRes.error;

      setRestaurantDishes(restaurantDishesRes.data || []);
      setRestaurants(restaurantsRes.data || []);
      setDishes(dishesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const priceInCents = Math.round(formData.price);
      
      if (editingItem) {
        const { error } = await supabase
          .from('restaurant_dishes')
          .update({
            restaurant_id: formData.restaurant_id,
            dish_id: formData.dish_id,
            price: priceInCents,
            is_available: formData.is_available,
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Menu item updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('restaurant_dishes')
          .insert([{
            restaurant_id: formData.restaurant_id,
            dish_id: formData.dish_id,
            price: priceInCents,
            is_available: formData.is_available,
          }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Menu item created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: RestaurantDish) => {
    setEditingItem(item);
    setFormData({
      restaurant_id: item.restaurant_id,
      dish_id: item.dish_id,
      price: item.price, // Already in XAF, no conversion needed
      is_available: item.is_available,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const { error } = await supabase
        .from('restaurant_dishes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (item: RestaurantDish) => {
    try {
      const { error } = await supabase
        .from('restaurant_dishes')
        .update({ is_available: !item.is_available })
        .eq('id', item.id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      restaurant_id: "",
      dish_id: "",
      price: 0,
      is_available: true,
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground">Manage restaurant menus and pricing</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Manage restaurant menus and pricing</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant_id">Restaurant</Label>
                <Select
                  value={formData.restaurant_id}
                  onValueChange={(value) => setFormData({ ...formData, restaurant_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a restaurant" />
                  </SelectTrigger>
                  <SelectContent>
                    {restaurants.map((restaurant) => (
                      <SelectItem key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dish_id">Dish</Label>
                <Select
                  value={formData.dish_id}
                  onValueChange={(value) => setFormData({ ...formData, dish_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dish" />
                  </SelectTrigger>
                  <SelectContent>
                    {dishes.map((dish) => (
                      <SelectItem key={dish.id} value={dish.id}>
                        {dish.name} ({dish.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (XAF)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
                <Label htmlFor="is_available">Available</Label>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant</TableHead>
                <TableHead>Dish</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurantDishes.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.restaurant.name}
                  </TableCell>
                  <TableCell>{item.dish.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                      {item.dish.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">XAF</span>
                      {formatPrice(item.price)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.is_available}
                      onCheckedChange={() => toggleAvailability(item)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {restaurantDishes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No menu items found. Add items to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}