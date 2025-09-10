import { MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TownSelectorProps {
  selectedTown: string;
  onTownChange: (town: string) => void;
}

const towns = [
  { id: "limbe", name: "Limbe", available: true },
  { id: "douala", name: "Douala", available: false },
  { id: "yaounde", name: "Yaoundé", available: false },
  { id: "buea", name: "Buea", available: false },
];

export const TownSelector = ({ selectedTown, onTownChange }: TownSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between chop-input hover:bg-primary/5"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">Delivering to {selectedTown}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[300px]">
        {towns.map((town) => (
          <DropdownMenuItem
            key={town.id}
            onClick={() => town.available && onTownChange(town.name)}
            className={`flex items-center justify-between ${
              !town.available ? "opacity-50 cursor-not-allowed" : ""
            } ${selectedTown === town.name ? "bg-primary/10 text-primary" : ""}`}
            disabled={!town.available}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{town.name}</span>
            </div>
            {!town.available && (
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            )}
            {selectedTown === town.name && (
              <span className="text-xs text-primary font-medium">Selected</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};