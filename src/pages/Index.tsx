import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddRunForm from "@/components/AddRunForm";
import RunHistory from "@/components/RunHistory";
import ProgressChart from "@/components/ProgressChart";
import RunCalendar from "@/components/RunCalendar";
import { Run, RunFormData } from "@/types/running";
import { calculatePace, calculateSpeed } from "@/utils/calculations";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, TrendingUp, Target } from "lucide-react";

const STORAGE_KEY = "running-tracker-runs";

const Index = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const { toast } = useToast();

  // Charger les courses depuis le localStorage au démarrage
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

  // Sauvegarder les courses dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
  }, [runs]);

  const handleAddRun = (formData: RunFormData) => {
    const duration = formData.hours * 3600 + formData.minutes * 60 + formData.seconds;
    const pace = calculatePace(formData.distance, duration);
    const speed = calculateSpeed(formData.distance, duration);

    const newRun: Run = {
      id: uuidv4(),
      date: formData.date,
      name: formData.name,
      distance: formData.distance,
      duration,
      pace,
      speed,
      unit: formData.unit,
    };

    setRuns((prev) => [...prev, newRun]);
    
    toast({
      title: "Course ajoutée",
      description: "La course a été enregistrée avec succès",
    });
  };

  const handleDeleteRun = (id: string) => {
    setRuns((prev) => prev.filter((run) => run.id !== id));
    toast({
      title: "Course supprimée",
      description: "La course a été supprimée avec succès",
    });
  };

  const handleUpdateRun = (id: string, updatedRun: Partial<Run>) => {
    setRuns((prev) =>
      prev.map((run) => {
        if (run.id === id) {
          const duration = updatedRun.duration ?? run.duration;
          const distance = updatedRun.distance ?? run.distance;
          const pace = calculatePace(distance, duration);
          const speed = calculateSpeed(distance, duration);

          return {
            ...run,
            ...updatedRun,
            pace,
            speed,
          };
        }
        return run;
      })
    );

    toast({
      title: "Course modifiée",
      description: "La course a été modifiée avec succès",
    });
  };

  return (
    <div className="container mx-auto p-4 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Suivi de Course</h1>
          <RunCalendar runs={runs} />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to="/progress">
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progression
            </Button>
          </Link>
          <Link to="/stats">
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </Button>
          </Link>
          <Link to="/goals">
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <Target className="h-4 w-4" />
              Objectifs
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <div className="order-1 lg:order-none">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Ajouter une course</h2>
          <AddRunForm onSubmit={handleAddRun} />
        </div>
        
        {runs.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Progression</h2>
            <ProgressChart runs={runs} />
          </div>
        )}
      </div>

      {runs.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Historique</h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-full inline-block align-middle">
              <RunHistory 
                runs={runs} 
                onDelete={handleDeleteRun}
                onUpdate={handleUpdateRun}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;