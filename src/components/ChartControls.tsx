import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowUp } from "lucide-react";

interface ChartControlsProps {
  showSpeed: boolean;
  showDistance: boolean;
  onToggleSpeed: () => void;
  onToggleDistance: () => void;
}

const ChartControls = ({
  showSpeed,
  showDistance,
  onToggleSpeed,
  onToggleDistance,
}: ChartControlsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={showSpeed ? "default" : "outline"}
        size="sm"
        onClick={onToggleSpeed}
        className="gap-2"
      >
        <ArrowUp className="h-4 w-4" />
        Vitesse
      </Button>
      <Button
        variant={showDistance ? "default" : "outline"}
        size="sm"
        onClick={onToggleDistance}
        className="gap-2"
      >
        <TrendingUp className="h-4 w-4" />
        Distance
      </Button>
    </div>
  );
};

export default ChartControls;