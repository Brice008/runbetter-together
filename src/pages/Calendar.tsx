import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import BackButton from "@/components/BackButton";
import ActivityList from "@/components/calendar/ActivityList";
import { useRunStore } from "@/stores/runStore";
import { useLoadUserData } from "@/hooks/useLoadUserData";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { runs } = useRunStore();
  
  // Load user data when authenticated
  useLoadUserData();

  // Create a Set of dates with activities
  const activityDates = new Set(
    runs.map((run) => run.date.toISOString().split('T')[0])
  );

  // Function to check if a date has activities
  const hasActivityOnDate = (date: Date) => {
    return activityDates.has(date.toISOString().split('T')[0]);
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

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            Activités du {date?.toLocaleDateString()}
          </h2>
          <ActivityList selectedDate={date} />
        </Card>
      </div>
    </div>
  );
};

export default Calendar;