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
  Plus, 
  Edit2, 
  Trash2, 
  ChefHat,
  Link,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

interface Complement {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
}

interface Dish {
  id: string;
  name: string;
  category: string;
}

interface DishComplement {
  id: string;
  dish_id: string;
  complement_id: string;
  is_required: boolean;
  max_quantity: number;
  dish: { name: string; category: string };
  complement: { name: string; price: number; currency: string };
}

export default function AdminComplements() {
  const [activeTab, setActiveTab] = useState("complements");
  
  // Complements state
  const [complements, setComplements] = useState<Complement[]>([]);
  const [complementsLoading, setComplementsLoading] = useState(true);
  const [complementDialogOpen, setComplementDialogOpen] = useState(false);
  const [editingComplement, setEditingComplement] = useState<Complement | null>(null);
  
  // Dishes state
  const [dishes, setDishes] = useState<Dish[]>([]);
  
  // Dish Complements state
  const [dishComplements, setDishComplements] = useState<DishComplement[]>([]);
  const [dishComplementsLoading, setDishComplementsLoading] = useState(true);
  const [dishComplementDialogOpen, setDishComplementDialogOpen] = useState(false);
  const [editingDishComplement, setEditingDishComplement] = useState<DishComplement | null>(null);

  useEffect(() => {
    fetchComplements();
    fetchDishes();
    fetchDishComplements();
  }, []);

  const fetchComplements = async () => {
    try {
      setComplementsLoading(true);
      const { data, error } = await supabase
        .from("complements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComplements(data || []);
    } catch (error) {
      console.error("Error fetching complements:", error);
      toast.error("Failed to fetch complements");
    } finally {
      setComplementsLoading(false);
    }
  };

  const fetchDishes = async () => {
    try {
      const { data, error } = await supabase
        .from("dishes")
        .select("id, name, category")
        .order("name");

      if (error) throw error;
      setDishes(data || []);
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  const fetchDishComplements = async () => {
    try {
      setDishComplementsLoading(true);
      const { data, error } = await supabase
        .from("dish_complements")
        .select(`
          *,
          dish:dishes(name, category),
          complement:complements(name, price, currency)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDishComplements(data || []);
    } catch (error) {
      console.error("Error fetching dish complements:", error);
      toast.error("Failed to fetch dish complements");
    } finally {
      setDishComplementsLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string = 'XAF') => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + ` ${currency}`;
  };

  const handleComplementSubmit = async (formData: any) => {
    try {
      if (editingComplement) {
        const { error } = await supabase
          .from("complements")
          .update(formData)
          .eq("id", editingComplement.id);
        if (error) throw error;
        toast.success("Complement updated successfully");
      } else {
        const { error } = await supabase
          .from("complements")
          .insert([formData]);
        if (error) throw error;
        toast.success("Complement created successfully");
      }
      
      setComplementDialogOpen(false);
      setEditingComplement(null);
      fetchComplements();
    } catch (error) {
      console.error("Error saving complement:", error);
      toast.error("Failed to save complement");
    }
  };

  const handleDishComplementSubmit = async (formData: any) => {
    try {
      if (editingDishComplement) {
        const { error } = await supabase
          .from("dish_complements")
          .update(formData)
          .eq("id", editingDishComplement.id);
        if (error) throw error;
        toast.success("Dish complement updated successfully");
      } else {
        const { error } = await supabase
          .from("dish_complements")
          .insert([formData]);
        if (error) throw error;
        toast.success("Dish complement created successfully");
      }
      
      setDishComplementDialogOpen(false);
      setEditingDishComplement(null);
      fetchDishComplements();
    } catch (error) {
      console.error("Error saving dish complement:", error);
      toast.error("Failed to save dish complement");
    }
  };

  const deleteComplement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this complement?")) return;
    
    try {
      const { error } = await supabase
        .from("complements")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Complement deleted successfully");
      fetchComplements();
    } catch (error) {
      console.error("Error deleting complement:", error);
      toast.error("Failed to delete complement");
    }
  };

  const deleteDishComplement = async (id: string) => {
    if (!confirm("Are you sure you want to remove this complement from the dish?")) return;
    
    try {
      const { error } = await supabase
        .from("dish_complements")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Dish complement removed successfully");
      fetchDishComplements();
    } catch (error) {
      console.error("Error removing dish complement:", error);
      toast.error("Failed to remove dish complement");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Complement Management</h1>
          <p className="text-muted-foreground">
            Manage dish complements and their associations
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="complements" className="flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            Complements
          </TabsTrigger>
          <TabsTrigger value="dish-complements" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Dish Associations
          </TabsTrigger>
        </TabsList>

        {/* Complements Tab */}
        <TabsContent value="complements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Complements ({complements.length})</h2>
            <Dialog open={complementDialogOpen} onOpenChange={setComplementDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Complement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingComplement ? "Edit Complement" : "Add New Complement"}
                  </DialogTitle>
                </DialogHeader>
                <ComplementForm
                  complement={editingComplement}
                  onSubmit={handleComplementSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {complementsLoading ? (
                <div className="p-6 text-center">Loading complements...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complements.map((complement) => (
                      <TableRow key={complement.id}>
                        <TableCell className="font-medium">{complement.name}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {complement.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatPrice(complement.price, complement.currency)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={complement.is_active ? "default" : "secondary"}>
                            {complement.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingComplement(complement);
                                setComplementDialogOpen(true);
                              }}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteComplement(complement.id)}
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

        {/* Dish Complements Tab */}
        <TabsContent value="dish-complements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Dish Associations ({dishComplements.length})</h2>
            <Dialog open={dishComplementDialogOpen} onOpenChange={setDishComplementDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Associate Complement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingDishComplement ? "Edit Association" : "Associate Complement with Dish"}
                  </DialogTitle>
                </DialogHeader>
                <DishComplementForm
                  dishComplement={editingDishComplement}
                  dishes={dishes}
                  complements={complements}
                  onSubmit={handleDishComplementSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {dishComplementsLoading ? (
                <div className="p-6 text-center">Loading dish complements...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dish</TableHead>
                      <TableHead>Complement</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Max Quantity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dishComplements.map((dishComplement) => (
                      <TableRow key={dishComplement.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{dishComplement.dish.name}</div>
                            <Badge variant="outline" className="text-xs">
                              {dishComplement.dish.category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {dishComplement.complement.name}
                        </TableCell>
                        <TableCell>
                          {formatPrice(dishComplement.complement.price, dishComplement.complement.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={dishComplement.is_required ? "destructive" : "secondary"}>
                            {dishComplement.is_required ? "Required" : "Optional"}
                          </Badge>
                        </TableCell>
                        <TableCell>{dishComplement.max_quantity}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingDishComplement(dishComplement);
                                setDishComplementDialogOpen(true);
                              }}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteDishComplement(dishComplement.id)}
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

// Complement Form Component
function ComplementForm({ 
  complement, 
  onSubmit 
}: { 
  complement: Complement | null; 
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: complement?.name || "",
    description: complement?.description || "",
    price: complement?.price || 0,
    currency: complement?.currency || "XAF",
    is_active: complement?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Extra Cheese"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the complement"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="XAF">XAF</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">
          {complement ? "Update" : "Create"} Complement
        </Button>
      </div>
    </form>
  );
}

// Dish Complement Form Component
function DishComplementForm({ 
  dishComplement, 
  dishes, 
  complements, 
  onSubmit 
}: { 
  dishComplement: DishComplement | null; 
  dishes: Dish[];
  complements: Complement[];
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    dish_id: dishComplement?.dish_id || "",
    complement_id: dishComplement?.complement_id || "",
    is_required: dishComplement?.is_required ?? false,
    max_quantity: dishComplement?.max_quantity || 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
                {dish.name} - {dish.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="complement_id">Complement</Label>
        <Select
          value={formData.complement_id}
          onValueChange={(value) => setFormData({ ...formData, complement_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a complement" />
          </SelectTrigger>
          <SelectContent>
            {complements.filter(c => c.is_active).map((complement) => (
              <SelectItem key={complement.id} value={complement.id}>
                {complement.name} - {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(complement.price)} {complement.currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_quantity">Maximum Quantity</Label>
        <Input
          id="max_quantity"
          type="number"
          min="1"
          value={formData.max_quantity}
          onChange={(e) => setFormData({ ...formData, max_quantity: parseInt(e.target.value) || 1 })}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_required"
          checked={formData.is_required}
          onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
        />
        <Label htmlFor="is_required">Required</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">
          {dishComplement ? "Update" : "Create"} Association
        </Button>
      </div>
    </form>
  );
}