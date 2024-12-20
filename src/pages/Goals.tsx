import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AddGoalDialog from "@/components/AddGoalDialog";
import GoalsList from "@/components/GoalsList";
import { Goal } from "@/types/goals";
import BackButton from "@/components/BackButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_KEY = "running-tracker-goals";

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem(STORAGE_KEY);
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((goal: Goal) => ({
        ...goal,
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
      }));
      setGoals(parsedGoals);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (goalData: Omit<Goal, "id" | "completed">) => {
    const newGoal: Goal = {
      ...goalData,
      id: uuidv4(),
      completed: false,
    };
    setGoals((prev) => [...prev, newGoal]);
    setIsAddDialogOpen(false);
    toast({
      title: "Objectif ajouté",
      description: "L'objectif a été ajouté avec succès",
    });
  };

  const handleEditGoal = (goalData: Omit<Goal, "id" | "completed">) => {
    if (!editingGoal) return;
    
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === editingGoal.id
          ? { ...goal, ...goalData }
          : goal
      )
    );
    setEditingGoal(null);
    setIsAddDialogOpen(false);
    toast({
      title: "Objectif modifié",
      description: "L'objectif a été modifié avec succès",
    });
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    setGoalToDelete(null);
    toast({
      title: "Objectif supprimé",
      description: "L'objectif a été supprimé avec succès",
    });
  };

  const handleToggleComplete = (id: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? { ...goal, completed: !goal.completed }
          : goal
      )
    );
    toast({
      title: "Statut mis à jour",
      description: "Le statut de l'objectif a été mis à jour",
    });
  };

  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-3xl font-bold">Objectifs</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Ajouter un objectif
        </Button>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Objectifs en cours</h2>
          <GoalsList
            goals={activeGoals}
            onDelete={(id) => setGoalToDelete(id)}
            onEdit={(goal) => {
              setEditingGoal(goal);
              setIsAddDialogOpen(true);
            }}
            onToggleComplete={handleToggleComplete}
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Objectifs réussis</h2>
          <GoalsList
            goals={completedGoals}
            onDelete={(id) => setGoalToDelete(id)}
            onEdit={(goal) => {
              setEditingGoal(goal);
              setIsAddDialogOpen(true);
            }}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>

      <AddGoalDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={editingGoal ? handleEditGoal : handleAddGoal}
        goal={editingGoal}
      />

      <AlertDialog open={!!goalToDelete} onOpenChange={() => setGoalToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cet objectif sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => goalToDelete && handleDeleteGoal(goalToDelete)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Goals;