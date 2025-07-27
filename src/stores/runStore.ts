import { create } from "zustand";
import { Run } from "@/types/running";
import { supabase } from "@/integrations/supabase/client";
import { calculatePace, calculateSpeed } from "@/utils/calculations";

interface RunState {
  runs: Run[];
  loading: boolean;
  addRun: (run: Run) => Promise<void>;
  updateRun: (id: string, updatedRun: Partial<Run>) => Promise<void>;
  deleteRun: (id: string) => Promise<void>;
  loadRuns: () => Promise<void>;
}

export const useRunStore = create<RunState>((set, get) => ({
  runs: [],
  loading: false,
  addRun: async (run) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Utilisateur non authentifié");

    const { data, error } = await supabase
      .from('runs')
      .insert({
        id: run.id,
        user_id: user.id,
        distance: run.distance,
        duration: run.duration,
        date: run.date.toISOString(),
        notes: run.name || null
      })
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      runs: [...state.runs, run]
    }));
  },
  updateRun: async (id, updatedRun) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Utilisateur non authentifié");

    const updateData: any = {};
    if (updatedRun.distance !== undefined) updateData.distance = updatedRun.distance;
    if (updatedRun.duration !== undefined) updateData.duration = updatedRun.duration;
    if (updatedRun.date !== undefined) updateData.date = updatedRun.date.toISOString();
    if (updatedRun.name !== undefined) updateData.notes = updatedRun.name;

    const { error } = await supabase
      .from('runs')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    set((state) => ({
      runs: state.runs.map((run) =>
        run.id === id ? { ...run, ...updatedRun } : run
      )
    }));
  },
  deleteRun: async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Utilisateur non authentifié");

    const { error } = await supabase
      .from('runs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    set((state) => ({
      runs: state.runs.filter((run) => run.id !== id)
    }));
  },
  loadRuns: async () => {
    set({ loading: true });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ loading: false });
      return;
    }

    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des courses:', error);
      set({ loading: false });
      return;
    }

    const runs: Run[] = data.map((run) => {
      const unit = "km";
      const pace = calculatePace(run.distance, run.duration, unit);
      const speed = calculateSpeed(run.distance, run.duration, unit);
      
      return {
        id: run.id,
        distance: run.distance,
        duration: run.duration,
        date: new Date(run.date),
        name: run.notes || undefined,
        pace,
        speed,
        unit
      };
    });

    set({ runs, loading: false });
  },
}));