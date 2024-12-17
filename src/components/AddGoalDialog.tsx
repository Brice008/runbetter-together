import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Goal } from "@/types/goals";
import TimeInputs from "./goals/TimeInputs";
import BasicGoalInputs from "./goals/BasicGoalInputs";
import { useGoalForm } from "@/hooks/useGoalForm";

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (goalData: Omit<Goal, "id" | "completed">) => void;
  goal?: Goal | null;
}

const AddGoalDialog = ({ open, onOpenChange, onSubmit, goal }: AddGoalDialogProps) => {
  const { formData, handleFieldChange, calculateTotalSeconds } = useGoalForm(goal);

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
          <BasicGoalInputs
            name={formData.name}
            targetDistance={formData.targetDistance}
            targetSpeed={formData.targetSpeed}
            deadline={formData.deadline}
            onNameChange={(value) => handleFieldChange('name', value)}
            onDistanceChange={(value) => handleFieldChange('targetDistance', value)}
            onDeadlineChange={(value) => handleFieldChange('deadline', value)}
          />
          <TimeInputs
            hours={formData.hours}
            minutes={formData.minutes}
            seconds={formData.seconds}
            onChange={(field, value) => handleFieldChange(field, value)}
          />
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