import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddRunForm from "@/components/AddRunForm";
import RunHistory from "@/components/RunHistory";
import ProgressChart from "@/components/ProgressChart";
import { Run, RunFormData } from "@/types/running";
import { calculatePace, calculateSpeed } from "@/utils/calculations";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, TrendingUp, Target, Calendar, LogOut } from "lucide-react";
import { useRunStore } from "@/stores/runStore";
import { useAuth } from "@/hooks/useAuth";
import { useLoadUserData } from "@/hooks/useLoadUserData";

const Index = () => {
  const { runs, addRun, deleteRun, updateRun } = useRunStore();
  const { toast } = useToast();
  const { signOut } = useAuth();
  
  // Load user data when authenticated
  useLoadUserData();

  const handleAddRun = async (formData: RunFormData) => {
    try {
      const duration = formData.hours * 3600 + formData.minutes * 60 + formData.seconds;
      const pace = calculatePace(formData.distance, duration);
      const speed = calculateSpeed(formData.distance, duration);

      const newRun = {
        id: uuidv4(),
        date: formData.date,
        name: formData.name,
        distance: formData.distance,
        duration,
        pace,
        speed,
        unit: formData.unit,
      };

      await addRun(newRun);
      
      toast({
        title: "Course ajoutée",
        description: "La course a été enregistrée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la course",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRun = async (id: string) => {
    try {
      await deleteRun(id);
      toast({
        title: "Course supprimée",
        description: "La course a été supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la course",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRun = async (id: string, updatedRun: Partial<Run>) => {
    try {
      await updateRun(id, updatedRun);
      toast({
        title: "Course modifiée",
        description: "La course a été modifiée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la course",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Suivi de Course</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to="/progress">
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progression
            </Button>
          </Link>
          <Link to="/stats">
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </Button>
          </Link>
          <Link to="/goals">
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <Target className="h-4 w-4" />
              Objectifs
            </Button>
          </Link>
          <Link to="/calendar">
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendrier
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <div className="order-1 lg:order-none">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Ajouter une course</h2>
          <AddRunForm onSubmit={handleAddRun} />
        </div>
        
        {runs.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Progression</h2>
            <ProgressChart runs={runs} />
          </div>
        )}
      </div>

      {runs.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Historique</h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-full inline-block align-middle">
              <RunHistory 
                runs={runs} 
                onDelete={handleDeleteRun}
                onUpdate={handleUpdateRun}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
