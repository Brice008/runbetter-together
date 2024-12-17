import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Goal } from "@/types/goals";
import { calculateSpeed } from "@/utils/calculations";

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (goalData: Omit<Goal, "id" | "completed">) => void;
  goal?: Goal | null;
}

const AddGoalDialog = ({ open, onOpenChange, onSubmit, goal }: AddGoalDialogProps) => {
  const [formData, setFormData] = useState({
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
    } else {
      setFormData({
        name: "",
        targetDistance: "",
        hours: "",
        minutes: "",
        seconds: "",
        targetSpeed: "",
        deadline: "",
      });
    }
  }, [goal]);

  const calculateTotalSeconds = (h: string, m: string, s: string): number => {
    const hours = parseInt(h) || 0;
    const minutes = parseInt(m) || 0;
    const seconds = parseInt(s) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  const updateSpeed = () => {
    const distance = parseFloat(formData.targetDistance);
    const totalSeconds = calculateTotalSeconds(formData.hours, formData.minutes, formData.seconds);
    
    if (distance && totalSeconds > 0) {
      const speed = calculateSpeed(distance, totalSeconds);
      setFormData(prev => ({
        ...prev,
        targetSpeed: speed.toFixed(2)
      }));
    }
  };

  useEffect(() => {
    updateSpeed();
  }, [formData.targetDistance, formData.hours, formData.minutes, formData.seconds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSeconds = calculateTotalSeconds(formData.hours, formData.minutes, formData.seconds);
    
    onSubmit({
      name: formData.name,
      targetDistance: parseFloat(formData.targetDistance),
      targetTime: totalSeconds,
      targetSpeed: parseFloat(formData.targetSpeed),
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goal ? "Modifier l'objectif" : "Ajouter un objectif"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom de l'objectif
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="targetDistance" className="block text-sm font-medium mb-1">
              Distance cible (km)
            </label>
            <Input
              id="targetDistance"
              type="number"
              step="0.01"
              value={formData.targetDistance}
              onChange={(e) => setFormData({ ...formData, targetDistance: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="hours" className="block text-sm font-medium mb-1">
                Heures
              </label>
              <Input
                id="hours"
                type="number"
                min="0"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="minutes" className="block text-sm font-medium mb-1">
                Minutes
              </label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={formData.minutes}
                onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="seconds" className="block text-sm font-medium mb-1">
                Secondes
              </label>
              <Input
                id="seconds"
                type="number"
                min="0"
                max="59"
                value={formData.seconds}
                onChange={(e) => setFormData({ ...formData, seconds: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label htmlFor="targetSpeed" className="block text-sm font-medium mb-1">
              Vitesse calculée (km/h)
            </label>
            <Input
              id="targetSpeed"
              type="number"
              step="0.1"
              value={formData.targetSpeed}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium mb-1">
              Date limite
            </label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {goal ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;