import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WaitlistSignup } from "@/components/WaitlistSignup";
import { useTowns } from "@/hooks/useTowns";

interface TownSelectorProps {
  selectedTown: string;
  onTownChange: (town: string) => void;
}

export const TownSelector = ({ selectedTown, onTownChange }: TownSelectorProps) => {
  const { towns, loading } = useTowns();
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistTown, setWaitlistTown] = useState("");

  const handleTownSelect = (town: { name: string; is_active: boolean }) => {
    if (town.is_active) {
      onTownChange(town.name);
    } else {
      setWaitlistTown(town.name);
      setShowWaitlist(true);
    }
  };
  return (
    <>
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
        <DropdownMenuContent className="w-full min-w-[300px] bg-background z-50">
          {loading ? (
            <DropdownMenuItem disabled>Loading towns...</DropdownMenuItem>
          ) : (
            towns.map((town) => (
              <DropdownMenuItem
                key={town.id}
                onClick={() => handleTownSelect(town)}
                className={`flex items-center justify-between cursor-pointer ${
                  selectedTown === town.name ? "bg-primary/10 text-primary" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{town.name}</span>
                </div>
                {!town.is_active && (
                  <span className="text-xs text-muted-foreground">Coming Soon</span>
                )}
                {selectedTown === town.name && (
                  <span className="text-xs text-primary font-medium">Selected</span>
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showWaitlist} onOpenChange={setShowWaitlist}>
        <DialogContent className="sm:max-w-md">
          <WaitlistSignup 
            selectedTown={waitlistTown} 
            onClose={() => setShowWaitlist(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};