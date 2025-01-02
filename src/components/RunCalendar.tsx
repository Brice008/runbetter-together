import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Run } from "@/types/running";
import { Badge } from "@/components/ui/badge";

interface RunCalendarProps {
  runs: Run[];
}

const RunCalendar = ({ runs }: RunCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Créer un Set des dates où il y a eu des courses (en format ISO string pour la comparaison)
  const runDates = new Set(
    runs.map((run) => new Date(run.date).toISOString().split('T')[0])
  );

  // Fonction pour vérifier si une date donnée a une course
  const hasRunOnDate = (date: Date) => {
    return runDates.has(date.toISOString().split('T')[0]);
  };

  // Fonction pour styliser les jours avec des courses
  const modifiersStyles = {
    hasRun: { backgroundColor: "hsl(var(--primary))", color: "white", borderRadius: "50%" }
  };

  // Fonction pour ajouter le modificateur aux jours avec des courses
  const modifiers = {
    hasRun: (date: Date) => hasRunOnDate(date)
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
          <SheetTitle>Calendrier des courses</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border"
          />
        </div>
        {date && hasRunOnDate(date) && (
          <div className="space-y-4">
            <h3 className="font-medium">Courses du {date.toLocaleDateString()}</h3>
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
                      <p className="text-sm font-medium leading-none">
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
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default RunCalendar;