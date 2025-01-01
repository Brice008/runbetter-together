import { create } from 'zustand';
import { Activity } from '@/hooks/useActivities';

interface ActivityState {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id">) => void;
  deleteActivity: (id: string) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
}

const STORAGE_KEY = "sports-activities";

// Load initial state from localStorage
const loadActivities = (): Activity[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved).map((activity: any) => ({
    ...activity,
    date: new Date(activity.date)
  })) : [];
};

export const useActivityStore = create<ActivityState>((set) => ({
  activities: loadActivities(),
  addActivity: (activity) => set((state) => {
    const newActivity = {
      ...activity,
      id: crypto.randomUUID(),
    };
    const newActivities = [...state.activities, newActivity];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities));
    return { activities: newActivities };
  }),
  deleteActivity: (id) => set((state) => {
    const newActivities = state.activities.filter(activity => activity.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities));
    return { activities: newActivities };
  }),
  updateActivity: (id, updates) => set((state) => {
    const newActivities = state.activities.map(activity =>
      activity.id === id ? { ...activity, ...updates } : activity
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities));
    return { activities: newActivities };
  }),
}));