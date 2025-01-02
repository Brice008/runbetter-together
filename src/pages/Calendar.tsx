import { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import BackButton from "@/components/BackButton";
import { useActivityStore } from "@/stores/activityStore";
import AddActivityForm from "@/components/AddActivityForm";
import { Dumbbell, Activity, Timer } from "lucide-react";
import { Activity as ActivityType } from "@/types/activity";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { activities, loadActivities } = useActivityStore();

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Create a Set of dates with activities
  const activityDates = new Set(
    activities.map((activity) => activity.date.toISOString().split('T')[0])
  );

  // Function to check if a date has activities
  const hasActivityOnDate = (date: Date) => {
    return activityDates.has(date.toISOString().split('T')[0]);
  };

  // Get activities for a specific date
  const getActivitiesForDate = (date: Date) => {
    return activities.filter(
      (activity) => activity.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );
  };

  // Function to get icon for activity type
  const getActivityIcon = (type: ActivityType['type']) => {
    switch (type) {
      case 'running':
        return <Activity className="h-4 w-4" />;
      case 'musculation':
      case 'abdo':
        return <Dumbbell className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Styles for days with activities
  const modifiersStyles = {
    hasActivity: { backgroundColor: "hsl(var(--primary))", color: "white", borderRadius: "50%" }
  };

  const modifiers = {
    hasActivity: (date: Date) => hasActivityOnDate(date)
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-3xl font-bold">Calendrier Sportif</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-4">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border"
          />
        </Card>

        <div className="space-y-6">
          <AddActivityForm />

          {date && (
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">
                Activités du {date.toLocaleDateString()}
              </h2>
              <div className="space-y-2">
                {getActivitiesForDate(date).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="font-medium">{activity.name || "Activité sans nom"}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.duration} minutes
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {getActivitiesForDate(date).length === 0 && (
                  <p className="text-muted-foreground">Aucune activité pour cette date</p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;