import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Languages,
  StickyNote,
  Home,
  Briefcase,
  Store,
  GraduationCap,
  MapPinned,
} from "lucide-react";
import {
  useCustomer,
  useCustomerLocations,
  useCustomerOrders,
} from "@/hooks/useCustomers";

const LOCATION_ICON: Record<string, any> = {
  home: Home,
  office: Briefcase,
  shop: Store,
  school: GraduationCap,
};

export default function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading } = useCustomer(id);
  const { data: locations = [] } = useCustomerLocations(id);
  const { data: orders = [] } = useCustomerOrders(id, customer?.phone);

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading…</div>;
  }
  if (!customer) {
    return <div className="text-center py-12 text-muted-foreground">Customer not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Link to="/admin/customers">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to customers
        </Button>
      </Link>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {customer.preferred_name || "Unnamed customer"}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> {customer.phone}</span>
              {customer.email && (
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {customer.email}</span>
              )}
              <span className="flex items-center gap-1.5">
                <Languages className="h-4 w-4" />
                {customer.preferred_language === "fr" ? "Français" : "English"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{customer.total_orders} orders</Badge>
            <Badge>{customer.total_spent.toLocaleString()} XAF</Badge>
          </div>
        </div>
        {customer.notes && (
          <div className="mt-4 p-3 rounded-md bg-muted/50 text-sm flex gap-2">
            <StickyNote className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
            <p>{customer.notes}</p>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Saved Locations
          </h2>
          {locations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved locations yet.</p>
          ) : (
            <div className="space-y-3">
              {locations.map((loc: any) => {
                const Icon = LOCATION_ICON[(loc.location_name || "").toLowerCase()] || MapPinned;
                return (
                  <div key={loc.id} className="flex gap-3 p-3 rounded-md border">
                    <Icon className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium capitalize">{loc.location_name}</p>
                        {loc.is_default && (
                          <Badge variant="outline" className="text-[10px]">Default</Badge>
                        )}
                      </div>
                      {loc.address && (
                        <p className="text-sm text-muted-foreground">{loc.address}</p>
                      )}
                      {loc.landmark && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Landmark: {loc.landmark}
                        </p>
                      )}
                      {loc.notes && (
                        <p className="text-xs text-muted-foreground italic mt-0.5">{loc.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" /> Recent Orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-auto">
              {orders.map((o: any) => (
                <div key={o.id} className="flex items-center justify-between p-2 rounded-md border text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{o.reference_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.order_type} · {new Date(o.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[10px]">{o.status}</Badge>
                    <p className="text-xs mt-0.5">
                      {(o.actual_amount ?? o.estimated_amount ?? 0).toLocaleString()} XAF
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {customer.preferences && Object.keys(customer.preferences).length > 0 && (
        <Card className="p-6">
          <h2 className="font-semibold mb-3">Preferences</h2>
          <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
            {JSON.stringify(customer.preferences, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
