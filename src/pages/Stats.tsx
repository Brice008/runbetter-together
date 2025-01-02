import { useState, useEffect } from "react";
import RunningStats from "@/components/RunningStats";
import ActivityStats from "@/components/ActivityStats";
import { Run } from "@/types/running";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const STORAGE_KEY = "running-tracker-runs";
const ACTIVITIES_STORAGE_KEY = "sports-activities";

const Stats = () => {
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    const savedRuns = localStorage.getItem(STORAGE_KEY);
    if (savedRuns) {
      const parsedRuns = JSON.parse(savedRuns).map((run: Run) => ({
        ...run,
        date: new Date(run.date)
      }));
      setRuns(parsedRuns);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold">Statistiques</h1>
      </div>
      
      <ActivityStats />
      
      {runs.length > 0 ? (
        <RunningStats runs={runs} />
      ) : (
        <p className="text-center text-gray-500 py-8">
          Aucune course enregistrée pour le moment
        </p>
      )}
    </div>
  );
};

export default Stats;