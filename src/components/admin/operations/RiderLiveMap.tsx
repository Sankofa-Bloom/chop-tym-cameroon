import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { RiderLocation } from "@/hooks/useRiderOps";

const TOKEN_KEY = "choptym_mapbox_token";
// Limbe, Cameroon
const DEFAULT_CENTER: [number, number] = [9.2085, 4.0221];

const statusColor: Record<string, string> = {
  available: "#10b981",
  busy: "#f59e0b",
  offline: "#9ca3af",
};

interface RiderLiveMapProps {
  locations: RiderLocation[];
}

export const RiderLiveMap = ({ locations }: RiderLiveMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [token, setToken] = useState<string>(
    () => (import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN as string) || localStorage.getItem(TOKEN_KEY) || ""
  );
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: 12,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    locations
      .filter((r) => r.lat != null && r.lng != null)
      .forEach((r) => {
        const el = document.createElement("div");
        el.style.width = "16px";
        el.style.height = "16px";
        el.style.borderRadius = "9999px";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.4)";
        el.style.background = statusColor[r.current_status] ?? statusColor.offline;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([r.lng as number, r.lat as number])
          .setPopup(
            new mapboxgl.Popup({ offset: 16 }).setHTML(
              `<strong>${r.name}</strong><br/>${r.current_status} · ${r.active_orders_count}/${r.max_active_orders} orders`
            )
          )
          .addTo(map);
        markersRef.current.push(marker);
      });
  }, [locations]);

  const withCoords = locations.filter((r) => r.lat != null && r.lng != null).length;

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-4 h-4" /> Live Rider Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Paste your Mapbox public token to enable the live map. Get one at mapbox.com → Tokens.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="pk.eyJ1..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <Button
              onClick={() => {
                localStorage.setItem(TOKEN_KEY, tokenInput.trim());
                setToken(tokenInput.trim());
              }}
              disabled={!tokenInput.trim()}
            >
              Enable map
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Live Rider Map
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {withCoords} rider{withCoords === 1 ? "" : "s"} sharing location
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="h-[380px] w-full rounded-lg overflow-hidden" />
        {withCoords === 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            No rider is broadcasting a location yet — markers appear as riders come online.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
