import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import { useActivities } from "@/hooks/useActivities";
import { Dumbbell, Timer } from "lucide-react";
import { useRunStore } from "@/stores/runStore";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activityType, setActivityType] = useState("musculation");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const { toast } = useToast();
  const runs = useRunStore(state => state.runs);
  const { activities, addActivity, deleteActivity } = useActivities(runs);

  const handleAddActivity = () => {
    if (!date || (!hours && !minutes)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);

    addActivity({
      date,
      type: activityType,
      duration: totalMinutes,
    });

    toast({
      title: "Activité ajoutée",
      description: "L'activité a été ajoutée avec succès",
    });

    // Reset form
    setHours("");
    setMinutes("");
  };

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "musculation":
        return <Dumbbell className="h-4 w-4" />;
      case "abdos":
        return <Timer className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-3xl font-bold">Calendrier Sportif</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h2 className="text-xl font-semibold mb-4">Ajouter une activité</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Type d'activité</Label>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="musculation">Musculation</SelectItem>
                    <SelectItem value="abdos">Abdominaux</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heures</Label>
                  <Input
                    type="number"
                    min="0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minutes</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleAddActivity} className="w-full">
                Ajouter l'activité
              </Button>
            </div>
          </div>

          {date && (
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-4">
                Activités du {date.toLocaleDateString()}
              </h3>
              <div className="space-y-2">
                {activities
                  .filter(
                    (activity) =>
                      activity.date.toISOString().split('T')[0] ===
                      date.toISOString().split('T')[0]
                  )
                  .map((activity) => (
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
          )}
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