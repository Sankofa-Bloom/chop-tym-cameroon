import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { 
  Store, 
  Plus, 
  Edit2, 
  Trash2, 
  UtensilsCrossed, 
  Menu,
  Clock,
  MapPin,
  Phone,
  Eye,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  town: string;
  phone: string;
  image_url: string;
  is_open_now: boolean;
  opens_at: string;
  closes_at: string;
  operating_days: number[];
  exact_location: string;
  rating: number;
  delivery_time: string;
  created_at: string;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
}

interface RestaurantDish {
  id: string;
  restaurant_id: string;
  dish_id: string;
  price: number;
  is_available: boolean;
  currency: string;
  restaurant: { name: string };
  dish: { name: string; category: string; description: string };
}

const DISH_CATEGORIES = [
  "Main Course",
  "Appetizer", 
  "Dessert",
  "Beverage",
  "Soup",
  "Salad",
  "Side Dish"
];

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" }
];

export function RestaurantManagement() {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  // Restaurants state
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [restaurantDialogOpen, setRestaurantDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  
  // Dishes state
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [dishesLoading, setDishesLoading] = useState(true);
  const [dishDialogOpen, setDishDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  
  // Menu state
  const [menuItems, setMenuItems] = useState<RestaurantDish[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<RestaurantDish | null>(null);

  useEffect(() => {
    fetchRestaurants();
    fetchDishes();
    fetchMenuItems();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setRestaurantsLoading(true);
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error("Failed to fetch restaurants");
    } finally {
      setRestaurantsLoading(false);
    }
  };

  const fetchDishes = async () => {
    try {
      setDishesLoading(true);
      const { data, error } = await supabase
        .from("dishes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDishes(data || []);
    } catch (error) {
      console.error("Error fetching dishes:", error);
      toast.error("Failed to fetch dishes");
    } finally {
      setDishesLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true);
      const { data, error } = await supabase
        .from("restaurant_dishes")
        .select(`
          *,
          restaurant:restaurants(name),
          dish:dishes(name, category, description)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to fetch menu items");
    } finally {
      setMenuLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleRestaurantSubmit = async (formData: any) => {
    try {
      if (editingRestaurant) {
        const { error } = await supabase
          .from("restaurants")
          .update(formData)
          .eq("id", editingRestaurant.id);
        if (error) throw error;
        toast.success("Restaurant updated successfully");
      } else {
        const { error } = await supabase
          .from("restaurants")
          .insert([formData]);
        if (error) throw error;
        toast.success("Restaurant created successfully");
      }
      
      setRestaurantDialogOpen(false);
      setEditingRestaurant(null);
      fetchRestaurants();
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast.error("Failed to save restaurant");
    }
  };

  const handleDishSubmit = async (formData: any) => {
    try {
      if (editingDish) {
        const { error } = await supabase
          .from("dishes")
          .update(formData)
          .eq("id", editingDish.id);
        if (error) throw error;
        toast.success("Dish updated successfully");
      } else {
        const { error } = await supabase
          .from("dishes")
          .insert([formData]);
        if (error) throw error;
        toast.success("Dish created successfully");
      }
      
      setDishDialogOpen(false);
      setEditingDish(null);
      fetchDishes();
    } catch (error) {
      console.error("Error saving dish:", error);
      toast.error("Failed to save dish");
    }
  };

  const handleMenuItemSubmit = async (formData: any) => {
    try {
      if (editingMenuItem) {
        const { error } = await supabase
          .from("restaurant_dishes")
          .update(formData)
          .eq("id", editingMenuItem.id);
        if (error) throw error;
        toast.success("Menu item updated successfully");
      } else {
        const { error } = await supabase
          .from("restaurant_dishes")
          .insert([formData]);
        if (error) throw error;
        toast.success("Menu item created successfully");
      }
      
      setMenuDialogOpen(false);
      setEditingMenuItem(null);
      fetchMenuItems();
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error("Failed to save menu item");
    }
  };

  const deleteRestaurant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;
    
    try {
      const { error } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Restaurant deleted successfully");
      fetchRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error("Failed to delete restaurant");
    }
  };

  const deleteDish = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;
    
    try {
      const { error } = await supabase
        .from("dishes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Dish deleted successfully");
      fetchDishes();
    } catch (error) {
      console.error("Error deleting dish:", error);
      toast.error("Failed to delete dish");
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    
    try {
      const { error } = await supabase
        .from("restaurant_dishes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Menu item deleted successfully");
      fetchMenuItems();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restaurant Management</h1>
          <p className="text-muted-foreground">
            Manage restaurants, dishes, and menu items
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="restaurants" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Restaurants
          </TabsTrigger>
          <TabsTrigger value="dishes" className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            Dishes
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Menu className="w-4 h-4" />
            Menu Items
          </TabsTrigger>
        </TabsList>

        {/* Restaurants Tab */}
        <TabsContent value="restaurants" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Restaurants ({restaurants.length})</h2>
            <Dialog open={restaurantDialogOpen} onOpenChange={setRestaurantDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Restaurant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
                  </DialogTitle>
                </DialogHeader>
                <RestaurantForm
                  restaurant={editingRestaurant}
                  onSubmit={handleRestaurantSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {restaurantsLoading ? (
                <div className="p-6 text-center">Loading restaurants...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {restaurants.map((restaurant) => (
                      <TableRow key={restaurant.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{restaurant.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-48">
                              {restaurant.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {restaurant.town}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={restaurant.is_open_now ? "default" : "secondary"}>
                            {restaurant.is_open_now ? "Open" : "Closed"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="w-3 h-3" />
                            {restaurant.opens_at} - {restaurant.closes_at}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            ⭐ {restaurant.rating}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingRestaurant(restaurant);
                                setRestaurantDialogOpen(true);
                              }}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteRestaurant(restaurant.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dishes Tab */}
        <TabsContent value="dishes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Dishes ({dishes.length})</h2>
            <Dialog open={dishDialogOpen} onOpenChange={setDishDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Dish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingDish ? "Edit Dish" : "Add New Dish"}
                  </DialogTitle>
                </DialogHeader>
                <DishForm
                  dish={editingDish}
                  onSubmit={handleDishSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {dishesLoading ? (
                <div className="p-6 text-center">Loading dishes...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dishes.map((dish) => (
                      <TableRow key={dish.id}>
                        <TableCell className="font-medium">{dish.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{dish.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {dish.description}
                        </TableCell>
                        <TableCell>
                          {new Date(dish.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingDish(dish);
                                setDishDialogOpen(true);
                              }}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteDish(dish.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Menu Items Tab */}
        <TabsContent value="menu" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Menu Items ({menuItems.length})</h2>
            <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
                  </DialogTitle>
                </DialogHeader>
                <MenuItemForm
                  menuItem={editingMenuItem}
                  restaurants={restaurants}
                  dishes={dishes}
                  onSubmit={handleMenuItemSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {menuLoading ? (
                <div className="p-6 text-center">Loading menu items...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Dish</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menuItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.restaurant.name}
                        </TableCell>
                        <TableCell>{item.dish.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.dish.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatPrice(item.price)} {item.currency}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.is_available ? "default" : "secondary"}>
                            {item.is_available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingMenuItem(item);
                                setMenuDialogOpen(true);
                              }}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteMenuItem(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Form components (keeping them simple for now)
function RestaurantForm({ restaurant, onSubmit }: any) {
  const [formData, setFormData] = useState({
    name: restaurant?.name || "",
    description: restaurant?.description || "",
    town: restaurant?.town || "Douala",
    phone: restaurant?.phone || "",
    image_url: restaurant?.image_url || "",
    is_open_now: restaurant?.is_open_now ?? true,
    opens_at: restaurant?.opens_at || "08:00",
    closes_at: restaurant?.closes_at || "22:00",
    operating_days: restaurant?.operating_days || [1,2,3,4,5,6,7],
    exact_location: restaurant?.exact_location || "",
    rating: restaurant?.rating || 4.5,
    delivery_time: restaurant?.delivery_time || "30-45 min"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="town">Town</Label>
          <Input
            id="town"
            value={formData.town}
            onChange={(e) => setFormData({...formData, town: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="delivery_time">Delivery Time</Label>
          <Input
            id="delivery_time"
            value={formData.delivery_time}
            onChange={(e) => setFormData({...formData, delivery_time: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="opens_at">Opens At</Label>
          <Input
            id="opens_at"
            type="time"
            value={formData.opens_at}
            onChange={(e) => setFormData({...formData, opens_at: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="closes_at">Closes At</Label>
          <Input
            id="closes_at"
            type="time"
            value={formData.closes_at}
            onChange={(e) => setFormData({...formData, closes_at: e.target.value})}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_open_now"
          checked={formData.is_open_now}
          onCheckedChange={(checked) => setFormData({...formData, is_open_now: checked})}
        />
        <Label htmlFor="is_open_now">Currently Open</Label>
      </div>

      <Button type="submit" className="w-full">
        {restaurant ? "Update Restaurant" : "Create Restaurant"}
      </Button>
    </form>
  );
}

function DishForm({ dish, onSubmit }: any) {
  const [formData, setFormData] = useState({
    name: dish?.name || "",
    description: dish?.description || "",
    category: dish?.category || "",
    image_url: dish?.image_url || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {DISH_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
        />
      </div>

      <Button type="submit" className="w-full">
        {dish ? "Update Dish" : "Create Dish"}
      </Button>
    </form>
  );
}

function MenuItemForm({ menuItem, restaurants, dishes, onSubmit }: any) {
  const [formData, setFormData] = useState({
    restaurant_id: menuItem?.restaurant_id || "",
    dish_id: menuItem?.dish_id || "",
    price: menuItem?.price || 0,
    is_available: menuItem?.is_available ?? true,
    currency: menuItem?.currency || "XAF"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="restaurant_id">Restaurant</Label>
        <Select value={formData.restaurant_id} onValueChange={(value) => setFormData({...formData, restaurant_id: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select a restaurant" />
          </SelectTrigger>
          <SelectContent>
            {restaurants.map((restaurant: Restaurant) => (
              <SelectItem key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="dish_id">Dish</Label>
        <Select value={formData.dish_id} onValueChange={(value) => setFormData({...formData, dish_id: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select a dish" />
          </SelectTrigger>
          <SelectContent>
            {dishes.map((dish: Dish) => (
              <SelectItem key={dish.id} value={dish.id}>
                {dish.name} ({dish.category})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_available"
          checked={formData.is_available}
          onCheckedChange={(checked) => setFormData({...formData, is_available: checked})}
        />
        <Label htmlFor="is_available">Available</Label>
      </div>

      <Button type="submit" className="w-full">
        {menuItem ? "Update Menu Item" : "Create Menu Item"}
      </Button>
    </form>
  );
}
