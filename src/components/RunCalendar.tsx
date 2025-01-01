import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Dumbbell, Activity, Running } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Run as RunType } from "@/types/running";
import { Badge } from "@/components/ui/badge";

interface RunCalendarProps {
  runs: RunType[];
}

const RunCalendar = ({ runs }: RunCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Récupérer les activités du localStorage
  const getActivities = () => {
    const savedActivities = localStorage.getItem("sports-activities");
    if (savedActivities) {
      return JSON.parse(savedActivities).map((activity: any) => ({
        ...activity,
        date: new Date(activity.date)
      }));
    }
    return [];
  };

  const activities = getActivities();

  // Fonction pour obtenir les activités pour une date donnée
  const getActivitiesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Obtenir les courses pour cette date
    const runsForDate = runs.filter(
      run => new Date(run.date).toISOString().split('T')[0] === dateStr
    );
    
    // Obtenir les autres activités pour cette date
    const otherActivities = activities.filter(
      (activity: any) => new Date(activity.date).toISOString().split('T')[0] === dateStr
    );

    return {
      hasRuns: runsForDate.length > 0,
      hasWorkout: otherActivities.some((a: any) => a.type === "musculation"),
      hasAbs: otherActivities.some((a: any) => a.type === "abdos"),
    };
  };

  // Fonction pour afficher les icônes du jour
  const DayContent = (day: Date) => {
    const activities = getActivitiesForDate(day);
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute top-0 left-0 right-0 flex justify-center gap-1">
          {activities.hasRuns && <Running className="h-3 w-3" />}
          {activities.hasWorkout && <Dumbbell className="h-3 w-3" />}
          {activities.hasAbs && <Activity className="h-3 w-3" />}
        </div>
        <span className="mt-3">{day.getDate()}</span>
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Calendrier des activités</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            components={{
              DayContent: ({ date }) => DayContent(date),
            }}
            className="rounded-md border"
          />
        </div>
        {date && (
          <div className="space-y-4">
            <h3 className="font-medium">Activités du {date.toLocaleDateString()}</h3>
            <div className="space-y-2">
              {runs
                .filter(
                  (run) =>
                    new Date(run.date).toISOString().split('T')[0] ===
                    date.toISOString().split('T')[0]
                )
                .map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none flex items-center gap-2">
                        <Running className="h-4 w-4" />
                        {run.name || "Course sans nom"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {run.distance.toFixed(2)} {run.unit}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {run.speed.toFixed(1)} {run.unit}/h
                    </Badge>
                  </div>
                ))}
              {activities
                .filter(
                  (activity: any) =>
                    new Date(activity.date).toISOString().split('T')[0] ===
                    date.toISOString().split('T')[0]
                )
                .map((activity: any) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none flex items-center gap-2">
                        {activity.type === "musculation" && <Dumbbell className="h-4 w-4" />}
                        {activity.type === "abdos" && <Activity className="h-4 w-4" />}
                        {activity.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.duration} minutes
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default RunCalendar;