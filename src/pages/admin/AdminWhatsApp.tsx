import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Search, RotateCcw, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useCustomerSessions,
  useWhatsAppMessages,
  resetCustomerSession,
  WhatsAppSession,
} from "@/hooks/useCustomers";

function stateColor(state: string) {
  if (state === "idle") return "secondary";
  if (state.includes("error") || state.includes("failed")) return "destructive";
  return "default";
}

export default function AdminWhatsApp() {
  const { sessions, loading } = useCustomerSessions();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<WhatsAppSession | null>(null);
  const messages = useWhatsAppMessages(selected?.customer_id ?? undefined);
  const { toast } = useToast();

  const filtered = sessions.filter((s) =>
    !search.trim() ? true : s.phone.includes(search.trim())
  );

  const handleReset = async (s: WhatsAppSession) => {
    try {
      await resetCustomerSession(s.id);
      toast({ title: "Session reset", description: `State cleared for ${s.phone}` });
    } catch (e: any) {
      toast({ title: "Failed to reset", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          WhatsApp Operations
        </h1>
        <p className="text-sm text-muted-foreground">
          Live customer conversations and bot session state
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Card className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-6">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No conversations.</p>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-auto">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`w-full text-left p-3 rounded-md border transition-colors ${
                    selected?.id === s.id ? "border-primary bg-muted/40" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {s.phone}
                    </span>
                    <Badge variant={stateColor(s.current_state) as any} className="text-[10px]">
                      {s.current_state}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {s.channel} · {s.is_active ? "active" : "inactive"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(s.updated_at).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4 min-h-[400px]">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Select a conversation to view messages.
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between pb-3 border-b mb-3">
                <div>
                  <p className="font-semibold">{selected.phone}</p>
                  <p className="text-xs text-muted-foreground">
                    State: {selected.current_state}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleReset(selected)} className="gap-2">
                  <RotateCcw className="h-3 w-3" /> Reset state
                </Button>
              </div>

              <div className="flex-1 overflow-auto space-y-2 max-h-[500px]">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No messages yet for this customer.
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.direction === "outbound" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg p-3 text-sm ${
                          m.direction === "outbound"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {m.content || <em className="opacity-70">[{m.message_type}]</em>}
                        <p className="text-[10px] opacity-70 mt-1">
                          {new Date(m.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selected.temporary_data && Object.keys(selected.temporary_data).length > 0 && (
                <details className="mt-3 text-xs">
                  <summary className="cursor-pointer text-muted-foreground">
                    Session data
                  </summary>
                  <pre className="mt-2 bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(selected.temporary_data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
