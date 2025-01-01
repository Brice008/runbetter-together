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

interface Activity {
  id: string;
  date: Date;
  type: string;
  name: string;
  duration: number;
}

const STORAGE_KEY = "sports-activities";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).map((activity: any) => ({
      ...activity,
      date: new Date(activity.date)
    })) : [];
  });
  const [activityType, setActivityType] = useState("musculation");
  const [activityName, setActivityName] = useState("");
  const [duration, setDuration] = useState("");
  const { toast } = useToast();

  // Sauvegarder les activités dans le localStorage
  const saveActivities = (newActivities: Activity[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities));
    setActivities(newActivities);
  };

  const handleAddActivity = () => {
    if (!date || !activityName || !duration) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const newActivity: Activity = {
      id: crypto.randomUUID(),
      date,
      type: activityType,
      name: activityName,
      duration: parseInt(duration),
    };

    const newActivities = [...activities, newActivity];
    saveActivities(newActivities);

    toast({
      title: "Activité ajoutée",
      description: "L'activité a été ajoutée avec succès",
    });

    // Reset form
    setActivityName("");
    setDuration("");
  };

  const handleDeleteActivity = (id: string) => {
    const newActivities = activities.filter(activity => activity.id !== id);
    saveActivities(newActivities);
    
    toast({
      title: "Activité supprimée",
      description: "L'activité a été supprimée avec succès",
    });
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
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nom de l'activité</Label>
                <Input
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Ex: Séance jambes"
                />
              </div>

              <div className="space-y-2">
                <Label>Durée (minutes)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 45"
                />
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
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {activity.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.type} - {activity.duration} minutes
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteActivity(activity.id)}
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