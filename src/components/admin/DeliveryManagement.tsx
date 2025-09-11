import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useTowns } from "@/hooks/useTowns";
import { useDeliveryZones } from "@/hooks/useDeliveryZones";
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Truck,
  DollarSign,
  Users
} from "lucide-react";
import { toast } from "sonner";

interface Town {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface DeliveryZone {
  id: string;
  zone_name: string;
  town: string;
  delivery_fee: number;
  is_active: boolean;
  created_at: string;
}

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  town: string;
  created_at: string;
}

export function DeliveryManagement() {
  const [activeTab, setActiveTab] = useState("zones");
  
  // Towns state
  const { towns, loading: townsLoading, refetch: refetchTowns } = useTowns();
  const [townDialogOpen, setTownDialogOpen] = useState(false);
  const [editingTown, setEditingTown] = useState<Town | null>(null);
  const [newTownName, setNewTownName] = useState("");
  
  // Zones state
  const { zones, loading: zonesLoading, refetch: refetchZones } = useDeliveryZones();
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  
  // Waitlist state
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "waitlist") {
      fetchWaitlist();
    }
  }, [activeTab]);

  const fetchWaitlist = async () => {
    try {
      setWaitlistLoading(true);
      const { data, error } = await supabase
        .from("town_waitlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWaitlist(data || []);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      toast.error("Failed to fetch waitlist");
    } finally {
      setWaitlistLoading(false);
    }
  };

  const handleTownSubmit = async (formData: any) => {
    try {
      if (editingTown) {
        const { error } = await supabase
          .from("towns")
          .update(formData)
          .eq("id", editingTown.id);
        if (error) throw error;
        toast.success("Town updated successfully");
      } else {
        const { error } = await supabase
          .from("towns")
          .insert([{ ...formData, is_active: false }]);
        if (error) throw error;
        toast.success("Town created successfully");
      }
      
      setTownDialogOpen(false);
      setEditingTown(null);
      setNewTownName("");
      refetchTowns();
    } catch (error) {
      console.error("Error saving town:", error);
      toast.error("Failed to save town");
    }
  };

  const handleZoneSubmit = async (formData: any) => {
    try {
      if (editingZone) {
        const { error } = await supabase
          .from("delivery_zones")
          .update(formData)
          .eq("id", editingZone.id);
        if (error) throw error;
        toast.success("Delivery zone updated successfully");
      } else {
        const { error } = await supabase
          .from("delivery_zones")
          .insert([formData]);
        if (error) throw error;
        toast.success("Delivery zone created successfully");
      }
      
      setZoneDialogOpen(false);
      setEditingZone(null);
      refetchZones();
    } catch (error) {
      console.error("Error saving delivery zone:", error);
      toast.error("Failed to save delivery zone");
    }
  };

  const updateTownStatus = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from("towns")
        .update({ is_active })
        .eq("id", id);
      
      if (error) throw error;
      toast.success(`Town ${is_active ? 'activated' : 'deactivated'} successfully`);
      refetchTowns();
    } catch (error) {
      console.error("Error updating town status:", error);
      toast.error("Failed to update town status");
    }
  };

  const updateZoneStatus = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from("delivery_zones")
        .update({ is_active })
        .eq("id", id);
      
      if (error) throw error;
      toast.success(`Zone ${is_active ? 'activated' : 'deactivated'} successfully`);
      refetchZones();
    } catch (error) {
      console.error("Error updating zone status:", error);
      toast.error("Failed to update zone status");
    }
  };

  const deleteTown = async (id: string) => {
    if (!confirm("Are you sure you want to delete this town?")) return;
    
    try {
      const { error } = await supabase
        .from("towns")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Town deleted successfully");
      refetchTowns();
    } catch (error) {
      console.error("Error deleting town:", error);
      toast.error("Failed to delete town");
    }
  };

  const deleteZone = async (id: string) => {
    if (!confirm("Are you sure you want to delete this delivery zone?")) return;
    
    try {
      const { error } = await supabase
        .from("delivery_zones")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Delivery zone deleted successfully");
      refetchZones();
    } catch (error) {
      console.error("Error deleting delivery zone:", error);
      toast.error("Failed to delete delivery zone");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delivery Management</h1>
          <p className="text-muted-foreground">
            Manage delivery zones, towns, and service areas
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Towns</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {towns.filter(t => t.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              out of {towns.length} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Zones</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {zones.filter(z => z.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              active zones
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitlist.length}</div>
            <p className="text-xs text-muted-foreground">
              people waiting
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="zones" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Delivery Zones
          </TabsTrigger>
          <TabsTrigger value="towns" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Towns
          </TabsTrigger>
          <TabsTrigger value="waitlist" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Waitlist
          </TabsTrigger>
        </TabsList>

        {/* Delivery Zones Tab */}
        <TabsContent value="zones" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Delivery Zones ({zones.length})</h2>
            <Dialog open={zoneDialogOpen} onOpenChange={setZoneDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Zone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingZone ? "Edit Delivery Zone" : "Add New Delivery Zone"}
                  </DialogTitle>
                </DialogHeader>
                <ZoneForm
                  zone={editingZone}
                  towns={towns}
                  onSubmit={handleZoneSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {zonesLoading ? (
                <div className="p-6 text-center">Loading delivery zones...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone Name</TableHead>
                      <TableHead>Town</TableHead>
                      <TableHead>Delivery Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zones.map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">{zone.zone_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{zone.town}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatPrice(zone.delivery_fee)} XAF
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={zone.is_active}
                              onCheckedChange={(checked) => updateZoneStatus(zone.id, checked)}
                            />
                            <Badge variant={zone.is_active ? "default" : "secondary"}>
                              {zone.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(zone.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingZone(zone);
                                setZoneDialogOpen(true);
                              }}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteZone(zone.id)}
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

        {/* Towns Tab */}
        <TabsContent value="towns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Towns ({towns.length})</h2>
            <Dialog open={townDialogOpen} onOpenChange={setTownDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Town
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingTown ? "Edit Town" : "Add New Town"}
                  </DialogTitle>
                </DialogHeader>
                <TownForm
                  town={editingTown}
                  onSubmit={handleTownSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {townsLoading ? (
                <div className="p-6 text-center">Loading towns...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {towns.map((town) => (
                      <TableRow key={town.id}>
                        <TableCell className="font-medium">{town.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={town.is_active}
                              onCheckedChange={(checked) => updateTownStatus(town.id, checked)}
                            />
                            <Badge variant={town.is_active ? "default" : "secondary"}>
                              {town.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(town.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingTown(town);
                                setTownDialogOpen(true);
                              }}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteTown(town.id)}
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

        {/* Waitlist Tab */}
        <TabsContent value="waitlist" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Waitlist Entries ({waitlist.length})</h2>
          </div>

          <Card>
            <CardContent className="p-0">
              {waitlistLoading ? (
                <div className="p-6 text-center">Loading waitlist...</div>
              ) : waitlist.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No waitlist entries yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Town</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waitlist.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.name}</TableCell>
                        <TableCell>{entry.email}</TableCell>
                        <TableCell>{entry.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.town}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(entry.created_at).toLocaleDateString()}
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

// Form components
function TownForm({ town, onSubmit }: any) {
  const [name, setName] = useState(town?.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Town Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter town name"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {town ? "Update Town" : "Create Town"}
      </Button>
    </form>
  );
}

function ZoneForm({ zone, towns, onSubmit }: any) {
  const [formData, setFormData] = useState({
    zone_name: zone?.zone_name || "",
    town: zone?.town || "",
    delivery_fee: zone?.delivery_fee || 0,
    is_active: zone?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="zone_name">Zone Name</Label>
        <Input
          id="zone_name"
          value={formData.zone_name}
          onChange={(e) => setFormData({...formData, zone_name: e.target.value})}
          placeholder="Enter zone name"
          required
        />
      </div>

      <div>
        <Label htmlFor="town">Town</Label>
        <Input
          id="town"
          value={formData.town}
          onChange={(e) => setFormData({...formData, town: e.target.value})}
          placeholder="Enter town name"
          required
        />
      </div>

      <div>
        <Label htmlFor="delivery_fee">Delivery Fee (XAF)</Label>
        <Input
          id="delivery_fee"
          type="number"
          value={formData.delivery_fee}
          onChange={(e) => setFormData({...formData, delivery_fee: parseInt(e.target.value) || 0})}
          placeholder="Enter delivery fee"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <Button type="submit" className="w-full">
        {zone ? "Update Zone" : "Create Zone"}
      </Button>
    </form>
  );
}