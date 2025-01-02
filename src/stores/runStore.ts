import { create } from "zustand";
import { Run } from "@/types/running";

interface RunState {
  runs: Run[];
  addRun: (run: Run) => void;
  updateRun: (id: string, updatedRun: Partial<Run>) => void;
  deleteRun: (id: string) => void;
  loadRuns: () => void;
}

export const useRunStore = create<RunState>((set) => ({
  runs: [],
  addRun: (run) => {
    set((state) => {
      const newRuns = [...state.runs, run];
      localStorage.setItem("running-tracker-runs", JSON.stringify(newRuns));
      return { runs: newRuns };
    });
  },
  updateRun: (id, updatedRun) => {
    set((state) => {
      const newRuns = state.runs.map((run) =>
        run.id === id ? { ...run, ...updatedRun } : run
      );
      localStorage.setItem("running-tracker-runs", JSON.stringify(newRuns));
      return { runs: newRuns };
    });
  },
  deleteRun: (id) => {
    set((state) => {
      const newRuns = state.runs.filter((run) => run.id !== id);
      localStorage.setItem("running-tracker-runs", JSON.stringify(newRuns));
      return { runs: newRuns };
    });
  },
  loadRuns: () => {
    const savedRuns = localStorage.getItem("running-tracker-runs");
    if (savedRuns) {
      const parsedRuns = JSON.parse(savedRuns).map((run: Run) => ({
        ...run,
        date: new Date(run.date),
      }));
      set({ runs: parsedRuns });
    }
  },
}));