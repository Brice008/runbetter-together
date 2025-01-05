import { Goal } from "@/types/goals";
import DraggableGoal from "./DraggableGoal";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface GoalsSectionProps {
  title: string;
  goals: Goal[];
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
  onToggleComplete: (id: string, completedAt?: Date) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

const GoalsSection = ({
  title,
  goals,
  onDelete,
  onEdit,
  onToggleComplete,
  onDragEnd,
}: GoalsSectionProps) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <SortableContext items={goals} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {goals.length === 0 ? (
              <p className="text-center text-gray-500">Aucun objectif</p>
            ) : (
              goals.map((goal) => (
                <DraggableGoal
                  key={goal.id}
                  goal={goal}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onToggleComplete={onToggleComplete}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default GoalsSection;