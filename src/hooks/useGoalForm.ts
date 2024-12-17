import { useState, useEffect } from "react";
import { Goal } from "@/types/goals";
import { calculateSpeed } from "@/utils/calculations";

interface GoalFormData {
  name: string;
  targetDistance: string;
  hours: string;
  minutes: string;
  seconds: string;
  targetSpeed: string;
  deadline: string;
}

export const useGoalForm = (goal: Goal | null) => {
  const [formData, setFormData] = useState<GoalFormData>({
    name: "",
    targetDistance: "",
    hours: "",
    minutes: "",
    seconds: "",
    targetSpeed: "",
    deadline: "",
  });

  useEffect(() => {
    if (goal) {
      const totalSeconds = goal.targetTime || 0;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setFormData({
        name: goal.name,
        targetDistance: goal.targetDistance.toString(),
        hours: hours.toString(),
        minutes: minutes.toString(),
        seconds: seconds.toString(),
        targetSpeed: goal.targetSpeed?.toString() || "",
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : "",
      });
    }
  }, [goal]);

  const calculateTotalSeconds = (h: string, m: string, s: string): number => {
    const hours = parseInt(h) || 0;
    const minutes = parseInt(m) || 0;
    const seconds = parseInt(s) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleFieldChange = (field: keyof GoalFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleFieldChange,
    calculateTotalSeconds
  };
};