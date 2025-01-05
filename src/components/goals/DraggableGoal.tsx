import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Goal } from "@/types/goals";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, Circle, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { calculatePace, calculateSpeed, formatPace } from "@/utils/calculations";

interface DraggableGoalProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
  onToggleComplete: (id: string, completedAt?: Date) => void;
}

const DraggableGoal = ({ goal, onDelete, onEdit, onToggleComplete }: DraggableGoalProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  const handleCompletedDateChange = (date: string) => {
    onToggleComplete(goal.id, new Date(date));
  };

  const { speed, pace } = calculateMetrics(goal.targetDistance, goal.targetTime);

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className="p-4 touch-none"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
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
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing ml-auto md:ml-2">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
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
                  onChange={(e) => handleCompletedDateChange(e.target.value)}
                  className="w-auto"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
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
};

export default DraggableGoal;