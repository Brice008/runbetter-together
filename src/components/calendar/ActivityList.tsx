import { Badge } from "@/components/ui/badge";
import { Activity } from "@/types/activity";
import { useRunStore } from "@/stores/runStore";
import { Activity as ActivityIcon, Dumbbell, Timer } from "lucide-react";

interface ActivityListProps {
  selectedDate: Date | undefined;
}

const ActivityList = ({ selectedDate }: ActivityListProps) => {
  const { runs } = useRunStore();

  if (!selectedDate) return null;

  const activitiesForDate = runs.filter(
    (run) =>
      run.date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
  );

  if (activitiesForDate.length === 0) {
    return <p className="text-muted-foreground">Aucune activité pour cette date</p>;
  }

  return (
    <div className="space-y-2">
      {activitiesForDate.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <ActivityIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{activity.name || "Course sans nom"}</p>
              <p className="text-sm text-muted-foreground">
                {activity.distance.toFixed(2)} {activity.unit}
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            {activity.speed.toFixed(1)} {activity.unit}/h
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;