import { create } from "zustand";
import { Activity } from "@/types/activity";
import { v4 as uuidv4 } from "uuid";

interface ActivityState {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id">) => void;
  loadActivities: () => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  addActivity: (activity) => {
    const newActivity = {
      ...activity,
      id: uuidv4(),
    };
    set((state) => {
      const newActivities = [...state.activities, newActivity];
      localStorage.setItem("activities", JSON.stringify(newActivities));
      return { activities: newActivities };
    });
  },
  loadActivities: () => {
    const savedActivities = localStorage.getItem("activities");
    if (savedActivities) {
      const parsedActivities = JSON.parse(savedActivities).map((activity: Activity) => ({
        ...activity,
        date: new Date(activity.date),
      }));
      set({ activities: parsedActivities });
    }
  },
}));