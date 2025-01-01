import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import BackButton from "@/components/BackButton";
import { useRunStore } from "@/stores/runStore";
import { useActivityStore } from "@/stores/activityStore";
import ActivityForm from "@/components/calendar/ActivityForm";
import ActivityList from "@/components/calendar/ActivityList";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const runs = useRunStore(state => state.runs);
  const { activities } = useActivityStore();

  // Créer un Set des dates où il y a eu des activités
  const activityDates = new Set(
    activities.map((activity) => activity.date.toISOString().split('T')[0])
  );

  // Fonction pour vérifier si une date donnée a une activité
  const hasActivityOnDate = (date: Date) => {
    return activityDates.has(date.toISOString().split('T')[0]);
  };

  // Style pour les jours avec des activités
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
        <div className="space-y-6">
          <ActivityForm selectedDate={date} />
          {date && <ActivityList selectedDate={date} />}
        </div>

        <div>
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border"
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;