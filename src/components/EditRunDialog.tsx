import { Run } from "@/types/running";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditRunDialogProps {
  run: Run | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updatedRun: Partial<Run>) => void;
}

const EditRunDialog = ({ run, isOpen, onOpenChange, onUpdate }: EditRunDialogProps) => {
  if (!run) return null;

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const distance = parseFloat(formData.get("distance") as string);
    const hours = parseInt(formData.get("hours") as string);
    const minutes = parseInt(formData.get("minutes") as string);
    const seconds = parseInt(formData.get("seconds") as string);
    const unit = formData.get("unit") as "km" | "mi";
    const date = new Date(formData.get("date") as string);

    const duration = hours * 3600 + minutes * 60 + seconds;

    // Mettre à jour l'activité cardio correspondante dans le calendrier
    const activities = JSON.parse(localStorage.getItem("sports-activities") || "[]");
    const oldDate = new Date(run.date).toISOString().split('T')[0];
    const totalMinutes = hours * 60 + minutes + Math.ceil(seconds / 60);

    const updatedActivities = activities.map((activity: any) => {
      if (activity.type === "cardio" && new Date(activity.date).toISOString().split('T')[0] === oldDate) {
        return {
          ...activity,
          date: date,
          duration: totalMinutes,
        };
      }
      return activity;
    });

    localStorage.setItem("sports-activities", JSON.stringify(updatedActivities));

    onUpdate(run.id, {
      name,
      distance,
      duration,
      unit,
      date,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={new Date(run.date).toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom (optionnel)</Label>
            <Input
              id="name"
              name="name"
              defaultValue={run.name}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distance">Distance</Label>
              <Input
                id="distance"
                name="distance"
                type="number"
                step="0.01"
                min="0"
                defaultValue={run.distance}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unité</Label>
              <Select name="unit" defaultValue={run.unit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilomètres</SelectItem>
                  <SelectItem value="mi">Miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Heures</Label>
              <Input
                id="hours"
                name="hours"
                type="number"
                min="0"
                defaultValue={Math.floor(run.duration / 3600)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minutes">Minutes</Label>
              <Input
                id="minutes"
                name="minutes"
                type="number"
                min="0"
                max="59"
                defaultValue={Math.floor((run.duration % 3600) / 60)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seconds">Secondes</Label>
              <Input
                id="seconds"
                name="seconds"
                type="number"
                min="0"
                max="59"
                defaultValue={run.duration % 60}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRunDialog;