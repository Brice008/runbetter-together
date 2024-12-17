import { Goal } from "@/types/goals";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface GoalsListProps {
  goals: Goal[];
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
  onToggleComplete: (id: string) => void;
}

const GoalsList = ({ goals, onDelete, onEdit, onToggleComplete }: GoalsListProps) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Non défini";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-4">
      {goals.length === 0 ? (
        <p className="text-center text-gray-500">Aucun objectif défini</p>
      ) : (
        goals.map((goal) => (
          <Card key={goal.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleComplete(goal.id)}
                  >
                    {goal.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </Button>
                  <h3 className={`text-lg font-semibold ${goal.completed ? "line-through text-gray-500" : ""}`}>
                    {goal.name}
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p>Distance : {goal.targetDistance} km</p>
                  {goal.targetTime && <p>Temps : {formatDuration(goal.targetTime)}</p>}
                  {goal.targetSpeed && <p>Vitesse : {goal.targetSpeed.toFixed(2)} km/h</p>}
                  {goal.deadline && (
                    <p>Date limite : {new Date(goal.deadline).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(goal)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(goal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default GoalsList;