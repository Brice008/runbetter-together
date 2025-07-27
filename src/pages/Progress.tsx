import BackButton from "@/components/BackButton";
import ProgressSection from "@/components/ProgressSection";
import { useRunStore } from "@/stores/runStore";
import { useLoadUserData } from "@/hooks/useLoadUserData";

const Progress = () => {
  const { runs } = useRunStore();
  
  // Load user data when authenticated
  useLoadUserData();

  const veryShortRuns = runs.filter(run => run.distance <= 4);
  const shortRuns = runs.filter(run => run.distance > 4 && run.distance <= 5);
  const mediumRuns = runs.filter(run => run.distance > 5 && run.distance <= 6);
  const longRuns = runs.filter(run => run.distance > 6 && run.distance <= 7);
  const veryLongRuns = runs.filter(run => run.distance > 7);

  return (
    <div className="container mx-auto p-4 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-3xl sm:text-4xl font-bold">Progression</h1>
      </div>
      
      <div className="space-y-8">
        <ProgressSection 
          title="Courses très courtes (0 - 4 km)" 
          runs={veryShortRuns} 
        />
        
        <ProgressSection 
          title="Courses courtes (4,01 - 5 km)" 
          runs={shortRuns} 
        />
        
        <ProgressSection 
          title="Courses moyennes (5,01 - 6 km)" 
          runs={mediumRuns} 
        />

        <ProgressSection 
          title="Courses longues (6,01 - 7 km)" 
          runs={longRuns} 
        />

        <ProgressSection 
          title="Courses très longues (> 7 km)" 
          runs={veryLongRuns} 
        />

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