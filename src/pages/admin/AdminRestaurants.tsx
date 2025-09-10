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
import { Plus, Edit, Trash2, Star } from "lucide-react";
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
          <p className="text-muted-foreground">Manage restaurant listings</p>
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+237 6XX XXX XXX"
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

      <Card>
        <CardHeader>
          <CardTitle>Restaurant List</CardTitle>
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
    </div>
  );
}