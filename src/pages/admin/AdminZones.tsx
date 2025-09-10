import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit2, Plus, Save, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeliveryZones } from "@/hooks/useDeliveryZones";
import { useTowns } from "@/hooks/useTowns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AdminZones = () => {
  const [newZone, setNewZone] = useState({ town: "", zone_name: "", delivery_fee: "" });
  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [editData, setEditData] = useState({ zone_name: "", delivery_fee: "" });
  
  const { zones, loading, fetchAllZones } = useDeliveryZones();
  const { towns } = useTowns();
  const { toast } = useToast();

  useEffect(() => {
    fetchAllZones();
  }, []);

  const addZone = async () => {
    if (!newZone.town || !newZone.zone_name || !newZone.delivery_fee) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("delivery_zones")
        .insert({
          town: newZone.town,
          zone_name: newZone.zone_name,
          delivery_fee: parseInt(newZone.delivery_fee)
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery zone added successfully",
      });

      setNewZone({ town: "", zone_name: "", delivery_fee: "" });
      fetchAllZones();
    } catch (error) {
      console.error("Error adding zone:", error);
      toast({
        title: "Error",
        description: "Failed to add delivery zone",
        variant: "destructive",
      });
    }
  };

  const updateZone = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from("delivery_zones")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery zone updated successfully",
      });

      fetchAllZones();
    } catch (error) {
      console.error("Error updating zone:", error);
      toast({
        title: "Error",
        description: "Failed to update delivery zone",
        variant: "destructive",
      });
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

      toast({
        title: "Success",
        description: "Delivery zone deleted successfully",
      });

      fetchAllZones();
    } catch (error) {
      console.error("Error deleting zone:", error);
      toast({
        title: "Error",
        description: "Failed to delete delivery zone",
        variant: "destructive",
      });
    }
  };

  const startEditing = (zone: any) => {
    setEditingZone(zone.id);
    setEditData({
      zone_name: zone.zone_name,
      delivery_fee: zone.delivery_fee.toString()
    });
  };

  const saveEdit = async () => {
    if (!editData.zone_name || !editData.delivery_fee) return;

    await updateZone(editingZone!, {
      zone_name: editData.zone_name,
      delivery_fee: parseInt(editData.delivery_fee)
    });
    
    setEditingZone(null);
    setEditData({ zone_name: "", delivery_fee: "" });
  };

  const cancelEdit = () => {
    setEditingZone(null);
    setEditData({ zone_name: "", delivery_fee: "" });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="p-6">Loading delivery zones...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Delivery Zones</h1>
        <p className="text-muted-foreground">
          Manage delivery zones and fees for different towns
        </p>
      </div>

      {/* Add New Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Delivery Zone</CardTitle>
          <CardDescription>
            Create a new delivery zone with custom fees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="newTown">Town</Label>
              <Select value={newZone.town} onValueChange={(value) => setNewZone({...newZone, town: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select town" />
                </SelectTrigger>
                <SelectContent>
                  {towns.filter(town => town.is_active).map((town) => (
                    <SelectItem key={town.id} value={town.name}>
                      {town.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="newZoneName">Zone Name</Label>
              <Input
                id="newZoneName"
                value={newZone.zone_name}
                onChange={(e) => setNewZone({...newZone, zone_name: e.target.value})}
                placeholder="e.g., City Center, Suburbs"
              />
            </div>
            <div>
              <Label htmlFor="newDeliveryFee">Delivery Fee (XAF)</Label>
              <Input
                id="newDeliveryFee"
                type="number"
                value={newZone.delivery_fee}
                onChange={(e) => setNewZone({...newZone, delivery_fee: e.target.value})}
                placeholder="0"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addZone} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Zone
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Zones List */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Zones ({zones.length})</CardTitle>
          <CardDescription>
            Manage existing delivery zones and fees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {zones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No delivery zones yet. Add one above to get started.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Town</TableHead>
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Delivery Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.town}</TableCell>
                      <TableCell>
                        {editingZone === zone.id ? (
                          <Input
                            value={editData.zone_name}
                            onChange={(e) => setEditData({...editData, zone_name: e.target.value})}
                            className="w-full"
                          />
                        ) : (
                          zone.zone_name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingZone === zone.id ? (
                          <Input
                            type="number"
                            value={editData.delivery_fee}
                            onChange={(e) => setEditData({...editData, delivery_fee: e.target.value})}
                            className="w-full"
                          />
                        ) : (
                          formatPrice(zone.delivery_fee)
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={zone.is_active}
                          onCheckedChange={(checked) => updateZone(zone.id, { is_active: checked })}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(zone.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {editingZone === zone.id ? (
                            <>
                              <Button size="sm" onClick={saveEdit}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => startEditing(zone)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteZone(zone.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminZones;