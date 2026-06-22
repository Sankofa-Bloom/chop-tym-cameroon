import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Phone, MapPin } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const { data: customers = [], isLoading } = useCustomers(search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Customers
          </h1>
          <p className="text-sm text-muted-foreground">
            Search and manage all ChopTym customers
          </p>
        </div>
        <Badge variant="secondary">{customers.length} shown</Badge>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by phone or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading customers…</div>
      ) : customers.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No customers found.
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c) => (
            <Link key={c.id} to={`/admin/customers/${c.id}`}>
              <Card className="p-4 hover:border-primary transition-colors h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {c.preferred_name || "Unnamed customer"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" />
                      {c.phone}
                    </p>
                  </div>
                  <Badge variant="outline" className="uppercase text-[10px]">
                    {c.preferred_language}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t">
                  <span>{c.total_orders} orders</span>
                  <span className="font-medium text-foreground">
                    {c.total_spent.toLocaleString()} XAF
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
