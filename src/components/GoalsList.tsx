import { Goal } from "@/types/goals";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { calculatePace, calculateSpeed, formatPace } from "@/utils/calculations";
import { Input } from "./ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface GoalsListProps {
  goals: Goal[];
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
  onToggleComplete: (id: string, completedAt?: Date) => void;
}

const GoalsList = ({ goals, onDelete, onEdit, onToggleComplete }: GoalsListProps) => {
  const isMobile = useIsMobile();

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

  return (
    <div className="space-y-4">
      {goals.length === 0 ? (
        <p className="text-center text-gray-500">Aucun objectif défini</p>
      ) : (
        goals.map((goal) => {
          const { speed, pace } = calculateMetrics(goal.targetDistance, goal.targetTime);
          
          return (
            <Card key={goal.id} className={`p-3 ${isMobile ? 'text-sm' : 'p-4'}`}>
              <div className={`flex items-start ${isMobile ? 'flex-col gap-2' : 'justify-between'}`}>
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size={isMobile ? "sm" : "icon"}
                      onClick={() => onToggleComplete(goal.id)}
                      className={isMobile ? "p-1" : ""}
                    >
                      {goal.completed ? (
                        <CheckCircle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-green-500`} />
                      ) : (
                        <Circle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                      )}
                    </Button>
                    <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold ${goal.completed ? "line-through text-gray-500" : ""}`}>
                      {goal.name}
                    </h3>
                  </div>
                  <div className={`space-y-1 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-300`}>
                    <p>Distance : {goal.targetDistance} km</p>
                    {goal.targetTime && <p>Temps : {formatDuration(goal.targetTime)}</p>}
                    {speed && <p>Vitesse : {speed.toFixed(2)} km/h</p>}
                    {pace && <p>Allure : {formatPace(pace)}</p>}
                    {goal.deadline && (
                      <p>Date limite : {new Date(goal.deadline).toLocaleDateString()}</p>
                    )}
                    {goal.completed && (
                      <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-2`}>
                        <label htmlFor={`completedAt-${goal.id}`}>Date de réalisation :</label>
                        <Input
                          id={`completedAt-${goal.id}`}
                          type="date"
                          value={goal.completedAt ? new Date(goal.completedAt).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleCompletedDateChange(goal, e.target.value)}
                          className={`${isMobile ? 'w-full' : 'w-auto'}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className={`flex gap-2 ${isMobile ? 'w-full justify-end' : ''}`}>
                  <Button
                    variant="ghost"
                    size={isMobile ? "sm" : "icon"}
                    onClick={() => onEdit(goal)}
                  >
                    <Pencil className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size={isMobile ? "sm" : "icon"}
                    onClick={() => onDelete(goal.id)}
                  >
                    <Trash2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default GoalsList;