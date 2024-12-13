import RunningStats from "@/components/RunningStats";
import { Run } from "@/types/running";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const STORAGE_KEY = "running-tracker-runs";

const Stats = () => {
  // Charger les courses depuis le localStorage
  const savedRuns = localStorage.getItem(STORAGE_KEY);
  const runs: Run[] = savedRuns 
    ? JSON.parse(savedRuns).map((run: Run) => ({
        ...run,
        date: new Date(run.date)
      }))
    : [];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">Statistiques</h1>
      </div>
      
      {runs.length > 0 ? (
        <RunningStats runs={runs} />
      ) : (
        <p className="text-center text-gray-500">
          Aucune course enregistrée pour le moment
        </p>
      )}
    </div>
  );
};

export default Stats;