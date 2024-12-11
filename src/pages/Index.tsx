import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddRunForm from "@/components/AddRunForm";
import RunHistory from "@/components/RunHistory";
import RunningStats from "@/components/RunningStats";
import ProgressChart from "@/components/ProgressChart";
import { Run, RunFormData } from "@/types/running";
import { calculatePace, calculateSpeed } from "@/utils/calculations";

const Index = () => {
  const [runs, setRuns] = useState<Run[]>([]);

  const handleAddRun = (formData: RunFormData) => {
    const duration = formData.hours * 3600 + formData.minutes * 60 + formData.seconds;
    const pace = calculatePace(formData.distance, duration);
    const speed = calculateSpeed(formData.distance, duration);

    const newRun: Run = {
      id: uuidv4(),
      date: new Date(),
      name: formData.name,
      distance: formData.distance,
      duration,
      pace,
      speed,
    };

    setRuns((prev) => [...prev, newRun]);
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
          <RunHistory runs={runs} />
        </div>
      )}
    </div>
  );
};

export default Index;