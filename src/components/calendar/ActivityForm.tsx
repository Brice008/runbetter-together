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
import { useActivityStore } from "@/stores/activityStore";

interface ActivityFormProps {
  selectedDate: Date | undefined;
}

const ActivityForm = ({ selectedDate }: ActivityFormProps) => {
  const [activityType, setActivityType] = useState("musculation");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const { toast } = useToast();
  const { addActivity } = useActivityStore();

  const handleAddActivity = () => {
    if (!selectedDate || (!hours && !minutes)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);

    addActivity({
      date: selectedDate,
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

  return (
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
  );
};

export default ActivityForm;