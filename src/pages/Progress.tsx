import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProgressChart from "@/components/ProgressChart";
import { Run } from "@/types/running";

const STORAGE_KEY = "running-tracker-runs";

const Progress = () => {
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

  const shortRuns = runs.filter(run => run.distance <= 3.50);
  const mediumRuns = runs.filter(run => run.distance > 3.50 && run.distance <= 5.25);
  const longRuns = runs.filter(run => run.distance > 5.25 && run.distance <= 7.5);

  return (
    <div className="container mx-auto p-4 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold">Progression</h1>
      </div>
      
      <div className="space-y-8">
        {shortRuns.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Courses courtes (0 - 3,50 km)</h2>
            <ProgressChart runs={shortRuns} />
          </div>
        )}
        
        {mediumRuns.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Courses moyennes (3,51 - 5,25 km)</h2>
            <ProgressChart runs={mediumRuns} />
          </div>
        )}
        
        {longRuns.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Courses longues (5,26 - 7,5 km)</h2>
            <ProgressChart runs={longRuns} />
          </div>
        )}

        {runs.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Aucune course enregistrée pour le moment
          </p>
        )}
      </div>
    </div>
  );
};

export default Progress;