import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import AddRunForm from "@/components/AddRunForm";
import RunHistory from "@/components/RunHistory";
import RunningStats from "@/components/RunningStats";
import ProgressChart from "@/components/ProgressChart";
import { Run, RunFormData } from "@/types/running";
import { calculatePace, calculateSpeed } from "@/utils/calculations";
import { useToast } from "@/hooks/use-toast";

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
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Suivi de Course</h1>
      
      {runs.length > 0 && <RunningStats runs={runs} />}
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ajouter une course</h2>
          <AddRunForm onSubmit={handleAddRun} />
        </div>
        
        {runs.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Progression</h2>
            <ProgressChart runs={runs} />
          </div>
        )}
      </div>

      {runs.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Historique</h2>
          <RunHistory 
            runs={runs} 
            onDelete={handleDeleteRun}
            onUpdate={handleUpdateRun}
          />
        </div>
      )}
    </div>
  );
};

export default Index;