import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, ChevronDown } from "lucide-react";
import { useTowns } from "@/hooks/useTowns";

interface TownSelectorProps {
  selectedTown: string;
  onTownChange: (town: string, isActive: boolean) => void;
}

export function TownSelector({ selectedTown, onTownChange }: TownSelectorProps) {
  const { activeTowns, inactiveTowns, loading } = useTowns();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-muted rounded-lg w-48"></div>
      </div>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm shadow-lg">
      <div className="p-3">
        <Select 
          value={selectedTown} 
          onValueChange={(value) => {
            const town = [...activeTowns, ...inactiveTowns].find(t => t.name === value);
            if (town) {
              onTownChange(value, town.is_active);
            }
          }}
        >
          <SelectTrigger className="border-0 bg-transparent focus:ring-0 focus:ring-offset-0 h-auto p-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-xs text-muted-foreground">Delivering to</div>
                <SelectValue className="text-sm font-medium text-foreground">
                  {selectedTown}
                </SelectValue>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </SelectTrigger>
          <SelectContent className="max-w-xs">
            {activeTowns.length > 0 && (
              <>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Available Now</div>
                {activeTowns.map((town) => (
                  <SelectItem key={town.id} value={town.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {town.name}
                    </div>
                  </SelectItem>
                ))}
              </>
            )}
            
            {inactiveTowns.length > 0 && (
              <>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">Coming Soon</div>
                {inactiveTowns.map((town) => (
                  <SelectItem key={town.id} value={town.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{town.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">Soon</span>
                    </div>
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}