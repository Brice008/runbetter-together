import { useState, useEffect } from "react";
import { Run } from "@/types/running";

export interface Activity {
  id: string;
  date: Date;
  type: string;
  duration: number;
}

const STORAGE_KEY = "sports-activities";

export const useActivities = (runs: Run[]) => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).map((activity: any) => ({
      ...activity,
      date: new Date(activity.date)
    })) : [];
  });

  // Synchroniser les activités avec les courses
  useEffect(() => {
    const runActivities = runs.map(run => ({
      id: run.id,
      date: new Date(run.date),
      type: "cardio",
      duration: run.duration / 60, // Convertir les secondes en minutes
    }));

    // Filtrer les activités existantes pour ne garder que celles qui ne sont pas des courses
    const nonRunActivities = activities.filter(
      activity => activity.type !== "cardio"
    );

    // Combiner les activités non-course avec les nouvelles activités de course
    const newActivities = [...nonRunActivities, ...runActivities];
    
    setActivities(newActivities);
  }, [runs]);

  // Sauvegarder dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity: Omit<Activity, "id">) => {
    const newActivity = {
      ...activity,
      id: crypto.randomUUID(),
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id ? { ...activity, ...updates } : activity
      )
    );
  };

  return {
    activities,
    addActivity,
    deleteActivity,
    updateActivity,
  };
};