import { useState } from "react";
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

interface Activity {
  id: string;
  date: Date;
  type: string;
  duration: number;
}

interface AddActivityFormProps {
  selectedDate: Date;
  onSubmit: (activity: Omit<Activity, 'id'>) => void;
  editActivity?: Activity;
  onCancel?: () => void;
}

const AddActivityForm = ({ selectedDate, onSubmit, editActivity, onCancel }: AddActivityFormProps) => {
  const { toast } = useToast();
  const [activityType, setActivityType] = useState(editActivity?.type || "musculation");
  const [duration, setDuration] = useState(editActivity?.duration.toString() || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!duration) {
      toast({
        title: "Erreur",
        description: "La durée est requise",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      date: selectedDate,
      type: activityType,
      duration: parseInt(duration),
    });

    if (!editActivity) {
      setActivityType("musculation");
      setDuration("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
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

      <div>
        <Label>Durée (minutes)</Label>
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min="1"
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="w-full">
          {editActivity ? "Modifier" : "Ajouter"} l'activité
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddActivityForm;