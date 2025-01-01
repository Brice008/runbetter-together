import { Button } from "@/components/ui/button";
import { Activity } from "@/hooks/useActivities";
import { useActivityStore } from "@/stores/activityStore";
import { Dumbbell, Timer, Run } from "lucide-react";

interface ActivityListProps {
  selectedDate: Date | undefined;
}

const ActivityList = ({ selectedDate }: ActivityListProps) => {
  const { activities, deleteActivity } = useActivityStore();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "musculation":
        return <Dumbbell className="h-4 w-4" />;
      case "abdos":
        return <Timer className="h-4 w-4" />;
      case "cardio":
        return <Run className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (!selectedDate) return null;

  const dailyActivities = activities.filter(
    (activity) =>
      activity.date.toISOString().split('T')[0] ===
      selectedDate.toISOString().split('T')[0]
  );

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium mb-4">
        Activités du {selectedDate.toLocaleDateString()}
      </h3>
      <div className="space-y-2">
        {dailyActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-2">
              {getActivityIcon(activity.type)}
              <div>
                <p className="text-sm font-medium capitalize">
                  {activity.type}
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.floor(activity.duration / 60)}h{" "}
                  {activity.duration % 60}min
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteActivity(activity.id)}
            >
              Supprimer
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;