import { Goal } from "@/types/goals";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, Circle, FolderInput } from "lucide-react";
import { Card } from "@/components/ui/card";
import { calculatePace, calculateSpeed, formatPace } from "@/utils/calculations";
import { Input } from "./ui/input";
import { useState } from "react";
import MoveGoalDialog from "./goals/MoveGoalDialog";
import { GoalFolder } from "@/types/goals";

interface GoalsListProps {
  goals: Goal[];
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
  onToggleComplete: (id: string, completedAt?: Date) => void;
  onMove?: (goalId: string, folderId?: string) => void;
  folders?: GoalFolder[];
}

const GoalsList = ({ goals, onDelete, onEdit, onToggleComplete, onMove, folders = [] }: GoalsListProps) => {
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

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

  const calculateMetrics = (distance: number, time?: number) => {
    if (!time) return { speed: null, pace: null };
    const speed = calculateSpeed(distance, time);
    const pace = calculatePace(distance, time);
    return { speed, pace };
  };

  const handleCompletedDateChange = (goal: Goal, date: string) => {
    onToggleComplete(goal.id, new Date(date));
  };

  const handleMoveClick = (goalId: string) => {
    setSelectedGoalId(goalId);
    setMoveDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {goals.length === 0 ? (
        <p className="text-center text-gray-500">Aucun objectif défini</p>
      ) : (
        goals.map((goal) => {
          const { speed, pace } = calculateMetrics(goal.targetDistance, goal.targetTime);
          
          return (
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
                    {speed && <p>Vitesse : {speed.toFixed(2)} km/h</p>}
                    {pace && <p>Allure : {formatPace(pace)}</p>}
                    {goal.deadline && (
                      <p>Date limite : {new Date(goal.deadline).toLocaleDateString()}</p>
                    )}
                    {goal.completed && (
                      <div className="flex items-center gap-2">
                        <label htmlFor={`completedAt-${goal.id}`}>Date de réalisation :</label>
                        <Input
                          id={`completedAt-${goal.id}`}
                          type="date"
                          value={goal.completedAt ? new Date(goal.completedAt).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleCompletedDateChange(goal, e.target.value)}
                          className="w-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {onMove && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveClick(goal.id)}
                    >
                      <FolderInput className="h-4 w-4" />
                    </Button>
                  )}
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
          );
        })
      )}

      {onMove && (
        <MoveGoalDialog
          open={moveDialogOpen}
          onOpenChange={setMoveDialogOpen}
          folders={folders}
          onMove={(folderId) => {
            if (selectedGoalId && onMove) {
              onMove(selectedGoalId, folderId);
            }
          }}
        />
      )}
    </div>
  );
};

export default GoalsList;