import { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import AddActivityForm from "@/components/AddActivityForm";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  date: Date;
  type: string;
  duration: number;
}

const STORAGE_KEY = "sports-activities";
const RUNNING_STORAGE_KEY = "running-tracker-runs";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const { toast } = useToast();

  // Charger les activités depuis le localStorage au démarrage
  useEffect(() => {
    const loadActivities = () => {
      const savedActivities = localStorage.getItem(STORAGE_KEY);
      if (savedActivities) {
        const parsedActivities = JSON.parse(savedActivities).map((activity: any) => ({
          ...activity,
          date: new Date(activity.date)
        }));
        setActivities(parsedActivities);
      }
    };

    const loadRunningActivities = () => {
      const savedRuns = localStorage.getItem(RUNNING_STORAGE_KEY);
      if (savedRuns) {
        const parsedRuns = JSON.parse(savedRuns).map((run: any) => ({
          id: run.id,
          date: new Date(run.date),
          type: "cardio",
          duration: Math.round(run.duration / 60), // Convertir les secondes en minutes
        }));
        
        // Fusionner avec les activités existantes en évitant les doublons
        setActivities(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const newRuns = parsedRuns.filter(run => !existingIds.has(run.id));
          return [...prev, ...newRuns];
        });
      }
    };

    loadActivities();
    loadRunningActivities();
  }, []);

  // Sauvegarder les activités dans le localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const handleAddActivity = (newActivity: Omit<Activity, 'id'>) => {
    const activityWithId = {
      ...newActivity,
      id: crypto.randomUUID(),
    };

    setActivities(prev => [...prev, activityWithId]);
    
    toast({
      title: "Activité ajoutée",
      description: "L'activité a été ajoutée avec succès",
    });
  };

  const handleUpdateActivity = (updatedActivity: Omit<Activity, 'id'>) => {
    if (!editingActivity) return;

    setActivities(prev =>
      prev.map(activity =>
        activity.id === editingActivity.id
          ? { ...updatedActivity, id: activity.id }
          : activity
      )
    );

    setEditingActivity(null);
    
    toast({
      title: "Activité modifiée",
      description: "L'activité a été modifiée avec succès",
    });
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
    
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
            <h2 className="text-xl font-semibold mb-4">
              {editingActivity ? "Modifier une activité" : "Ajouter une activité"}
            </h2>
            {date && (
              <AddActivityForm
                selectedDate={date}
                onSubmit={editingActivity ? handleUpdateActivity : handleAddActivity}
                editActivity={editingActivity || undefined}
                onCancel={editingActivity ? () => setEditingActivity(null) : undefined}
              />
            )}
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
                      <div>
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.duration} minutes
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingActivity(activity)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteActivity(activity.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
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