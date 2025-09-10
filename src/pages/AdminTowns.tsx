import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, MapPin, Mail, Phone, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTowns, Town } from "@/hooks/useTowns";

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  town: string;
  created_at: string;
}

export default function AdminTowns() {
  const { towns, loading } = useTowns();
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loadingWaitlist, setLoadingWaitlist] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTown, setEditingTown] = useState<Town | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    is_active: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      const { data, error } = await supabase
        .from('town_waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWaitlist(data || []);
    } catch (error) {
      console.error('Error fetching waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to fetch waitlist",
        variant: "destructive",
      });
    } finally {
      setLoadingWaitlist(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTown) {
        const { error } = await supabase
          .from('towns')
          .update(formData)
          .eq('id', editingTown.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Town updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('towns')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Town created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingTown(null);
      resetForm();
    } catch (error) {
      console.error('Error saving town:', error);
      toast({
        title: "Error",
        description: "Failed to save town",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (town: Town) => {
    setEditingTown(town);
    setFormData({
      name: town.name,
      is_active: town.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this town?")) return;

    try {
      const { error } = await supabase
        .from('towns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Town deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting town:', error);
      toast({
        title: "Error",
        description: "Failed to delete town",
        variant: "destructive",
      });
    }
  };

  const toggleTownStatus = async (townId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('towns')
        .update({ is_active: isActive })
        .eq('id', townId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Town ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating town status:', error);
      toast({
        title: "Error",
        description: "Failed to update town status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingTown(null);
    setFormData({
      name: "",
      is_active: false,
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Town Management</h1>
          <p className="text-muted-foreground">Manage service areas and waitlist</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Town
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTown ? 'Edit Town' : 'Add New Town'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Town Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Service Available</Label>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTown ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="towns" className="w-full">
        <TabsList>
          <TabsTrigger value="towns">Towns</TabsTrigger>
          <TabsTrigger value="waitlist">
            Waitlist ({waitlist.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="towns">
          <Card>
            <CardHeader>
              <CardTitle>Service Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Town Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Waitlist Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {towns.map((town) => {
                    const townWaitlist = waitlist.filter(w => w.town === town.name);
                    return (
                      <TableRow key={town.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {town.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={town.is_active}
                              onCheckedChange={(checked) => toggleTownStatus(town.id, checked)}
                            />
                            <Badge variant={town.is_active ? "default" : "secondary"}>
                              {town.is_active ? "Active" : "Coming Soon"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {townWaitlist.length} people waiting
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(town)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(town.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {towns.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No towns found. Add your first service area to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waitlist">
          <Card>
            <CardHeader>
              <CardTitle>Service Waitlist</CardTitle>
              <p className="text-sm text-muted-foreground">
                Users waiting for service in inactive towns
              </p>
            </CardHeader>
            <CardContent>
              {loadingWaitlist ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted rounded" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Town</TableHead>
                      <TableHead>Date Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waitlist.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {entry.name}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3" />
                              {entry.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3" />
                              {entry.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.town}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {waitlist.length === 0 && !loadingWaitlist && (
                <div className="text-center py-8 text-muted-foreground">
                  No waitlist entries found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}