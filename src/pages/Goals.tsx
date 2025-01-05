import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AddGoalDialog from "@/components/AddGoalDialog";
import GoalsList from "@/components/GoalsList";
import { Goal, GoalFolder } from "@/types/goals";
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
import FoldersList from "@/components/goals/FoldersList";
import AddFolderDialog from "@/components/goals/AddFolderDialog";
import { Folder, Plus } from "lucide-react";

const GOALS_STORAGE_KEY = "running-tracker-goals";
const FOLDERS_STORAGE_KEY = "running-tracker-folders";

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [folders, setFolders] = useState<GoalFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingFolder, setEditingFolder] = useState<GoalFolder | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem(GOALS_STORAGE_KEY);
    const savedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
    
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((goal: Goal) => ({
        ...goal,
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      }));
      setGoals(parsedGoals);
    }
    
    if (savedFolders) {
      const parsedFolders = JSON.parse(savedFolders).map((folder: GoalFolder) => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
      }));
      setFolders(parsedFolders);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  const handleAddGoal = (goalData: Omit<Goal, "id" | "completed">) => {
    const newGoal: Goal = {
      ...goalData,
      id: uuidv4(),
      completed: false,
      folderId: selectedFolderId,
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

  const handleAddFolder = (name: string) => {
    const newFolder: GoalFolder = {
      id: uuidv4(),
      name,
      createdAt: new Date(),
    };
    setFolders((prev) => [...prev, newFolder]);
    setIsAddFolderDialogOpen(false);
    toast({
      title: "Dossier ajouté",
      description: "Le dossier a été ajouté avec succès",
    });
  };

  const handleEditFolder = (name: string) => {
    if (!editingFolder) return;
    
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === editingFolder.id
          ? { ...folder, name }
          : folder
      )
    );
    setEditingFolder(null);
    setIsAddFolderDialogOpen(false);
    toast({
      title: "Dossier modifié",
      description: "Le dossier a été modifié avec succès",
    });
  };

  const handleDeleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
    setGoals((prev) => prev.filter((goal) => goal.folderId !== id));
    if (selectedFolderId === id) {
      setSelectedFolderId(undefined);
    }
    setFolderToDelete(null);
    toast({
      title: "Dossier supprimé",
      description: "Le dossier et ses objectifs ont été supprimés avec succès",
    });
  };

  const handleToggleComplete = (id: string, completedAt?: Date) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              completed: completedAt ? true : !goal.completed,
              completedAt: completedAt || (goal.completed ? undefined : new Date()),
            }
          : goal
      )
    );
    toast({
      title: "Statut mis à jour",
      description: "Le statut de l'objectif a été mis à jour",
    });
  };

  const filteredGoals = selectedFolderId
    ? goals.filter(goal => goal.folderId === selectedFolderId)
    : goals.filter(goal => !goal.folderId);

  const activeGoals = filteredGoals.filter(goal => !goal.completed);
  const completedGoals = filteredGoals.filter(goal => goal.completed);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-3xl font-bold">Objectifs</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddFolderDialogOpen(true)}>
            <Folder className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel objectif
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Dossiers</h2>
          <FoldersList
            folders={folders}
            onDelete={(id) => setFolderToDelete(id)}
            onEdit={setEditingFolder}
            selectedFolderId={selectedFolderId}
            onSelect={setSelectedFolderId}
          />
        </div>

        <div className="md:col-span-3 space-y-8">
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
      </div>

      <AddGoalDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={editingGoal ? handleEditGoal : handleAddGoal}
        goal={editingGoal}
      />

      <AddFolderDialog
        open={isAddFolderDialogOpen}
        onOpenChange={setIsAddFolderDialogOpen}
        onSubmit={editingFolder ? handleEditFolder : handleAddFolder}
        folder={editingFolder}
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

      <AlertDialog open={!!folderToDelete} onOpenChange={() => setFolderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Ce dossier et tous ses objectifs seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => folderToDelete && handleDeleteFolder(folderToDelete)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Goals;