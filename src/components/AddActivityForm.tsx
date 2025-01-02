import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Activity, ActivityType } from "@/types/activity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActivityStore } from "@/stores/activityStore";

const AddActivityForm = () => {
  const { toast } = useToast();
  const addActivity = useActivityStore((state) => state.addActivity);
  const [formData, setFormData] = useState({
    type: "" as ActivityType,
    duration: 0,
    date: new Date(),
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.duration <= 0) {
      toast({
        title: "Erreur",
        description: "La durée doit être supérieure à 0",
        variant: "destructive",
      });
      return;
    }

    if (!formData.type) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type d'activité",
        variant: "destructive",
      });
      return;
    }

    addActivity({
      ...formData,
      date: new Date(formData.date),
    });
    
    setFormData({
      type: "" as ActivityType,
      duration: 0,
      date: new Date(),
      name: "",
    });

    toast({
      title: "Activité ajoutée",
      description: "Votre activité a été enregistrée avec succès",
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="type">Type d'activité</Label>
          <Select
            value={formData.type}
            onValueChange={(value: ActivityType) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une activité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="running">Course</SelectItem>
              <SelectItem value="musculation">Musculation</SelectItem>
              <SelectItem value="abdo">Abdos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="name">Nom de l'activité (optionnel)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Séance du matin"
          />
        </div>

        <div>
          <Label htmlFor="date">Date de l'activité</Label>
          <Input
            id="date"
            type="date"
            value={formData.date.toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
            required
          />
        </div>

        <div>
          <Label htmlFor="duration">Durée (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration || ""}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Ajouter l'activité
        </Button>
      </form>
    </Card>
  );
};

export default AddActivityForm;