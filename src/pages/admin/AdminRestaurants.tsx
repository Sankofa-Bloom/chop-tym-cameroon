import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Star, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Restaurant } from "@/hooks/useRealTimeData";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    rating: 4.5,
    delivery_time: "30-45 min",
    town: "",
    exact_location: "",
    phone: "",
    opens_at: "08:00",
    closes_at: "22:00",
    is_open_now: true,
    operating_days: [1, 2, 3, 4, 5, 6, 7],
    is_popular: false,
    popular_order: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('is_popular', { ascending: false })
        .order('popular_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch restaurants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRestaurant) {
        const { error } = await supabase
          .from('restaurants')
          .update(formData)
          .eq('id', editingRestaurant.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Restaurant updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('restaurants')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Restaurant created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingRestaurant(null);
      setFormData({
        name: "",
        description: "",
        image_url: "",
        rating: 4.5,
        delivery_time: "30-45 min",
        town: "",
        exact_location: "",
        phone: "",
        opens_at: "08:00",
        closes_at: "22:00",
        is_open_now: true,
        operating_days: [1, 2, 3, 4, 5, 6, 7],
        is_popular: false,
        popular_order: null,
      });
      fetchRestaurants();
    } catch (error) {
      console.error('Error saving restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to save restaurant",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      description: restaurant.description || "",
      image_url: restaurant.image_url || "",
      rating: restaurant.rating || 4.5,
      delivery_time: restaurant.delivery_time || "30-45 min",
      town: restaurant.town,
      exact_location: restaurant.exact_location || "",
      phone: restaurant.phone || "",
      opens_at: restaurant.opens_at,
      closes_at: restaurant.closes_at,
      is_open_now: restaurant.is_open_now,
      operating_days: restaurant.operating_days,
      is_popular: restaurant.is_popular || false,
      popular_order: restaurant.popular_order || null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;

    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Restaurant deleted successfully",
      });
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to delete restaurant",
        variant: "destructive",
      });
    }
  };

  const togglePopular = async (restaurantId: string, isPopular: boolean, currentOrder?: number | null) => {
    try {
      let updateData: any = { is_popular: isPopular };
      
      if (isPopular) {
        // If setting as popular, assign the next order number
        const popularRestaurants = restaurants.filter(r => r.is_popular);
        updateData.popular_order = popularRestaurants.length + 1;
      } else {
        // If removing from popular, set order to null
        updateData.popular_order = null;
      }

      const { error } = await supabase
        .from('restaurants')
        .update(updateData)
        .eq('id', restaurantId);

      if (error) throw error;

      // If removing a restaurant, reorder the remaining ones
      if (!isPopular && currentOrder !== null) {
        const toReorder = restaurants.filter(r => r.is_popular && r.popular_order && r.popular_order > currentOrder);
        for (const restaurant of toReorder) {
          await supabase
            .from('restaurants')
            .update({ popular_order: restaurant.popular_order! - 1 })
            .eq('id', restaurant.id);
        }
      }

      toast({
        title: "Success",
        description: `Restaurant ${isPopular ? 'added to' : 'removed from'} popular list`,
      });
      fetchRestaurants();
    } catch (error) {
      console.error('Error updating popular status:', error);
      toast({
        title: "Error",
        description: "Failed to update popular status",
        variant: "destructive",
      });
    }
  };

  const reorderPopular = async (restaurantId: string, direction: 'up' | 'down') => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant || !restaurant.is_popular || !restaurant.popular_order) return;

    const currentOrder = restaurant.popular_order;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    const swapRestaurant = restaurants.find(r => 
      r.is_popular && r.popular_order === newOrder
    );
    
    if (!swapRestaurant) return;

    try {
      // Swap the orders
      await supabase
        .from('restaurants')
        .update({ popular_order: newOrder })
        .eq('id', restaurantId);
        
      await supabase
        .from('restaurants')
        .update({ popular_order: currentOrder })
        .eq('id', swapRestaurant.id);

      toast({
        title: "Success",
        description: "Popular restaurants reordered",
      });
      fetchRestaurants();
    } catch (error) {
      console.error('Error reordering restaurants:', error);
      toast({
        title: "Error", 
        description: "Failed to reorder restaurants",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingRestaurant(null);
    setFormData({
      name: "",
      description: "",
      image_url: "",
      rating: 4.5,
      delivery_time: "30-45 min",
      town: "",
      exact_location: "",
      phone: "",
      opens_at: "08:00",
      closes_at: "22:00",
      is_open_now: true,
      operating_days: [1, 2, 3, 4, 5, 6, 7],
      is_popular: false,
      popular_order: null,
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Restaurants</h1>
            <p className="text-muted-foreground">Manage restaurant listings</p>
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
          <h1 className="text-3xl font-bold">Restaurants</h1>
          <p className="text-muted-foreground">Manage restaurant listings and popular selections</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="town">Town *</Label>
                <Input
                  id="town"
                  value={formData.town}
                  onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exact_location">Exact Location</Label>
                <Textarea
                  id="exact_location"
                  value={formData.exact_location}
                  onChange={(e) => setFormData({ ...formData, exact_location: e.target.value })}
                  placeholder="Detailed address..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="WhatsApp Number: +237 6XX XXX XXX"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opens_at">Opens At</Label>
                  <Input
                    id="opens_at"
                    type="time"
                    value={formData.opens_at}
                    onChange={(e) => setFormData({ ...formData, opens_at: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="closes_at">Closes At</Label>  
                  <Input
                    id="closes_at"
                    type="time"
                    value={formData.closes_at}
                    onChange={(e) => setFormData({ ...formData, closes_at: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_popular"
                  checked={formData.is_popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_popular: !!checked })}
                />
                <Label htmlFor="is_popular">Add to Popular Restaurants</Label>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRestaurant ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Restaurants</TabsTrigger>
          <TabsTrigger value="popular">Popular Restaurants</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Town</TableHead>
                    <TableHead>Phone</TableHead> 
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>
                        {restaurant.image_url ? (
                          <img
                            src={restaurant.image_url}
                            alt={restaurant.name}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            No Image
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{restaurant.name}</TableCell>
                      <TableCell>{restaurant.town}</TableCell>
                      <TableCell>{restaurant.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {restaurant.opens_at} - {restaurant.closes_at}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={restaurant.is_open_now ? "default" : "secondary"}>
                          {restaurant.is_open_now ? "Open" : "Closed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={restaurant.is_popular ? "default" : "outline"}
                          size="sm"
                          onClick={() => togglePopular(restaurant.id, !restaurant.is_popular, restaurant.popular_order)}
                        >
                          <Star className={`h-4 w-4 ${restaurant.is_popular ? 'fill-current' : ''}`} />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(restaurant)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(restaurant.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {restaurants.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No restaurants found. Add your first restaurant to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular">
          <Card>
            <CardHeader>
              <CardTitle>Popular Restaurants Order</CardTitle>
              <p className="text-sm text-muted-foreground">
                Drag to reorder how popular restaurants appear on the website
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Town</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restaurants
                    .filter(r => r.is_popular)
                    .sort((a, b) => (a.popular_order || 0) - (b.popular_order || 0))
                    .map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">#{restaurant.popular_order}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {restaurant.image_url ? (
                          <img
                            src={restaurant.image_url}
                            alt={restaurant.name}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            No Image
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{restaurant.name}</TableCell>
                      <TableCell>{restaurant.town}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => reorderPopular(restaurant.id, 'up')}
                            disabled={restaurant.popular_order === 1}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => reorderPopular(restaurant.id, 'down')}
                            disabled={restaurant.popular_order === restaurants.filter(r => r.is_popular).length}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePopular(restaurant.id, false, restaurant.popular_order)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {restaurants.filter(r => r.is_popular).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No popular restaurants selected. Go to "All Restaurants" tab to add some.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}