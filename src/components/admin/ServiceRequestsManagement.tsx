import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { 
  Truck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Filter,
  MapPin,
  Phone,
  User,
  Package,
  ShoppingBag,
  MessageSquare,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface ServiceRequest {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  town: string;
  items: any;
  notes: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

const SERVICE_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "processing", label: "In Progress", color: "bg-blue-500" },
  { value: "completed", label: "Completed", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" }
];

const SERVICE_TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  errands: { label: "Errands", icon: ShoppingBag, color: "bg-orange-500" },
  "package-delivery": { label: "Package Delivery", icon: Package, color: "bg-blue-500" },
  "pickups-dropoffs": { label: "Pickups & Drop-offs", icon: Truck, color: "bg-green-500" },
  "custom-request": { label: "Custom Request", icon: MessageSquare, color: "bg-purple-500" },
};

export function ServiceRequestsManagement() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterTown, setFilterTown] = useState<string>("all");

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .like("order_number", "SVC-%")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      toast.error("Failed to fetch service requests");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: status })
        .eq("id", requestId);

      if (error) throw error;
      
      toast.success("Status updated successfully");
      fetchServiceRequests();
      
      if (selectedRequest?.id === requestId) {
        setSelectedRequest({ ...selectedRequest, payment_status: status });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getServiceType = (request: ServiceRequest): string => {
    const items = request.items as any[];
    return items?.[0]?.serviceType || "custom-request";
  };

  const getServiceTypeBadge = (request: ServiceRequest) => {
    const serviceType = getServiceType(request);
    const config = SERVICE_TYPE_CONFIG[serviceType] || SERVICE_TYPE_CONFIG["custom-request"];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const config = SERVICE_STATUSES.find(s => s.value === status) || SERVICE_STATUSES[0];
    return (
      <Badge 
        variant={status === 'completed' ? 'default' : 'secondary'}
        className={status === 'completed' ? 'bg-green-500' : 
                  status === 'pending' ? 'bg-yellow-500' : 
                  status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'}
      >
        {config.label}
      </Badge>
    );
  };

  const filteredRequests = requests.filter(request => {
    const statusMatch = filterStatus === "all" || request.payment_status === filterStatus;
    const typeMatch = filterType === "all" || getServiceType(request) === filterType;
    const townMatch = filterTown === "all" || request.town === filterTown;
    return statusMatch && typeMatch && townMatch;
  });

  const uniqueTowns = [...new Set(requests.map(r => r.town))];

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.payment_status === 'pending').length,
    inProgress: requests.filter(r => r.payment_status === 'processing').length,
    completed: requests.filter(r => r.payment_status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded animate-pulse w-20" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Requests</h1>
          <p className="text-muted-foreground">
            Manage errands, deliveries, and custom requests
          </p>
        </div>
        <Button onClick={fetchServiceRequests} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {SERVICE_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="type-filter">Service Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(SERVICE_TYPE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="town-filter">Town</Label>
              <Select value={filterTown} onValueChange={setFilterTown}>
                <SelectTrigger>
                  <SelectValue placeholder="All towns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Towns</SelectItem>
                  {uniqueTowns.map((town) => (
                    <SelectItem key={town} value={town}>
                      {town}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Town</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No service requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.order_number}
                    </TableCell>
                    <TableCell>
                      {getServiceTypeBadge(request)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{request.customer_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {request.customer_phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {request.town}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.payment_status)}
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request);
                            setDetailOpen(true);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Select
                          value={request.payment_status}
                          onValueChange={(status) => updateRequestStatus(request.id, status)}
                        >
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICE_STATUSES.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details - {selectedRequest?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <ServiceRequestDetail 
              request={selectedRequest} 
              onStatusUpdate={updateRequestStatus} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServiceRequestDetail({ 
  request, 
  onStatusUpdate 
}: { 
  request: ServiceRequest; 
  onStatusUpdate: (id: string, status: string) => void;
}) {
  const serviceType = (request.items as any[])?.[0]?.serviceType || "custom-request";
  const config = SERVICE_TYPE_CONFIG[serviceType] || SERVICE_TYPE_CONFIG["custom-request"];
  const Icon = config.icon;

  // Parse notes to extract structured info
  const notes = request.notes || "";
  
  return (
    <div className="space-y-6">
      {/* Service Type */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${config.color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{config.label}</h3>
              <p className="text-sm text-muted-foreground">Service Request</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Name</Label>
              <p className="font-semibold">{request.customer_name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
              <p className="font-semibold">{request.customer_phone}</p>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Town</Label>
            <Badge variant="outline">{request.town}</Badge>
          </div>
          <div>
            <a 
              href={`https://wa.me/${request.customer_phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:underline"
            >
              <MessageSquare className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Request Details (from notes) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Request Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg">
            {notes}
          </pre>
        </CardContent>
      </Card>

      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={request.payment_status}
            onValueChange={(status) => onStatusUpdate(request.id, status)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
