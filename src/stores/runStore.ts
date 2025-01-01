import { create } from 'zustand';
import { Run } from '@/types/running';
import { useActivityStore } from './activityStore';

interface RunState {
  runs: Run[];
  addRun: (run: Run) => void;
  updateRun: (id: string, run: Partial<Run>) => void;
  deleteRun: (id: string) => void;
}

const STORAGE_KEY = "running-tracker-runs";

// Charger les courses depuis le localStorage
const loadRuns = (): Run[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  return JSON.parse(saved).map((run: Run) => ({
    ...run,
    date: new Date(run.date)
  }));
};

export const useRunStore = create<RunState>((set) => ({
  runs: loadRuns(),
  addRun: (run) => {
    set((state) => {
      const newRuns = [...state.runs, run];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRuns));

      // Ajouter automatiquement l'activité au calendrier avec un jour de moins
      const activityDate = new Date(run.date);
      activityDate.setDate(activityDate.getDate() - 1);
      
      const { addActivity } = useActivityStore.getState();
      addActivity({
        date: activityDate,
        type: "cardio",
        duration: run.duration / 60, // Convertir les secondes en minutes
      });

      return { runs: newRuns };
    });
  },
  updateRun: (id, updates) => set((state) => {
    const newRuns = state.runs.map((run) =>
      run.id === id ? { ...run, ...updates } : run
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRuns));
    return { runs: newRuns };
  }),
  deleteRun: (id) => set((state) => {
    const newRuns = state.runs.filter((run) => run.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRuns));
    return { runs: newRuns };
  }),
}));