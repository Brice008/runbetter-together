import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RunFormData } from "@/types/running";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddRunFormProps {
  onSubmit: (run: RunFormData) => void;
}

const AddRunForm = ({ onSubmit }: AddRunFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<RunFormData>({
    name: "",
    distance: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    date: new Date(),
    unit: "km",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.distance <= 0) {
      toast({
        title: "Erreur",
        description: "La distance doit être supérieure à 0",
        variant: "destructive",
      });
      return;
    }

    if (formData.hours === 0 && formData.minutes === 0 && formData.seconds === 0) {
      toast({
        title: "Erreur",
        description: "La durée doit être supérieure à 0",
        variant: "destructive",
      });
      return;
    }

    // Créer une copie du formData avec la date correctement définie
    const submissionData = {
      ...formData,
      date: new Date(formData.date), // Assure que c'est bien un objet Date
    };

    onSubmit(submissionData);
    
    // Réinitialiser le formulaire
    setFormData({
      name: "",
      distance: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      date: new Date(),
      unit: "km",
    });

    toast({
      title: "Course ajoutée",
      description: "Votre course a été enregistrée avec succès",
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const newDate = new Date(dateValue);
    // Ajuster pour le fuseau horaire local
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    setFormData({ ...formData, date: newDate });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nom de la course (optionnel)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Course matinale"
          />
        </div>

        <div>
          <Label htmlFor="date">Date de la course</Label>
          <Input
            id="date"
            type="date"
            value={formData.date.toISOString().split('T')[0]}
            onChange={handleDateChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="distance">Distance</Label>
            <Input
              id="distance"
              type="number"
              step="0.01"
              value={formData.distance || ""}
              onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <Label htmlFor="unit">Unité</Label>
            <Select
              value={formData.unit}
              onValueChange={(value: "km" | "mi") => setFormData({ ...formData, unit: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une unité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">Kilomètres</SelectItem>
                <SelectItem value="mi">Miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="hours">Heures</Label>
            <Input
              id="hours"
              type="number"
              min="0"
              value={formData.hours || ""}
              onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="minutes">Minutes</Label>
            <Input
              id="minutes"
              type="number"
              min="0"
              max="59"
              value={formData.minutes || ""}
              onChange={(e) => setFormData({ ...formData, minutes: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="seconds">Secondes</Label>
            <Input
              id="seconds"
              type="number"
              min="0"
              max="59"
              value={formData.seconds || ""}
              onChange={(e) => setFormData({ ...formData, seconds: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Ajouter la course
        </Button>
      </form>
    </Card>
  );
};

export default AddRunForm;