import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useTowns } from "@/hooks/useTowns";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Users, MapPin } from "lucide-react";

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  town: string;
  created_at: string;
}

export default function AdminTowns() {
  const { towns, loading, refetch } = useTowns();
  const [newTownName, setNewTownName] = useState("");
  const [editingTown, setEditingTown] = useState<string | null>(null);
  const [editTownName, setEditTownName] = useState("");
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loadingWaitlist, setLoadingWaitlist] = useState(false);

  const loadWaitlist = async () => {
    setLoadingWaitlist(true);
    try {
      const { data, error } = await supabase
        .from("town_waitlist" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWaitlist(data as unknown as WaitlistEntry[] || []);
    } catch (error) {
      console.error("Error loading waitlist:", error);
      toast.error("Failed to load waitlist");
    } finally {
      setLoadingWaitlist(false);
    }
  };

  const addTown = async () => {
    if (!newTownName.trim()) return;

    try {
      const { error } = await supabase
        .from("towns" as any)
        .insert([{ name: newTownName.trim(), is_active: false }]);

      if (error) throw error;

      toast.success("Town added successfully");
      setNewTownName("");
      refetch();
    } catch (error) {
      console.error("Error adding town:", error);
      toast.error("Failed to add town");
    }
  };

  const updateTown = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from("towns" as any)
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast.success("Town updated successfully");
      refetch();
    } catch (error) {
      console.error("Error updating town:", error);
      toast.error("Failed to update town");
    }
  };

  const deleteTown = async (id: string) => {
    if (!confirm("Are you sure you want to delete this town?")) return;

    try {
      const { error } = await supabase
        .from("towns" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Town deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting town:", error);
      toast.error("Failed to delete town");
    }
  };

  const startEditing = (town: any) => {
    setEditingTown(town.id);
    setEditTownName(town.name);
  };

  const saveEdit = async () => {
    if (!editingTown || !editTownName.trim()) return;

    await updateTown(editingTown, { name: editTownName.trim() });
    setEditingTown(null);
    setEditTownName("");
  };

  const cancelEdit = () => {
    setEditingTown(null);
    setEditTownName("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Towns Management</h1>
        <p className="text-muted-foreground">
          Manage available towns and view waitlist entries
        </p>
      </div>

      <Tabs defaultValue="towns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="towns">Towns</TabsTrigger>
          <TabsTrigger value="waitlist" onClick={loadWaitlist}>
            Waitlist ({waitlist.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="towns">
          <div className="space-y-6">
            {/* Add New Town */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Town
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="townName">Town Name</Label>
                    <Input
                      id="townName"
                      placeholder="Enter town name"
                      value={newTownName}
                      onChange={(e) => setNewTownName(e.target.value)}
                    />
                  </div>
                  <Button onClick={addTown} className="mt-6">
                    Add Town
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Towns List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Existing Towns
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading towns...</p>
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
                          <TableCell>
                            {editingTown === town.id ? (
                              <Input
                                value={editTownName}
                                onChange={(e) => setEditTownName(e.target.value)}
                                className="w-32"
                              />
                            ) : (
                              town.name
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={town.is_active}
                                onCheckedChange={(checked) =>
                                  updateTown(town.id, { is_active: checked })
                                }
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
                              {editingTown === town.id ? (
                                <>
                                  <Button size="sm" onClick={saveEdit}>
                                    Save
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEditing(town)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => deleteTown(town.id)}
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
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="waitlist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Waitlist Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingWaitlist ? (
                <p>Loading waitlist...</p>
              ) : waitlist.length === 0 ? (
                <p className="text-muted-foreground">No waitlist entries yet.</p>
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