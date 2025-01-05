import { Goal, GoalFolder } from "@/types/goals";
import GoalsList from "@/components/GoalsList";

interface GoalsSectionProps {
  activeGoals: Goal[];
  completedGoals: Goal[];
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
  onToggleComplete: (id: string, completedAt?: Date) => void;
  onMove?: (goalId: string, folderId?: string) => void;
  folders?: GoalFolder[];
}

const GoalsSection = ({
  activeGoals,
  completedGoals,
  onDelete,
  onEdit,
  onToggleComplete,
  onMove,
  folders = [],
}: GoalsSectionProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Objectifs en cours</h2>
        <GoalsList
          goals={activeGoals}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleComplete={onToggleComplete}
          onMove={onMove}
          folders={folders}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Objectifs réussis</h2>
        <GoalsList
          goals={completedGoals}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleComplete={onToggleComplete}
          onMove={onMove}
          folders={folders}
        />
      </div>
    </div>
  );
};

export default GoalsSection;