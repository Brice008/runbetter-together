import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Goal } from "@/types/goals";

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
    targetTime: "",
    targetSpeed: "",
    deadline: "",
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetDistance: goal.targetDistance.toString(),
        targetTime: goal.targetTime?.toString() || "",
        targetSpeed: goal.targetSpeed?.toString() || "",
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : "",
      });
    } else {
      setFormData({
        name: "",
        targetDistance: "",
        targetTime: "",
        targetSpeed: "",
        deadline: "",
      });
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      targetDistance: parseFloat(formData.targetDistance),
      targetTime: formData.targetTime ? parseInt(formData.targetTime) : undefined,
      targetSpeed: formData.targetSpeed ? parseFloat(formData.targetSpeed) : undefined,
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
          <div>
            <label htmlFor="targetTime" className="block text-sm font-medium mb-1">
              Temps cible (secondes)
            </label>
            <Input
              id="targetTime"
              type="number"
              value={formData.targetTime}
              onChange={(e) => setFormData({ ...formData, targetTime: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="targetSpeed" className="block text-sm font-medium mb-1">
              Vitesse cible (km/h)
            </label>
            <Input
              id="targetSpeed"
              type="number"
              step="0.1"
              value={formData.targetSpeed}
              onChange={(e) => setFormData({ ...formData, targetSpeed: e.target.value })}
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